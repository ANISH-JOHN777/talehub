import { useRef, Suspense, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'

function AnimatedSphere() {
  const sphereRef = useRef()

  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x += 0.003
      sphereRef.current.rotation.y += 0.004
    }
  })

  return (
    <group ref={sphereRef}>
      <Sphere args={[1, 100, 100]} scale={1.3}>
        <MeshDistortMaterial
          color="#708090"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.3}
          metalness={0.7}
        />
      </Sphere>
    </group>
  )
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 5]} intensity={1.2} color="#FAF3E0" />
      <pointLight position={[-10, -5, 5]} intensity={0.8} color="#708090" />
      <pointLight position={[5, -10, -5]} intensity={0.6} />
      <AnimatedSphere />
    </>
  )
}

export default function UserAvatar3D() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 500)
    return () => clearTimeout(timer)
  }, [])

  if (!isReady) {
    return <div className="w-full h-full bg-gradient-to-br from-warm-cream to-slate-gray/10" />
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 2.5] }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true, precision: 'highp' }}
      dpr={[1, 1.5]}
      onCreated={(state) => {
        state.gl.setClearColor('#FAF3E0', 0)
      }}
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  )
}
