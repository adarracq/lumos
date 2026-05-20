// src/store/useUIStore.ts
import { create } from 'zustand';

export type ToolModalId = 'breathing' | 'grounding' | 'reframer' | 'boredom' | 'dojo' | 'filter' | 'approach' | 'bodyLang' | 'social' | 'focusSession' | 'bisou' | 'flow' | 'antidote' | 'fearSetting' | 'vault' | null;

interface UIState {
    isQuickActionVisible: boolean;
    setQuickActionVisible: (val: boolean) => void;
    activeModal: ToolModalId;
    openModal: (id: ToolModalId) => void;
    closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    isQuickActionVisible: false,
    setQuickActionVisible: (val) => set({ isQuickActionVisible: val }),
    activeModal: null,
    openModal: (id) => set({ activeModal: id }),
    closeModal: () => set({ activeModal: null }),
}));