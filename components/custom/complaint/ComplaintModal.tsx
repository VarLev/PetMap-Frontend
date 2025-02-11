import { StyleSheet, Text, View } from "react-native";
import { Button, Modal, Portal } from "react-native-paper";
import { FC, useEffect, useState } from "react";
import CustomOutlineInputText from "../inputs/CustomOutlineInputText";
import userStore from "@/stores/UserStore";

type ComplaintModalProps = {
    isVisible: boolean;
    handleCloseModal: () => void;
    handleComplain: (text: string) => void;
    isComplaintDone: boolean;
    isComplaintSuccess: boolean;
    contentId: string;
    contentUserId: string;
    contentType: string;
}

const ComplaintModal: FC<ComplaintModalProps> = ({
    isVisible,
    handleCloseModal,
    handleComplain,
    isComplaintDone,
    isComplaintSuccess,
    contentId,
    contentUserId,
    contentType
}) => {
    const [inputValue, setInputValue] = useState('');
    const [complaintText, setComplaintText] = useState('');
    const [textButtonColor, setTextButtonColor] = useState('');
    const [currentUserId, setCurrentUserId] = useState('');

    useEffect(() => {
        if (!complaintText) {
            setTextButtonColor('text-gray-500')
        } else {
            setTextButtonColor('text-indigo-700')
        }
    }, [complaintText])

    useEffect(() => {
        const userId = userStore.currentUser?.id;
        if (userId) {
            setCurrentUserId(userId)
        }
    }, [])

    const handleChangeComplaint = (text: string) => {
        setInputValue(text);
        setComplaintText(
            `Кем отправлена: ${currentUserId}
            на пользователя: ${contentUserId}
            за контент: ${contentType} ${contentId}
            текст жалобы: ${text}`
        )
    }

    const onComplain = () => {
        handleComplain(complaintText);
    }

    return (
        <Portal>
            <Modal visible={isVisible} onDismiss={handleCloseModal}>
                {!isComplaintDone ?
                <View style={styles.complaint}>
                    <Text className="text-base font-nunitoSansBold text-indigo-700">
                        Опишите причину жалобы
                    </Text>
                    <CustomOutlineInputText
                        containerStyles="py-4"
                        numberOfLines={5}
                        placeholder="оскорбления, разжигание ненависти, сексизм, дескриминация, спам и тд."
                        value={inputValue}
                        handleChange={(text) => handleChangeComplaint(text)}
                        maxLength={360}
                    />
                    <View className="flex flex-row justify-between">
                        <Button
                            mode="text"
                            onPress={handleCloseModal}
                            style={{marginHorizontal: 0}}
                        >
                            <Text className="text-base font-nunitoSansBold text-gray-500">
                                Отменить
                            </Text>
                        </Button>
                        <Button
                            mode="text"
                            onPress={onComplain}
                            disabled={!inputValue}
                        >
                            <Text className={"text-base font-nunitoSansBold " + textButtonColor}>
                                Отправить
                            </Text>
                        </Button>
                    </View>
                </View> :
                <View style={styles.complaint}>
                    <Text className="text-base font-nunitoSansBold text-indigo-700 text-center">
                        {isComplaintSuccess ? "Жалоба успешно отправлена!" : "К сожалению, произошла ошибка. Попробуйте позже."}
                    </Text>
                    <Button
                        mode="text"
                        onPress={handleCloseModal}
                        labelStyle={{marginVertical: 0}}
                    >
                        <Text className="text-base font-nunitoSansBold text-gray-500">
                            Закрыть
                        </Text>
                    </Button>
                </View>
                }
            </Modal>
        </Portal>
    )
}

const styles = StyleSheet.create({
  complaint: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 24,
    borderRadius: 12,
    display: "flex",
    flexDirection: "column",
    gap: 16
  }
});

export default ComplaintModal;