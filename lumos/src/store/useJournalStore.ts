import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface JournalEntry {
    id: string;
    date: string; // Format ISO pour pouvoir la trier facilement
    title: string;
    content: string;
    isFavorite?: boolean; // Optionnel : pour marquer les entrées importantes
    mood?: string;
}

interface JournalState {
    entries: JournalEntry[];
    addEntry: (entry: Omit<JournalEntry, 'id'>) => void;
    deleteEntry: (id: string) => void;
    toggleFavorite: (id: string) => void;
}

export const useJournalStore = create<JournalState>()(
    persist(
        (set) => ({
            entries: [],

            // Ajoute la nouvelle entrée tout en haut de la liste (la plus récente d'abord)
            addEntry: (entry) => set((state) => ({
                entries: [{ ...entry, id: Date.now().toString() }, ...state.entries]
            })),

            deleteEntry: (id) => set((state) => ({
                entries: state.entries.filter(e => e.id !== id)
            })),

            toggleFavorite: (id) => set((state) => ({
                entries: state.entries.map(e => e.id === id ? { ...e, isFavorite: !e.isFavorite } : e)
            })),
        }),
        {
            name: 'lumos-journal-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);