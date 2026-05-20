import { feedbackService } from '@/src/services/feedbackService';
import { X } from 'lucide-react-native';
import React, { ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';

interface BottomSheetModalProps {
    isVisible: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export const BaseBottomSheetModal = ({ isVisible, onClose, title, children }: BottomSheetModalProps) => {
    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
            statusBarTranslucent={true}
            onRequestClose={onClose}
        >
            {/* 1. Le KeyboardAvoidingView devient le composant Racine absolue */}
            {/* On force 'padding' pour iOS ET Android, car le translucent casse le comportement Android */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
                keyboardVerticalOffset={Platform.OS === 'android' ? 24 : 0} // Compense la barre de statut Android
                style={styles.keyboardRoot}
            >
                {/* 2. L'overlay sombre prend tout l'espace et pousse le contenu vers le bas */}
                <View style={styles.overlay}>

                    <View style={styles.modalContainer}>

                        <View style={styles.dragHandleContainer}>
                            <View style={styles.dragHandle} />
                        </View>

                        <View style={styles.header}>
                            <Text style={styles.title}>{title}</Text>
                            <TouchableOpacity onPress={() => { onClose(); feedbackService.light(); }} style={styles.closeBtn}>
                                <X color={Colors.textMuted} size={24} />
                            </TouchableOpacity>
                        </View>

                        {/* 3. flexShrink sur le ScrollView règle le problème de micro-scroll */}
                        <ScrollView
                            style={styles.scrollView}
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            bounces={false}
                        >
                            {children}
                        </ScrollView>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    keyboardRoot: {
        flex: 1, // Indispensable pour que le clavier pousse correctement
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(10, 10, 10, 0.85)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#161616',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        maxHeight: '92%',
        paddingHorizontal: 20,
        // On compense la zone de la Home Bar (iOS) sans créer de trou avec le bas de l'écran
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        width: '100%',
        margin: 0,
    },
    dragHandleContainer: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    dragHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    title: {
        color: Colors.text,
        fontSize: 20,
        fontFamily: 'PoppinsBold',
    },
    closeBtn: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonSimple: {
        position: 'absolute',
        top: 16,
        right: 20,
        zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.06)',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flexShrink: 1, // LE SECRET EST ICI : autorise le composant à se "rétrécir" à la taille de son contenu
    },
    scrollContent: {
        // Plus de flexGrow: 1 !
        paddingBottom: 20,
    }
});