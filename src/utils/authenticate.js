// test
export function getToken() {
  return localStorage.getItem('token') || undefined;
}

export function setToken(token) {
  return localStorage.setItem('token', token);
}
