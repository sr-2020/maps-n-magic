import fetch from 'isomorphic-fetch';

export const getSettings = (state: {url: string}) => ({
  async get() {
    // console.log('getSettings url', state.url);
    const response = await fetch(state.url);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const text = await response.text();
      // console.log(response);
      // throw new Error(`Network response was not ok ${text}`);
      throw new Error(`get settings network response was not ok ${response.ok} ${response.statusText}`);
    }

    // return {};
    // const text = await response.text();

    return response.json();
  },
});

export const postSettings = (state: {url: string}) => ({
  async post(settings: unknown) {
    const response = await fetch(state.url, {
      method: 'POST',
      // headers: {
      //   'Content-Type': 'application/json;charset=utf-8',
      //   'X-User-Id': 1,
      // },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      const text = await response.text();
      // throw new Error(`Network response was not ok ${text}`);
      throw new Error(`post settings network response was not ok ${response.ok} ${response.statusText}`);
    }

    // console.log('before parse post settings json');

    // return response.json();
    // something strange. response.json() returns error
    // just use settings instead
    return settings;
  },
});