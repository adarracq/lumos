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
    exerciseCommitment: 'SOLO' | 'SOCIAL' | null;
    mantraDiscovered: boolean;

    // La nouvelle checklist du matin
    morningRoutine: {
        water: boolean;
        bed: boolean;
        stretching: boolean;
        mantra: boolean;
        breathing: boolean;
        smile: boolean;
        shower: boolean;
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
    completeMorningFocus: (isAirplaneMode: boolean) => void;
    completeDayExercise: (themeId: number, type: 'SOLO' | 'SOCIAL') => void;
    completeEveningRitual: () => void;
    toggleMorningStep: (step: keyof DailyState['morningRoutine']) => void;
    setMainTaskId: (id: string | null) => void;
    setExerciseType: (type: 'SOLO' | 'SOCIAL') => void; // 👈 Nouveau
    undoDayExercise: (themeId: number, type: 'SOLO' | 'SOCIAL') => void;
    checkAndResetNewDay: () => void;
    closeStreakModal: () => void;
    updateEveningDraft: (updates: Partial<DailyState['eveningReviewDraft']>) => void;
    commitToExercise: () => void;
    cancelCommitment: () => void;
    discoverMantra: () => void;

    // Fonction de debug pour simuler le passage du temps
    debugSimulateTimePassage: (days: number) => void;
}

export const useDailyStore = create<DailyState>()(
    persist(
        (set, get) => ({
            dateKey: getLogicalTodayKey(),
            morningFocusCompleted: false,
            dayExerciseCompleted: false,
            selectedExerciseType: 'SOLO',
            eveningRitualCompleted: false,
            mainTaskId: null,
            dailyGreetingStatus: null,
            isStreakModalVisible: false,
            exerciseCommitment: null,
            mantraDiscovered: false,

            // État initial de la checklist du matin
            morningRoutine: {
                water: false,
                bed: false,
                stretching: false,
                mantra: false,
                breathing: false,
                smile: false,
                shower: false,
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

            completeMorningFocus: (isAirplaneMode) => {
                if (!get().morningFocusCompleted) {
                    set({ morningFocusCompleted: true });

                    // Calcul de la récompense
                    const xpEarned = isAirplaneMode
                        ? XP_REWARDS.MORNING_FOCUS + XP_REWARDS.AIRPLANE_BONUS
                        : XP_REWARDS.MORNING_FOCUS;

                    grantXP(xpEarned);
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

                    let greetingStatus: DailyState['dailyGreetingStatus'] = null;

                    // NOUVEAU : On sécurise ici ! On ne fait progresser les jours que si on avance dans le temps.
                    if (diffDays > 0) {
                        currentUserStore.setOnboardingDay(currentUserStore.onboardingDay + 1);

                        if (diffDays === 1) {
                            currentUserStore.updateStreak(true);
                            if (currentUserStore.streak % 6 === 0) {
                                currentUserStore.addStreakFreeze(1);
                                greetingStatus = 'FREEZE_EARNED';
                            } else {
                                greetingStatus = 'INCREASED';
                            }
                        } else if (diffDays > 1) {
                            const missedDays = diffDays - 1;
                            if (currentUserStore.streakFreezes >= missedDays) {
                                currentUserStore.useStreakFreeze(missedDays);
                                currentUserStore.updateStreak(true);
                                greetingStatus = 'FROZEN';
                            } else {
                                currentUserStore.updateStreak(false);
                                greetingStatus = 'LOST';
                            }
                        }
                    }

                    // On reset les paramètres quotidiens peu importe si diffDays > 0 (au cas où la date change)
                    set({
                        dateKey: logicalToday,
                        morningFocusCompleted: false,
                        dayExerciseCompleted: false,
                        eveningRitualCompleted: false,
                        mainTaskId: null,
                        selectedExerciseType: 'SOLO',
                        morningRoutine: { water: false, bed: false, stretching: false, mantra: false, breathing: false, smile: false, task: false, shower: false },
                        mantraDiscovered: false,
                        eveningReviewDraft: { difficulty: null, impact: 0, reflection: '', mood: null, pride: '', gratitude: '' },
                        dailyGreetingStatus: greetingStatus,
                        isStreakModalVisible: greetingStatus !== null,
                        exerciseCommitment: null
                    });
                }
            },

            closeStreakModal: () => set({ isStreakModalVisible: false, dailyGreetingStatus: null }),

            commitToExercise: () => set((state) => ({ exerciseCommitment: state.selectedExerciseType })),
            cancelCommitment: () => set({ exerciseCommitment: null }),
            discoverMantra: () => set({ mantraDiscovered: true }),


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