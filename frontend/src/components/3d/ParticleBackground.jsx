import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles() {
  const particles = useRef()
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#FAF3E0'
    ctx.beginPath()
    ctx.arc(32, 32, 10, 0, Math.PI * 2)
    ctx.fill()
    return new THREE.CanvasTexture(canvas)
  }, [])

  useFrame(() => {
    if (particles.current) {
      particles.current.rotation.x += 0.0003
      particles.current.rotation.y += 0.0005
    }
  })

  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const count = 200
    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 40
      positions[i + 1] = (Math.random() - 0.5) * 40
      positions[i + 2] = (Math.random() - 0.5) * 40
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [])

  return (
    <points ref={particles} geometry={particlesGeometry}>
      <pointsMaterial
        size={0.5}
        color="#708090"
        sizeAttenuation
        transparent
        opacity={0.6}
        map={texture}
      />
    </points>
  )
}

export default function ParticleBackground() {
  return (
    <Canvas
      style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
      camera={{ position: [0, 0, 15] }}
      gl={{ antialias: true, alpha: true, transparent: true }}
    >
      <Particles />
    </Canvas>
  )
}
