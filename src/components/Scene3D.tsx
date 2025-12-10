import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Sphere, Torus, Box } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as THREE from 'three';

interface AnimatedShapeProps {
  position: [number, number, number];
  color: string;
  speed?: number;
}

const AnimatedSphere = ({ position, color, speed = 1 }: AnimatedShapeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere
        ref={meshRef}
        args={[1, 64, 64]}
        position={position}
        scale={hovered ? 1.1 : 1}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.1}
        />
      </Sphere>
    </Float>
  );
};

const AnimatedTorus = ({ position, color, speed = 1 }: AnimatedShapeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.4 * speed;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.2 * speed;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={0.8}>
      <Torus
        ref={meshRef}
        args={[0.8, 0.3, 32, 64]}
        position={position}
      >
        <MeshWobbleMaterial
          color={color}
          attach="material"
          factor={0.3}
          speed={2}
          roughness={0.3}
          metalness={0.2}
        />
      </Torus>
    </Float>
  );
};

const AnimatedBox = ({ position, color, speed = 1 }: AnimatedShapeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5 * speed;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.8} floatIntensity={0.6}>
      <Box
        ref={meshRef}
        args={[1, 1, 1]}
        position={position}
      >
        <meshStandardMaterial
          color={color}
          roughness={0.1}
          metalness={0.3}
        />
      </Box>
    </Float>
  );
};

const Scene3D = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#e07a4f" />
        
        <AnimatedSphere position={[-4, 2, -2]} color="#e07a4f" speed={0.8} />
        <AnimatedTorus position={[4, -1, -3]} color="#3d9a8b" speed={1.2} />
        <AnimatedBox position={[5, 3, -4]} color="#1e3a5f" speed={0.6} />
        <AnimatedSphere position={[-5, -2, -5]} color="#f4a261" speed={1} />
        <AnimatedTorus position={[-2, 3, -6]} color="#264653" speed={0.7} />
      </Canvas>
    </div>
  );
};

export default Scene3D;
