export const NumberWithCommas = (number: number) => {
  return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};
