import fetch from 'isomorphic-fetch';
import { genericServerConstants2 } from './constants';

export async function getUserTokenData(login: string, password: string) {
  return await fetch(genericServerConstants2().loginUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      login,
      password,
      "rememberMe": false
    })
  });
}