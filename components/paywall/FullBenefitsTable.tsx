import { FC } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from 'react-native-paper';

type IconProps = {
    icon: string,
    color: string;
}

const FullBenefitsTable = () => {
    const TableIcon: FC<IconProps> = ({icon, color}) => <Icon source={icon} color={color} size={24} />

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
          name: 'Доступ ко всем фильтрам',
          base: <TableIcon icon="close" color="white" />,
          premium: <TableIcon icon="check" color="#ACFFB9" />,
        },
        {
          key: 5,
          name: 'Поиск на карте через прямой адрес',
          base: <TableIcon icon="close" color="white" />,
          premium: <TableIcon icon="check" color="#ACFFB9" />,
        },
        {
          key: 6,
          name: 'Перевод всего пользовательского текста',
          base: <TableIcon icon="close" color="white" />,
          premium: <TableIcon icon="check" color="#ACFFB9" />,
        },
        {
          key: 7,
          name: 'Реклама',
          base: <TableIcon icon="check" color="white" />,
          premium: <TableIcon icon="close" color="#ACFFB9" />,
        },
        {
          key: 8,
          name: 'Увеличение каждого бонуса на +0.5%',
          base: <TableIcon icon="close" color="white" />,
          premium: <TableIcon icon="check" color="#ACFFB9" />,
        },
    ];

    return (
        <View className="mb-[18px]">
            <Text className="text-[20px] text-center color-white font-nunitoSansBold mb-[16px]">Что вы получите?</Text>
            <View style={styles.table}>
                <View style={styles.header}>
                    <Text style={styles.benefit}> </Text>
                    <Text style={styles.column}>Обычный</Text>
                    <Text style={{...styles.column, ...styles.premium}}>Премиум</Text>
                </View>

                {benefits.map((benefit) => {
                    const borderTop = benefit.key !== 1 ? styles.borderTop : null;

                    return (
                        <View key={benefit.key} style={{...styles.row, ...borderTop}}>
                            <Text style={styles.benefit}>{benefit.name}</Text>
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
    header: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        marginHorizontal: 16,
    },
    benefit: {
        color: "white",
        width: "50%",
    },
    column: {
        display: "flex",
        width: "25%",
        textAlign: "center",
        color: "white"
    },
    borderTop: {
        borderTopColor: "#BFA8FF",
        borderTopWidth: 1,
    },
    row: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        marginHorizontal: 16,
    },
    premium: {
        color: "#ACFFB9"
    }
})

export default FullBenefitsTable;