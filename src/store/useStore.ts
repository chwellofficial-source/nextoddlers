import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from '../data/i18n';

interface AppState {
  // Auth State
  isAuthenticated: boolean;
  classroomCode: string | null;
  nickname: string | null;
  
  // Settings State
  language: Language;
  ttsRate: number;
  sessionDuration: number;
  
  // Progress State
  stars: number;
  
  // Actions
  login: (code: string, nickname: string) => void;
  logout: () => void;
  setLanguage: (lang: Language) => void;
  setTtsRate: (rate: number) => void;
  setSessionDuration: (minutes: number) => void;
  addStar: (amount?: number) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      classroomCode: null,
      nickname: null,
      
      language: 'en',
      ttsRate: 0.8,
      sessionDuration: 5,
      
      stars: 0,
      
      login: (code, nickname) => set({ 
        isAuthenticated: true, 
        classroomCode: code, 
        nickname 
      }),
      
      logout: () => set({ 
        isAuthenticated: false, 
        classroomCode: null, 
        nickname: null 
      }),
      
      setLanguage: (language) => set({ language }),
      
      setTtsRate: (ttsRate) => set({ ttsRate }),
      
      setSessionDuration: (sessionDuration) => set({ sessionDuration }),
      
      addStar: (amount = 1) => set((state) => ({ stars: state.stars + amount })),
    }),
    {
      name: 'nexttoddlers-storage',
    }
  )
);