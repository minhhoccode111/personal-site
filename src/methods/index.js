export function get(key = 'loginState') {
  const data = localStorage.getItem(key);
  return data === null ? {} : JSON.parse(data);
}

export function set(value, key = 'loginState') {
  localStorage.setItem(key, JSON.stringify(value));
}
