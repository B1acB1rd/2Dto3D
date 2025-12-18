import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Grid, Html, useProgress } from '@react-three/drei'
import { Suspense, useEffect } from 'react'
import * as THREE from 'three'

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

// Error boundary for GLB loading
function ModelError() {
    return (
        <Html center>
            <div style={{
                color: '#ef4444',
                fontSize: '14px',
                background: 'rgba(0,0,0,0.7)',
                padding: '12px 24px',
                borderRadius: '8px'
            }}>
                Failed to load 3D model
            </div>
        </Html>
    )
}

// 3D Model component
function Model({ url }) {
    const { scene } = useGLTF(url, true)

    useEffect(() => {
        // Dispose of the model when component unmounts
        return () => {
            useGLTF.preload(url)
        }
    }, [url])

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
    // Don't render if no valid URL
    if (!modelUrl || modelUrl.includes('null')) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'var(--text-muted)'
            }}>
                <p>Waiting for model...</p>
            </div>
        )
    }

    return (
        <Canvas
            camera={{
                position: [1.5, 1.5, 1.5],
                fov: 50,
                near: 0.01,
                far: 100
            }}
            style={{ width: '100%', height: '100%' }}
            gl={{
                antialias: true,
                alpha: false,
                powerPreference: 'high-performance',
                // Handle context loss gracefully
                failIfMajorPerformanceCaveat: false
            }}
            onCreated={({ gl }) => {
                // Handle WebGL context loss
                gl.domElement.addEventListener('webglcontextlost', (e) => {
                    e.preventDefault()
                    console.warn('WebGL context lost')
                })
                gl.domElement.addEventListener('webglcontextrestored', () => {
                    console.log('WebGL context restored')
                })
            }}
        >
            {/* Background color */}
            <color attach="background" args={['#0a0a0f']} />

            {/* Lighting - no external HDRI needed */}
            <ambientLight intensity={0.6} />
            <directionalLight
                position={[5, 10, 5]}
                intensity={1.2}
                castShadow
            />
            <directionalLight
                position={[-5, 5, -5]}
                intensity={0.4}
            />
            <hemisphereLight
                color="#ffffff"
                groundColor="#444444"
                intensity={0.5}
            />

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
                <Model url={modelUrl} />
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
