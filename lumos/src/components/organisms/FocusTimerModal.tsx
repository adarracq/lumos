// src/components/organisms/FocusTimerModal.tsx
import { feedbackService } from '@/src/services/feedbackService';
import { Award, Square, Wind } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, AppState, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BREATHING_EXERCISES, BreathingExercise } from '../../constants/Breathing';
import { Colors } from '../../constants/Colors';
import { LumosButton } from '../atoms/LumosButton';
import { BodyText, Title } from '../atoms/Typography';
import { BaseBottomSheetModal } from '../molecules/BaseBottomSheet';

// ... [Interface et Logique interne inchangées] ...
interface FocusTimerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const FocusTimerModal = ({ isVisible, onClose, onComplete }: FocusTimerModalProps) => {

  const getRecommendedExercise = (): BreathingExercise => {
    const date = new Date();
    const hour = date.getHours();
    const dayOfWeek = date.getDay();

    if (hour >= 18) {
      const eveningPool = ['relax', 'box'];
      const selectedId = eveningPool[dayOfWeek % eveningPool.length];
      return BREATHING_EXERCISES.find(e => e.id === selectedId) || BREATHING_EXERCISES[0];
    } else {
      const morningPool = ['coherence', 'box', 'primal'];
      const selectedId = morningPool[dayOfWeek % morningPool.length];
      return BREATHING_EXERCISES.find(e => e.id === selectedId) || BREATHING_EXERCISES[0];
    }
  };

  const [selectedExercise, setSelectedExercise] = useState<BreathingExercise>(getRecommendedExercise());
  const [showSelectionMenu, setShowSelectionMenu] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const [totalSecondsLeft, setTotalSecondsLeft] = useState(0);
  const [cyclesLeft, setCyclesLeft] = useState(0);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseSeconds, setPhaseSeconds] = useState(0);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isVisible) {
      setSelectedExercise(getRecommendedExercise());
      setIsActive(false);
      setShowSelectionMenu(false);
    }
  }, [isVisible]);

  useEffect(() => {
    setTotalSecondsLeft(selectedExercise.defaultTarget * 60);
    setCyclesLeft(selectedExercise.defaultTarget);
    setCurrentPhaseIndex(0);
    setPhaseSeconds(selectedExercise.phases[0].duration || 0);
    scaleAnim.setValue(1);
  }, [selectedExercise]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive) {
      interval = setInterval(() => {
        const currentPhase = selectedExercise.phases[currentPhaseIndex];
        setPhaseSeconds((prev) => {
          if (currentPhase.isVariable) return prev + 1;
          if (prev > 1) return prev - 1;
          return 0;
        });
        if (selectedExercise.type === 'RHYTHM') {
          setTotalSecondsLeft((prev) => {
            if (prev <= 1) { handleFinish(); return 0; }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, currentPhaseIndex, selectedExercise]);

  useEffect(() => {
    if (isActive) {
      const currentPhase = selectedExercise.phases[currentPhaseIndex];
      if (!currentPhase.isVariable && phaseSeconds === 0) handlePhaseTransition();
    }
  }, [phaseSeconds, isActive]);

  const handlePhaseTransition = () => {
    const isLastPhase = currentPhaseIndex === selectedExercise.phases.length - 1;
    if (selectedExercise.type === 'CYCLE_BASED' && isLastPhase) {
      if (cyclesLeft <= 1) handleFinish();
      else {
        setCyclesLeft((prev) => prev - 1);
        setCurrentPhaseIndex(0);
        setPhaseSeconds(selectedExercise.phases[0].duration);
      }
    } else {
      const nextIndex = (currentPhaseIndex + 1) % selectedExercise.phases.length;
      setCurrentPhaseIndex(nextIndex);
      setPhaseSeconds(selectedExercise.phases[nextIndex].duration);
    }
  };

  useEffect(() => {
    scaleAnim.stopAnimation();
    if (!isActive) { Animated.timing(scaleAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start(); return; }
    const phase = selectedExercise.phases[currentPhaseIndex];
    const durationMs = phase.duration > 0 ? phase.duration * 1000 : 1000;
    if (phase.action === 'IN') Animated.timing(scaleAnim, { toValue: 1.8, duration: durationMs, easing: Easing.inOut(Easing.ease), useNativeDriver: true }).start();
    else if (phase.action === 'OUT') Animated.timing(scaleAnim, { toValue: 1, duration: durationMs, easing: Easing.inOut(Easing.ease), useNativeDriver: true }).start();
    else if (phase.action === 'HOLD_FULL') Animated.timing(scaleAnim, { toValue: 1.8, duration: 300, useNativeDriver: true }).start();
    else if (phase.action === 'HOLD_EMPTY') Animated.timing(scaleAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    else if (phase.action === 'FAST') Animated.loop(Animated.sequence([Animated.timing(scaleAnim, { toValue: 1.4, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }), Animated.timing(scaleAnim, { toValue: 1.0, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true })])).start();
  }, [currentPhaseIndex, isActive, selectedExercise]);

  const appState = useRef(AppState.currentState);
  const backgroundTime = useRef<number | null>(null);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        if (backgroundTime.current && isActive) {
          const elapsedSecondsInBackground = Math.floor((Date.now() - backgroundTime.current) / 1000);
          if (selectedExercise.type === 'RHYTHM') {
            setTotalSecondsLeft((prev) => {
              const newTotal = prev - elapsedSecondsInBackground;
              if (newTotal <= 0) { handleFinish(); return 0; }
              return newTotal;
            });
          }
        }
      } else if (nextAppState.match(/inactive|background/)) {
        backgroundTime.current = Date.now();
      }
      appState.current = nextAppState;
    });
    return () => subscription.remove();
  }, [isActive, selectedExercise]);

  const handleFinish = () => { setIsActive(false); onComplete(); onClose(); };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const formatGlobalTime = () => {
    if (selectedExercise.type === 'CYCLE_BASED') return `Cycle ${selectedExercise.defaultTarget - cyclesLeft + 1} / ${selectedExercise.defaultTarget}`;
    return formatTime(totalSecondsLeft);
  };

  if (!isVisible) return null;

  const currentPhase = selectedExercise.phases[currentPhaseIndex];
  let displayLabel = currentPhase.label;
  let breathCounter: string | null = null;

  if (currentPhase.action === 'FAST') {
    const isInspire = phaseSeconds % 2 === 0;
    displayLabel = isInspire ? 'Inspire' : 'Expire';
    const currentBreath = 20 - Math.floor((Math.max(0, phaseSeconds - 1)) / 2);
    breathCounter = `Respiration ${Math.min(20, Math.max(1, currentBreath))} / 20`;
  }

  return (
    <BaseBottomSheetModal
      isVisible={isVisible}
      onClose={onClose}
      title="Respiration" // <-- Magique ! Le header se crée tout seul
    >

      {!isActive && showSelectionMenu ? (
        <View style={{ flex: 1, marginTop: 15 }}>
          <BodyText style={{ marginBottom: 15 }}>Sélectionner un rituel :</BodyText>
          {BREATHING_EXERCISES.map((ex) => (
            <TouchableOpacity
              key={ex.id}
              style={[styles.glassExCard, selectedExercise.id === ex.id && styles.glassExCardActive]}
              onPress={() => { setSelectedExercise(ex); setShowSelectionMenu(false); }}
              activeOpacity={0.7}
            >
              <Text style={[styles.exName, selectedExercise.id === ex.id && { color: Colors.primary }]}>{ex.name}</Text>
              <Text style={styles.exDesc}>{ex.description}</Text>
            </TouchableOpacity>
          ))}
          <LumosButton title="Retour" onPress={() => setShowSelectionMenu(false)} style={{ marginTop: 20 }} />
        </View>
      ) : !isActive ? (
        <View style={styles.readyContainer}>
          <View style={styles.readyIconWrapper}>
            <Wind color={Colors.primary} size={48} />
          </View>
          <Title center style={{ fontSize: 22, marginTop: 16 }}>{selectedExercise.name}</Title>
          <BodyText center style={{ paddingHorizontal: 20, marginBottom: 30, opacity: 0.8 }}>{selectedExercise.description}</BodyText>

          <View style={styles.targetBadge}>
            <Text style={styles.targetIndicatorText}>
              {selectedExercise.type === 'RHYTHM' ? `Objectif : ${selectedExercise.defaultTarget} Minutes` : `Objectif : ${selectedExercise.defaultTarget} Cycles`}
            </Text>
          </View>

          <LumosButton title="Démarrer" onPress={() => setIsActive(true)} style={{ width: '100%', marginBottom: 20 }} />
          <TouchableOpacity onPress={() => { setShowSelectionMenu(true); feedbackService.light(); }} activeOpacity={0.7}>
            <Text style={styles.changeBtnText}>Changer d'exercice</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.activeContainer}>
          <View style={styles.globalIndicatorWrapper}>
            <Text style={styles.globalIndicator}>{formatGlobalTime()}</Text>
          </View>

          <View style={styles.animationZone}>
            <Text style={styles.phaseLabelTop}>{displayLabel}</Text>

            <View style={styles.subLabelContainer}>
              {breathCounter && <Text style={styles.phaseSubLabel}>{breathCounter}</Text>}
            </View>

            <View style={styles.circleContainer}>
              <Animated.View style={[styles.breathingCircle, { transform: [{ scale: scaleAnim }] }]} />
              <View style={styles.timerContainer}>
                <Text style={styles.phaseTimer}>
                  {currentPhase.isVariable ? formatTime(phaseSeconds) : phaseSeconds}
                </Text>
              </View>
            </View>

            <View style={{ height: 30, justifyContent: 'center' }}>
              {currentPhase.isVariable && (
                <View style={styles.recordBadge}>
                  <Award color={Colors.primary} size={14} />
                  <Text style={styles.recordText}>Record max (Libre)</Text>
                </View>
              )}
            </View>
          </View>

          {currentPhase.isVariable ? (
            <TouchableOpacity style={styles.glassNextPhaseBtn} onPress={handlePhaseTransition} activeOpacity={0.8}>
              <Text style={styles.glassNextPhaseBtnText}>J'inspire à fond</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.glassStopBtn} onPress={() => { setIsActive(false); onClose(); feedbackService.error(); }} activeOpacity={0.7}>
              <Square color={Colors.error} size={14} fill={Colors.error} />
              <Text style={styles.glassStopBtnText}>Abandonner</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </BaseBottomSheetModal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: Colors.surface,
    height: '85%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)'
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  closeBtn: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 6, borderRadius: 20 },

  // NOUVEAU: Liste d'exercices en verre
  glassExCard: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  glassExCardActive: { borderColor: 'rgba(212, 175, 55, 0.4)', backgroundColor: 'rgba(212, 175, 55, 0.08)' },
  exName: { color: Colors.text, fontSize: 16, fontFamily: 'PoppinsBold' },
  exDesc: { color: Colors.textMuted, fontSize: 12, marginTop: 4, lineHeight: 18, fontFamily: 'InterRegular' },

  readyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  readyIconWrapper: { padding: 24, borderRadius: 40, backgroundColor: 'rgba(212, 175, 55, 0.1)', borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.2)' },
  targetBadge: { backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginBottom: 40, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  targetIndicatorText: { color: Colors.primary, fontSize: 13, fontFamily: 'PoppinsBold', letterSpacing: 0.5 },
  changeBtnText: { color: Colors.textMuted, fontSize: 14, textDecorationLine: 'underline', fontFamily: 'PoppinsMedium' },

  activeContainer: { flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 20 },

  globalIndicatorWrapper: { backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  globalIndicator: { fontSize: 13, color: Colors.text, fontFamily: 'PoppinsBold', letterSpacing: 1, textTransform: 'uppercase' },

  animationZone: { width: '100%', alignItems: 'center' },
  phaseLabelTop: { color: Colors.primary, fontSize: 28, fontFamily: 'PoppinsBold', textTransform: 'uppercase', letterSpacing: 2, textAlign: 'center', height: 40 },
  subLabelContainer: { height: 20, justifyContent: 'center', marginBottom: 10 },
  phaseSubLabel: { color: Colors.textMuted, fontSize: 14, fontFamily: 'PoppinsMedium', letterSpacing: 0.5 },

  circleContainer: { width: 220, height: 220, justifyContent: 'center', alignItems: 'center', marginVertical: 20 },
  breathingCircle: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(212, 175, 55, 0.15)', borderWidth: 2, borderColor: Colors.primary },
  timerContainer: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  phaseTimer: { color: Colors.text, fontSize: 64, fontFamily: 'PoppinsBold', marginTop: 10 },

  recordBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(212, 175, 55, 0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  recordText: { color: Colors.primary, fontSize: 11, fontFamily: 'PoppinsBold' },

  // NOUVEAU : Bouton Abandon (Glass)
  glassStopBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 20, backgroundColor: 'rgba(207, 102, 121, 0.1)', borderWidth: 1, borderColor: 'rgba(207, 102, 121, 0.3)' },
  glassStopBtnText: { color: Colors.error, fontFamily: 'PoppinsBold', fontSize: 13 },

  // NOUVEAU : Bouton Action (Glass)
  glassNextPhaseBtn: { paddingVertical: 16, paddingHorizontal: 40, borderRadius: 24, borderWidth: 1, borderColor: Colors.primary, backgroundColor: 'rgba(212, 175, 55, 0.1)' },
  glassNextPhaseBtnText: { color: Colors.primary, fontFamily: 'PoppinsBold', fontSize: 15, letterSpacing: 1, textTransform: 'uppercase' }
});