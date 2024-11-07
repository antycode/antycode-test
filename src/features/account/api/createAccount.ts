import {
  collection,
  doc,
  serverTimestamp,
  DocumentReference,
  runTransaction,
  //setDoc
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { AccStatus, InProgressAccount } from '../types';
import { TAccCreationForm } from '../components/AccCreationDrawer/AccCreationForm/AccCreationForm';

export const createAccount = async (data: TAccCreationForm) => {
  await runTransaction(db, async (transaction) => {
    const accRefs = [];
    for (let i = 1; i <= data.accountNumbers; i++) {
      const newAccRef = doc(
        collection(db, 'accounts')
      ) as DocumentReference<InProgressAccount>;

      transaction.set(newAccRef, {
        id: newAccRef.id,
        created_at: serverTimestamp(),
        status: AccStatus.InProgress,
      });

      accRefs.push(newAccRef);
    }

    const newTaskRef = doc(collection(db, 'tasks'));

    transaction.set(newTaskRef, {
      id: newTaskRef.id,
      constraints: {
        [`sms_api_${data.serviceSmsNumbers}`]: true, // FIXME refactor
        [`sms_api_${data.serviceSmsNumbers}_key`]: data.serviceSmsNumbers,
        phone_delay: data.activationSmsTimeout,
        handle_captcha_method: data.ruCaptchaToken,
        locale: data.alphabetType,
        gender: data.gender,
        years: [data.birthYearFrom, data.birthYearTo],
      },
      result: accRefs,
      count: data.accountNumbers,
      status: 'not_done',
      type: 'register',
    });
  });
};

export const useCreateAccount = () => {};

// async function createMockAcc() {
//   const newDocRef = doc(collection(db, 'tasks'));

//   return await setDoc(doc(collection(db, 'accounts')), {
//     id: newDocRef.id,
//     cookies: 'cookie_data',
//     created_at: serverTimestamp(),
//     first_name: 'Difa',
//     gender: 'female',
//     last_name: 'Timofeevna',
//     find_name: 'daria timofeevna',
//     login: '380209602408',
//     message: '1501945690',
//     password: 'kjb#KOfP1n.',
//     phone: '380209602408',
//     status: generateStatus(),
//     worker_name: 'w-004',
//   });
// }

// function generateStatus() {
//   const randomInteger = (min: number, max: number) => {
//     let rand = min + Math.random() * (max + 1 - min);
//     return Math.floor(rand);
//   }

//   const rnd = randomInteger(1, 4);

//   switch (rnd) {
//     case 1:
//       return AccStatus.ActivationPending;
//     case 2:
//       return AccStatus.Active;
//     case 3:
//       return AccStatus.Error;
//     default:
//       return AccStatus.NotActive;
//   }
// }
//createMockAcc()