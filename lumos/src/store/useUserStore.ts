// src/store/useUserStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ThemeLevels {
    solo: number;
    social: number;
}

interface NotificationPrefs {
    enabled: boolean;
    time: string; // Format "HH:mm"
}

interface UserState {
    hasSeenOnboarding: boolean;
    lumens: number;
    onboardingDay: number;
    streak: number;
    themeLevels: Record<number, ThemeLevels>;
    socialFilters: string[];
    isPremium: boolean;
    toolUsage: Record<string, number>;
    streakFreezes: number;
    morningRoutinePreferences: string[];
    notifications: Record<'morning' | 'day' | 'evening', NotificationPrefs>;
    highScores: Record<string, number>;
    primalBreathRecord: number;

    setHasSeenOnboarding: (value: boolean) => void;
    setOnboardingDay: (day: number) => void;
    addLumens: (value: number) => void;
    updateStreak: (isConsecutive: boolean) => void;
    incrementThemeLevel: (themeId: number, type: 'SOLO' | 'SOCIAL') => void;
    decrementThemeLevel: (themeId: number, type: 'SOLO' | 'SOCIAL') => void;
    setSocialFilters: (filters: string[]) => void;
    setPremium: (status: boolean) => void;
    trackToolUsage: (toolId: string) => void;
    addStreakFreeze: (amount: number) => void;
    useStreakFreeze: (amount: number) => void;
    setMorningRoutinePreferences: (prefs: string[]) => void;
    updateNotificationSetting: (type: 'morning' | 'day' | 'evening', setting: Partial<NotificationPrefs>) => void;
    updateHighScore: (gameId: string, score: number) => void;
    updatePrimalBreathRecord: (record: number) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            hasSeenOnboarding: false,
            lumens: 0,
            onboardingDay: 1,
            streak: 1,
            themeLevels: {},
            socialFilters: ["", "", ""],
            isPremium: false,
            toolUsage: {},
            streakFreezes: 1,
            morningRoutinePreferences: ['water', 'bed', 'mantra', 'stretching', 'breathing', 'smile', 'task', 'shower'],
            notifications: {
                morning: { enabled: true, time: '08:00' },
                day: { enabled: false, time: '10:00' },
                evening: { enabled: true, time: '21:00' },
            },
            highScores: {},
            primalBreathRecord: 0,

            setHasSeenOnboarding: (value) => set({ hasSeenOnboarding: value }),
            setOnboardingDay: (day) => set({ onboardingDay: day }),
            addLumens: (value) => set((state) => ({ lumens: state.lumens + value })),
            updateStreak: (isConsecutive) => set((state) => ({ streak: isConsecutive ? state.streak + 1 : 1 })),
            incrementThemeLevel: (themeId, type) => set((state) => {
                const current = state.themeLevels[themeId] || { solo: 1, social: 1 };
                return {
                    themeLevels: {
                        ...state.themeLevels,
                        [themeId]: { ...current, [type.toLowerCase()]: current[type.toLowerCase() as keyof ThemeLevels] + 1 }
                    }
                };
            }),

            decrementThemeLevel: (themeId, type) => set((state) => {
                const current = state.themeLevels[themeId] || { solo: 1, social: 1 };
                return {
                    themeLevels: {
                        ...state.themeLevels,
                        [themeId]: { ...current, [type.toLowerCase()]: Math.max(1, current[type.toLowerCase() as keyof ThemeLevels] - 1) }
                    }
                };
            }),
            setSocialFilters: (filters) => set({ socialFilters: filters }),
            setPremium: (status) => set({ isPremium: status }),
            trackToolUsage: (toolId) => set((state) => ({
                toolUsage: {
                    ...state.toolUsage,
                    [toolId]: (state.toolUsage[toolId] || 0) + 1
                }
            })),
            addStreakFreeze: (amount) => set((state) => ({
                // On plafonne à 3 freezes maximum (modifiable selon vos envies)
                streakFreezes: Math.min(state.streakFreezes + amount, 3)
            })),
            useStreakFreeze: (amount) => set((state) => ({
                streakFreezes: Math.max(0, state.streakFreezes - amount)
            })),
            setMorningRoutinePreferences: (prefs) => set({ morningRoutinePreferences: prefs }),
            updateNotificationSetting: (type, setting) => set((state) => ({
                notifications: {
                    ...state.notifications,
                    [type]: { ...state.notifications[type], ...setting }
                }
            })),
            updateHighScore: (gameId, score) => set((state) => {
                const currentHighScore = state.highScores[gameId] || 0;
                // On met à jour uniquement si le nouveau score est strictement supérieur
                if (score > currentHighScore) {
                    return {
                        highScores: {
                            ...state.highScores,
                            [gameId]: score
                        }
                    };
                }
                return state; // Rien ne change
            }),
            updatePrimalBreathRecord: (record) => set((state) => ({
                primalBreathRecord: record > state.primalBreathRecord ? record : state.primalBreathRecord
            })),
        }),
        {
            name: 'lumos-user-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);