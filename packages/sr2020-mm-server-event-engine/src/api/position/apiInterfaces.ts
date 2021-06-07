import fetch from 'isomorphic-fetch';

export const gettable = (state: {url: string}) => ({
  async get() {
    // console.log('gettable url', `${state.url}?limit=200`);
    const response = await fetch(`${state.url}?limit=200`);
    if (!response.ok) {
      const text = await response.text();
      // throw new Error(`Network response was not ok ${text}`);
      throw new Error(`gettable network response was not ok ${response.ok} ${response.statusText}`);
    }

    return response.json();
  },
});

export const postable = <T>(state: {url: string, defaultObject: T}) => ({
  async post({ props }: {props: T}) {
    const response = await fetch(state.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-User-Id': '1',
      },
      body: JSON.stringify({
        ...state.defaultObject,
        ...props,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      // throw new Error(`Network response was not ok ${text}`);
      throw new Error(`postable network response was not ok ${response.ok} ${response.statusText}`);
    }

    return response.json();
  },
});

export const puttable = <T>(state: {url: string}) => ({
  async put({ id, props }: {id: number, props: T}) {
    const response = await fetch(`${state.url}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-User-Id': '1',
      },
      body: JSON.stringify({
        ...props,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      // throw new Error(`Network response was not ok ${text}`);
      throw new Error(`puttable network response was not ok ${response.ok} ${response.statusText}`);
    }

    return response.json();
  },
});

export const multiPuttable = <T>(state: {url: string}) => ({
  async putMultiple({ updates }: {updates: T}) {
    const response = await fetch(`${state.url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-User-Id': '1',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const text = await response.text();
      // throw new Error(`Network response was not ok ${text}`);
      throw new Error(`multiPuttable network response was not ok ${response.ok} ${response.statusText}`);
    }

    return response.json();
  },
});

export const deletable = (state: {url: string}) => ({
  async delete({ id }: {id: number}) {
    const response = await fetch(`${state.url}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-User-Id': '1',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      // throw new Error(`Network response was not ok ${text}`);
      throw new Error(`deletable network response was not ok ${response.ok} ${response.statusText}`);
    }

    return response;
  },
});
