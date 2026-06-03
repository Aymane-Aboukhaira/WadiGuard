import { useState, useRef, useCallback } from 'react';
import { timeStamp } from '../utils';

export function useLogs(initial = []) {
  const [logs, setLogs] = useState(initial);
  const fired = useRef(new Set());

  const resetLogs = useCallback((entries = []) => {
    fired.current = new Set();
    setLogs(entries);
  }, []);

  const addLog = useCallback((entries) => {
    setLogs(cur => [...entries, ...cur].slice(0, 35));
  }, []);

  const checkEvents = useCallback((scenario, scenarioKey, simTime) => {
    scenario.events.forEach(event => {
      const key = `${scenarioKey}-${event.t}`;
      if (simTime >= event.t && !fired.current.has(key)) {
        fired.current.add(key);
        const entries = [
          { at: timeStamp(), level: event.level, category: 'event', text: event.log },
          ...event.actions.map(a => ({ at: timeStamp(), level: event.level, category: 'action', text: `→ ${a}` })),
          ...(event.comms || []).map(c => ({ at: timeStamp(), level: event.level, category: 'comms', text: c })),
        ];
        setLogs(cur => [...entries, ...cur].slice(0, 35));
      }
    });
  }, []);

  return { logs, addLog, resetLogs, checkEvents };
}
