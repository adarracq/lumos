// src/components/organisms/BreathingModal.tsx
import { feedbackService } from '@/src/services/feedbackService';
import { useUserStore } from '@/src/store/useUserStore';
import { Award, Medal, Square, Wind } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, AppState, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BREATHING_EXERCISES, BreathingExercise } from '../../constants/Breathing';
import { Colors } from '../../constants/Colors';
import { LumosButton } from '../atoms/LumosButton';
import { BodyText, Title } from '../atoms/Typography';
import { BaseBottomSheetModal } from '../molecules/BaseBottomSheet';

// On a supprimé onComplete de l'interface car on le gère en interne maintenant !
interface BreathingModalProps {
  isVisible: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export const BreathingModal = ({ isVisible, onClose, onComplete }: BreathingModalProps) => {

  const trackToolUsage = useUserStore(state => state.trackToolUsage);

  const primalBreathRecord = useUserStore(state => state.primalBreathRecord || 0);
  const updatePrimalBreathRecord = useUserStore(state => state.updatePrimalBreathRecord);

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
    if (isActive) {
      const currentPhase = selectedExercise.phases[currentPhaseIndex];
      if (currentPhase.action === 'IN') {
        feedbackService.breatheIn();
      } else if (currentPhase.action === 'OUT') {
        feedbackService.breatheOut();
      } else if (currentPhase.action === 'HOLD_FULL' || currentPhase.action === 'HOLD_EMPTY') {
        feedbackService.breatheHold();
      }
    }
  }, [currentPhaseIndex, isActive, selectedExercise]);

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
          // CORRECTION 1 : L'updater est 100% pur, pas d'effets de bord ici !
          setTotalSecondsLeft((prev) => Math.max(0, prev - 1));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, currentPhaseIndex, selectedExercise]);

  useEffect(() => {
    if (isActive && selectedExercise.phases[currentPhaseIndex].action === 'FAST') {
      // Sur un cycle de 4s : (Ex: 60 = Inspire, 58 = Expire)
      if (phaseSeconds % 4 === 0) {
        feedbackService.breatheIn();
      } else if (phaseSeconds % 4 === 2) {
        feedbackService.breatheOut();
      }
    }
  }, [phaseSeconds, isActive, currentPhaseIndex, selectedExercise]);

  useEffect(() => {
    if (isActive) {
      const currentPhase = selectedExercise.phases[currentPhaseIndex];
      if (!currentPhase.isVariable && phaseSeconds === 0) handlePhaseTransition();
    }
  }, [phaseSeconds, isActive]);

  const handlePhaseTransition = () => {

    // 💡 MODULE DE RECORD : Si on quitte l'apnée, on vérifie si le record est battu
    if (currentPhase.isVariable) {
      if (phaseSeconds > primalBreathRecord) {
        updatePrimalBreathRecord(phaseSeconds);
        feedbackService.heavy(); // Petit retour haptique de célébration !
      }
    }

    const isLastPhase = currentPhaseIndex === selectedExercise.phases.length - 1;
    if (selectedExercise.type === 'CYCLE_BASED' && isLastPhase) {
      if (cyclesLeft <= 1) handleFinish(); // Ici c'est sûr, on n'est pas dans un setState
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
    else if (phase.action === 'FAST') Animated.loop(Animated.sequence([Animated.timing(scaleAnim, { toValue: 1.4, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }), Animated.timing(scaleAnim, { toValue: 1.0, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true })])).start();
  }, [currentPhaseIndex, isActive, selectedExercise]);

  const appState = useRef(AppState.currentState);
  const backgroundTime = useRef<number | null>(null);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        if (backgroundTime.current && isActive) {
          const elapsedSecondsInBackground = Math.floor((Date.now() - backgroundTime.current) / 1000);
          if (selectedExercise.type === 'RHYTHM') {
            // CORRECTION 2 : Pareil, on garde l'updater pur
            setTotalSecondsLeft((prev) => Math.max(0, prev - elapsedSecondsInBackground));
          }
        }
      } else if (nextAppState.match(/inactive|background/)) {
        backgroundTime.current = Date.now();
      }
      appState.current = nextAppState;
    });
    return () => subscription.remove();
  }, [isActive, selectedExercise]);

  // CORRECTION 3 : C'est ici qu'on écoute de manière réactive si le temps est écoulé
  useEffect(() => {
    if (isActive && selectedExercise.type === 'RHYTHM' && totalSecondsLeft <= 0) {
      handleFinish();
    }
  }, [totalSecondsLeft, isActive, selectedExercise.type]);

  const handleFinish = () => {
    setIsActive(false);
    trackToolUsage('breathing');
    if (onComplete) onComplete();
    onClose();
  };
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
    // Le chronomètre descendant (60, 59, 58...), l'inspiration correspond aux modulo 0 et 3
    const isInspire = phaseSeconds % 4 === 0 || phaseSeconds % 4 === 3;
    displayLabel = isInspire ? 'Inspire' : 'Expire';

    // On divise par 4 pour obtenir 15 respirations parfaites sur 60 secondes
    const currentBreath = 15 - Math.floor((Math.max(0, phaseSeconds - 1)) / 4);
    breathCounter = `Respiration ${Math.min(15, Math.max(1, currentBreath))} / 15`;
  }

  return (
    <BaseBottomSheetModal
      isVisible={isVisible}
      onClose={onClose}
      title="Relaxation"
    >
      {!isActive && showSelectionMenu ? (
        <View style={{ flex: 1, marginTop: 15 }}>
          <BodyText style={{ marginBottom: 15 }}>Sélectionner un exercice :</BodyText>
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
        <View style={styles.centerContent}>
          <View style={styles.readyIconWrapper}>
            <Wind color={Colors.primary} size={48} />
          </View>

          <Title center style={{ marginTop: 16 }}>{selectedExercise.name}</Title>
          <BodyText center color={Colors.textMuted} style={{ marginBottom: 30, paddingHorizontal: 20 }}>
            {selectedExercise.description}
          </BodyText>

          <View style={styles.glassProgressBadge}>
            <Text style={styles.progressText}>
              {selectedExercise.type === 'RHYTHM' ? `Objectif : ${selectedExercise.defaultTarget} Minutes` : `Objectif : ${selectedExercise.defaultTarget} Cycles`}
            </Text>
          </View>

          {selectedExercise.id === 'primal' && primalBreathRecord > 0 && (
            <View style={[styles.glassProgressBadge, { flexDirection: 'row', alignItems: 'center', borderColor: Colors.primary + '80' }]}>
              <Medal color={Colors.primary} size={14} />
              <Text style={[styles.progressText, { color: Colors.primary, marginLeft: 5 }]}>
                {formatTime(primalBreathRecord)}
              </Text>
            </View>
          )}

          <LumosButton title="Démarrer" onPress={() => setIsActive(true)} style={{ width: '100%', marginBottom: 20 }} />
          <TouchableOpacity onPress={() => { setShowSelectionMenu(true); feedbackService.light(); }} activeOpacity={0.7}>
            <Text style={styles.changeBtnText}>Changer d'exercice</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.centerContent}>
          <View style={styles.glassProgressBadge}>
            <Text style={styles.progressText}>{formatGlobalTime()}</Text>
          </View>

          <View style={styles.animationZone}>

            {/* 1. Titre de l'action */}
            <Title center style={{ textTransform: 'uppercase', letterSpacing: 2 }}>
              {displayLabel}
            </Title>

            {/* 2. Sous-titre */}
            <View style={styles.subLabelContainer}>
              {breathCounter && (
                <BodyText center color={Colors.textMuted}>{breathCounter}</BodyText>
              )}
            </View>

            {/* 3. Cercle d'animation uniquement */}
            <View style={styles.circleContainer}>
              <Animated.View style={[styles.breathingCircle, { transform: [{ scale: scaleAnim }] }]} />
            </View>

            {/* 4. Chrono en dessous */}
            <Text style={[styles.timerText, { color: Colors.primary }]}>
              {currentPhase.isVariable ? formatTime(phaseSeconds) : `${phaseSeconds}s`}
            </Text>

            <View style={{ height: 30, justifyContent: 'center' }}>
              {currentPhase.isVariable && (
                <View style={styles.recordBadge}>
                  <Award color={Colors.primary} size={14} />
                  {/* 💡 MODIFICATION ICI : */}
                  <Text style={styles.recordText}>
                    Record : {primalBreathRecord > 0 ? formatTime(primalBreathRecord) : 'Aucun'}
                  </Text>
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
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: Colors.surface,
    height: '85%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)'
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  closeBtn: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 6, borderRadius: 20 },
  centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  glassExCard: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  glassExCardActive: { borderColor: 'rgba(212, 175, 55, 0.4)', backgroundColor: 'rgba(212, 175, 55, 0.08)' },
  exName: { color: Colors.text, fontSize: 16, fontFamily: 'PoppinsBold' },
  exDesc: { color: Colors.textMuted, fontSize: 12, marginTop: 4, lineHeight: 18, fontFamily: 'InterRegular' },
  readyIconWrapper: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255, 255, 255, 0.02)', justifyContent: 'center', alignItems: 'center', marginBottom: 10, borderWidth: 2, borderColor: 'rgba(212, 175, 55, 0.3)' },
  changeBtnText: { color: Colors.textMuted, fontSize: 14, textDecorationLine: 'underline', fontFamily: 'PoppinsMedium' },
  glassProgressBadge: { backgroundColor: 'rgba(255, 255, 255, 0.05)', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', alignItems: 'center', justifyContent: 'center' },
  progressText: { color: Colors.primary, fontFamily: 'PoppinsBold', letterSpacing: 1, fontSize: 11, textTransform: 'uppercase', includeFontPadding: false, textAlignVertical: 'center' },
  animationZone: { width: '100%', alignItems: 'center' },
  subLabelContainer: { height: 24, justifyContent: 'center', marginBottom: 10 },
  circleContainer: { width: 200, height: 200, justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  breathingCircle: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderWidth: 2, borderColor: 'rgba(212, 175, 55, 0.3)' },
  timerText: { fontSize: 64, fontFamily: 'PoppinsBold', marginBottom: 30 },
  recordBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(212, 175, 55, 0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginBottom: 20 },
  recordText: { color: Colors.primary, fontSize: 11, fontFamily: 'PoppinsBold' },
  glassStopBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 20, backgroundColor: 'rgba(207, 102, 121, 0.1)', borderWidth: 1, borderColor: 'rgba(207, 102, 121, 0.3)', marginTop: 20 },
  glassStopBtnText: { color: Colors.error, fontFamily: 'PoppinsBold', fontSize: 13 },
  glassNextPhaseBtn: { paddingVertical: 16, paddingHorizontal: 40, borderRadius: 24, borderWidth: 1, borderColor: Colors.primary, backgroundColor: 'rgba(212, 175, 55, 0.1)', marginTop: 20 },
  glassNextPhaseBtnText: { color: Colors.primary, fontFamily: 'PoppinsBold', fontSize: 15, letterSpacing: 1, textTransform: 'uppercase' }
});