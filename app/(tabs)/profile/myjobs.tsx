import React from 'react';
import { observer } from 'mobx-react-lite';
import { BonusProvider } from '@/contexts/BonusContex';
import UserJobsList from '@/components/navigation/userJob/UserJobsList';

const MyJobs = observer(() => {
  return (
    <BonusProvider>
      <UserJobsList  />
    </BonusProvider>
  );
});

export default MyJobs;