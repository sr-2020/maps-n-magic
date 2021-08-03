import fetch from 'isomorphic-fetch';

import { mainServerConstants } from '../constants';

export async function sendPush(id: number, title: string, body: string): Promise<void> {
  const response = await fetch(`${mainServerConstants().pushServiceUrl}/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      accept: 'application/json',
    },
    body: JSON.stringify({
      title,
      body,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`send push notification network response was not ok ${response.ok} ${response.statusText}`);
  }
}
