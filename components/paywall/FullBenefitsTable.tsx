import React, { FC } from "react";
import { View, Text } from "react-native";
import { Icon } from "react-native-paper";

type IconProps = {
  icon: string;
  color: string;
};

const TableIcon: FC<IconProps> = ({ icon, color }) => (
  <Icon source={icon} color={color} size={24} />
);

const FullBenefitsTable: FC = () => {
  const benefits = [
    {
      key: 1,
      name: "Значок Премиум пользователя",
      base: <TableIcon icon="close" color="white" />,
      premium: <TableIcon icon="check" color="#ACFFB9" />,
    },
    {
      key: 2,
      name: "Количество созданных прогулок",
      base: "2 шт / день",
      premium: <TableIcon icon="all-inclusive" color="#ACFFB9" />,
    },
    {
      key: 3,
      name: "Количество созданных меток",
      base: "20 шт",
      premium: <TableIcon icon="all-inclusive" color="#ACFFB9" />,
    },
    {
      key: 4,
      name: "Доступ ко всем фильтрам",
      base: <TableIcon icon="close" color="white" />,
      premium: <TableIcon icon="check" color="#ACFFB9" />,
    },
    {
      key: 5,
      name: "Поиск на карте через прямой адрес",
      base: <TableIcon icon="close" color="white" />,
      premium: <TableIcon icon="check" color="#ACFFB9" />,
    },
    {
      key: 6,
      name: "Перевод всего пользовательского текста",
      base: <TableIcon icon="close" color="white" />,
      premium: <TableIcon icon="check" color="#ACFFB9" />,
    },
    {
      key: 7,
      name: "Реклама",
      base: <TableIcon icon="check" color="white" />,
      premium: <TableIcon icon="close" color="#ACFFB9" />,
    },
    {
      key: 8,
      name: "Увеличение каждого бонуса на +0.5%",
      base: <TableIcon icon="close" color="white" />,
      premium: <TableIcon icon="check" color="#ACFFB9" />,
    },
  ];

  return (
    <View className="mb-[18px]">
      <Text className="text-[20px] text-center text-white font-nunitoSansBold mb-[16px]">
        Что вы получите?
      </Text>

      <View className="bg-[#1D1B204D] border-[1px] border-[#BFA8FF] rounded-[15px]">
        {/* Заголовок таблицы */}
        <View className="flex-row items-center py-[10px] mx-[16px]">
          <Text className="w-1/2 text-white" />
          <Text className="w-1/4 text-center text-white">Обычный</Text>
          <Text className="w-1/4 text-center text-[#ACFFB9]">Премиум</Text>
        </View>

        {/* Динамические строки преимуществ */}
        {benefits.map((benefit, idx) => (
          <View
            key={benefit.key}
            className={`flex-row items-center py-[10px] mx-[16px] ${
              idx !== 0 ? "border-t border-[#BFA8FF]" : ""
            }`}
          >
            <Text className="w-1/2 text-white">{benefit.name}</Text>
            <Text className="w-1/4 text-center text-white">{benefit.base}</Text>
            <Text className="w-1/4 text-center text-[#ACFFB9]">
              {benefit.premium}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default FullBenefitsTable;
