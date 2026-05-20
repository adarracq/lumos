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
    if (lumens >= 2500) return { title: 'Illumination', currentMin: 2500, nextMin: null, color: '#E1BEE7' };
    if (lumens >= 1800) return { title: 'Paix', currentMin: 1800, nextMin: 2500, color: '#B3E5FC' };
    if (lumens >= 1200) return { title: 'Amour & Joie', currentMin: 1200, nextMin: 1800, color: '#F8BBD0' };
    if (lumens >= 700) return { title: 'Raison', currentMin: 700, nextMin: 1200, color: '#C8E6C9' };
    if (lumens >= 400) return { title: 'Volonté', currentMin: 400, nextMin: 700, color: '#FFF9C4' };
    if (lumens >= 150) return { title: 'Courage', currentMin: 150, nextMin: 400, color: '#FFE0B2' };
    return { title: 'Fierté', currentMin: 0, nextMin: 150, color: '#FFCDD2' };
};