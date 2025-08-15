import { useEffect, useState } from "react";

export const Confetti: React.FC<{ trigger: boolean }> = ({ trigger }) => {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
    }>
  >([]);

  useEffect(() => {
    if (!trigger) return;

    const colors = [
      "#f43f5e",
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#8b5cf6",
      "#ef4444",
    ];
    const newParticles = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x:
        Math.random() *
        (typeof window !== "undefined" ? window.innerWidth : 1200),
      y: typeof window !== "undefined" ? window.innerHeight + 10 : 800,
      vx: (Math.random() - 0.5) * 10,
      vy: -(Math.random() * 15 + 10),
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
    }));

    setParticles(newParticles);

    const animateParticles = () => {
      setParticles((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.5,
          }))
          .filter(
            (particle: { y: number }) =>
              particle.y <
              (typeof window !== "undefined" ? window.innerHeight + 100 : 900),
          ),
      );
    };

    const interval = setInterval(animateParticles, 16);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setParticles([]);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [trigger]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(
        (particle: {
          id: React.Key | null | undefined;
          x: any;
          y: any;
          size: any;
          color: any;
        }) => (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              transform: "translate(-50%, -50%)",
            }}
          />
        ),
      )}
    </div>
  );
};
