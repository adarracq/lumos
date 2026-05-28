// src/components/atoms/LumosButton.tsx
import { feedbackService } from '@/src/services/feedbackService';
import React, { useRef } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Subtitle } from './Typography';

interface LumosButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'outline' | 'ghost';
    isLoading?: boolean;
    style?: ViewStyle | ViewStyle[];
    disabled?: boolean;
    color?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const LumosButton = ({ title, onPress, variant = 'primary', isLoading, style, disabled, color }: LumosButtonProps) => {
    const isPrimary = variant === 'primary';
    const isOutline = variant === 'outline';
    const isDisabled = isLoading || disabled;
    const buttonColor = color ? color : Colors.primary;

    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        if (isDisabled) return;
        Animated.spring(scaleAnim, {
            toValue: 0.96,
            useNativeDriver: true,
            speed: 30,
        }).start();
    };

    const handlePressOut = () => {
        if (isDisabled) return;
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            bounciness: 10,
            speed: 20,
        }).start();
    };

    return (
        <AnimatedPressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={() => {
                feedbackService.heavy();
                onPress();
            }}
            disabled={isDisabled}
            // 👈 CORRECTION ICI : On retire la fonction ({ pressed }) => pour remettre un simple tableau
            style={[
                styles.buttonBase,
                isPrimary && styles.primaryGlass,
                isOutline && styles.outlineGlass,
                variant === 'ghost' && styles.ghost,
                isDisabled && styles.disabledButton,
                style,
                color && { borderTopColor: color },
                { transform: [{ scale: scaleAnim }] }
            ]}
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
        </AnimatedPressable>
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
    },
    primaryGlass: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderTopColor: Colors.primary,
        borderTopWidth: 1.5,
    },
    outlineGlass: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
        borderTopColor: `${Colors.primary}80`,
    },
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
        fontSize: 15,
        letterSpacing: 1.2,
        fontFamily: 'PoppinsSemiBold',
    },
    primaryText: {
        color: Colors.primary,
        textShadowColor: `${Colors.primary}40`,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
    outlineText: {
        color: Colors.textMuted,
    },
    ghostText: {
        color: Colors.textMuted,
        textDecorationLine: 'underline',
    }
});