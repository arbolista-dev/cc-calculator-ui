export const loadState = (id) => {
  try {
    const serializedItem = localStorage.getitem(id);
    if (serializedItem === null) {
      return undefined;
    }
    return JSON.parse(serializedItem);

  } catch (err) {
    console.log('loadState err: ', err)
    return undefined;
  }
};

export const saveState = (id, state) => {
  try {
    const serializedItem = JSON.stringify(state);
    localStorage.setItem(id, serializedItem);
  } catch (err) {
    console.log('saveState err: ', err)
  }
}
