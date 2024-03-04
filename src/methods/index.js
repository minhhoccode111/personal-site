import localforage from 'localforage';

export async function init() {
  localforage.config({
    driver: localforage.WEBSQL,
    name: import.meta.env.VITE_LOCALFORAGE_NAME,
    version: 1.0,
    size: 4980736,
    description: `store user's authentication token`,
    storeName: import.meta.env.VITE_LOCALFORAGE_STORE_NAME,
  });

  console.log(`Init localforage config`);
}

export async function get(key) {
  try {
    const result = await localforage.getItem(key);
    return { success: true, result };
  } catch (err) {
    return { success: false, err };
  }
}

export async function set(key, value) {
  try {
    await localforage.setItem(key, value);
    return { success: true, [key]: value };
  } catch (err) {
    return { success: false, err };
  }
}
