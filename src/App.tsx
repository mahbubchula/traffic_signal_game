import { useState, useEffect, useCallback } from 'react';
import TrafficLight from './components/TrafficLight';
import Road from './components/Road';
import Sky from './components/Sky';
import Controls from './components/Controls';

type SignalState = 'red' | 'yellow' | 'green';

function App() {
  const [signal, setSignal] = useState<SignalState>('red');
  const [isAuto, setIsAuto] = useState(true);
  const [countdown, setCountdown] = useState(0);

  const durations: Record<SignalState, number> = {
    red: 8,
    yellow: 3,
    green: 6,
  };

  const nextSignal: Record<SignalState, SignalState> = {
    red: 'green',
    yellow: 'red',
    green: 'yellow',
  };

  const cycleSignal = useCallback(() => {
    setSignal(prev => {
      const next = nextSignal[prev];
      setCountdown(durations[next]);
      return next;
    });
  }, []);

  const setManualSignal = (s: SignalState) => {
    setIsAuto(false);
    setSignal(s);
    setCountdown(durations[s]);
  };

  useEffect(() => {
    setCountdown(durations[signal]);
  }, []);

  useEffect(() => {
    if (!isAuto) return;
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          cycleSignal();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isAuto, cycleSignal]);

  return (
    <div className="w-full h-screen overflow-hidden relative bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      <Sky />
      <div className="absolute inset-0 flex flex-col items-center justify-end">
        {/* Traffic Light Pole */}
        <div className="absolute left-[12%] bottom-[35%] z-30 flex flex-col items-center">
          <TrafficLight signal={signal} countdown={countdown} />
          <div className="w-3 h-40 bg-gradient-to-b from-gray-600 to-gray-800 rounded-sm shadow-lg" />
          <div className="w-16 h-3 bg-gray-700 rounded-sm" />
        </div>

        {/* Road Scene */}
        <Road signal={signal} />

        {/* Controls */}
        <Controls
          signal={signal}
          isAuto={isAuto}
          setIsAuto={setIsAuto}
          setSignal={setManualSignal}
          countdown={countdown}
        />
      </div>
    </div>
  );
}

export default App;
