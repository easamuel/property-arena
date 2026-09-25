export const enumToSelectOptions = (e: object) =>
  Object.values(e).map(v => ({ label: v[0].toUpperCase() + v.slice(1), value: v }));