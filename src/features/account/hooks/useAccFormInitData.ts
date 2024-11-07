import { useMemo } from 'react';
import { AccGender } from '../types';

const accCountOptions = 1;

const geoOptions = [
  { value: 1, label: 'Russia' },
  { value: 2, label: 'Ukraine' },
  { value: 3, label: 'Kazakhstan' },
];

const smsServicesOptions = [{ value: 1, label: 'SMS-Activate' }];

const captchaServicesOptions = [{ value: 1, label: 'ReCaptcha Solver' }];

const localeOptions = [
  { value: 0, label: 'Latin' },
  { value: 1, label: 'Cyrillic' },
];
const genderOptions = [
  { value: 0, label: 'Male' },
  { value: 1, label: 'Female' },
];

const registrationOptions = [
  { value: 'Windows', label: 'Windows' },
  { value: 'Macos', label: 'Macos' },
  { value: 'Linux', label: 'Linux' },
];

const countSmsServicesOptions = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
];

const generateYearOptions = (yearFrom?: number) => {
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

  function getYearsRange() {
    const maxAge = 74;
    const from = new Date().getFullYear() - maxAge;
    const to = new Date().getFullYear();

    return { from, to };
  }

  return options;
};

const yearOptions = generateYearOptions();

const options = {
  accCount: accCountOptions,
  geo: geoOptions,
  smsService: smsServicesOptions,
  captchaService: captchaServicesOptions,
  locale: localeOptions,
  gender: genderOptions,
  yearFrom: yearOptions,
  registrationVia: registrationOptions,
  countSmsServicesUse: countSmsServicesOptions
};

const defaultValues = {
  accountNumbers: accCountOptions,
  verification: true,
  geo: geoOptions[1].value,
  serviceSmsNumbers: smsServicesOptions[0].value,
  activationSmsTimeout: 20,
  smsServiceKey: '88cf33cA49847b1fc7b6fd2e451be316',
  captchaService: captchaServicesOptions[0].value,
  alphabetType: localeOptions[0].value,
  gender: genderOptions[0].value,
  birthYearFrom: yearOptions[0].value,
  birthYearTo: yearOptions[yearOptions.length - 1].value,
  platformType: registrationOptions[0].value,
  countSmsServicesUse: countSmsServicesOptions[0].value,
  proxyThreads:[],
  mailToken: "someMailToken",
  ruCaptchaToken: "someRuCaptchaToken",
  smsBeans:[]
};

export function useAccFormInitData() {
  const initData = useMemo(
    () => ({
      options,
      defaultValues,
    }),
    []
  );
  return initData;
}
