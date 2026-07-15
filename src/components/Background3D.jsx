import React, { useEffect, useRef } from 'react';

const Background3D = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const particleCount = 60; // Perfect count for performance and aesthetics
    const focalLength = 300; // Focal length for 3D perspective projection

    // Mouse coordinates and target for interpolation (smooth movement)
    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    let scrollY = 0;

    // Helper to create a single particle
    const createParticle = (initY = false) => {
      const isPetal = Math.random() > 0.4; // 60% petals, 40% golden sparkles
      return {
        x: (Math.random() - 0.5) * width * 1.5,
        y: initY ? -50 - Math.random() * height : (Math.random() - 0.5) * height * 1.5,
        z: Math.random() * 800 + 100, // Z depth from 100 to 900
        size: isPetal ? Math.random() * 12 + 8 : Math.random() * 3 + 1,
        color: isPetal 
          ? `rgba(${92 + Math.random() * 30}, ${6 + Math.random() * 15}, ${18 + Math.random() * 20}, ${0.5 + Math.random() * 0.4})` // Marsala tones
          : `rgba(${212 + Math.random() * 40}, ${175 + Math.random() * 40}, ${55 + Math.random() * 30}, ${0.6 + Math.random() * 0.4})`, // Gold tones
        isPetal,
        // Drift speeds
        vx: Math.random() * 0.8 - 0.4,
        vy: Math.random() * 0.5 + 0.3, // Constant downward drift
        vz: Math.random() * 0.4 - 0.2,
        // Rotation for petals
        angle: Math.random() * Math.PI * 2,
        angleSpeed: Math.random() * 0.02 - 0.01,
        swing: Math.random() * Math.PI * 2,
        swingSpeed: Math.random() * 0.01 + 0.005,
        swingRange: Math.random() * 0.5 + 0.2
      };
    };

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(false));
    }

    const drawPetal = (ctx, x, y, size, angle, color) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      
      // Create Marsala gradient for the petal
      const grad = ctx.createLinearGradient(-size, -size, size, size);
      grad.addColorStop(0, color);
      // Darker shading on edge
      grad.addColorStop(1, 'rgba(60, 2, 8, 0.9)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      
      // Draw organic petal shape using curves
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(size * 0.8, -size * 0.8, size * 1.2, size * 0.2, 0, size);
      ctx.bezierCurveTo(-size * 1.2, size * 0.2, -size * 0.8, -size * 0.8, 0, -size);
      
      ctx.closePath();
      ctx.fill();

      // Add elegant highlight line down center of petal
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(0, size * 0.8);
      ctx.stroke();

      ctx.restore();
    };

    const drawSparkle = (ctx, x, y, size, color) => {
      ctx.save();
      
      // Glow effect for golden sparkles
      ctx.shadowBlur = size * 4;
      ctx.shadowColor = 'rgba(212, 175, 55, 0.8)';
      ctx.fillStyle = color;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    };

    // Render loop
    const animate = () => {
      // Clear canvas with very subtle fade to create light motion blur
      ctx.fillStyle = 'rgba(250, 247, 245, 0.15)'; // Matching base off-white page background
      ctx.fillRect(0, 0, width, height);

      // Smooth mouse tracking
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Render & update particles
      particles.forEach((p, index) => {
        // Apply wind/mouse influence
        const dx = (p.x + width / 2) - mouse.x;
        const dy = (p.y + height / 2) - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 250) {
          const force = (250 - dist) / 250;
          p.vx += (dx / dist) * force * 0.15;
          p.vy += (dy / dist) * force * 0.15;
        }

        // Base physics
        p.x += p.vx;
        p.y += p.vy + Math.sin(p.swing) * p.swingRange * 0.3; // Gentle swaying motion
        p.z += p.vz;
        
        // Slower drift speed limiters
        p.vx *= 0.98;
        
        // Update petal rotation angles
        if (p.isPetal) {
          p.angle += p.angleSpeed;
          p.swing += p.swingSpeed;
        }

        // Apply scroll movement
        p.y -= (scrollY - window.scrollY) * 0.08 * (300 / p.z);

        // Calculate 3D perspective position
        const scale = focalLength / (focalLength + p.z);
        const projectedX = p.x * scale + width / 2;
        const projectedY = p.y * scale + height / 2;
        const projectedSize = p.size * scale;

        // Draw particle if within bounds
        if (
          projectedX >= -projectedSize * 2 &&
          projectedX <= width + projectedSize * 2 &&
          projectedY >= -projectedSize * 2 &&
          projectedY <= height + projectedSize * 2
        ) {
          if (p.isPetal) {
            drawPetal(ctx, projectedX, projectedY, projectedSize, p.angle, p.color);
          } else {
            drawSparkle(ctx, projectedX, projectedY, projectedSize, p.color);
          }
        }

        // Reset particle if it drifts too far down, up, or out of view
        if (p.y > height * 1.5 || p.z <= 0 || p.z > 1000 || p.x < -width || p.x > width) {
          particles[index] = createParticle(true);
        }
      });

      // Update baseline scroll state
      scrollY = window.scrollY;

      animationFrameId = requestAnimationFrame(animate);
    };

    // Event listeners
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        background: 'linear-gradient(135deg, #fffbf9 0%, #faf7f5 100%)',
      }}
    />
  );
};

export default Background3D;
