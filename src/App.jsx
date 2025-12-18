import { useState, useCallback } from 'react'
import ImageUploader from './components/ImageUploader'
import ControlPanel from './components/ControlPanel'
import ThreeCanvas from './components/ThreeCanvas'
import ModeSelector from './components/ModeSelector'
import AgentActivityPanel from './components/AgentActivityPanel'
import ManualEditTools from './components/ManualEditTools'

// API base URL - uses proxy in dev, direct URL in production
const API_BASE = import.meta.env.DEV
    ? ''
    : 'https://tremick-b1acb1rd-2d-to-3d.hf.space'

function App() {
    // State management
    const [uploadedImage, setUploadedImage] = useState(null)
    const [modelUrl, setModelUrl] = useState(null)
    const [depthPreviewUrl, setDepthPreviewUrl] = useState(null)
    const [isConverting, setIsConverting] = useState(false)
    const [conversionProgress, setConversionProgress] = useState('')
    const [error, setError] = useState(null)
    const [modelStats, setModelStats] = useState(null)
    const [jobId, setJobId] = useState(null)

    // Conversion parameters
    const [heightScale, setHeightScale] = useState(1.0)
    const [detailLevel, setDetailLevel] = useState('medium')
    const [mode, setMode] = useState('automatic') // automatic | ai-assisted | manual

    // Handle image upload
    const handleImageSelect = useCallback((file) => {
        setUploadedImage(file)
        setModelUrl(null)
        setDepthPreviewUrl(null)
        setError(null)
        setModelStats(null)
        setJobId(null)
    }, [])

    // Handle conversion
    const handleConvert = useCallback(async () => {
        if (!uploadedImage) return

        setIsConverting(true)
        setError(null)
        setConversionProgress('Uploading image...')

        try {
            const formData = new FormData()
            formData.append('file', uploadedImage)
            formData.append('height_scale', heightScale.toString())
            formData.append('detail_level', detailLevel)
            formData.append('mode', mode)

            if (mode === 'ai-assisted') {
                setConversionProgress('AI Agent analyzing and improving map...')
            } else {
                setConversionProgress('Analyzing depth with AI...')
            }

            const response = await fetch(`${API_BASE}/api/convert`, {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.detail || 'Conversion failed')
            }

            setConversionProgress('Generating 3D mesh...')

            const result = await response.json()

            setJobId(result.job_id)
            // Only set model URL if it exists (null in manual mode initially)
            if (result.model_url) {
                setModelUrl(`${API_BASE}${result.model_url}`)
            }
            if (result.depth_preview_url) {
                setDepthPreviewUrl(`${API_BASE}${result.depth_preview_url}`)
            }
            setModelStats({
                ...result.metadata,
                mode: result.mode,
                agentEdits: result.agent_edits || 0
            })
            setConversionProgress('')

        } catch (err) {
            console.error('Conversion error:', err)
            setError(err.message || 'Failed to convert image')
        } finally {
            setIsConverting(false)
        }
    }, [uploadedImage, heightScale, detailLevel, mode])

    // Handle running AI agent on existing job
    const handleRunAgent = useCallback(async () => {
        if (!jobId) return

        setIsConverting(true)
        setConversionProgress('AI Agent improving the map...')

        try {
            const response = await fetch(`${API_BASE}/api/agent/run/${jobId}`, {
                method: 'POST'
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.detail || 'Agent failed')
            }

            const result = await response.json()

            // Update model URL with timestamp to force refresh
            if (result.model_url) {
                setModelUrl(`${API_BASE}${result.model_url}?t=${Date.now()}`)
            }
            if (result.depth_preview_url) {
                setDepthPreviewUrl(`${API_BASE}${result.depth_preview_url}?t=${Date.now()}`)
            }
            setModelStats(prev => ({
                ...prev,
                agentEdits: result.total_edits
            }))

        } catch (err) {
            console.error('Agent error:', err)
            setError(err.message || 'Agent failed')
        } finally {
            setIsConverting(false)
            setConversionProgress('')
        }
    }, [jobId])

    // Handle manual edit applied
    const handleEditApplied = useCallback((result) => {
        if (result.reset) {
            // Refresh after reset
            setDepthPreviewUrl(prev => prev?.split('?')[0] + `?t=${Date.now()}`)
            return
        }

        // Update model and depth preview
        if (result.model_url) {
            setModelUrl(`${API_BASE}${result.model_url}?t=${Date.now()}`)
        }
        if (result.depth_preview_url) {
            setDepthPreviewUrl(`${API_BASE}${result.depth_preview_url}?t=${Date.now()}`)
        }
    }, [])

    // Handle export
    const handleExport = useCallback((format) => {
        if (!modelUrl) return

        // Trigger download
        const link = document.createElement('a')
        link.href = modelUrl.split('?')[0] // Remove cache-bust
        link.download = `terrain_model.${format}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }, [modelUrl])

    return (
        <div className="app">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo">
                        <div className="logo-icon">🗺️</div>
                        <div className="logo-text">
                            <h1>Map to 3D</h1>
                            <p>AI-Powered Terrain Generator</p>
                        </div>
                    </div>
                </div>

                <div className="sidebar-content">
                    {/* Mode Selection */}
                    <ModeSelector
                        mode={mode}
                        setMode={setMode}
                        disabled={isConverting}
                    />

                    {/* Image Upload */}
                    <ImageUploader
                        onImageSelect={handleImageSelect}
                        uploadedImage={uploadedImage}
                    />

                    {/* Controls - only for automatic/ai-assisted initial convert */}
                    {mode !== 'manual' || !jobId ? (
                        <ControlPanel
                            heightScale={heightScale}
                            setHeightScale={setHeightScale}
                            detailLevel={detailLevel}
                            setDetailLevel={setDetailLevel}
                            onConvert={handleConvert}
                            onExport={handleExport}
                            canConvert={!!uploadedImage && !isConverting}
                            canExport={!!modelUrl}
                            isConverting={isConverting}
                        />
                    ) : null}

                    {/* AI-Assisted Mode: Agent Panel */}
                    {mode === 'ai-assisted' && (
                        <AgentActivityPanel
                            jobId={jobId}
                            isRunning={isConverting}
                            onRunAgent={handleRunAgent}
                            apiBase={API_BASE}
                        />
                    )}

                    {/* Manual Mode: Editing Tools */}
                    {mode === 'manual' && jobId && (
                        <ManualEditTools
                            jobId={jobId}
                            onEditApplied={handleEditApplied}
                            disabled={isConverting}
                            apiBase={API_BASE}
                        />
                    )}

                    {/* Manual mode: Convert first button */}
                    {mode === 'manual' && !jobId && uploadedImage && (
                        <div className="control-group">
                            <button
                                className="btn btn-primary"
                                onClick={handleConvert}
                                disabled={isConverting}
                            >
                                {isConverting ? '⏳ Processing...' : '🎯 Generate Base Map'}
                            </button>
                            <p className="helper-text">
                                Generate a base map first, then edit manually
                            </p>
                        </div>
                    )}

                    {/* Export button for manual mode */}
                    {mode === 'manual' && modelUrl && (
                        <div className="control-group">
                            <button
                                className="btn btn-secondary"
                                onClick={() => handleExport('glb')}
                            >
                                📥 Download GLB Model
                            </button>
                        </div>
                    )}

                    {/* Depth Preview */}
                    {depthPreviewUrl && (
                        <div className="depth-preview fade-in">
                            <h4>Depth Map</h4>
                            <img src={depthPreviewUrl} alt="Depth estimation" />
                        </div>
                    )}

                    {/* Error Display */}
                    {error && (
                        <div className="status-bar" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                            <div className="status-item">
                                <span className="status-dot error"></span>
                                <span style={{ color: 'var(--error)' }}>{error}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Status Bar */}
                <div className="status-bar">
                    <div className="status-item">
                        <span className="status-dot"></span>
                        <span>
                            {modelStats
                                ? `${modelStats.vertices?.toLocaleString()} vertices · ${modelStats.faces?.toLocaleString()} faces${modelStats.agentEdits ? ` · ${modelStats.agentEdits} AI edits` : ''}`
                                : `Mode: ${mode}`}
                        </span>
                    </div>
                </div>
            </aside>

            {/* 3D Canvas */}
            <main className="canvas-container">
                {isConverting && (
                    <div className="loading-overlay">
                        <div className="loading-spinner"></div>
                        <p className="loading-text">
                            {mode === 'ai-assisted' ? 'AI Agent Working...' : 'Converting to 3D...'}
                        </p>
                        <p className="loading-progress">{conversionProgress}</p>
                    </div>
                )}

                {!modelUrl && !isConverting && (
                    <div className="empty-state">
                        <div className="empty-icon">🌄</div>
                        <h2>No 3D Model Yet</h2>
                        <p>
                            {mode === 'automatic' && 'Upload an image and click Convert'}
                            {mode === 'ai-assisted' && 'Upload an image - AI will help improve the result'}
                            {mode === 'manual' && 'Upload an image, generate base map, then edit'}
                        </p>
                    </div>
                )}

                {modelUrl && (
                    <div className="canvas-wrapper fade-in">
                        <ThreeCanvas modelUrl={modelUrl} />
                    </div>
                )}
            </main>
        </div>
    )
}

export default App
