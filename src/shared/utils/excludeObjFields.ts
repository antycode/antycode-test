export function excludeObjFields<T>(obj: T, fields: Array<keyof T>) {
  const newObj = { ...obj };

  for (const key of fields) {
    delete newObj[key];
  }

  return newObj;
}
