// src/screens/profile/components/VaultWidget.tsx
import { Colors } from '@/src/constants/Colors';
import { Archive, ChevronRight } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface VaultWidgetProps {
    onPress: () => void;
}

export const VaultWidget = ({ onPress }: VaultWidgetProps) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={styles.leftContent}>
                <View style={styles.iconBg}>
                    <Archive color={Colors.primary} size={22} />
                </View>
                <View>
                    <Text style={styles.title}>Coffre-fort</Text>
                    <Text style={styles.subtitle}>
                        {"Explore tes pensées et bilans passés."}
                    </Text>
                </View>
            </View>

            <View style={styles.rightContent}>
                <ChevronRight color={Colors.textMuted} size={20} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(212, 175, 55, 0.05)', // Légèrement doré pour l'aspect "précieux"
        borderRadius: 20,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.2)',
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        flex: 1,
    },
    iconBg: {
        width: 46,
        height: 46,
        borderRadius: 14,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: Colors.text,
        fontSize: 16,
        fontFamily: 'PoppinsSemiBold',
        marginBottom: 2,
    },
    subtitle: {
        color: Colors.textMuted,
        fontSize: 12,
        fontFamily: 'InterMedium',
    },
    rightContent: {
        paddingLeft: 10,
    }
});