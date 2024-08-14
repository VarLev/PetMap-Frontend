import React from 'react';
import { SvgUri } from 'react-native-svg';
import { View, StyleSheet } from 'react-native';

interface RandomAvatarComponentProps {
  gender: string;
}

const RandomAvatarComponent: React.FC<RandomAvatarComponentProps> = ({ gender }) => {
  const [avatarUrl, setAvatarUrl] = React.useState(generateRandomAvatarUrl(gender));

  function getRandomElement(arr: string[]) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function generateRandomAvatarUrl(gender: string) {
    const maleTopTypes = [
      'NoHair', 'Eyepatch', 'Hat', 'Hijab', 'Turban', 'WinterHat1', 'WinterHat2', 'WinterHat3', 'WinterHat4', 'ShortHairDreads01', 'ShortHairDreads02', 'ShortHairFrizzle', 'ShortHairShaggyMullet', 'ShortHairShortCurly', 'ShortHairShortFlat', 'ShortHairShortRound', 'ShortHairShortWaved', 'ShortHairSides', 'ShortHairTheCaesar', 'ShortHairTheCaesarSidePart'
    ];

    const femaleTopTypes = [
      'LongHairBigHair', 'LongHairBob', 'LongHairBun', 'LongHairCurly', 'LongHairCurvy', 'LongHairDreads', 'LongHairFrida', 'LongHairFro', 'LongHairFroBand', 'LongHairNotTooLong', 'LongHairShavedSides', 'LongHairMiaWallace', 'LongHairStraight', 'LongHairStraight2', 'LongHairStraightStrand'
    ];

    const accessoriesTypes = ['Blank', 'Kurt', 'Prescription01', 'Prescription02', 'Round', 'Sunglasses', 'Wayfarers'];
    const hairColors = ['Auburn', 'Black', 'Blonde', 'BlondeGolden', 'Brown', 'BrownDark', 'PastelPink', 'Platinum', 'Red', 'SilverGray'];
    const facialHairTypes = ['Blank', 'BeardMedium', 'BeardLight', 'BeardMajestic', 'MoustacheFancy', 'MoustacheMagnum'];
    const clotheTypes = ['BlazerShirt', 'BlazerSweater', 'CollarSweater', 'GraphicShirt', 'Hoodie', 'Overall', 'ShirtCrewNeck', 'ShirtScoopNeck', 'ShirtVNeck'];
    const eyeTypes = ['Close', 'Cry', 'Default', 'Dizzy', 'EyeRoll', 'Happy', 'Hearts', 'Side', 'Squint', 'Surprised', 'Wink', 'WinkWacky'];
    const eyebrowTypes = ['Angry', 'AngryNatural', 'Default', 'DefaultNatural', 'FlatNatural', 'RaisedExcited', 'RaisedExcitedNatural', 'SadConcerned', 'SadConcernedNatural', 'UnibrowNatural', 'UpDown', 'UpDownNatural'];
    const mouthTypes = ['Concerned', 'Default', 'Disbelief', 'Eating', 'Grimace', 'Sad', 'ScreamOpen', 'Serious', 'Smile', 'Tongue', 'Twinkle', 'Vomit'];
    const skinColors = ['Tanned', 'Yellow', 'Pale', 'Light', 'Brown', 'DarkBrown', 'Black'];

    const topTypes = gender === 'male' ? maleTopTypes : gender === 'female' ? femaleTopTypes : [...maleTopTypes, ...femaleTopTypes];

    const params = [
      `topType=${getRandomElement(topTypes)}`,
      `accessoriesType=${getRandomElement(accessoriesTypes)}`,
      `hairColor=${getRandomElement(hairColors)}`,
      `facialHairType=${gender === 'female' ? 'Blank' : getRandomElement(facialHairTypes)}`,
      `clotheType=${getRandomElement(clotheTypes)}`,
      `eyeType=${getRandomElement(eyeTypes)}`,
      `eyebrowType=${getRandomElement(eyebrowTypes)}`,
      `mouthType=${getRandomElement(mouthTypes)}`,
      `skinColor=${getRandomElement(skinColors)}`
    ];

    return `https://avataaars.io/?avatarStyle=Circle&${params.join('&')}`;
  }

  React.useEffect(() => {
    setAvatarUrl(generateRandomAvatarUrl(gender));
  }, [gender]);

  return (
    <View style={styles.container}>
      <SvgUri
        width="100"
        height="100"
        uri={avatarUrl}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});

export default RandomAvatarComponent;
