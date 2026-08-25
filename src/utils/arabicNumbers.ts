/**
 * Converts Western digits (1, 2, 3...) to Eastern Arabic digits (١, ٢, ٣...)
 */
export const toArabicDigits = (num: number | string): string => {
  const digits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/\d/g, (d) => digits[parseInt(d, 10)]);
};
