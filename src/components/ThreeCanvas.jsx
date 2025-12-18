import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF, Grid, Html, useProgress } from '@react-three/drei'
import { Suspense } from 'react'

// Loading indicator component
function Loader() {
    const { progress } = useProgress()
    return (
        <Html center>
            <div style={{
                color: 'white',
                fontSize: '14px',
                background: 'rgba(0,0,0,0.7)',
                padding: '12px 24px',
                borderRadius: '8px'
            }}>
                Loading 3D Model... {progress.toFixed(0)}%
            </div>
        </Html>
    )
}

// 3D Model component
function Model({ url }) {
    const { scene } = useGLTF(url)

    return (
        <primitive
            object={scene}
            scale={[2, 2, 2]}
            position={[0, 0, 0]}
        />
    )
}

// Main Three.js canvas component
function ThreeCanvas({ modelUrl }) {
    return (
        <Canvas
            camera={{
                position: [1.5, 1.5, 1.5],
                fov: 50,
                near: 0.01,
                far: 100
            }}
            style={{ width: '100%', height: '100%' }}
            gl={{ antialias: true, alpha: false }}
        >
            {/* Background color */}
            <color attach="background" args={['#0a0a0f']} />

            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight
                position={[5, 10, 5]}
                intensity={1}
                castShadow
            />
            <directionalLight
                position={[-5, 5, -5]}
                intensity={0.3}
            />

            {/* Environment map for realistic reflections */}
            <Environment preset="city" />

            {/* Grid helper */}
            <Grid
                args={[10, 10]}
                cellSize={0.1}
                cellThickness={0.5}
                cellColor="#2a2a3a"
                sectionSize={0.5}
                sectionThickness={1}
                sectionColor="#3a3a5a"
                fadeDistance={5}
                fadeStrength={1}
                position={[0, -0.01, 0]}
            />

            {/* 3D Model with loading suspense */}
            <Suspense fallback={<Loader />}>
                {modelUrl && <Model url={modelUrl} />}
            </Suspense>

            {/* Orbit controls for camera navigation */}
            <OrbitControls
                makeDefault
                enableDamping
                dampingFactor={0.05}
                minDistance={0.5}
                maxDistance={10}
                minPolarAngle={0.1}
                maxPolarAngle={Math.PI / 2 + 0.3}
            />
        </Canvas>
    )
}

export default ThreeCanvas
