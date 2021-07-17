import { 
  ErrorResponse, 
  SpiritJarQr, 
  validateErrorResponse, 
  consequenceStatus,
  // SpiritDataForQrValidation, 
  Spirit 
} from "sr2020-mm-event-engine";

export const isLoggedIn = async () => fetch('/api/isLoggedIn');

export async function loginUser(credentials: {
  username: string;
  password: string;
}): Promise<{ status: number; text: string; } | ErrorResponse> {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });
  if (res.status !== 200) {
    const errorResponse: unknown = await res.json();
    if (validateErrorResponse(errorResponse)) {
      return errorResponse;
    } else {
      return {
        errorTitle: 'Неизвестная ошибка',
        errorSubtitle: JSON.stringify(validateErrorResponse.errors)
      };
    }
  }
  return {
    status: res.status,
    text: ''
  };
}

export async function logoutUser() {
  const res = await fetch('/api/logout', {
    method: 'POST',
  });
  return res;
}

export async function refreshCharacterModel() {
  const res = await fetch('/api/refreshCharacterModel', {
    method: 'POST',
  });
  return res;
}

export async function callSecureApi() {
  const res = await fetch('/api/secureEndpoint', {method: 'POST'});
  return res;
}

export async function getSpiritDataByQr(spiritJarQrString: string): Promise<ErrorResponse | {
  spiritJarQr: SpiritJarQr;
  spirit: Spirit | undefined;
}> {
  const res = await fetch('/api/getSpiritDataByQr?' + new URLSearchParams({
    spiritJarQrString
  }));
  return await res.json();
}

export async function isBodyStorageValid(bodyStorageQrString: string, shouldBeEmpty: boolean): Promise<ErrorResponse | true> {
  const res = await fetch('/api/isBodyStorageValid?' + new URLSearchParams({
    bodyStorageQrString,
    shouldBeEmpty: String(shouldBeEmpty)
  }));
  return await res.json();
}

export async function isSpiritJarValid(spiritJarQrString: string, shouldBeEmpty: boolean): Promise<ErrorResponse | Spirit> {
  const res = await fetch('/api/isSpiritJarValid?' + new URLSearchParams({
    spiritJarQrString,
    shouldBeEmpty: String(shouldBeEmpty)
  }));
  return await res.json();
}

export async function suitSpirit(
  bodyStorageQrString: string, 
  spiritJarQrString: string
): Promise<ErrorResponse | true> {
  const res = await fetch('/api/suitSpirit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      bodyStorageQrString,
      spiritJarQrString
    }),
  });
  return await res.json();
}

export async function dispirit(
  bodyStorageQrString: string, 
  spiritJarQrString: string | null
): Promise<ErrorResponse | consequenceStatus> {
  const res = await fetch('/api/dispirit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      bodyStorageQrString,
      spiritJarQrString
    }),
  });
  return await res.json();
}

export async function emergencyDispirit(): Promise<ErrorResponse | true> {
  const res = await fetch('/api/emergencyDispirit', {
    method: 'POST',
  });
  return await res.json();
}

export async function freeSpirit(qrId: number, reason: string): Promise<ErrorResponse | {
  status: 'success',
  qrModelData: SpiritJarQr
}> {
  const res = await fetch('/api/freeSpirit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      qrId,
      reason
    }),
  });
  return await res.json();
}

export async function catchSpirit(qrId: number, spiritId: number): Promise<ErrorResponse | SpiritJarQr> {
  const res = await fetch('/api/catchSpirit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      qrId,
      spiritId
    }),
  });
  return await res.json();
}

export async function catchSpirit2(spiritJarQrString: string, spiritId: number): Promise<ErrorResponse | unknown> {
  const res = await fetch('/api/catchSpirit2', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      spiritJarQrString,
      spiritId: spiritId
    }),
  });
  return await res.json();
}
