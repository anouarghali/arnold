function set(key, value) {
  localStorage[key] = JSON.stringify(value);
}

function get(key, value) {
  if(!(key in localStorage)) {
    return null;
  }

  return JSON.parse(localStorage[key]);
}

function clear() {
  localStorage.clear();
}

export default {
  set,
  get,
  clear
}
