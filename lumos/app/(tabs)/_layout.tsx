import { AntidoteModal } from '@/src/components/organisms/AntidoteModal';
import { BisouModal } from '@/src/components/organisms/BisouModal';
import { BodyLanguageModal } from '@/src/components/organisms/BodyLanguageModal';
import { BoredomModal } from '@/src/components/organisms/BoredomModal';
import { BrainDumpModal } from '@/src/components/organisms/BrainDumpModal';
import { BreathingModal } from '@/src/components/organisms/BreathingModal';
import { FearSettingModal } from '@/src/components/organisms/FearSettingModal';
import { FlowTriggerModal } from '@/src/components/organisms/FlowTriggerModal';
import { FocusSessionModal } from '@/src/components/organisms/FocusSessionModal';
import { FutureSelfModal } from '@/src/components/organisms/FutureSelfModal';
import { GroundingModal } from '@/src/components/organisms/GroundingModal';
import { JournalVaultModal } from '@/src/components/organisms/JournalVaultModal';
import { MicroStepsModal } from '@/src/components/organisms/MicroStepsModal';
import { QuickActionModal } from '@/src/components/organisms/QuickActionModal';
import { ReframerModal } from '@/src/components/organisms/ReframerModal';
import { SocialDojoModal } from '@/src/components/organisms/SocialDojoModal';
import { SocialFilterModal } from '@/src/components/organisms/SocialFilterModal';
import { SocialModal } from '@/src/components/organisms/SocialModal';
import { LogicPathModal } from '@/src/screens/games/LogicPathModal';
import { MathRushModal } from '@/src/screens/games/MathRushModal';
import { MemoryMatrixModal } from '@/src/screens/games/MemoryMatrixModal';
import { NameRecallModal } from '@/src/screens/games/NameRecallModal';
import { NBackModal } from '@/src/screens/games/NBackModal';
import { SchulteTableModal } from '@/src/screens/games/SchulteTableModal';
import { StroopModal } from '@/src/screens/games/StroopModal';
import { TargetTrackerModal } from '@/src/screens/games/TargetTrackerModal';
import { WordCascadeModal } from '@/src/screens/games/WordCascadeModal';
import { feedbackService } from '@/src/services/feedbackService';
import { useUIStore } from '@/src/store/useUIStore';
import { Tabs } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, ImageSourcePropType, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AddTaskModal } from '../../src/components/organisms/AddTaskModal';
import { Colors } from '../../src/constants/Colors';
import { useTaskStore } from '../../src/store/useTaskStore';

// ------------------------------------------------------------------
// 1. COMPOSANT MOLÉCULE : Icône locale avec effet de lueur
// ------------------------------------------------------------------
type AnimatedTabIconProps = {
  focused: boolean;
  source: ImageSourcePropType;
};

function AnimatedTabIcon({ focused, source }: AnimatedTabIconProps) {
  const animValue = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animValue, {
      toValue: focused ? 1 : 0,
      useNativeDriver: true,
      friction: 8,
      tension: 60,
    }).start();
  }, [focused]);

  const scale = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  const color = focused ? Colors.primary : Colors.textMuted;

  return (
    <View style={styles.iconContainer}>
      <Animated.Image
        source={source}
        style={[
          styles.icon,
          {
            tintColor: color,
            transform: [{ scale }],
          },
        ]}
      />

      {/* Un simple petit point/pilule très élégant sous l'icône */}
      <Animated.View
        style={[
          styles.activeIndicatorLine,
          {
            opacity: animValue,
            backgroundColor: Colors.primary,
            shadowColor: Colors.primary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 4,
            transform: [{ scale }],
          },
        ]}
      />
    </View>
  );
}

// ------------------------------------------------------------------
// 2. LAYOUT PRINCIPAL
// ------------------------------------------------------------------
export default function TabsLayout() {
  const setAddModalVisible = useTaskStore((state) => state.setAddModalVisible);
  const { setQuickActionVisible, activeModal, closeModal } = useUIStore();

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIconStyle: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          },
          tabBarItemStyle: styles.tabBarItem,
          tabBarStyle: styles.tabBar,
        }}
        screenListeners={{
          tabPress: () => {
            feedbackService.light();
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ focused }) => (
              <AnimatedTabIcon focused={focused} source={require('../../assets/icons/home.png')} />
            ),
          }}
        />
        <Tabs.Screen
          name="habits"
          options={{
            tabBarIcon: ({ focused }) => (
              <AnimatedTabIcon focused={focused} source={require('../../assets/icons/habits.png')} />
            ),
          }}
        />

        <Tabs.Screen
          name="add"
          options={{
            tabBarButton: (props) => (
              <View style={styles.addWrapper} pointerEvents="box-none">
                {/* 1. L'anneau extérieur (Bezel) en verre sombre */}
                <View style={styles.addBezel}>
                  {/* 2. Le cœur intérieur lumineux (Core) */}
                  <TouchableOpacity onPress={props.onPress} activeOpacity={0.85} style={styles.addCore}>
                    <Animated.Image source={require('../../assets/icons/plus.png')} style={styles.addIcon} />
                  </TouchableOpacity>
                </View>
              </View>
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              feedbackService.heavy();
              setQuickActionVisible(true);
            },
          }}
        />

        <Tabs.Screen
          name="tasks"
          options={{
            tabBarIcon: ({ focused }) => (
              <AnimatedTabIcon focused={focused} source={require('../../assets/icons/tasks.png')} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ focused }) => (
              <AnimatedTabIcon focused={focused} source={require('../../assets/icons/profile.png')} />
            ),
          }}
        />
      </Tabs>

      <AddTaskModal />
      <QuickActionModal />
      <BreathingModal isVisible={activeModal === 'breathing'} onClose={() => closeModal()} />
      <BisouModal isVisible={activeModal === 'bisou'} onClose={() => closeModal()} />
      <FlowTriggerModal isVisible={activeModal === 'flow'} onClose={() => closeModal()} />
      <GroundingModal isVisible={activeModal === 'grounding'} onClose={() => closeModal()} />
      <SocialModal isVisible={activeModal === 'social'} onClose={() => closeModal()} />
      <SocialFilterModal isVisible={activeModal === 'filter'} onClose={() => closeModal()} />
      <BodyLanguageModal isVisible={activeModal === 'bodyLang'} onClose={() => closeModal()} />
      <ReframerModal isVisible={activeModal === 'reframer'} onClose={() => closeModal()} />
      <AntidoteModal isVisible={activeModal === 'antidote'} onClose={() => closeModal()} />
      <SocialDojoModal isVisible={activeModal === 'dojo'} onClose={() => closeModal()} />
      <BoredomModal isVisible={activeModal === 'boredom'} onClose={() => closeModal()} />
      <FocusSessionModal isVisible={activeModal === 'focusSession'} onClose={() => closeModal()} />
      <FearSettingModal isVisible={activeModal === 'fearSetting'} onClose={() => closeModal()} />
      <JournalVaultModal isVisible={activeModal === 'vault'} onClose={() => closeModal()} />
      <StroopModal isVisible={activeModal === 'stroop'} onClose={() => closeModal()} />
      <MathRushModal isVisible={activeModal === 'mathRush'} onClose={() => closeModal()} />
      <MemoryMatrixModal isVisible={activeModal === 'memoryMatrix'} onClose={() => closeModal()} />
      <NBackModal isVisible={activeModal === 'nback'} onClose={() => closeModal()} />
      <LogicPathModal isVisible={activeModal === 'logicPath'} onClose={() => closeModal()} />
      <SchulteTableModal isVisible={activeModal === 'schulte'} onClose={() => closeModal()} />
      <TargetTrackerModal isVisible={activeModal === 'targetTracker'} onClose={() => closeModal()} />
      <WordCascadeModal isVisible={activeModal === 'wordCascade'} onClose={() => closeModal()} />
      <NameRecallModal isVisible={activeModal === 'nameRecall'} onClose={() => closeModal()} />
      <BrainDumpModal isVisible={activeModal === 'brainDump'} onClose={() => closeModal()} />
      <FutureSelfModal isVisible={activeModal === 'futureSelf'} onClose={() => closeModal()} />
      <MicroStepsModal isVisible={activeModal === 'microSteps'} onClose={() => closeModal()} />
    </>
  );
}

// ------------------------------------------------------------------
// 3. STYLES
// ------------------------------------------------------------------
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(10, 10, 12, 0.96)', // Noir très profond et élégant
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: Platform.OS === 'ios' ? 95 : 80,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)', // Bordure ultra-fine
    elevation: 0,
    shadowOpacity: 0,
  },
  tabBarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  icon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  activeIndicatorLine: {
    position: 'absolute',
    bottom: 4,
    width: 8,
    height: 2,
    borderRadius: 3,
  },
  addWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // --- NOUVEAU DESIGN DU BOUTON CENTRAL ---

  // 1. L'anneau en verre (Bezel)
  addBezel: {
    top: -24, // Fait léviter le bouton au-dessus de la barre
    width: 68,
    height: 68,
    borderRadius: 34, // Cercle parfait
    backgroundColor: '#121215', // Couleur solide pour Android, imite la barre
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    // Ombre noire pour se décoller du contenu de l'app (listes, fond...)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 8,
  },

  // 2. Le cœur plein et vibrant (Core)
  addCore: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary, // L'or pur
    justifyContent: 'center',
    alignItems: 'center',
    // La lueur magique autour de l'or, qui "bave" dans l'anneau sombre
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 4,
  },

  // 3. L'icône contrastée
  addIcon: {
    width: 26,
    height: 26,
    tintColor: Colors.background, // Icône sombre pour un contraste d'orfèvrerie
    resizeMode: 'contain',
  },
});