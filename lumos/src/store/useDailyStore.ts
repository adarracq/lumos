import AsyncStorage from '@react-native-async-storage/async-storage';
import { differenceInDays, format, parseISO, subDays } from 'date-fns';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { XP_REWARDS } from '../constants/Rewards';
import { getLogicalTodayKey } from '../utils/dateUtils';
import { grantXP } from '../utils/rewardManager';
import { useUserStore } from './useUserStore';

interface DailyState {
    dateKey: string;
    morningFocusCompleted: boolean;
    dayExerciseCompleted: boolean;
    selectedExerciseType: 'SOLO' | 'SOCIAL';
    eveningRitualCompleted: boolean;
    mainTaskId: string | null;
    dailyGreetingStatus: 'INCREASED' | 'FROZEN' | 'LOST' | 'FREEZE_EARNED' | null;
    isStreakModalVisible: boolean;

    // La nouvelle checklist du matin
    morningRoutine: {
        water: boolean;
        stretching: boolean;
        mantra: boolean;
        focus: boolean;
        smile: boolean;
        task: boolean;
    };

    eveningReviewDraft: {
        difficulty: string | null;
        impact: number;
        reflection: string;
        mood: string | null;
        pride: string;       // Fierté
        gratitude: string;   // Gratitude
    };

    // Actions
    completeMorningFocus: () => void;
    completeDayExercise: (themeId: number, type: 'SOLO' | 'SOCIAL') => void;
    completeEveningRitual: () => void;
    toggleMorningStep: (step: keyof DailyState['morningRoutine']) => void;
    setMainTaskId: (id: string | null) => void;
    setExerciseType: (type: 'SOLO' | 'SOCIAL') => void; // 👈 Nouveau
    undoDayExercise: (themeId: number, type: 'SOLO' | 'SOCIAL') => void;
    checkAndResetNewDay: () => void;
    closeStreakModal: () => void;
    updateEveningDraft: (updates: Partial<DailyState['eveningReviewDraft']>) => void;

    // Fonction de debug pour simuler le passage du temps
    debugSimulateTimePassage: (days: number) => void;
}

export const useDailyStore = create<DailyState>()(
    persist(
        (set, get) => ({
            dateKey: format(new Date(), 'yyyy-MM-dd'),
            morningFocusCompleted: false,
            dayExerciseCompleted: false,
            selectedExerciseType: 'SOLO',
            eveningRitualCompleted: false,
            mainTaskId: null,
            dailyGreetingStatus: null,
            isStreakModalVisible: false,

            // État initial de la checklist du matin
            morningRoutine: {
                water: false,
                stretching: false,
                mantra: false,
                focus: false,
                smile: false,
                task: false,
            },

            eveningReviewDraft: {
                difficulty: null,
                impact: 0,
                reflection: '',
                mood: null,
                pride: '',
                gratitude: ''
            },

            completeMorningFocus: () => {
                if (!get().morningFocusCompleted) {
                    set({ morningFocusCompleted: true });
                    grantXP(XP_REWARDS.MORNING_FOCUS);
                }
            },

            // Action pour cocher/décocher une étape de la routine
            toggleMorningStep: (step) => {
                const isCompleted = get().morningRoutine[step];
                if (!isCompleted) {
                    grantXP(XP_REWARDS.MORNING_STEP);
                } else {
                    grantXP(-XP_REWARDS.MORNING_STEP);
                }

                set((state) => ({
                    morningRoutine: {
                        ...state.morningRoutine,
                        [step]: !isCompleted
                    }
                }));
            },

            // Modifie tes fonctions completeDayExercise et undoDayExercise :
            completeDayExercise: (themeId: number, type: 'SOLO' | 'SOCIAL') => {
                if (!get().dayExerciseCompleted) {
                    set({ dayExerciseCompleted: true });
                    grantXP(XP_REWARDS.DAY_EXERCISE);
                    useUserStore.getState().incrementThemeLevel(themeId, type); // Level UP !
                }
            },

            undoDayExercise: (themeId: number, type: 'SOLO' | 'SOCIAL') => {
                if (get().dayExerciseCompleted) {
                    set({ dayExerciseCompleted: false });
                    grantXP(-XP_REWARDS.DAY_EXERCISE);
                    useUserStore.getState().decrementThemeLevel(themeId, type); // Level DOWN
                }
            },

            completeEveningRitual: () => {
                if (!get().eveningRitualCompleted) {
                    set({ eveningRitualCompleted: true });
                    grantXP(XP_REWARDS.EVENING_RITUAL); // Remplace addLumens(20)
                }
            },
            setMainTaskId: (id) => set((state) => ({
                mainTaskId: id,
                // On coche automatiquement l'étape du matin si une tâche est choisie
                morningRoutine: { ...state.morningRoutine, task: id !== null }
            })),
            setExerciseType: (type) => set({ selectedExerciseType: type }),


            // Cherchez la fonction checkAndResetNewDay et remplacez sa logique par celle-ci :

            checkAndResetNewDay: () => {
                const logicalToday = getLogicalTodayKey();
                const lastDateString = get().dateKey;

                if (!lastDateString) {
                    set({ dateKey: logicalToday });
                    return;
                }

                if (lastDateString !== logicalToday) {
                    const currentUserStore = useUserStore.getState();
                    const diffDays = differenceInDays(parseISO(logicalToday), parseISO(lastDateString));

                    currentUserStore.setOnboardingDay(currentUserStore.onboardingDay + 1);

                    let greetingStatus: DailyState['dailyGreetingStatus'] = null;

                    // Extrait de src/store/useDailyStore.ts
                    if (diffDays === 1) {
                        currentUserStore.updateStreak(true);
                        if (currentUserStore.streak % 6 === 0) {
                            currentUserStore.addStreakFreeze(1);
                            greetingStatus = 'FREEZE_EARNED'; // Jackpot : 6 jours !
                        } else {
                            greetingStatus = 'INCREASED'; // Routine normale
                        }

                    } else if (diffDays > 1) {
                        const missedDays = diffDays - 1;
                        if (currentUserStore.streakFreezes >= missedDays) {
                            currentUserStore.useStreakFreeze(missedDays);
                            currentUserStore.updateStreak(true);
                            greetingStatus = 'FROZEN'; // Ouf, sauvé !
                        } else {
                            currentUserStore.updateStreak(false);
                            greetingStatus = 'LOST'; // Dommage...
                        }
                    }

                    set({
                        dateKey: logicalToday,
                        morningFocusCompleted: false,
                        dayExerciseCompleted: false,
                        eveningRitualCompleted: false,
                        mainTaskId: null,
                        selectedExerciseType: 'SOLO',
                        morningRoutine: { water: false, stretching: false, mantra: false, focus: false, smile: false, task: false },

                        eveningReviewDraft: { difficulty: null, impact: 0, reflection: '', mood: null, pride: '', gratitude: '' },

                        dailyGreetingStatus: greetingStatus,
                        isStreakModalVisible: greetingStatus !== null
                    });
                }
            },

            closeStreakModal: () => set({ isStreakModalVisible: false, dailyGreetingStatus: null }),


            debugSimulateTimePassage: (days) => {
                const lastDate = parseISO(get().dateKey);
                const fakePastDate = subDays(lastDate, days);

                // On fait croire à l'app que notre dernière visite date d'il y a X jours
                set({ dateKey: format(fakePastDate, 'yyyy-MM-dd') });

                // On déclenche la vérification immédiatement
                get().checkAndResetNewDay();
            },

            updateEveningDraft: (updates) => set((state) => ({
                eveningReviewDraft: { ...state.eveningReviewDraft, ...updates }
            })),
        }),
        {
            name: 'lumos-daily-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);