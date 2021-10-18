export interface SpiritConsistencyResponse {
  type: 'qrIsNotSpiritJar' | 'spiritJarContainsOtherSpirit' | 'spiritJarIsEmpty';
  message: string;
}
