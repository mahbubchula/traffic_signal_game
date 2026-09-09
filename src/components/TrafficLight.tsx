interface TrafficLightProps {
  signal: 'red' | 'yellow' | 'green';
  countdown: number;
}

export default function TrafficLight({ signal, countdown }: TrafficLightProps) {
  return (
    <div className="relative">
      {/* Housing */}
      <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-3 shadow-2xl border border-gray-700/50">
        {/* Top cap */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-20 h-3 bg-gray-700 rounded-t-lg" />
        
        {/* Visor hoods */}
        <div className="flex flex-col gap-3 items-center">
          {/* Red Light */}
          <div className="relative">
            <div className="absolute -top-1 -left-2 -right-2 h-5 bg-gray-800 rounded-t-full" />
            <div
              className={`w-14 h-14 rounded-full transition-all duration-500 flex items-center justify-center
                ${signal === 'red'
                  ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.8),0_0_60px_rgba(239,68,68,0.4)]'
                  : 'bg-red-900/60'
                }`}
            >
              {signal === 'red' && (
                <div className="absolute inset-2 rounded-full bg-red-400/30 animate-pulse" />
              )}
              {signal === 'red' && (
                <span className="text-white font-bold text-lg z-10">{countdown}</span>
              )}
            </div>
          </div>

          {/* Yellow Light */}
          <div className="relative">
            <div className="absolute -top-1 -left-2 -right-2 h-5 bg-gray-800 rounded-t-full" />
            <div
              className={`w-14 h-14 rounded-full transition-all duration-500 flex items-center justify-center
                ${signal === 'yellow'
                  ? 'bg-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.8),0_0_60px_rgba(250,204,21,0.4)]'
                  : 'bg-yellow-900/60'
                }`}
            >
              {signal === 'yellow' && (
                <div className="absolute inset-2 rounded-full bg-yellow-300/30 animate-pulse" />
              )}
              {signal === 'yellow' && (
                <span className="text-gray-800 font-bold text-lg z-10">{countdown}</span>
              )}
            </div>
          </div>

          {/* Green Light */}
          <div className="relative">
            <div className="absolute -top-1 -left-2 -right-2 h-5 bg-gray-800 rounded-t-full" />
            <div
              className={`w-14 h-14 rounded-full transition-all duration-500 flex items-center justify-center
                ${signal === 'green'
                  ? 'bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.8),0_0_60px_rgba(34,197,94,0.4)]'
                  : 'bg-green-900/60'
                }`}
            >
              {signal === 'green' && (
                <div className="absolute inset-2 rounded-full bg-green-400/30 animate-pulse" />
              )}
              {signal === 'green' && (
                <span className="text-white font-bold text-lg z-10">{countdown}</span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom cap */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-3 bg-gray-700 rounded-b-lg" />
      </div>

      {/* Light glow effect on ground */}
      <div
        className={`absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 h-8 rounded-full blur-xl transition-all duration-500
          ${signal === 'red' ? 'bg-red-500/30' : signal === 'yellow' ? 'bg-yellow-400/30' : 'bg-green-500/30'}`}
      />
    </div>
  );
}
