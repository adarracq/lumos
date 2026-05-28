import { Brain, Edit2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useUserStore } from '../../store/useUserStore';
import { LumosButton } from '../atoms/LumosButton';
import { Title } from '../atoms/Typography';
import { BaseBottomSheetModal } from '../molecules/BaseBottomSheet';

export const SocialFilterModal = ({ isVisible, onClose }: { isVisible: boolean, onClose: () => void }) => {
    const { socialFilters, setSocialFilters } = useUserStore();
    const [isEditing, setIsEditing] = useState(false);
    const [tempFilters, setTempFilters] = useState(socialFilters);

    const handleSave = () => {
        setSocialFilters(tempFilters);
        setIsEditing(false);
    };

    if (!isVisible) return null;

    return (
        <BaseBottomSheetModal
            isVisible={isVisible}
            onClose={onClose}
            title="Filtres sociaux"
        >

            <View style={styles.glassMindsetBox}>
                <Brain color="#9C27B0" size={24} style={{ marginBottom: 10 }} />
                <Text style={styles.mindsetTitle}>Renverser la dynamique</Text>

                {/* 1. Le texte philosophique raccourci et percutant */}
                <Text style={styles.mindsetDesc}>
                    Ne t'épuise plus à chercher la validation de personnes que tu n'estimes pas. Ton temps est précieux : demande-toi plutôt si elles correspondent à tes standards.
                </Text>

                <View style={styles.separator} />

                {/* 2. L'instruction claire sur l'action à faire */}
                <Text style={styles.instructionText}>
                    Définis ci-dessous les 3 qualités ou valeurs qu'une personne doit impérativement posséder pour mériter ton attention.
                </Text>
            </View>

            <View style={styles.filtersHeader}>
                <Title style={{ fontSize: 18 }}>Mes 3 Critères</Title>
                {!isEditing && (
                    <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(true)}>
                        <Edit2 color={Colors.primary} size={18} />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.filtersContainer}>
                {[0, 1, 2].map((index) => (
                    <View key={index} style={[styles.glassFilterItem, isEditing && styles.glassFilterItemEditing]}>
                        <Text style={styles.filterNumber}>{index + 1}.</Text>
                        {isEditing ? (
                            <TextInput
                                style={styles.glassInput}
                                value={tempFilters[index]}
                                onChangeText={(text) => {
                                    const newFilters = [...tempFilters];
                                    newFilters[index] = text;
                                    setTempFilters(newFilters);
                                }}
                                placeholder={`Ex: Être bienveillant, ambitieux...`}
                                placeholderTextColor={Colors.textMuted}
                                maxLength={50}
                                selectionColor={Colors.primary}
                            />
                        ) : (
                            <Text style={[styles.filterText, !socialFilters[index] && { color: Colors.textMuted, fontStyle: 'italic' }]}>
                                {socialFilters[index] || "Critère non défini..."}
                            </Text>
                        )}
                    </View>
                ))}
            </View>

            {isEditing && (
                <LumosButton
                    title="Sauvegarder mes filtres"
                    onPress={handleSave}
                    style={{ marginTop: 20 }}
                />
            )}

        </BaseBottomSheetModal>
    );
};

const styles = StyleSheet.create({
    // Glass Mindset Box
    glassMindsetBox: {
        backgroundColor: 'rgba(156, 39, 176, 0.1)',
        padding: 20,
        borderRadius: 16,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: 'rgba(156, 39, 176, 0.2)'
    },
    mindsetTitle: {
        color: "#9C27B0",
        fontFamily: 'PoppinsBold',
        fontSize: 16,
        marginBottom: 5
    },
    mindsetDesc: {
        color: Colors.text,
        fontSize: 13,
        lineHeight: 20,
        fontFamily: 'InterRegular',
        opacity: 0.9
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(156, 39, 176, 0.2)',
        marginVertical: 12,
    },
    instructionText: {
        color: Colors.text,
        fontSize: 13,
        fontFamily: 'PoppinsSemiBold',
        lineHeight: 18,
    },

    filtersHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    editBtn: { padding: 8, backgroundColor: 'rgba(212, 175, 55, 0.1)', borderRadius: 12 },
    filtersContainer: { gap: 15 },

    // Glass Filter Item & Input
    glassFilterItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.03)', paddingHorizontal: 15, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', height: 60 },
    glassFilterItemEditing: { backgroundColor: 'transparent', borderColor: 'transparent', paddingHorizontal: 0 },
    filterNumber: { color: Colors.primary, fontFamily: 'PoppinsBold', fontSize: 18, marginRight: 15 },
    filterText: { color: Colors.text, fontSize: 15, fontFamily: 'PoppinsSemiBold', flex: 1 },
    glassInput: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', color: Colors.text, fontSize: 15, fontFamily: 'PoppinsSemiBold', height: '100%', borderRadius: 12, paddingHorizontal: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }
});