import { SERVER_URL } from "sr2020-mm-client-event-engine";

export const isLoggedIn = async () => fetch(SERVER_URL + '/api/isLoggedIn');

export async function loginUser(credentials: {
  username: string;
  password: string;
}): Promise<{ status: number; text: string; }> {
  const res = await fetch(SERVER_URL + '/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });
  if (res.status !== 200) {
    const text = await res.text();
    return {
      status: res.status,
      text
    };
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
