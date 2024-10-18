import React from 'react';
import { observer } from 'mobx-react-lite';

import { MapPointType } from '@/dtos/enum/MapPointType';
import MyMapItemList from '@/components/navigation/points/MyMapItemList';

const MyWalks = observer(() => {
  return (
    <MyMapItemList renderType={MapPointType.Walk} />
  );
});

export default MyWalks;