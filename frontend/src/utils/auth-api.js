class AuthApi {
  constructor(options) {
    this._headers = options.headers;
    this._baseUrl = options.baseUrl;
  }

  signup(email, password) {
    return fetch(`${this._baseUrl}/signup`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        email,
        password,
      }),
    }).then(this._checkResponse);
  }

  signin(email, password) {
    return fetch(`${this._baseUrl}/signin`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        email,
        password,
      }),
    }).then(this._checkResponse);
  }

  getCurrentUser(jwt) {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: { ...this._headers, Authorization: `Bearer ${jwt}` },
    }).then(this._checkResponse);
  }

  _checkResponse(result) {
    if (result.ok) {
      return result.json();
    }

    return Promise.reject("API returned an error");
  }
}

const authApi = new AuthApi({
  baseUrl: "http://frontend.nomoredomains.work/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default authApi;
