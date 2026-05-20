// src/components/atoms/LumosButton.tsx
import { feedbackService } from '@/src/services/feedbackService';
import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Subtitle } from './Typography';

interface LumosButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'outline' | 'ghost';
    isLoading?: boolean;
    style?: ViewStyle;
    disabled?: boolean;
    color?: string; // Optionnel pour permettre une personnalisation de la couleur du texte
}

export const LumosButton = ({ title, onPress, variant = 'primary', isLoading, style, disabled, color }: LumosButtonProps) => {
    const isPrimary = variant === 'primary';
    const isOutline = variant === 'outline';
    const isDisabled = isLoading || disabled;
    const buttonColor = color ? color : Colors.primary;

    return (
        <TouchableOpacity
            style={[
                styles.buttonBase,
                isPrimary && styles.primaryGlass,
                isOutline && styles.outlineGlass,
                variant === 'ghost' && styles.ghost,
                isDisabled && styles.disabledButton,
                style,
                color && { borderTopColor: color } // Permet de personnaliser la bordure si une couleur est fournie
            ]}
            onPress={() => {
                feedbackService.heavy();
                onPress();
            }}
            disabled={isDisabled}
            activeOpacity={0.7}
        >
            {isLoading ? (
                <ActivityIndicator color={isPrimary ? Colors.text : buttonColor} />
            ) : (
                <View style={styles.contentRow}>
                    <Subtitle
                        style={[
                            styles.text,
                            isPrimary && styles.primaryText,
                            isOutline && styles.outlineText,
                            variant === 'ghost' && styles.ghostText,
                            color && { color: buttonColor }
                        ]}
                    >
                        {title}
                    </Subtitle>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonBase: {
        height: 56,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        width: '100%',
        marginVertical: 8,
        // SUPPRESSION DES OMBRES ICI (shadow et elevation)
    },
    // --- VARIANT: PRIMARY (Glassmorphism Premium avec Accentuation) ---
    primaryGlass: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)', // Encore plus transparent pour éviter l'effet "gris"
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderTopColor: Colors.primary, // L'éclat de lumière de ta couleur en haut
        borderTopWidth: 1.5,
    },
    // --- VARIANT: OUTLINE (Verre fumé / Secondaire) ---
    outlineGlass: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
        // Si tu veux aussi un rappel sur le bouton secondaire :
        borderTopColor: `${Colors.primary}80`,
    },
    // --- VARIANT: GHOST (Invisible, juste le texte) ---
    ghost: {
        backgroundColor: 'transparent',
        shadowOpacity: 0,
        elevation: 0,
    },
    disabledButton: {
        opacity: 0.4,
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 15, // Légèrement affiné
        letterSpacing: 1.2, // Un peu plus d'espace pour le côté élégant
        fontFamily: 'PoppinsSemiBold',
    },
    primaryText: {
        color: Colors.primary,
        textShadowColor: `${Colors.primary}40`, // Un léger halo lumineux autour du texte
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
    outlineText: {
        color: Colors.textMuted, // Texte légèrement grisé
    },
    ghostText: {
        color: Colors.textMuted,
        textDecorationLine: 'underline',
    }
});