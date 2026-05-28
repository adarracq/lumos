// src/components/organisms/MicroStepsModal.tsx
import { LumosButton } from '@/src/components/atoms/LumosButton';
import { BodyText, Title } from '@/src/components/atoms/Typography';
import { BaseBottomSheetModal } from '@/src/components/molecules/BaseBottomSheet';
import { Colors } from '@/src/constants/Colors';
import { XP_REWARDS } from '@/src/constants/Rewards';
import { feedbackService } from '@/src/services/feedbackService';
import { useUserStore } from '@/src/store/useUserStore';
import { grantXP } from '@/src/utils/rewardManager';
import { CheckCircle2, Circle, Plus, Target } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface MicroStepsModalProps {
    isVisible: boolean;
    onClose: () => void;
}

export const MicroStepsModal = ({ isVisible, onClose }: MicroStepsModalProps) => {
    const trackToolUsage = useUserStore(state => state.trackToolUsage);

    const [step, setStep] = useState<'intro' | 'breakdown' | 'action'>('intro');
    const [mainTask, setMainTask] = useState('');
    const [microInput, setMicroInput] = useState('');
    const [microSteps, setMicroSteps] = useState<{ id: string, text: string, done: boolean }[]>([]);

    useEffect(() => {
        if (isVisible) {
            setStep('intro');
            setMainTask('');
            setMicroSteps([]);
            setMicroInput('');
        }
    }, [isVisible]);

    const handleAddStep = () => {
        if (!microInput.trim()) return;
        setMicroSteps([...microSteps, { id: Date.now().toString(), text: microInput.trim(), done: false }]);
        setMicroInput('');
        feedbackService.light();
    };

    const toggleStep = (id: string) => {
        const updatedSteps = microSteps.map(s => s.id === id ? { ...s, done: !s.done } : s);
        setMicroSteps(updatedSteps);

        if (updatedSteps.find(s => s.id === id)?.done) {
            feedbackService.medium(); // Coche
        } else {
            feedbackService.light(); // Décoche
        }
    };

    const handleFinish = () => {
        trackToolUsage('microSteps');
        grantXP(XP_REWARDS.MICRO_STEPS);
        feedbackService.success();
        onClose();
    };

    const renderContent = () => {
        // --- PHASE 1 : LA TÂCHE PRINCIPALE ---
        if (step === 'intro') {
            return (
                <View style={styles.centerContent}>
                    <View style={styles.iconWrapper}>
                        <Target color={Colors.primary} size={48} />
                    </View>
                    <Title center style={{ marginTop: 16 }}>La Montagne</Title>
                    <BodyText center color={Colors.textMuted} style={{ marginBottom: 30, paddingHorizontal: 10 }}>
                        Quelle est cette tâche qui te paralyse ou que tu repousses sans cesse ?
                    </BodyText>

                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Ranger tout mon appartement..."
                        placeholderTextColor={Colors.textMuted}
                        value={mainTask}
                        onChangeText={setMainTask}
                        autoFocus
                    />

                    <LumosButton
                        title="Suivant"
                        onPress={() => {
                            if (mainTask.trim()) {
                                feedbackService.light();
                                setStep('breakdown');
                            }
                        }}
                        disabled={!mainTask.trim()}
                        style={{ width: '100%', marginTop: 20 }}
                    />
                </View>
            );
        }

        // --- PHASE 2 : LE DÉCOUPAGE ---
        if (step === 'breakdown') {
            return (
                <View style={styles.fullWidth}>
                    <Title center style={{ marginBottom: 10 }}>Les Cailloux</Title>
                    <BodyText center color={Colors.textMuted} style={{ marginBottom: 20 }}>
                        Découpe "{mainTask}" en actions plus petites (moins de 5 minutes).
                    </BodyText>

                    <View style={styles.addStepRow}>
                        <TextInput
                            style={[styles.input, { flex: 1, marginBottom: 0 }]}
                            placeholder="Ex: Ramasser le verre de la table"
                            placeholderTextColor={Colors.textMuted}
                            value={microInput}
                            onChangeText={setMicroInput}
                            onSubmitEditing={handleAddStep}
                        />
                        <TouchableOpacity style={styles.addButton} onPress={handleAddStep} activeOpacity={0.8}>
                            <Plus color="#FFF" size={24} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.stepsList} showsVerticalScrollIndicator={false}>
                        {microSteps.map((s, index) => (
                            <View key={s.id} style={styles.stepItem}>
                                <Text style={styles.stepNumber}>{index + 1}.</Text>
                                <Text style={styles.stepText}>{s.text}</Text>
                            </View>
                        ))}
                    </ScrollView>

                    <LumosButton
                        title={`Passer à l'action (${microSteps.length})`}
                        onPress={() => {
                            feedbackService.medium();
                            setStep('action');
                        }}
                        disabled={microSteps.length === 0}
                        style={{ width: '100%', marginTop: 10 }}
                    />
                </View>
            );
        }

        // --- PHASE 3 : L'ACTION ---
        if (step === 'action') {
            const progress = microSteps.length > 0 ? (microSteps.filter(s => s.done).length / microSteps.length) * 100 : 0;
            const isAllDone = microSteps.length > 0 && microSteps.every(s => s.done);

            return (
                <View style={styles.fullWidth}>
                    <Title center style={{ marginBottom: 5 }}>En action !</Title>
                    <Text style={styles.mainTaskReminder}>{mainTask}</Text>

                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                    </View>

                    <ScrollView style={styles.stepsList} showsVerticalScrollIndicator={false}>
                        {microSteps.map((s) => (
                            <TouchableOpacity
                                key={s.id}
                                style={[styles.actionStepItem, s.done && styles.actionStepItemDone]}
                                onPress={() => toggleStep(s.id)}
                                activeOpacity={0.7}
                            >
                                {s.done ? (
                                    <CheckCircle2 color={Colors.primary} size={24} />
                                ) : (
                                    <Circle color={Colors.textMuted} size={24} />
                                )}
                                <Text style={[styles.actionStepText, s.done && styles.actionStepTextDone]}>
                                    {s.text}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    {isAllDone ?
                        <LumosButton
                            title="Terminé !"
                            onPress={handleFinish}
                            style={{ width: '100%', marginTop: 20 }}
                            disabled={!isAllDone}
                        />
                        :
                        <BodyText center color={Colors.textMuted} style={{ marginTop: 20 }}>
                            Coche chaque action au fur et à mesure que tu les réalises.
                        </BodyText>
                    }
                </View>
            );
        }
    };

    return (
        <BaseBottomSheetModal isVisible={isVisible} onClose={onClose} title="Paralysie face à la tâche">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.container}
            >
                {renderContent()}
            </KeyboardAvoidingView>
        </BaseBottomSheetModal>
    );
};

const styles = StyleSheet.create({
    container: { minHeight: 450, paddingHorizontal: 10, paddingBottom: 20 },
    centerContent: { alignItems: 'center', justifyContent: 'center', paddingTop: 20 },
    fullWidth: { flex: 1, paddingTop: 10 },

    iconWrapper: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(212, 175, 55, 0.05)', justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.2)' },

    input: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 16,
        color: Colors.text,
        fontSize: 16,
        fontFamily: 'InterMedium',
        marginBottom: 20,
    },

    addStepRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
    addButton: { width: 54, height: 54, borderRadius: 16, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },

    stepsList: { maxHeight: 300, width: '100%' },
    stepItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 12, marginBottom: 8 },
    stepNumber: { color: Colors.primary, fontFamily: 'PoppinsBold', fontSize: 16, marginRight: 12 },
    stepText: { color: Colors.text, fontFamily: 'InterMedium', fontSize: 15, flex: 1 },

    mainTaskReminder: { color: Colors.primary, fontFamily: 'PoppinsMedium', fontSize: 14, textAlign: 'center', marginBottom: 20 },

    progressBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, marginBottom: 20, overflow: 'hidden' },
    progressBarFill: { height: '100%', backgroundColor: Colors.primary },

    actionStepItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 16, marginBottom: 10, gap: 12 },
    actionStepItemDone: { backgroundColor: 'rgba(212, 175, 55, 0.05)', borderColor: 'rgba(212, 175, 55, 0.2)' },
    actionStepText: { color: Colors.text, fontFamily: 'InterMedium', fontSize: 15, flex: 1 },
    actionStepTextDone: { color: Colors.textMuted, textDecorationLine: 'line-through' },
});