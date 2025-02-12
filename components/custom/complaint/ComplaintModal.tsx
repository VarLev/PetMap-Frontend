import { StyleSheet, Text, View } from "react-native";
import { Button, Modal, Portal } from "react-native-paper";
import { FC, useEffect, useState } from "react";
import CustomOutlineInputText from "../inputs/CustomOutlineInputText";
import userStore from "@/stores/UserStore";
import i18n from "@/i18n";

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
                        {i18n.t("complaint.reason")}
                    </Text>
                    <CustomOutlineInputText
                        containerStyles="py-4"
                        numberOfLines={5}
                        placeholder={i18n.t("complaint.placeholder")}
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
                                {i18n.t("complaint.cancel")}
                            </Text>
                        </Button>
                        <Button
                            mode="text"
                            onPress={onComplain}
                            disabled={!inputValue}
                        >
                            <Text className={"text-base font-nunitoSansBold " + textButtonColor}>
                                {i18n.t("complaint.submit")}
                            </Text>
                        </Button>
                    </View>
                </View> :
                <View style={styles.complaint}>
                    <Text className="text-base font-nunitoSansBold text-indigo-700 text-center">
                        {isComplaintSuccess ? i18n.t("complaint.success") : i18n.t("complaint.error")}
                    </Text>
                    <Button
                        mode="text"
                        onPress={handleCloseModal}
                        labelStyle={{marginVertical: 0}}
                    >
                        <Text className="text-base font-nunitoSansBold text-gray-500">
                            {i18n.t("complaint.close")}
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