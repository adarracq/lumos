// src/screens/profile/components/DataBackupSettings.tsx
import { Colors } from '@/src/constants/Colors';
import { useUserStore } from '@/src/store/useUserStore';
import { Crown, Download, Save } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// N'oublie pas d'importer tes vraies fonctions de sauvegarde ici :
// import { exportData, importData } from '@/src/services/dataBackupService'; 
import { PaywallModal } from '@/src/components/organisms/PaywallModal';
import { dataBackupService } from '@/src/services/dataBackupService';
import { feedbackService } from '@/src/services/feedbackService';

export const DataBackupSettings = () => {
    const isPremium = useUserStore(state => state.isPremium);
    const [isPaywallVisible, setPaywallVisible] = useState(false);

    const handleExport = async () => {
        if (!isPremium) {
            feedbackService.error();
            setPaywallVisible(true);
            return;
        }
        feedbackService.medium();
        // Lancer la fonction d'export ici :
        dataBackupService.exportDataJSON();
    };

    const handleImport = async () => {
        if (!isPremium) {
            feedbackService.error();
            setPaywallVisible(true);
            return;
        }
        feedbackService.medium();
        // Lancer la fonction d'import ici :
        dataBackupService.importDataJSON();
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.description}>
                    Sécurisez votre progression ou restaurez vos données sur un nouvel appareil.
                </Text>

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={handleExport}
                        activeOpacity={0.8}
                    >
                        <Save color={Colors.primary} size={18} />
                        <Text style={styles.btnText}>Sauvegarder</Text>
                        {!isPremium && <View style={styles.proTag}>
                            <Crown size={12} />
                        </View>}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={handleImport}
                        activeOpacity={0.8}
                    >
                        <Download color={Colors.text} size={18} />
                        <Text style={[styles.btnText, { color: Colors.text }]}>Restaurer</Text>
                        {!isPremium && <View style={styles.proTag}>
                            <Crown size={12} />
                        </View>}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Modale d'abonnement si un utilisateur gratuit tente de cliquer */}
            <PaywallModal
                isVisible={isPaywallVisible}
                onClose={() => setPaywallVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginBottom: 24 },
    title: { color: Colors.text, fontSize: 16, fontFamily: 'PoppinsSemiBold' },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.04)',
    },
    description: { color: Colors.textMuted, fontSize: 13, fontFamily: 'InterMedium', marginBottom: 16, lineHeight: 20 },

    buttonRow: { flexDirection: 'row', gap: 12 },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingVertical: 12,
        borderRadius: 14,
        gap: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.03)'
    },
    btnText: { color: Colors.primary, fontFamily: 'PoppinsSemiBold', fontSize: 13 },

    proTag: {
        backgroundColor: Colors.primary,
        color: Colors.background,
        fontSize: 9,
        fontFamily: 'PoppinsBold',
        padding: 4,
        borderRadius: 4,
        position: 'absolute',
        top: -6,
        right: -4
    }
});