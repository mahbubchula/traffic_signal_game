import { useMemo } from 'react';

interface SkyProps {}

export default function Sky(_props: SkyProps) {
  const stars = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 40,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 3,
      duration: Math.random() * 2 + 1,
    }));
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      {/* Stars */}
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            opacity: 0.7,
          }}
        />
      ))}

      {/* Moon */}
      <div className="absolute top-[8%] right-[15%] w-16 h-16 rounded-full bg-yellow-100 shadow-[0_0_30px_rgba(255,255,200,0.5)]">
        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-yellow-200/50" />
        <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-yellow-200/40" />
      </div>

      {/* City skyline */}
      <div className="absolute bottom-[35%] left-0 right-0 flex items-end justify-center gap-1 opacity-30">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="bg-gray-800"
            style={{
              width: `${Math.random() * 30 + 15}px`,
              height: `${Math.random() * 80 + 30}px`,
              borderRadius: '2px 2px 0 0',
            }}
          >
            {/* Windows */}
            <div className="flex flex-wrap gap-1 p-1">
              {Array.from({ length: Math.floor(Math.random() * 6) + 2 }, (_, j) => (
                <div
                  key={j}
                  className="w-1.5 h-1.5 rounded-sm"
                  style={{
                    backgroundColor: Math.random() > 0.5 ? '#ffd700' : '#333',
                    opacity: Math.random() > 0.5 ? 0.8 : 0.3,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
