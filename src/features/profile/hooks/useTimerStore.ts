import { create } from 'zustand';

interface Timer {
    isActive: Boolean;
    id: string;
    startTime: number;
    elapsedTime: number;
    intervalId?: NodeJS.Timeout;
}

interface TimerStore {
    timers: Record<string, Timer>;
    startTimer: (id: string) => void;
    stopTimer: (id: string) => void;
    removeTimer: (id: string) => void;
    saveTimeToLocalStorage: (id: string, time: string | number) => void;
}

export const useTimerStore = create<TimerStore>(set => ({
    timers: {},
    startTimer: (id) => set(state => {
        if (state.timers[id]?.intervalId) {
            clearInterval(state.timers[id].intervalId);
        }

        const startTime = state.timers[id]?.startTime || Date.now();
        const elapsedTime = state.timers[id]?.elapsedTime || 0;

        const intervalId = setInterval(() => {
            set(state => {
                if (state.timers[id] && state.timers[id].isActive) {
                    return {
                        timers: {
                            ...state.timers,
                            [id]: {
                                ...state.timers[id],
                                elapsedTime: Date.now() - state.timers[id].startTime,
                            }
                        }
                    };
                }
                return state;
            });
        }, 1000);

        const newTimer: Timer = {
            id,
            isActive: true,
            startTime,
            elapsedTime,
            intervalId,
        };

        return {
            timers: {
                ...state.timers,
                [id]: newTimer
            }
        };
    }),
    stopTimer: (id) => set(state => {
        const timer = state.timers[id];
        if (timer && timer.isActive && timer.intervalId) {
            clearInterval(timer.intervalId);
            const finalTime = Date.now() - timer.startTime + timer.elapsedTime;
            return {
                timers: {
                    ...state.timers,
                    [id]: {
                        ...timer,
                        isActive: false,
                        elapsedTime: finalTime,
                        intervalId: undefined,
                    }
                }
            };
        }
        return { timers: {...state.timers} };
    }),
    removeTimer: (id) => set(state => {
        const newTimers = { ...state.timers };
        delete newTimers[id];
        return { timers: newTimers };
    }),
    saveTimeToLocalStorage: (id, elapsedTime) => {
        const existing = JSON.parse(localStorage.getItem('timers') || '[]');
        const updated = existing.filter((item: any) => item.id !== id);
        updated.push({ id, time: getFormattedTime(elapsedTime) });
        localStorage.setItem('timers', JSON.stringify(updated));
    }
}));

const getFormattedTime = (ms: any) => {
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    const hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};