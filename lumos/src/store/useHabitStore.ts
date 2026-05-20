import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { XP_REWARDS } from '../constants/Rewards';
import { Habit, HabitLog } from '../models/Habit';
import { notificationService } from '../services/notificationService';
import { getLogicalTodayKey } from '../utils/dateUtils';
import { grantXP } from '../utils/rewardManager';

interface HabitState {
    habits: Habit[];
    logs: HabitLog;
    addHabit: (habitData: Omit<Habit, 'id'>) => void;
    updateHabit: (id: string, habitData: Partial<Omit<Habit, 'id'>>) => void;
    deleteHabit: (id: string) => void;
    toggleHabitCompletion: (habitId: string) => void;
    progressHabit: (habitId: string, amount: number) => void;
}

export const useHabitStore = create<HabitState>()(
    persist(
        (set, get) => ({
            habits: [],
            logs: {},

            addHabit: (habitData) => {
                const newId = Date.now().toString();

                if (habitData.reminderTime) {
                    notificationService.scheduleHabitReminder(newId, habitData.name, habitData.reminderTime, habitData.frequency);
                }

                set((state) => ({
                    habits: [...state.habits, { ...habitData, id: newId }]
                }));
            },

            updateHabit: (id, updatedData) => {
                const habits = get().habits;
                const habitIndex = habits.findIndex(h => h.id === id);
                if (habitIndex === -1) return;

                const currentHabit = habits[habitIndex];
                const newHabit = { ...currentHabit, ...updatedData };

                // 💡 Gérer les notifications en cas de changement
                if (updatedData.reminderTime !== undefined || updatedData.name !== undefined) {
                    if (currentHabit.frequency) {
                        for (const day of currentHabit.frequency) {
                            notificationService.cancelNotification(`habit-${id}-day-${day}`);
                        }
                    }
                    if (newHabit.frequency) {
                        for (const day of newHabit.frequency) {
                            notificationService.scheduleHabitReminder(id, newHabit.name, newHabit.reminderTime || currentHabit.reminderTime || "08:00", newHabit.frequency);
                        }
                    }
                }

                const newHabits = [...habits];
                newHabits[habitIndex] = newHabit;

                set({ habits: newHabits });
            },

            deleteHabit: (id) => {
                const habit = get().habits.find(h => h.id === id);
                if (habit && habit.frequency) {
                    for (const day of habit.frequency) {
                        notificationService.cancelNotification(`habit-${id}-day-${day}`);
                    }
                }

                set((state) => ({
                    habits: state.habits.filter(h => h.id !== id)
                }));
            },

            toggleHabitCompletion: (habitId) => {
                const today = getLogicalTodayKey();
                const todayLogs = get().logs[today] || {};
                const isCompleted = !!todayLogs[habitId];

                grantXP(isCompleted ? -XP_REWARDS.HABIT_COMPLETED : XP_REWARDS.HABIT_COMPLETED);

                set((state) => ({
                    logs: { ...state.logs, [today]: { ...todayLogs, [habitId]: !isCompleted } },
                }));
            },

            progressHabit: (habitId, amount) => {
                const today = getLogicalTodayKey();
                const habit = get().habits.find(h => h.id === habitId);
                if (!habit || !habit.targetValue) return;

                const todayLogs = get().logs[today] || {};
                const currentValue = (todayLogs[habitId] as number) || 0;
                const newValue = Math.min(currentValue + amount, habit.targetValue);

                if (currentValue < habit.targetValue && newValue >= habit.targetValue) {
                    grantXP(XP_REWARDS.HABIT_COMPLETED);
                }

                set((state) => ({
                    logs: { ...state.logs, [today]: { ...todayLogs, [habitId]: newValue } },
                }));
            }
        }),
        {
            name: 'lumos-habits-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);