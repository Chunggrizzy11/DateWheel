import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Category } from '../../types/category';

interface WheelCanvasProps {
  categories: Category[];
  isSpinning: boolean;
  onSpinEnd: (winner: Category) => void;
  winnerIndex: number;
  onSpinClick?: () => void;
}

export default function WheelCanvas({ categories, isSpinning, onSpinEnd, winnerIndex, onSpinClick }: WheelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<Record<string, HTMLImageElement>>({});

  // Preload Images
  useEffect(() => {
    if (categories.length === 0) return;
    
    let loaded = 0;
    const newImages: Record<string, HTMLImageElement> = {};
    
    categories.forEach(cat => {
      const img = new Image();
      img.src = cat.icon || `https://ui-avatars.com/api/?name=${encodeURIComponent(cat.name)}&background=random`;
      
      const handleLoad = (finalImg: HTMLImageElement) => {
        newImages[cat._id] = finalImg;
        loaded++;
        if (loaded === categories.length) setImages({ ...newImages });
      };

      img.onload = () => handleLoad(img);
      img.onerror = () => {
        const fb = new Image();
        fb.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cat.name)}&background=random`;
        fb.onload = () => handleLoad(fb);
      };
    });
  }, [categories]);

  // Draw Wheel
  useEffect(() => {
    if (!canvasRef.current || categories.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 15;
    const sliceAngle = (2 * Math.PI) / categories.length;
    const WHEEL_COLORS = ['#0ea5e9', '#ec4899', '#3b82f6', '#f97316', '#d946ef', '#eab308', '#65a30d', '#ef4444'];

    ctx.clearRect(0, 0, size, size);

    categories.forEach((cat, index) => {
      const angle = index * sliceAngle;
      
      // Draw slice
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, angle, angle + sliceAngle);
      ctx.fillStyle = WHEEL_COLORS[index % WHEEL_COLORS.length];
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.stroke();

      // Draw text & image
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(angle + sliceAngle / 2);
      
      const img = images[cat._id];
      if (img) {
        // Draw icon near the edge
        ctx.drawImage(img, radius - 55, -20, 40, 40);
      }
      
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 24px "Segoe UI", Arial, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 4;
      
      const text = cat.name.substring(0, 15);
      ctx.fillText(text, radius - 65, 0);
      ctx.restore();
    });

    // Outer wheel border
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 16;
    ctx.strokeStyle = '#fcd34d'; // Gold outer
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(center, center, radius - 8, 0, 2 * Math.PI);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#fbbf24'; // Inner gold line
    ctx.stroke();

    // Center dot (QUAY button)
    ctx.beginPath();
    ctx.arc(center, center, 48, 0, 2 * Math.PI);
    ctx.fillStyle = '#dc2626'; // Red
    ctx.fill();
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#fcd34d'; // Gold border
    ctx.stroke();

    // "QUAY" text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px Arial, sans-serif';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 4;
    ctx.fillText('QUAY', center, center);

  }, [categories, images]);

  // Handle Spin Animation
  useEffect(() => {
    if (!isSpinning || !containerRef.current) return;

    const segmentAngle = 360 / categories.length;
    const rotations = 15 * 360; // 15 full spins for a long 15s animation
    const targetAngle = rotations + (360 - (winnerIndex * segmentAngle + segmentAngle / 2));

    const el = containerRef.current;
    // Reset
    el.style.transition = 'none';
    el.style.transform = 'rotate(0deg)';
    
    // Force reflow
    void el.offsetWidth;
    
    // Spin
    el.style.transition = 'transform 15s cubic-bezier(0.1, 0.9, 0.2, 1)';
    el.style.transform = `rotate(${targetAngle}deg)`;

    const timer = setTimeout(() => {
      onSpinEnd(categories[winnerIndex]);
      // Optional: trigger confetti here or in parent
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }, 15000);

    return () => clearTimeout(timer);
  }, [isSpinning, winnerIndex, categories, onSpinEnd]);

  if (categories.length === 0) {
    return <div className="w-full aspect-square bg-muted rounded-full flex items-center justify-center text-muted-foreground border-8 border-border">Select categories to spin</div>;
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !onSpinClick || isSpinning) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = x * scaleX;
    const clickY = y * scaleY;
    
    const center = canvas.width / 2;
    const dist = Math.hypot(clickX - center, clickY - center);
    
    // Radius of center QUAY button is 48, add some padding
    if (dist <= 55) {
      onSpinClick();
    }
  };

  return (
    <div className="relative w-full max-w-[500px] mx-auto aspect-square">
      {/* Pointer */}
      <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[15px] border-y-transparent border-r-[30px] border-r-foreground z-10 drop-shadow-md"></div>
      
      {/* Wheel */}
      <div ref={containerRef} className="w-full h-full rounded-full border-8 border-card shadow-2xl overflow-hidden relative bg-muted">
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={600} 
          className={`w-full h-full object-contain ${!isSpinning && onSpinClick ? 'cursor-pointer' : ''}`} 
          onClick={handleCanvasClick} 
        />
      </div>
    </div>
  );
}
