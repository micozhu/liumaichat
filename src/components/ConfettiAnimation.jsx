// @ts-ignore;
import React, { useEffect, useRef } from 'react';

export function ConfettiAnimation() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const confetti = [];
    const confettiCount = 150;
    const gravity = 0.5;
    const terminalVelocity = 5;
    const drag = 0.075;
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#000000'];

    // 设置canvas尺寸
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 创建confetti粒子
    for (let i = 0; i < confettiCount; i++) {
      confetti.push({
        color: colors[Math.floor(Math.random() * colors.length)],
        dimensions: {
          x: Math.random() * 10 + 5,
          y: Math.random() * 10 + 5
        },
        position: {
          x: Math.random() * canvas.width,
          y: -Math.random() * canvas.height
        },
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 - 5,
        velocity: {
          x: Math.random() * 10 - 5,
          y: Math.random() * 5 + 1
        }
      });
    }
    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let activeCount = 0;
      confetti.forEach((confetto, index) => {
        const width = confetto.dimensions.x;
        const height = confetto.dimensions.y;
        ctx.save();
        ctx.translate(confetto.position.x, confetto.position.y);
        ctx.rotate(confetto.rotation * Math.PI / 180);
        ctx.fillStyle = confetto.color;
        ctx.fillRect(-width / 2, -height / 2, width, height);
        ctx.restore();

        // 物理模拟
        confetto.velocity.x -= confetto.velocity.x * drag;
        confetto.velocity.y = Math.min(confetto.velocity.y + gravity, terminalVelocity);
        confetto.velocity.y -= confetto.velocity.y * drag;
        confetto.position.x += confetto.velocity.x;
        confetto.position.y += confetto.velocity.y;
        confetto.rotation += confetto.rotationSpeed;

        // 检查是否还在屏幕内
        if (confetto.position.y >= canvas.height) {
          confetto.velocity.y = Math.abs(confetto.velocity.y) * -0.85;
          confetto.position.y = canvas.height;
        }
        if (confetto.position.y > -100) {
          activeCount++;
        }
      });
      if (activeCount > 0) {
        animationId = requestAnimationFrame(animate);
      }
    };
    animate();
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" style={{
    background: 'transparent'
  }} />;
}