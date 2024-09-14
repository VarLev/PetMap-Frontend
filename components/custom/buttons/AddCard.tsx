import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Card, IconButton } from 'react-native-paper';

interface AddCardProps {
  onPress: () => void;
  buttonText: string;
  cardClassName?: string; // Дополнительный класс для стилей карточки
}

const AddCard: React.FC<AddCardProps> = ({ onPress, buttonText, cardClassName }) => {
  return (
    <Card className={`w-full/2 h-[230px] m-2 p-2 border-3 border-dashed border-[#D9CBFF] rounded-2xl shadow-lg items-center justify-center ${cardClassName}`}
    style={{ borderWidth: 3, borderColor: '#D9CBFF', width: 200 }}
    >
      <TouchableOpacity className="items-center" onPress={onPress}>
        <IconButton
          icon="plus"
          size={30}
          iconColor="black"
          className="bg-[#F5ECFF] rounded-full"
        />
        <Text className="font-nunitoSansRegular mt-2">
          {buttonText}
        </Text>
      </TouchableOpacity>
    </Card>
  );
};

export default AddCard;
