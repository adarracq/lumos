import { Zap } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useToastStore } from '../../store/useToastStore';
import { Subtitle } from '../atoms/Typography';

export const FloatingToast = () => {
    const { message, visible } = useToastStore();
    const translateY = new Animated.Value(-100);
    const opacity = new Animated.Value(0);

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(translateY, { toValue: 50, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(translateY, { toValue: -100, duration: 300, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true })
            ]).start();
        }
    }, [visible]);

    if (!message && !visible) return null;

    return (
        <Animated.View style={[styles.container, { opacity, transform: [{ translateY }] }]}>
            <Subtitle style={styles.text}>{message}</Subtitle>
            <Zap color={Colors.primary} size={18} fill={Colors.primary} style={{ marginLeft: 8 }} />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        alignSelf: 'center',
        backgroundColor: Colors.background,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        zIndex: 9999,
    },
    text: {
        color: Colors.primary,
    }
});