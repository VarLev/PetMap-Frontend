import React from 'react';
import { I18nManager, ViewStyle } from 'react-native';
import Svg, { Path, ClipPath, Defs, Rect } from 'react-native-svg';

export type StarIconProps = {
  index: number;
  size: number;
  color: string;
  type: 'full' | 'half' | 'empty';
};

const CircleBorder = ({ size, color }: Omit<StarIconProps, 'type'>) => (
  <Svg height={size} viewBox="0 0 24 24" width={size}>
    <Path
      fill="none"
      stroke={color}
      strokeWidth="2"
      d="M12 2.0845a9.9155 9.9155 0 1 0 9.9155 9.9155A9.9155 9.9155 0 0 0 12 2.0845z"
    />
  </Svg>
);

const CircleFull = ({ size, color }: Omit<StarIconProps, 'type'>) => (
  <Svg height={size} viewBox="0 0 24 24" width={size}>
    <Path
      fill={color}
      d="M12 2.0845a9.9155 9.9155 0 1 0 9.9155 9.9155A9.9155 9.9155 0 0 0 12 2.0845z"
    />
  </Svg>
);

const CircleHalf = ({ size, color }: Omit<StarIconProps, 'type'>) => (
  <Svg
    height={size}
    viewBox="0 0 24 24"
    width={size}
    style={I18nManager.isRTL ? RTL_TRANSFORM : undefined}
  >
    <Defs>
      <ClipPath id="halfClip">
        <Rect x="0" y="0" width="12" height="24" />
      </ClipPath>
    </Defs>
    <Path
      fill={color}
      d="M12 2.0845a9.9155 9.9155 0 1 0 9.9155 9.9155A9.9155 9.9155 0 0 0 12 2.0845z"
      clipPath="url(#halfClip)"
    />
    <Path
      fill="none"
      stroke={color}
      strokeWidth="2"
      d="M12 2.0845a9.9155 9.9155 0 1 0 9.9155 9.9155A9.9155 9.9155 0 0 0 12 2.0845z"
    />
  </Svg>
);

const RTL_TRANSFORM: ViewStyle = {
  transform: [{ rotateY: '180deg' }],
};

const CircleIcon = ({ index, type, size, color }: StarIconProps) => {
  const Component =
    type === 'full' ? CircleFull : type === 'half' ? CircleHalf : CircleBorder;

  return <Component index={index} size={size} color={color} />;
};

export default CircleIcon;
