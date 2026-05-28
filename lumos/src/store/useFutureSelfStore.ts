// src/store/useFutureSelfStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addMonths, format } from 'date-fns';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface FutureLetter {
    id: string;
    content: string;
    createdAt: string;
    unlockAt: string;
    isUnlocked: boolean;
}

interface FutureSelfState {
    letters: FutureLetter[];
    addLetter: (content: string, months: number) => void;
}

export const useFutureSelfStore = create<FutureSelfState>()(
    persist(
        (set) => ({
            letters: [],

            addLetter: (content, months) => {
                const now = new Date();
                const unlockDate = addMonths(now, months);

                const newLetter: FutureLetter = {
                    id: `letter_${Date.now()}`,
                    content,
                    createdAt: format(now, 'yyyy-MM-dd'),
                    unlockAt: format(unlockDate, 'dd/MM/yyyy'), // Format lisible pour l'affichage
                    isUnlocked: false,
                };

                set((state) => ({
                    letters: [newLetter, ...state.letters],
                }));
            },
        }),
        {
            name: 'lumos-future-self-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);