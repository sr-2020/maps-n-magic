import { pushServiceUrl } from './constants';

export async function sendNotification(id, title, body) {
  const response = await fetch(`${pushServiceUrl}/${id}`, {
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
    throw new Error(`Network response was not ok ${text}`);
  }

  console.log('notification sended');
}

// sendNotification(51935, 'title1', 'body2');
