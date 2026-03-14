'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'motion/react';

/**
 * MetatronGeometry — Sacred geometry: nested circles + hexagonal connecting lines
 * Metatron's Cube: 13 spheres (outer ring of 6, middle ring of 6, center)
 * Connected by precise geometric lines
 */
function MetatronGeometry() {
  const meshRef = React.useRef<THREE.Group>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useFrame(({ clock }, delta) => {
    if (!meshRef.current || prefersReducedMotion) return;

    // Slow rotation: 20s full loop
    meshRef.current.rotation.z += (delta / 20) * Math.PI * 2;

    // Breathing scale on outer group
    const breatheScale = 1 + Math.sin(clock.elapsedTime * 0.3) * 0.025;
    meshRef.current.scale.set(breatheScale, breatheScale, breatheScale);
  });

  // Create 13 circles (nodes of Metatron's Cube)
  const createCircleGeometry = (radius: number) => {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, true, 0);
    const points = curve.getPoints(64);
    return points;
  };

  // Outer ring: 6 circles (circumscribe)
  const outerRadius = 3;
  const outerPoints = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2;
    return {
      x: Math.cos(angle) * outerRadius,
      y: Math.sin(angle) * outerRadius,
    };
  });

  // Middle ring: 6 circles (between outer)
  const middleRadius = 1.8;
  const middlePoints = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
    return {
      x: Math.cos(angle) * middleRadius,
      y: Math.sin(angle) * middleRadius,
    };
  });

  // Center: 1 circle
  const centerPoint = { x: 0, y: 0 };

  const allPoints = [...outerPoints, ...middlePoints, centerPoint];
  const circleRadius = 0.35;

  return (
    <group ref={meshRef}>
      {/* Draw each circle (node) */}
      {allPoints.map((point, idx) => {
        const circlePoints = createCircleGeometry(circleRadius);
        const positions = new Float32Array(circlePoints.length * 3);
        circlePoints.forEach((p, i) => {
          positions[i * 3] = p.x + point.x;
          positions[i * 3 + 1] = p.y + point.y;
          positions[i * 3 + 2] = 0;
        });

        return (
          <line key={`circle-${idx}`}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" array={positions} itemSize={3} />
            </bufferGeometry>
            <lineBasicMaterial
              color={0x10b981}
              linewidth={1.5}
              transparent
              opacity={0.6}
            />
          </line>
        );
      })}

      {/* Connecting lines (hexagon structure) */}
      {/* Outer hexagon */}
      {outerPoints.map((point, idx) => {
        const nextPoint = outerPoints[(idx + 1) % outerPoints.length];
        const positions = new Float32Array([
          point.x, point.y, 0,
          nextPoint.x, nextPoint.y, 0,
        ]);

        return (
          <line key={`outer-line-${idx}`}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" array={positions} itemSize={3} />
            </bufferGeometry>
            <lineBasicMaterial color={0x10b981} transparent opacity={0.4} linewidth={1} />
          </line>
        );
      })}

      {/* Middle hexagon */}
      {middlePoints.map((point, idx) => {
        const nextPoint = middlePoints[(idx + 1) % middlePoints.length];
        const positions = new Float32Array([
          point.x, point.y, 0,
          nextPoint.x, nextPoint.y, 0,
        ]);

        return (
          <line key={`middle-line-${idx}`}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" array={positions} itemSize={3} />
            </bufferGeometry>
            <lineBasicMaterial color={0x10b981} transparent opacity={0.35} linewidth={1} />
          </line>
        );
      })}

      {/* Radial spokes (outer to middle) */}
      {outerPoints.map((oPoint, idx) => {
        const mPoint = middlePoints[idx];
        const positions = new Float32Array([
          oPoint.x, oPoint.y, 0,
          mPoint.x, mPoint.y, 0,
        ]);

        return (
          <line key={`spoke-${idx}`}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" array={positions} itemSize={3} />
            </bufferGeometry>
            <lineBasicMaterial color={0x10b981} transparent opacity={0.25} linewidth={0.8} />
          </line>
        );
      })}

      {/* Spokes to center */}
      {[...outerPoints, ...middlePoints].map((point, idx) => {
        const positions = new Float32Array([
          point.x, point.y, 0,
          centerPoint.x, centerPoint.y, 0,
        ]);

        return (
          <line key={`to-center-${idx}`}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" array={positions} itemSize={3} />
            </bufferGeometry>
            <lineBasicMaterial color={0x10b981} transparent opacity={0.15} linewidth={0.6} />
          </line>
        );
      })}
    </group>
  );
}

/**
 * RitualThreshold — Metatron's Cube sacred geometry as visual threshold
 * Used only on SessionSetup screen, not in chat interface
 *
 * Performance:
 * - frameloop="demand" (never 'always')
 * - PerformanceMonitor scales dpr [0.5, 2] on low-end devices
 * - Respects prefers-reduced-motion
 */
export function RitualThreshold() {
  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0.9 }}
      animate={{ opacity: 1, scaleY: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 26, mass: 0.9 }}
      className="relative w-full h-32 mb-8 bg-void-1/40 rounded-2xl border border-white/5 overflow-hidden"
    >
      {/* Ambient glow background */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/10 via-transparent to-transparent pointer-events-none" />

      {/* R3F Canvas */}
      <Suspense fallback={<div className="w-full h-full bg-void-2/50" />}>
        <Canvas
          frameloop="demand"
          dpr={[0.5, 2]}
          orthographic
          camera={{
            zoom: 80,
            position: [0, 0, 1],
          }}
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <PerformanceMonitor>
            <MetatronGeometry />
          </PerformanceMonitor>
        </Canvas>
      </Suspense>

      {/* Text overlay — stays in DOM for a11y and crisp rendering */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <p className="text-xs uppercase tracking-widest text-slate-400/60">
          Ritual Threshold
        </p>
      </div>
    </motion.div>
  );
}
