import fetch from 'isomorphic-fetch';

import { urls } from '../constants';

export async function sendNotification(id: number, title: string, body: string): Promise<void> {
  const response = await fetch(`${urls().pushServiceUrl}/${id}`, {
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
    // throw new Error(`Network response was not ok ${text}`);
    throw new Error(`send push notification network response was not ok ${response.ok} ${response.statusText}`);
  }

  // console.log('notification sended');
}

// sendNotification(51935, 'title1', 'body2');
