export const parsePair = (s: string) => {
  const [x, y] = s.split(",").map(Number);
  return { x, y };
};

export const parseCircleEquation = (eq: string) => {
  const clean = eq.replace(/\s+/g, "");
  const m = clean.match(/\(x([+-]\d+(\.\d+)?)\)\^2\+\(y([+-]\d+(\.\d+)?)\)\^2=(\d+(\.\d+)?)/);
  if (!m) return null;
  const h = -parseFloat(m[1]);
  const k = -parseFloat(m[3]);
  const r = Math.sqrt(parseFloat(m[5]));
  return { h, k, r };
};

export const parseLineEquation = (eq: string) => {
  const clean = eq.replace(/\s+/g, "");
  let m = clean.match(/^y=([+-]?\d+(\.\d+)?)$/);
  if (m) return { horizontal: true, m: 0, b: parseFloat(m[1]) };

  m = clean.match(/^y=([+-]?\d+(\.\d+)?)[x](\+|\-)(\d+(\.\d+)?)$/i);
  if (!m) return null;
  const slope = parseFloat(m[1]);
  const b = parseFloat(m[4]) * (m[3] === "-" ? -1 : 1);
  return { horizontal: false, m: slope, b };
};
