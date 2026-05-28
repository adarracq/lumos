import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { XP_REWARDS } from '../constants/Rewards';
import { Task } from '../models/Task';
import { grantXP } from '../utils/rewardManager';

interface TaskState {
    tasks: Task[];
    isAddModalVisible: boolean;
    totalCompletedTasks: number; // 💡 NOUVEAU : Compteur historique permanent

    // Actions
    setAddModalVisible: (visible: boolean) => void;
    addTask: (title: string, isUrgent: boolean, isImportant: boolean) => void;
    toggleTask: (id: string) => void;
    deleteTask: (id: string) => void;
}

export const useTaskStore = create<TaskState>()(
    persist(
        (set) => ({
            tasks: [],
            isAddModalVisible: false,
            totalCompletedTasks: 0, // Initialisation

            setAddModalVisible: (visible) => set({ isAddModalVisible: visible }),

            addTask: (title, isUrgent, isImportant) => set((state) => ({
                tasks: [
                    {
                        id: Date.now().toString(),
                        title,
                        isUrgent,
                        isImportant,
                        isCompleted: false,
                        createdAt: Date.now(),
                    },
                    ...state.tasks,
                ],
            })),

            toggleTask: (id) => set((state) => {
                const task = state.tasks.find(t => t.id === id);
                let completedDiff = 0;

                if (task) {
                    let xp = XP_REWARDS.TASK_NORMAL;
                    if (task.isUrgent && task.isImportant) xp = XP_REWARDS.TASK_URGENT_IMPORTANT;
                    else if (task.isUrgent) xp = XP_REWARDS.TASK_URGENT;
                    else if (task.isImportant) xp = XP_REWARDS.TASK_IMPORTANT;

                    if (!task.isCompleted) {
                        grantXP(xp);
                        completedDiff = 1; // +1 tâche complétée
                    } else {
                        grantXP(-xp);
                        completedDiff = -1; // -1 tâche (si on annule)
                    }
                }

                return {
                    tasks: state.tasks.map((t) => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t),
                    totalCompletedTasks: (state.totalCompletedTasks || 0) + completedDiff, // Mise à jour du record
                };
            }),

            deleteTask: (id) => set((state) => ({
                tasks: state.tasks.filter((task) => task.id !== id),
                // 💡 Note : on ne modifie PAS totalCompletedTasks ici. Le record historique est conservé !
            })),
        }),
        {
            name: 'lumos-tasks-storage',
            storage: createJSONStorage(() => AsyncStorage),
            // On sauvegarde le compteur historique dans le cache
            partialize: (state) => ({ tasks: state.tasks, totalCompletedTasks: state.totalCompletedTasks }),
        }
    )
);