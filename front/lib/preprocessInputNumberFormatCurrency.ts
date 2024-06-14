export const PreprocessInputNumberWithCommas = (val: any) => {
  if (typeof val === "number") return val;
  if (typeof val !== "string") return "";
  const rmDot = val.replaceAll(",", "");
  return isNaN(parseInt(rmDot)) ? "" : parseInt(rmDot);
};
