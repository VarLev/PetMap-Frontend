import { Colors } from "@/constants/Colors";
import { FC, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RadioButton, IconButton , Text } from "react-native-paper";

type SubscriptionRadioButtonProps = {
    value: string;
    price: string;
    checked: boolean;
    sale?: number;
    handleSheetOpen: () => void;
    handleOpenBenefits: () => void;
}

const SubscriptionRadioButton: FC<SubscriptionRadioButtonProps> = ({value, price, checked, sale, handleSheetOpen, handleOpenBenefits}) => {
    const [borderColor, setBorderColor] = useState("#BFA8FF");
    const [borderWidth, setBorderWidth] = useState(1);
    const [paddingVertical, setPaddingVertical] = useState(14);
    const [paddingHorizontal, setPaddingHorizontal] = useState(10);
    const [isSaleInfo, setIsSaleInfo] = useState(false);

    useEffect(() => {
        if (checked === true) {
            setBorderColor("#ACFFB9");
            setBorderWidth(2);
            setPaddingVertical(13);
            setPaddingHorizontal(9);
        } else {
            setBorderColor("#BFA8FF");
            setBorderWidth(1);
            setPaddingVertical(14);
            setPaddingHorizontal(10);
        }
    }, [checked]);

    useEffect(() => {
        if (sale) {
            setIsSaleInfo(true)
        } else setIsSaleInfo(false);
    }, [sale]);

    const fullBenefits = [
        {
            id: 1,
            firstWord: "Безлимитное",
            lastWords: "создание прогулок"
        },
        {
            id: 3,
            firstWord: "Встроеный",
            lastWords: "AI-переводчик"
        },
    ];

    return (
        <TouchableOpacity activeOpacity={0.8} onPress={handleSheetOpen}>
            <View
                style={{
                    ...styles.radioButton,
                    borderColor: borderColor,
                    borderWidth: borderWidth,
                    paddingVertical: paddingVertical,
                    paddingHorizontal: paddingHorizontal
                }}
            >
                <RadioButton
                    value={value}
                    color="#ACFFB9"
                    uncheckedColor="#BFA8FF"
                />
                <View className="flex-column gap-1">
                    <Text className="text-[24px] font-nunitoSansBold color-white">{price}</Text>
                    <View className="flex-column">
                        {fullBenefits.map(benefit => {
                            return (
                                <View key={benefit.id} className="flex-row">
                                    <Text style={{...styles.textSmall, ...styles.semiBold}}>{'\u2022 '} {benefit.firstWord} </Text>
                                    <Text style={styles.textSmall}>{benefit.lastWords}</Text>
                                </View>
                            )
                        })}
                        {/* <View className="flex-row">
                            <Text style={{...styles.textSmall, ...styles.semiBold}}>{'\u2022 '} Безлимитное </Text>
                            <Text style={styles.textSmall}>создание прогулок</Text>
                        </View>
                        <View className="flex-row">
                            <Text style={{...styles.textSmall, ...styles.semiBold}}>{'\u2022 '} Безлимитное </Text>
                            <Text style={styles.textSmall}>создание меток на карте</Text>
                        </View> */}
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        className="flex-row items-center"
                        onPress={handleOpenBenefits}
                    >
                        <Text style={{...styles.textSmall, ...styles.semiBold}}>Подробнее о преимуществах</Text>
                        <IconButton
                            icon="chevron-right"
                            size={24}
                            iconColor="white"
                            style={styles.iconButton}
                        />
                    </TouchableOpacity>
                </View>
                {isSaleInfo &&
                    <View style={styles.saleContainer}>
                        <Text style={styles.saleText}>Выгоднее на {sale}%</Text>
                    </View>
                }
            </View>
        </TouchableOpacity>
        
    )

}

const styles = StyleSheet.create({
    radioButton: {
        display: "flex",
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        minWidth: "100%",
        borderRadius: 15,
        borderWidth: 1,
        backgroundColor: "#1D1B204D",
        marginBottom: 12,
        position: "relative"
    },
    iconButton: {
        alignSelf: "flex-end",
        marginHorizontal: 0,
        marginVertical: 0,
        paddingTop: 2
    },
    textSmall: {
        fontSize: 14,
        color: "white",
    },
    semiBold: {
        fontWeight: 600,
        fontFamily: "NunitoSans_700Bold"
    },
    saleContainer: {
        position: "absolute",
        top: -16,
        right: 20,
        backgroundColor: "white",
        padding: 8,
        borderRadius: 16

    },
    saleText: {
        color: Colors.darkViolet,
        fontSize: 14,
        fontWeight: 500,
    }
})

export default SubscriptionRadioButton;