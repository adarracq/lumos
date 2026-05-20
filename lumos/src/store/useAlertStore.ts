import { create } from 'zustand';

export interface AlertButton {
    text: string;
    style?: 'default' | 'cancel' | 'destructive';
    onPress?: () => void;
}

interface AlertState {
    isVisible: boolean;
    title: string;
    message: string;
    buttons: AlertButton[];
    showAlert: (title: string, message: string, buttons?: AlertButton[]) => void;
    hideAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
    isVisible: false,
    title: '',
    message: '',
    buttons: [],
    showAlert: (title, message, buttons = [{ text: 'OK', style: 'default' }]) =>
        set({ isVisible: true, title, message, buttons }),
    hideAlert: () => set({ isVisible: false }),
}));