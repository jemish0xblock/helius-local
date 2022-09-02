export const setLocalStorageItem = (key: string, value: string | boolean) => {
  const stringify = JSON.stringify(value);

  localStorage.setItem(key, stringify);
};

// export const setLocalStorageItems = (arr) => {
//   arr.forEach((item) => {
//     setLocalStorageItem({ key: item.key, value: item.value });
//   });
// };

export const removeLocalStorageItem = (key: string) => localStorage.removeItem(key);

// export const removeLocalStorageItems = (arr) => {
//   arr.forEach((item) => {
//     removeLocalStorageItem({ key: item.key });
//   });
// };

export const getLocalStorageItem = (key: string) => {
  const item = localStorage.getItem(key);
  return JSON.parse(item || "{}");
};

// export const getLocalStorageItems = (arr) =>
//   arr.map((item) => getLocalStorageItem({ key: item.key }));
