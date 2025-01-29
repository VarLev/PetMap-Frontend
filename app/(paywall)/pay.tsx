import React from 'react';
import { observer } from 'mobx-react-lite';
import PaywallModal from '@/components/paywall/PaywallModal';
import { router } from 'expo-router';

const PayWallScreen = observer(() => {
  return <PaywallModal />;
});

export default PayWallScreen;
