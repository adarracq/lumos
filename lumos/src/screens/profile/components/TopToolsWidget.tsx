// src/screens/profile/components/TopToolsWidget.tsx
import { Colors } from '@/src/constants/Colors';
import { TOOLS_CATALOG } from '@/src/constants/Tools';
import { Wrench } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TopToolsWidgetProps {
    tools: { id: string, count: number }[];
}

export const TopToolsWidget = ({ tools }: TopToolsWidgetProps) => {
    if (tools.length === 0) return null;

    return (
        <View style={styles.glassSection}>
            <Text style={styles.sectionHeader}>Outils de survie (Top 3)</Text>
            <View style={styles.toolsList}>
                {tools.map((tool, index) => {
                    const meta = TOOLS_CATALOG.find(t => t.id === tool.id) || { title: tool.id, icon: Wrench };
                    return (
                        <View key={tool.id} style={styles.toolRow}>
                            <View style={styles.toolRowLeft}>
                                <Text style={styles.toolRank}>#{index + 1}</Text>
                                <View style={styles.toolIconBg}>
                                    <meta.icon color={Colors.primary} size={14} />
                                </View>
                                <Text style={styles.toolName}>{meta.title}</Text>
                            </View>
                            <View style={styles.toolCountBadge}>
                                <Text style={styles.toolCountText}>{tool.count} fois</Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    glassSection: { backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.04)', marginBottom: 16 },
    sectionHeader: { color: Colors.textMuted, fontSize: 11, fontFamily: 'PoppinsBold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
    toolsList: { gap: 10 },
    toolRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: 12, borderRadius: 14 },
    toolRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    toolRank: { color: Colors.textMuted, fontSize: 12, fontFamily: 'PoppinsBold', width: 20 },
    toolIconBg: { backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: 6, borderRadius: 8 },
    toolName: { color: Colors.text, fontSize: 13, fontFamily: 'PoppinsSemiBold' },
    toolCountBadge: { backgroundColor: 'rgba(255, 255, 255, 0.05)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    toolCountText: { color: Colors.textMuted, fontSize: 11, fontFamily: 'PoppinsBold' }
});