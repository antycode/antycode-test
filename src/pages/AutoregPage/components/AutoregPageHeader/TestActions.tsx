import clsx from 'clsx';
import { db } from '@/shared/lib/firebase';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { Button } from '@/shared/components/Button';

interface TestActionsProps {}

export const TestActions = (props: TestActionsProps) => {
  const {} = props;

  const handleSendClick = async () => {
    const q = query(collection(db, 'accounts'), orderBy('created_at', 'desc'));
    const querySnapshot = await getDocs(q);

    console.log('!===');
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const data = doc.data();
      console.log('@@@ get', doc.id, ' => ', {
        ...data,
      });
    });
  };

  return (
    <div style={{ marginRight: 20 }}>
      <Button variant="outline" color="orange" onClick={handleSendClick}>
        $Get
      </Button>
    </div>
  );
};
