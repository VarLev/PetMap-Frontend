import { FC, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RadioButton, IconButton , Text } from "react-native-paper";

type SubscriptionRadioButtonProps = {
    value: string;
    price: string;
    checked: boolean;
    handleSheetOpen: () => void;
    handleOpenBenefits: () => void;
}

const SubscriptionRadioButton: FC<SubscriptionRadioButtonProps> = ({value, price, handleOpenBenefits, checked, handleSheetOpen}) => {
    const [borderColor, setBorderColor] = useState("#BFA8FF");
    const [borderWidth, setBorderWidth] = useState(1);
    const [paddingVertical, setPaddingVertical] = useState(16);
    const [paddingHorizontal, setPaddingHorizontal] = useState(10);

    useEffect(() => {
        if (checked === true) {
            setBorderColor("#ACFFB9");
            setBorderWidth(2);
            setPaddingVertical(15);
            setPaddingHorizontal(9);
        } else {
            setBorderColor("#BFA8FF");
            setBorderWidth(1);
            setPaddingVertical(16);
            setPaddingHorizontal(10);
        }
    }, [checked]);

    return (
        <TouchableOpacity onPress={handleSheetOpen}>
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
                        <View className="flex-row">
                            <Text style={{...styles.textSmall, ...styles.semiBold}}>{'\u2022 '} Безлимитное </Text>
                            <Text style={styles.textSmall}>создание прогулок</Text>
                        </View>
                        <View className="flex-row">
                            <Text style={{...styles.textSmall, ...styles.semiBold}}>{'\u2022 '} Безлимитное </Text>
                            <Text style={styles.textSmall}>создание меток на карте</Text>
                        </View>
                    </View>
                    <TouchableOpacity
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
        marginBottom: 12
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
        fontWeight: 600
    }
      
})

export default SubscriptionRadioButton;