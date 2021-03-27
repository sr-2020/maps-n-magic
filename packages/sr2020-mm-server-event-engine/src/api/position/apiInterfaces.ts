import fetch from 'isomorphic-fetch';

export interface Gettable<T> {
  get(): Promise<T[]>;
}

export const gettable = (state: {url: string}) => ({
  async get() {
    const response = await fetch(`${state.url}?limit=200`);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Network response was not ok ${text}`);
    }

    return response.json();
  },
});

export interface GetSettings<T> {
  get(): Promise<T>;
}

export const getSettings = (state: {url: string}) => ({
  async get() {
    const response = await fetch(state.url);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const text = await response.text();
      // console.log(response);
      throw new Error(`Network response was not ok ${text}`);
    }

    // return {};
    // const text = await response.text();

    return response.json();
  },
});

// export const postManaOcean = (state) => ({
//   async get({ props } = {}) {
//     const url = 'https://gateway.evarun.ru/api/v1/config/test';
//     // const response = await fetch(state.url, {
//     const response = await fetch(url, {
//       method: 'POST',
//       // headers: {
//       //   'Content-Type': 'application/json;charset=utf-8',
//       // },
//       body: JSON.stringify({ test: 100500 }),
//     });

//     if (!response.ok) {
//       const text = await response.text();
//       throw new Error(`Network response was not ok ${text}`);
//     }

//     return response.json();
//   },
// });

// export const manaOceanGettable = (state) => ({
//   async get() {
//     const response = await fetch(state.url);
//     if (!response.ok) {
//       const text = await response.text();
//       throw new Error(`Network response was not ok ${text}`);
//     }

//     return response.json();
//   },
// });

// fetch('https://gateway.evarun.ru/api/v1/config/test', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json;charset=utf-8'
//   },
//     body: JSON.stringify({"test":100500})
// })

export interface PostSettings<T> {
  post(settings: T): Promise<T>;
}

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
      throw new Error(`Network response was not ok ${text}`);
    }

    // console.log('before parse post settings json');

    // return response.json();
    // something strange. response.json() returns error
    // just use settings instead
    return settings;
  },
});

export interface Postable<T> {
  post({props}: {props: T}): Promise<T>;
}

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
      throw new Error(`Network response was not ok ${text}`);
    }

    return response.json();
  },
});

export interface Puttable<T> {
  put({id, props}: {id: number, props: T}): Promise<T>;
}

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
      throw new Error(`Network response was not ok ${text}`);
    }

    return response.json();
  },
});

export interface MultiPuttable<T> {
  putMultiple({updates}: {updates: T[]}): Promise<T>;
}

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
      throw new Error(`Network response was not ok ${text}`);
    }

    return response.json();
  },
});

export interface Deletable<T> {
  deletable({id}: {id: number}): Promise<T>;
}

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
      throw new Error(`Network response was not ok ${text}`);
    }

    return response;
  },
});
