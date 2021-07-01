import { SERVER_URL } from "sr2020-mm-client-event-engine";
import { ErrorResponse, validateErrorResponse } from "sr2020-mm-event-engine";

export const isLoggedIn = async () => fetch(SERVER_URL + '/api/isLoggedIn');

export async function loginUser(credentials: {
  username: string;
  password: string;
}): Promise<{ status: number; text: string; } | ErrorResponse> {
  const res = await fetch(SERVER_URL + '/api/login', {
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
  // const res = await fetch(SERVER_URL + '/api/logout', {
  const res = await fetch('/api/logout', {
    method: 'POST',
  });
  return res;
}
