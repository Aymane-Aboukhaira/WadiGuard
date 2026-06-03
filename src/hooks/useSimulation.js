import { useState, useEffect, useCallback, useRef } from 'react';

export function useSimulation(maxTime = 95) {
  const [simTime, setSimTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setSimTime(t => {
        const next = Math.min(t + speed, maxTime);
        if (next >= maxTime) setRunning(false);
        return next;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, speed, maxTime]);

  const start = useCallback(() => {
    setSimTime(0);
    setRunning(true);
  }, []);

  const reset = useCallback(() => {
    setSimTime(0);
    setRunning(false);
  }, []);

  const togglePause = useCallback(() => setRunning(r => !r), []);

  return { simTime, running, speed, setSpeed, start, reset, togglePause };
}
