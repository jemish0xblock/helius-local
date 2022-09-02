export const validateNum = (value: string) => {
  const expression = "^[a-zA-Z ]*$";
  if (value.search(expression)) {
    return false;
  }
  return true;
};
