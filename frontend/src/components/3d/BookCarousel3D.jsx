import { useRef, Suspense, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

function Book3D({ position, rotation, color }) {
  const bookRef = useRef()

  useFrame(() => {
    if (bookRef.current) {
      bookRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={bookRef} position={position} rotation={rotation}>
      <mesh position={[0, 0, 0.1]}>
        <boxGeometry args={[1.2, 1.8, 0.08]} />
        <meshStandardMaterial
          color={color}
          metalness={0.4}
          roughness={0.3}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>

      <mesh position={[-0.64, 0, 0]}>
        <boxGeometry args={[0.08, 1.8, 0.08]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </mesh>

      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[1.2, 1.8, 0.08]} />
        <meshStandardMaterial color={`${color}dd`} metalness={0.2} roughness={0.5} />
      </mesh>
    </group>
  )
}

function SceneContent() {
  const books = [
    { color: '#8B4513', position: [-3, 0, 0] },
    { color: '#708090', position: [0, 0, 0] },
    { color: '#D4A574', position: [3, 0, 0] },
  ]

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 8]} intensity={1.2} color="#FFD700" />
      <pointLight position={[-5, -5, 8]} intensity={0.8} color="#FAF3E0" />
      {books.map((book, idx) => (
        <Book3D key={idx} position={book.position} rotation={[0, 0, 0]} color={book.color} />
      ))}
    </>
  )
}

export default function BookCarousel3D() {
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
      camera={{ position: [0, 0, 6] }}
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
