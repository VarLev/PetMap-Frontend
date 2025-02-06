import React from 'react';
import { observer } from 'mobx-react-lite';
import PaywallModal from '@/components/paywall/PaywallModal';


const PayWallScreen = observer(() => {
  return <PaywallModal />;
});

export default PayWallScreen;
