// src/components/organisms/RitualDetailModal.tsx
import { LumosButton } from '@/src/components/atoms/LumosButton';
import { BodyText } from '@/src/components/atoms/Typography';
import { BaseBottomSheetModal } from '@/src/components/molecules/BaseBottomSheet';
import { Colors } from '@/src/constants/Colors';
import { Brain, Clock, Sparkles } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface RitualDetailModalProps {
    isVisible: boolean;
    onClose: () => void;
    ritual: {
        title: string;
        family: 'REFLECTION' | 'ACTION' | string;
        description: string;
        durationMin?: number;
    } | null;
    onComplete: () => void;
}

export const RitualDetailModal = ({ isVisible, onClose, ritual, onComplete }: RitualDetailModalProps) => {
    if (!ritual) return null;

    const isReflection = ritual.family === 'REFLECTION';
    // Utilisation des icônes Lucide adaptées à la catégorie
    const FamilyIcon = isReflection ? Brain : Sparkles;
    const familyLabel = isReflection ? 'Réflexion du soir' : 'Action consciente';
    const accentColor = isReflection ? Colors.primary : '#9C27B0'; // Or pour la réflexion, Violet mystique pour l'action

    const handleConfirm = () => {
        onComplete();
        onClose();
    };

    return (
        <BaseBottomSheetModal
            isVisible={isVisible}
            onClose={onClose}
            title={ritual.title}
        >
            <View style={styles.container}>

                {/* Ligne d'informations (Badges de catégorie et durée) */}
                <View style={styles.metaRow}>
                    <View style={[styles.badge, { backgroundColor: `${accentColor}12`, borderColor: `${accentColor}25` }]}>
                        <FamilyIcon color={accentColor} size={14} />
                        <Text style={[styles.badgeText, { color: accentColor }]}>{familyLabel}</Text>
                    </View>

                    {ritual.durationMin && (
                        <View style={styles.durationBadge}>
                            <Clock color={Colors.textMuted} size={14} />
                            <Text style={styles.durationText}>{ritual.durationMin} min</Text>
                        </View>
                    )}
                </View>

                {/* Conteneur descriptif style "Verre fumé" très épuré */}
                <View style={styles.descriptionCard}>
                    <BodyText style={styles.descriptionText}>
                        {ritual.description}
                    </BodyText>
                </View>

                {/* Bouton de validation premium de l'application */}
                <LumosButton
                    title="Terminer"
                    onPress={handleConfirm}
                    style={styles.button}
                />
            </View>
        </BaseBottomSheetModal>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 4,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        borderWidth: 1,
    },
    badgeText: {
        fontSize: 11,
        fontFamily: 'PoppinsBold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    durationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    durationText: {
        color: Colors.textMuted,
        fontSize: 12,
        fontFamily: 'PoppinsSemiBold',
    },
    descriptionCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.01)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.04)',
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
    },
    descriptionText: {
        color: Colors.text,
        fontSize: 15,
        lineHeight: 24,
        fontFamily: 'PoppinsMedium',
    },
    button: {
        marginTop: 8,
    },
});