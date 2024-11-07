export const getPrefixedClassName = (prefix: string, className?: string) => {
  if (!className) {
    return '';
  }

  return prefix + className[0].toUpperCase() + className.slice(1);
};
