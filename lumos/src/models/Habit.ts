export type HabitType = 'UNIQUE' | 'QUANTITY' | 'TIME';

export interface Habit {
    id: string;
    name: string;
    type: HabitType;
    targetValue?: number; // Pour la quantité (ex: 1.5) ou le temps (ex: 30 minutes)
    icon: string;
    color: string;
    frequency: number[]; // Jours de la semaine: 1 (Lundi) à 7 (Dimanche)
    reminderTime?: string; // Format "HH:mm" ou null
}

export interface HabitLog {
    [date: string]: {
        [habitId: string]: boolean | number; // boolean pour UNIQUE, number pour QUANTITY/TIME
    };
}