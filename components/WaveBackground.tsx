import React, { useRef, useEffect } from 'react';

const WaveBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let frameId: number;
        let t = 0;

        const waves = [
            { color: 'rgba(59, 130, 246, 0.7)', amp: 25, freq: 0.02, speed: 0.015, offset: 0, width: 1.5 },
            { color: 'rgba(139, 92, 246, 0.7)', amp: 30, freq: 0.015, speed: -0.01, offset: 1, width: 1.5 },
            { color: 'rgba(236, 72, 153, 0.7)', amp: 35, freq: 0.01, speed: 0.02, offset: 2, width: 1.5 },
            { color: 'rgba(34, 211, 238, 0.7)', amp: 40, freq: 0.008, speed: -0.012, offset: 3, width: 1.0 },
            { color: 'rgba(16, 185, 129, 0.7)', amp: 20, freq: 0.025, speed: 0.025, offset: 4, width: 1.0 },
        ];
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = 'lighter'; // Additive blending for a neon glow effect

            const h = canvas.height;
            const w = canvas.width;
            
            t += 1;

            waves.forEach(wave => {
                ctx.beginPath();
                ctx.strokeStyle = wave.color;
                ctx.lineWidth = wave.width;
                ctx.shadowBlur = 15;
                ctx.shadowColor = wave.color;

                for (let x = 0; x < w; x++) {
                    const angle = (x / w) * Math.PI * 2;
                    const noise = Math.sin(x * wave.freq * 0.5 + t * wave.speed * 0.5) * 10;
                    const y = h / 2 + Math.sin(x * wave.freq + t * wave.speed + wave.offset) * wave.amp * Math.sin(angle) + noise;
                    if (x === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();
            });

            frameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};

export default WaveBackground;