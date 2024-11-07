import { useMemo } from 'react';

const geoOptions = [
  { value: 0, label: 'Russia' },
  { value: 1, label: 'Ukraine' },
  { value: 2, label: 'Kazakhstan' },
];

const actionOptions = [
  { value: 1, label: 'Nothing to do' },
  { value: 2, label: 'Add a frame to your ava' },
  { value: 3, label: 'Add city of residence' },
  { value: 4, label: 'Set university' },
  { value: 5, label: 'Install work' },
  { value: 6, label: 'Set marital status' },
  { value: 7, label: 'Add hobby' },
  { value: 8, label: 'Add friends' },
  { value: 9, label: 'Accept friend requests' },
  { value: 10, label: 'Read messages' },
  { value: 11, label: 'Block random messages' },
  { value: 12, label: 'Join groups' },
  { value: 13, label: 'View notifications' },
  { value: 14, label: 'View ads' },
  { value: 15, label: 'Fumbling around the tape' },
  { value: 16, label: 'Make a repost from the tape to the wall' },
  { value: 17, label: 'Like a random post' },
  { value: 18, label: 'Walk around the sites' },
  { value: 19, label: 'Sign up for events' }
];

const smsServicesOptions = [{ value: 1, label: 'SMS-Activate' }];

const captchaServicesOptions = [{ value: 1, label: 'ReCaptcha Solver' }];

const switchOptions = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
];

const options = {
  smsServicesCount: 1,
  smsActivationService1: smsServicesOptions,
  geo1: geoOptions,
  smsServiceKey1: smsServicesOptions,
  smsActivationService2: smsServicesOptions,
  geo2: geoOptions,
  smsServiceKey2: smsServicesOptions,
  token: '88cf33cA49847b1fc7b6fd2e451be316',
  tokenRuCaptcha: captchaServicesOptions,
  createFanPage: switchOptions,
  farmAvatar: switchOptions,
  avatar: switchOptions,
  fanPageImage: switchOptions,
  action1: actionOptions,
  action2: actionOptions,
  saveFacebookToken: switchOptions,
  managerPolicy: switchOptions,
  callZrd: switchOptions,
  checkZrd: switchOptions,
  passZrd: switchOptions,
  businessManager: switchOptions,
  background: switchOptions
};

const defaultValues = {
  smsServicesCount: 1,
  smsActivationService1: smsServicesOptions[0].label,
  geo1: geoOptions[1].value,
  smsServiceKey1: '88cf33cA49847b1fc7b6fd2e451be316',
  smsActivationService2: smsServicesOptions[0].label,
  geo2: geoOptions[1].value,
  smsServiceKey2: '88cf33cA49847b1fc7b6fd2e451be316',
  token: '88cf33cA49847b1fc7b6fd2e451be316',
  tokenRuCaptcha: captchaServicesOptions[0].label,
  createFanPage: true,
  avatar: true,
  farmAvatar: true,
  fanPageImage: true,
  directoryForAvatar: 'D:\photos\bg',
  directoryForBackImage: 'D:\photos\anpage',
  action1: 0,
  action2: 0,
  saveFacebookToken: false,
  managerPolicy: true,
  callZrd: true,
  checkZrd: false,
  passZrd: true,
  businessManager: true,
  background: true,
  documentDownloader: 'D:\photos\anpage'
};

export function useFarmFormInitData() {
  const initData = useMemo(
    () => ({
      options,
      defaultValues: defaultValues,
    }),
    []
  );
  return initData;
}