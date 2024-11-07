import {useEffect} from "react";
import {useTimerStore} from "@/features/profile/hooks/useTimerStore";

const getFormattedTime = (ms: any) => {
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    const hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

interface TimerProps {
    pidProcess: any[],
    external_id: string
}

export const Timer = (props: TimerProps) => {
    const {pidProcess, external_id} = props;

    const timer = useTimerStore(state => state.timers[external_id]);
    const { startTimer, stopTimer } = useTimerStore();

    useEffect(() => {
        startTimer(external_id);
        return () => stopTimer(external_id);
    }, [external_id, startTimer, stopTimer]);

    return <div>{timer ? getFormattedTime(timer.elapsedTime) : "null"}</div>;
};