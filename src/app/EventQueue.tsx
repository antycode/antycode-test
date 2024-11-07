import { useState, useEffect } from 'react';

export const EventQueue = () => {
    const [queue, setQueue] = useState<any[]>([]);

    useEffect(() => {
        if (queue.length > 0) {
            const nextEvent = queue[0];
            nextEvent();
            setQueue(prevQueue => prevQueue.slice(1));
        }
    }, [queue]);

    const addToQueue = (eventHandler: any) => {
        setQueue(prevQueue => [...prevQueue, eventHandler]);
    };

    return {
        addToQueue,
    };
};