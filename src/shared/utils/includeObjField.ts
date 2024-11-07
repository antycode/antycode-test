export function includeObjFields<T extends Record<string, any>>(
  obj: T,
  fields: Array<keyof T>
) {
  const includedObj = {} as Pick<T, (typeof fields)[number]>;

  for (const key of fields) {
    if (key in obj) {
      includedObj[key] = obj[key];
    }
  }

  return includedObj;
}
