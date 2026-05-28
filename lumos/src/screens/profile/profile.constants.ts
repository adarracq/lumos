// src/screens/profile/profile.constants.ts
import { Anchor, BrainCircuit, MessageCircleHeart, Target, Wind } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';

export const AXIS_CONFIG: Record<string, { icon: any, color: string, label: string }> = {
    DISCIPLINE: { icon: Target, color: '#FF9800', label: 'Discipline' },
    SERENITE: { icon: Wind, color: Colors.primary, label: 'Sérénité' },
    EMPATHIE: { icon: MessageCircleHeart, color: '#E91E63', label: 'Empathie' },
    SAGESSE: { icon: BrainCircuit, color: '#9C27B0', label: 'Sagesse' },
    ANCRAGE: { icon: Anchor, color: '#4CAF50', label: 'Ancrage' }
};

export const getRank = (lumens: number) => {
    // 15 000 Lumens = ~4 à 6 mois de constance absolue
    if (lumens >= 15000) return { title: 'Illumination', currentMin: 15000, nextMin: null, color: '#E1BEE7' };

    // 9 000 Lumens = ~3 mois
    if (lumens >= 9000) return { title: 'Paix', currentMin: 9000, nextMin: 15000, color: '#B3E5FC' };

    // 5 000 Lumens = ~1.5 mois
    if (lumens >= 5000) return { title: 'Amour & Joie', currentMin: 5000, nextMin: 9000, color: '#F8BBD0' };

    // 2 500 Lumens = ~3 semaines
    if (lumens >= 2500) return { title: 'Raison', currentMin: 2500, nextMin: 5000, color: '#C8E6C9' };

    // 1 000 Lumens = ~10 jours
    if (lumens >= 1000) return { title: 'Volonté', currentMin: 1000, nextMin: 2500, color: '#FFF9C4' };

    // 300 Lumens = ~2-3 jours
    if (lumens >= 300) return { title: 'Courage', currentMin: 300, nextMin: 1000, color: '#FFE0B2' };

    // Départ
    return { title: 'Fierté', currentMin: 0, nextMin: 300, color: '#FFCDD2' };
};