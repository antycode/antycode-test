export function generateYearOptions(yearFrom?: number) {
  const options = [];
  let yearsRange = getYearsRange();
  let from = yearFrom ?? yearsRange.from;
  let to = yearsRange.to;

  while (from <= to) {
    options.push({
      value: from,
      label: from,
    });

    from++;
  }

  return options;
}

function getYearsRange() {
  const maxAge = 80;
  const from = new Date().getFullYear() - maxAge;
  const to = new Date().getFullYear() - 19;

  return { from, to };
}
