export const validateInput = (val: string) => {
  return /^[^=+\@|>%<]*$/.test(val);
};
