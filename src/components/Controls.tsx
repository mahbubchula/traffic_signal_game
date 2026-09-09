interface ControlsProps {
  signal: 'red' | 'yellow' | 'green';
  isAuto: boolean;
  setIsAuto: (v: boolean) => void;
  setSignal: (s: 'red' | 'yellow' | 'green') => void;
  countdown: number;
}

export default function Controls({ signal, isAuto, setIsAuto, setSignal, countdown }: ControlsProps) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-gray-900/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-gray-700/50">
        <div className="flex items-center gap-4 flex-wrap justify-center">
          {/* Auto/Manual toggle */}
          <button
            onClick={() => setIsAuto(!isAuto)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              isAuto
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {isAuto ? '🔄 Auto' : '✋ Manual'}
          </button>

          {/* Signal buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setSignal('red')}
              disabled={isAuto}
              className={`w-10 h-10 rounded-full transition-all ${
                signal === 'red'
                  ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)] scale-110'
                  : 'bg-red-900/60 hover:bg-red-800/60'
              } ${isAuto ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            />
            <button
              onClick={() => setSignal('yellow')}
              disabled={isAuto}
              className={`w-10 h-10 rounded-full transition-all ${
                signal === 'yellow'
                  ? 'bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)] scale-110'
                  : 'bg-yellow-900/60 hover:bg-yellow-800/60'
              } ${isAuto ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            />
            <button
              onClick={() => setSignal('green')}
              disabled={isAuto}
              className={`w-10 h-10 rounded-full transition-all ${
                signal === 'green'
                  ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)] scale-110'
                  : 'bg-green-900/60 hover:bg-green-800/60'
              } ${isAuto ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            />
          </div>

          {/* Countdown display */}
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
              ${signal === 'red' ? 'bg-red-500/20 text-red-400 border border-red-500/50' :
                signal === 'yellow' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' :
                'bg-green-500/20 text-green-400 border border-green-500/50'}`}
            >
              {countdown}
            </div>
            <span className="text-gray-400 text-xs">sec</span>
          </div>

          {/* Status */}
          <div className="text-xs text-gray-400 hidden sm:block">
            {signal === 'red' && '🛑 STOP — Traffic Jam!'}
            {signal === 'yellow' && '⚠️ CAUTION — Slow down'}
            {signal === 'green' && '✅ GO — Traffic flowing'}
          </div>
        </div>
      </div>
    </div>
  );
}
