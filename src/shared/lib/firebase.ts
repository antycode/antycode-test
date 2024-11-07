import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';

const firebaseConfigTest = {
  apiKey: 'AIzaSyD6hyGmzdKzyjfyFi2rbUhsW9BXE4V9HeM',
  authDomain: 'autoreg-test.firebaseapp.com',
  projectId: 'autoreg-test',
  storageBucket: 'autoreg-test.appspot.com',
  messagingSenderId: '1042980368546',
  appId: '1:1042980368546:web:18d3c78af684853f23e7fb',
  measurementId: 'G-S4KCMMEM1X',
};

const firebaseConfigTestAlex = {
  apiKey: "AIzaSyA-AykKIEerdYvCjQt7PtARkvYn5lzUGZQ",
  authDomain: "anticod-72a32.firebaseapp.com",
  projectId: "anticod-72a32",
  storageBucket: "anticod-72a32.appspot.com",
  messagingSenderId: "553509645388",
  appId: "1:553509645388:web:b05c95ee40613027bbd8e9",
  measurementId: "G-9XV4RPNW69"
};

const firebaseConfigAutoreg = {
  apiKey: 'AIzaSyAINqJdaOIMFC0ijcoVf0qMpP9acuLXb4o',
  authDomain: 'antycode.firebaseapp.com',
  projectId: 'antycode',
  storageBucket: 'antycode.appspot.com',
  messagingSenderId: '1007389116088',
  appId: '1:1007389116088:web:0404773a30d33f8f0c164d',
  measurementId: 'G-4D7JMPHT0Y',
};

// Initialize Firebase
const app = initializeApp(firebaseConfigAutoreg);

export const db = getFirestore(app);
