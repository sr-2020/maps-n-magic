import md5 from 'md5';
// taken from
// https://github.com/sr-2020/nodejs-monorepo/blob/d4d815dd4e454dcd4919e70860488b3c5998451e/packages/alice-qr-lib/qr.ts

export interface QrData {
  type: number;
  kind: number;
  validUntil: number;
  payload: string;
}

export class FormatError implements Error {
  public name = 'FormatError';
  constructor(public message: string) {}
}

export class ValidationError implements Error {
  public name = 'ValidationError';
  constructor(public message: string) {}
}

function uint16LESignature(buffer: Buffer, data: string): number {
  // TODO: get salt from config
  const salt = 'do you like ponies?';
  const joinedBuffer = Buffer.concat([buffer, Buffer.from(data), Buffer.from(salt)]);
  const md5buffer = Buffer.from(md5(joinedBuffer), 'hex');
  return md5buffer.readUInt16LE(0);
}

export function decode(content: string): QrData {
  if (content.length < 12) throw new FormatError('Format Error: QR code content should contain 12 character header');

  try {
    const signatureBuffer = Buffer.from(content.slice(0, 4), 'hex');
    const contentBuffer = Buffer.from(content.slice(4, 12), 'base64');
    const type = contentBuffer.readUInt8(0);
    const kind = contentBuffer.readUInt8(1);
    const validUntil = contentBuffer.readUInt32LE(2);
    const signature = signatureBuffer.readUInt16LE(0);
    const expectedSignature = uint16LESignature(contentBuffer, content.slice(12));
    if (signature != expectedSignature) throw new ValidationError('Validation Error: Invalid signature');
    return { type: type, kind: kind, validUntil: validUntil, payload: content.slice(12) };
  } catch (e) {
    if (e instanceof RangeError) {
      throw new FormatError('Format Error: Cannot process content: index out of range');
    }
    throw e;
  }
}

export function encode(data: QrData): string {
  const contentBuffer = Buffer.alloc(6);
  contentBuffer.writeUInt8(data.type, 0);
  contentBuffer.writeUInt8(data.kind, 1);
  contentBuffer.writeUInt32LE(data.validUntil, 2);
  const signatureBuffer = Buffer.alloc(2);
  signatureBuffer.writeUInt16LE(uint16LESignature(contentBuffer, data.payload), 0);
  return signatureBuffer.toString('hex') + contentBuffer.toString('base64') + data.payload;
}