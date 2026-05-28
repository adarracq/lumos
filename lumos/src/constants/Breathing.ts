export type BreathingType = 'RHYTHM' | 'CYCLE_BASED';
export type BreathingAction = 'IN' | 'HOLD_FULL' | 'OUT' | 'HOLD_EMPTY' | 'FAST';

export interface BreathingPhase {
    label: string;
    duration: number; // Durée par défaut en secondes
    action: BreathingAction;
    isVariable?: boolean; // Vrai si le joueur peut étendre le temps (pour battre son record)
}

export interface BreathingExercise {
    id: string;
    name: string;
    description: string;
    type: BreathingType;
    defaultTarget: number; // Minutes pour RHYTHM, Cycles pour CYCLE_BASED
    phases: BreathingPhase[];
}

export const BREATHING_EXERCISES: BreathingExercise[] = [
    {
        id: 'coherence',
        name: 'Cohérence Cardiaque',
        description: 'Équilibre le système nerveux, réduit le stress instantanément. Idéal en journée.',
        type: 'RHYTHM',
        defaultTarget: 5, // 5 minutes
        phases: [
            { label: 'Inspire', duration: 5, action: 'IN' },
            { label: 'Expire', duration: 5, action: 'OUT' },
        ]
    },
    {
        id: 'relax',
        name: 'Relaxation 4-7-8',
        description: 'Parfait pour le soir. Calme le rythme cardiaque et prépare au sommeil.',
        type: 'RHYTHM',
        defaultTarget: 4, // 4 minutes
        phases: [
            { label: 'Inspire', duration: 4, action: 'IN' },
            { label: 'Bloque', duration: 7, action: 'HOLD_FULL' },
            { label: 'Expire', duration: 8, action: 'OUT' },
        ]
    },
    {
        id: 'box',
        name: 'Respiration Carrée',
        description: 'Utilisée par les forces spéciales pour retrouver un focus et un calme laser.',
        type: 'RHYTHM',
        defaultTarget: 3, // 3 minutes
        phases: [
            { label: 'Inspire', duration: 4, action: 'IN' },
            { label: 'Bloque Plein', duration: 4, action: 'HOLD_FULL' },
            { label: 'Expire', duration: 4, action: 'OUT' },
            { label: 'Bloque Vide', duration: 4, action: 'HOLD_EMPTY' },
        ]
    },
    {
        id: 'primal',
        name: 'Respiration Primale',
        description: 'Inspiré de Wim Hof. Alcale ton corps, booste ton énergie et teste tes limites d\'apnée.',
        type: 'CYCLE_BASED',
        defaultTarget: 2,
        phases: [
            { label: 'Respiration Rapide', duration: 60, action: 'FAST' },
            { label: 'Rétention (Vides)', duration: 0, action: 'HOLD_EMPTY', isVariable: true }, // Apnée libre
            { label: 'Inhale à fond...', duration: 3, action: 'IN' },
            { label: 'Blocage (Pleins)', duration: 15, action: 'HOLD_FULL' }, // Compte à rebours 15s
            { label: 'Expire lentement', duration: 5, action: 'OUT' },
        ]
    }
];