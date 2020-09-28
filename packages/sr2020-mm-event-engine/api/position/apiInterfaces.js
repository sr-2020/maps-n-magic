export const gettable = (state) => ({
  async get() {
    const response = await fetch(`${state.url}?limit=200`);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Network response was not ok ${text}`);
    }

    return response.json();
  },
});

export const getSettings = (state) => ({
  async get() {
    const response = await fetch(state.url);
    if (!response.ok) {
      const text = await response.text();
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

export const postSettings = (state) => ({
  async post(settings) {
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

    return response.json();
  },
});

export const postable = (state) => ({
  async post({ props }) {
    const response = await fetch(state.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-User-Id': 1,
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

export const puttable = (state) => ({
  async put({ id, props }) {
    const response = await fetch(`${state.url}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-User-Id': 1,
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

export const multiPuttable = (state) => ({
  async putMultiple({ updates }) {
    const response = await fetch(`${state.url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-User-Id': 1,
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

export const deletable = (state) => ({
  async delete({ id }) {
    const response = await fetch(`${state.url}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-User-Id': 1,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Network response was not ok ${text}`);
    }

    return response;
  },
});
