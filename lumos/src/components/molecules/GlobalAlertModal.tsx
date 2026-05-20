import { feedbackService } from '@/src/services/feedbackService';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useAlertStore } from '../../store/useAlertStore';

export const GlobalAlertModal = () => {
    const { isVisible, title, message, buttons, hideAlert } = useAlertStore();

    if (!isVisible) return null;

    return (
        <Modal visible={isVisible} transparent animationType="fade" statusBarTranslucent={true}>
            <View style={styles.overlay}>
                <View style={styles.alertBox}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonContainer}>
                        {buttons.map((btn, index) => {
                            const isCancel = btn.style === 'cancel';
                            const isDestructive = btn.style === 'destructive';

                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.button,
                                        isCancel && styles.buttonCancel,
                                        isDestructive && styles.buttonDestructive,
                                        buttons.length > 2 && styles.buttonStacked // Si plus de 2 boutons, on les empile
                                    ]}
                                    onPress={() => {
                                        hideAlert();
                                        feedbackService.heavy();
                                        if (btn.onPress) btn.onPress();
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[
                                        styles.buttonText,
                                        isCancel && styles.textCancel,
                                        isDestructive && styles.textDestructive
                                    ]}>
                                        {btn.text}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    alertBox: {
        backgroundColor: 'rgba(30, 30, 30, 0.95)',
        width: '100%',
        maxWidth: 340,
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    title: {
        color: Colors.text,
        fontSize: 18,
        fontFamily: 'PoppinsBold',
        marginBottom: 10,
        textAlign: 'center'
    },
    message: {
        color: Colors.textMuted,
        fontSize: 14,
        fontFamily: 'InterRegular',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20
    },
    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 10
    },
    button: {
        flex: 1,
        minWidth: '45%',
        paddingVertical: 12,
        borderRadius: 14,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonStacked: {
        minWidth: '100%',
    },
    buttonCancel: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    buttonDestructive: {
        backgroundColor: 'rgba(207, 102, 121, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(207, 102, 121, 0.4)',
    },
    buttonText: {
        color: Colors.background,
        fontFamily: 'PoppinsSemiBold',
        fontSize: 14,
    },
    textCancel: {
        color: Colors.text,
    },
    textDestructive: {
        color: '#CF6679', // Colors.error
    }
});