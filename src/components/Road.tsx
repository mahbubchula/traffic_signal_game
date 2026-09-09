import { useEffect, useState, useRef } from 'react';

interface RoadProps {
  signal: 'red' | 'yellow' | 'green';
}

interface Car {
  id: number;
  x: number;
  lane: number;
  color: string;
  type: 'sedan' | 'suv' | 'truck' | 'van';
  speed: number;
  width: number;
  height: number;
}

const CAR_COLORS = [
  '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6',
  '#1abc9c', '#e67e22', '#ecf0f1', '#2c3e50', '#d35400',
  '#c0392b', '#2980b9', '#27ae60', '#f1c40f', '#8e44ad',
];

const CAR_TYPES: Array<{ type: Car['type']; width: number; height: number }> = [
  { type: 'sedan', width: 60, height: 28 },
  { type: 'suv', width: 68, height: 32 },
  { type: 'truck', width: 85, height: 34 },
  { type: 'van', width: 72, height: 30 },
];

function createCar(id: number, startX?: number): Car {
  const typeInfo = CAR_TYPES[Math.floor(Math.random() * CAR_TYPES.length)];
  return {
    id,
    x: startX ?? (Math.random() * 800 + 100),
    lane: Math.random() > 0.5 ? 0 : 1,
    color: CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)],
    type: typeInfo.type,
    speed: Math.random() * 0.5 + 0.3,
    width: typeInfo.width,
    height: typeInfo.height,
  };
}

export default function Road({ signal }: RoadProps) {
  const [cars, setCars] = useState<Car[]>(() => {
    const initial: Car[] = [];
    for (let i = 0; i < 14; i++) {
      initial.push(createCar(i, 150 + i * 70 + Math.random() * 30));
    }
    return initial;
  });
  const animRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const animate = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const delta = (time - lastTimeRef.current) / 16;
      lastTimeRef.current = time;

      setCars(prev => {
        const updated = prev.map((car, idx) => {
          let newX = car.x;
          
          if (signal === 'green') {
            // Cars move forward
            newX += car.speed * delta * 1.5;
          } else if (signal === 'yellow') {
            // Cars slow down gradually
            newX += car.speed * delta * 0.3;
          }
          // Red: cars don't move (jam!)

          // Check distance to car ahead in same lane
          const carsAhead = prev
            .filter((c, i) => i !== idx && c.lane === car.lane && c.x > car.x)
            .sort((a, b) => a.x - b.x);
          
          if (carsAhead.length > 0) {
            const dist = carsAhead[0].x - car.x - carsAhead[0].width;
            if (dist < 20) {
              newX = car.x; // Too close, stop
            } else if (dist < 50 && signal !== 'green') {
              newX = car.x; // Maintain distance when stopped
            }
          }

          // Wrap around if car goes off screen
          if (newX > window.innerWidth + 100) {
            newX = -car.width - Math.random() * 100;
          }

          return { ...car, x: newX };
        });
        return updated;
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [signal]);

  const lane0Cars = cars.filter(c => c.lane === 0);
  const lane1Cars = cars.filter(c => c.lane === 1);

  return (
    <div className="relative w-full h-[35%] z-10">
      {/* Road surface */}
      <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-b from-gray-700 to-gray-800">
        {/* Road texture */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)',
          }}
        />
        
        {/* Sidewalk top */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-gray-500 to-gray-600 border-b-2 border-yellow-500/60" />
        
        {/* Lane markings - center dashed line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 flex gap-8 px-4">
          {Array.from({ length: 30 }, (_, i) => (
            <div key={i} className="w-12 h-full bg-yellow-400/80 rounded-sm flex-shrink-0" />
          ))}
        </div>

        {/* Side lines */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-white/60" />
        <div className="absolute bottom-4 left-0 right-0 h-0.5 bg-white/60" />

        {/* Cars - Lane 0 (top) */}
        <div className="absolute top-[15%] left-0 right-0 h-[35%]">
          {lane0Cars.map(car => (
            <CarSVG
              key={car.id}
              car={car}
              direction="right"
            />
          ))}
        </div>

        {/* Cars - Lane 1 (bottom) - going opposite direction */}
        <div className="absolute top-[55%] left-0 right-0 h-[35%]">
          {lane1Cars.map(car => (
            <CarSVG
              key={car.id}
              car={car}
              direction="left"
            />
          ))}
        </div>

        {/* Stop line */}
        <div className="absolute top-4 bottom-4 left-[18%] w-1.5 bg-white/80" />

        {/* Crosswalk */}
        <div className="absolute top-4 bottom-4 left-[15%] w-8 flex flex-col gap-2 justify-center">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="w-full h-2 bg-white/70 rounded-sm" />
          ))}
        </div>

        {/* Road debris / details */}
        <div className="absolute bottom-6 right-[20%] w-3 h-1 bg-gray-600 rounded-full opacity-50" />
        <div className="absolute bottom-8 right-[45%] w-2 h-1 bg-gray-600 rounded-full opacity-40" />
      </div>

      {/* Street lights */}
      <div className="absolute top-0 right-[20%] z-20">
        <div className="w-1.5 h-20 bg-gray-600 mx-auto" />
        <div className="w-8 h-2 bg-gray-600 rounded-full -mt-0.5" />
        <div className={`w-3 h-3 rounded-full -mt-1 ml-4 ${
          signal === 'red' ? 'bg-orange-300/60 shadow-[0_0_10px_rgba(255,200,100,0.5)]' : 'bg-orange-300/30'
        }`} />
      </div>

      <div className="absolute top-0 right-[60%] z-20">
        <div className="w-1.5 h-20 bg-gray-600 mx-auto" />
        <div className="w-8 h-2 bg-gray-600 rounded-full -mt-0.5" />
        <div className={`w-3 h-3 rounded-full -mt-1 ml-4 ${
          signal === 'red' ? 'bg-orange-300/60 shadow-[0_0_10px_rgba(255,200,100,0.5)]' : 'bg-orange-300/30'
        }`} />
      </div>

      {/* Exhaust fumes when jammed */}
      {signal === 'red' && (
        <div className="absolute top-[20%] left-[30%] z-20">
          <div className="w-4 h-4 bg-gray-400/20 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
          <div className="w-3 h-3 bg-gray-400/15 rounded-full animate-ping absolute -top-2 -left-1" style={{ animationDuration: '2.5s' }} />
        </div>
      )}
    </div>
  );
}

function CarSVG({ car, direction }: { car: Car; direction: 'right' | 'left' }) {
  const flip = direction === 'left' ? 'scaleX(-1)' : '';
  
  return (
    <div
      className="absolute transition-all duration-100"
      style={{
        left: `${car.x}px`,
        transform: flip,
        top: `${Math.random() > 0.5 ? 0 : 5}px`,
      }}
    >
      <svg width={car.width} height={car.height} viewBox={`0 0 ${car.width} ${car.height}`}>
        {/* Car body */}
        <rect
          x="5"
          y={car.height * 0.3}
          width={car.width - 10}
          height={car.height * 0.5}
          rx="4"
          fill={car.color}
        />
        {/* Car roof */}
        {car.type === 'sedan' && (
          <rect
            x={car.width * 0.25}
            y={car.height * 0.1}
            width={car.width * 0.4}
            height={car.height * 0.35}
            rx="3"
            fill={car.color}
            opacity="0.85"
          />
        )}
        {car.type === 'suv' && (
          <rect
            x={car.width * 0.2}
            y={car.height * 0.05}
            width={car.width * 0.5}
            height={car.height * 0.4}
            rx="3"
            fill={car.color}
            opacity="0.85"
          />
        )}
        {car.type === 'truck' && (
          <>
            <rect
              x={car.width * 0.55}
              y={car.height * 0.05}
              width={car.width * 0.2}
              height={car.height * 0.4}
              rx="2"
              fill={car.color}
              opacity="0.85"
            />
            <rect
              x="5"
              y={car.height * 0.15}
              width={car.width * 0.5}
              height={car.height * 0.35}
              rx="2"
              fill="#666"
            />
          </>
        )}
        {car.type === 'van' && (
          <rect
            x={car.width * 0.15}
            y={car.height * 0.08}
            width={car.width * 0.6}
            height={car.height * 0.38}
            rx="4"
            fill={car.color}
            opacity="0.85"
          />
        )}
        {/* Windows */}
        <rect
          x={car.width * 0.3}
          y={car.height * 0.15}
          width={car.width * 0.15}
          height={car.height * 0.2}
          rx="2"
          fill="#87CEEB"
          opacity="0.7"
        />
        <rect
          x={car.width * 0.48}
          y={car.height * 0.15}
          width={car.width * 0.12}
          height={car.height * 0.2}
          rx="2"
          fill="#87CEEB"
          opacity="0.7"
        />
        {/* Wheels */}
        <circle cx={car.width * 0.22} cy={car.height * 0.82} r={car.height * 0.14} fill="#1a1a1a" />
        <circle cx={car.width * 0.22} cy={car.height * 0.82} r={car.height * 0.08} fill="#444" />
        <circle cx={car.width * 0.72} cy={car.height * 0.82} r={car.height * 0.14} fill="#1a1a1a" />
        <circle cx={car.width * 0.72} cy={car.height * 0.82} r={car.height * 0.08} fill="#444" />
        {/* Headlights */}
        <rect x={car.width - 8} y={car.height * 0.4} width="4" height="4" rx="1" fill="#ffd700" opacity="0.9" />
        {/* Taillights */}
        <rect x="4" y={car.height * 0.4} width="3" height="4" rx="1" fill="#ff0000" opacity="0.8" />
      </svg>
    </div>
  );
}
