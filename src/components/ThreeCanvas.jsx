import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, Grid, Html, useProgress, GizmoHelper, GizmoViewport } from '@react-three/drei'
import { Suspense, useEffect, useState, useRef } from 'react'
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

// 3D Model component
function Model({ url }) {
    const { scene } = useGLTF(url, true)

    useEffect(() => {
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

// Camera info display component
function CameraInfo({ onCameraUpdate }) {
    const { camera } = useThree()

    useFrame(() => {
        onCameraUpdate({
            x: camera.position.x.toFixed(2),
            y: camera.position.y.toFixed(2),
            z: camera.position.z.toFixed(2)
        })
    })

    return null
}

// Main Three.js canvas component
function ThreeCanvas({ modelUrl }) {
    const controlsRef = useRef()
    const [cameraPos, setCameraPos] = useState({ x: '1.50', y: '1.50', z: '1.50' })
    const [showGrid, setShowGrid] = useState(true)
    const [autoRotate, setAutoRotate] = useState(false)

    // View preset positions
    const viewPresets = {
        front: { position: [0, 1, 3], target: [0, 0, 0] },
        top: { position: [0, 3, 0.01], target: [0, 0, 0] },
        side: { position: [3, 1, 0], target: [0, 0, 0] },
        iso: { position: [2, 2, 2], target: [0, 0, 0] }
    }

    const setView = (preset) => {
        if (controlsRef.current) {
            const { position, target } = viewPresets[preset]
            controlsRef.current.object.position.set(...position)
            controlsRef.current.target.set(...target)
            controlsRef.current.update()
        }
    }

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
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* 3D Canvas */}
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
                    failIfMajorPerformanceCaveat: false
                }}
                onCreated={({ gl }) => {
                    gl.domElement.addEventListener('webglcontextlost', (e) => {
                        e.preventDefault()
                        console.warn('WebGL context lost')
                    })
                    gl.domElement.addEventListener('webglcontextrestored', () => {
                        console.log('WebGL context restored')
                    })
                }}
            >
                <color attach="background" args={['#0a0a0f']} />

                {/* Lighting */}
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
                <directionalLight position={[-5, 5, -5]} intensity={0.4} />
                <hemisphereLight color="#ffffff" groundColor="#444444" intensity={0.5} />

                {/* Grid helper (toggleable) */}
                {showGrid && (
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
                )}

                {/* Axes helper */}
                <axesHelper args={[1]} />

                {/* 3D Model */}
                <Suspense fallback={<Loader />}>
                    <Model url={modelUrl} />
                </Suspense>

                {/* Gizmo for orientation */}
                <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                    <GizmoViewport labelColor="white" axisHeadScale={1} />
                </GizmoHelper>

                {/* Camera info tracker */}
                <CameraInfo onCameraUpdate={setCameraPos} />

                {/* Orbit controls */}
                <OrbitControls
                    ref={controlsRef}
                    makeDefault
                    enableDamping
                    dampingFactor={0.05}
                    minDistance={0.5}
                    maxDistance={10}
                    minPolarAngle={0.1}
                    maxPolarAngle={Math.PI / 2 + 0.3}
                    autoRotate={autoRotate}
                    autoRotateSpeed={1}
                />
            </Canvas>

            {/* View Controls Overlay */}
            <div className="view-controls">
                {/* Camera Position Display */}
                <div className="camera-info">
                    <span>📍 X: {cameraPos.x}</span>
                    <span>Y: {cameraPos.y}</span>
                    <span>Z: {cameraPos.z}</span>
                </div>

                {/* View Preset Buttons */}
                <div className="view-presets">
                    <button onClick={() => setView('front')} title="Front View">Front</button>
                    <button onClick={() => setView('top')} title="Top View">Top</button>
                    <button onClick={() => setView('side')} title="Side View">Side</button>
                    <button onClick={() => setView('iso')} title="Isometric View">Iso</button>
                </div>

                {/* Toggle Buttons */}
                <div className="view-toggles">
                    <button
                        onClick={() => setShowGrid(!showGrid)}
                        className={showGrid ? 'active' : ''}
                        title="Toggle Grid"
                    >
                        Grid
                    </button>
                    <button
                        onClick={() => setAutoRotate(!autoRotate)}
                        className={autoRotate ? 'active' : ''}
                        title="Auto Rotate"
                    >
                        🔄 Rotate
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ThreeCanvas
