import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import { Colors } from '../../constants/Colors';

interface TypographyProps extends TextProps {
    children: React.ReactNode;
    color?: string;
    center?: boolean;
}

export const Title = ({ children, color = Colors.text, center, style, ...props }: TypographyProps) => (
    <Text style={[styles.title, { color, textAlign: center ? 'center' : 'left' }, style]} {...props}>
        {children}
    </Text>
);

export const Subtitle = ({ children, color = Colors.primary, center, style, ...props }: TypographyProps) => (
    <Text style={[styles.subtitle, { color, textAlign: center ? 'center' : 'left' }, style]} {...props}>
        {children}
    </Text>
);

export const BodyText = ({ children, color = Colors.textMuted, center, style, ...props }: TypographyProps) => (
    <Text style={[styles.body, { color, textAlign: center ? 'center' : 'left' }, style]} {...props}>
        {children}
    </Text>
);

const styles = StyleSheet.create({
    title: {
        fontFamily: 'PoppinsBold',
        fontSize: 28,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontFamily: 'PoppinsSemiBold',
        fontSize: 16,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    body: {
        fontFamily: 'InterRegular',
        fontSize: 16,
        lineHeight: 24,
    },
});