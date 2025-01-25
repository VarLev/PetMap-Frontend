
import { FC } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from 'react-native-paper';
import i18n from "@/i18n";


type IconProps = {
  icon: string;
  color: string;
};

const TableIcon: FC<IconProps> = ({ icon, color }) => (
  <Icon source={icon} color={color} size={24} />
);

    const benefits = [
        {
          key: 1,
          name: "paywall.benefits.item1",
          base: <TableIcon icon="close" color="white" />,
          premium: <TableIcon icon="check" color="#ACFFB9" />,
        },
        {
          key: 2,
          name: "paywall.benefits.item2",
          base: `2 ${i18n.t("paywall.perDay")}`,
          premium: <TableIcon icon="all-inclusive" color="#ACFFB9" />,
        },
        {
          key: 3,
          name: "paywall.benefits.item3",
          base: "20",
          premium: <TableIcon icon="all-inclusive" color="#ACFFB9" />,
        },
        {
          key: 4,
          name: 'paywall.benefits.item4',
          base: <TableIcon icon="close" color="white" />,
          premium: <TableIcon icon="check" color="#ACFFB9" />,
        },
        {
          key: 5,
          name: 'paywall.benefits.item5',
          base: <TableIcon icon="close" color="white" />,
          premium: <TableIcon icon="check" color="#ACFFB9" />,
        },
        {
          key: 6,
          name: 'paywall.benefits.item6',
          base: <TableIcon icon="close" color="white" />,
          premium: <TableIcon icon="check" color="#ACFFB9" />,
        },
        {
          key: 7,
          name: 'paywall.benefits.item7',
          base: <TableIcon icon="check" color="white" />,
          premium: <TableIcon icon="close" color="#ACFFB9" />,
        },
        {
          key: 8,
          name: 'paywall.benefits.item8',
          base: <TableIcon icon="close" color="white" />,
          premium: <TableIcon icon="check" color="#ACFFB9" />,
        },
    ];

    return (
        <View className="mb-[18px]">
            <Text className="text-[20px] text-center color-white font-nunitoSansBold mb-[16px]">{i18n.t("paywall.whatGet")}</Text>
            <View style={styles.table}>
                <View style={styles.header}>
                    <Text style={styles.benefit}> </Text>
                    <Text style={styles.column}>{i18n.t("paywall.standard")}</Text>
                    <Text style={{...styles.column, ...styles.premium}}>{i18n.t("paywall.premium")}</Text>
                </View>

                {benefits.map((benefit) => {
                    const borderTop = benefit.key !== 1 ? styles.borderTop : null;

                    return (
                        <View key={benefit.key} style={{...styles.row, ...borderTop}}>
                            <Text style={styles.benefit}>{i18n.t(benefit.name)}</Text>
                            <Text style={styles.column}>{benefit.base}</Text>
                            <Text style={{...styles.column, ...styles.premium}}>{benefit.premium}</Text>
                        </View>
                    )
                })}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    table: {
        backgroundColor: "#1D1B204D",
        borderWidth: 1,
        borderRadius: 15,
        borderColor: "#BFA8FF"

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
