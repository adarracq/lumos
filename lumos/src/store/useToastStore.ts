import { create } from 'zustand';

interface ToastState {
    message: string | null;
    visible: boolean;
    showToast: (msg: string) => void;
    hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
    message: null,
    visible: false,
    showToast: (msg) => {
        set({ message: msg, visible: true });
        // Fait disparaître le message après 2 secondes
        setTimeout(() => set({ visible: false }), 2000);
    },
    hideToast: () => set({ visible: false })
}));