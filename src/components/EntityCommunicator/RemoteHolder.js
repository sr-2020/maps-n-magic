export class RemoteHolder {
  constructor(url, defaultObject) {
    this.url = url;
    this.defaultObject = defaultObject;
  }

  async get() {
    const response = await fetch(this.url);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Network response was not ok ${text}`);
    }

    return response.json();
  }

  async post({ props }) {
    const response = await fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-User-Id': 1,
      },
      body: JSON.stringify({
        ...this.defaultObject,
        ...props,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Network response was not ok ${text}`);
    }

    return response.json();
  }

  async put({ id, props }) {
    const response = await fetch(`${this.url}/${id}`, {
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
  }

  async delete({ id }) {
    const response = await fetch(`${this.url}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-User-Id': 1,
      },
      // body: JSON.stringify({
      //   // ...defaultBeaconRecord,
      //   ...props,
      // }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Network response was not ok ${text}`);
    }

    // return response.json();
    return response;
  }
}
