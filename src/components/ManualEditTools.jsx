import { useState } from 'react'

/**
 * Manual editing tools: Paint, Smooth, Flatten
 */
function ManualEditTools({ jobId, onEditApplied, disabled, apiBase = '' }) {
    const [activeTool, setActiveTool] = useState('paint')
    const [brushSize, setBrushSize] = useState(10)
    const [intensity, setIntensity] = useState(0.1)
    const [isApplying, setIsApplying] = useState(false)

    // Region selection (percent-based)
    const [region, setRegion] = useState({ x: 40, y: 40, width: 20, height: 20 })

    const tools = [
        { id: 'paint', icon: '🎨', label: 'Paint Height', desc: 'Raise or lower terrain' },
        { id: 'smooth', icon: '🔧', label: 'Smooth', desc: 'Smooth rough areas' },
        { id: 'flatten', icon: '📐', label: 'Flatten', desc: 'Make area flat' }
    ]

    const applyEdit = async () => {
        if (!jobId || isApplying) return
        setIsApplying(true)

        try {
            const edit = {
                type: activeTool,
                x: region.x,
                y: region.y,
                width: region.width,
                height: region.height,
                value: activeTool === 'smooth' ? intensity :
                    activeTool === 'flatten' ? 0.0 :
                        intensity
            }

            const res = await fetch(`${apiBase}/api/manual/edit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    job_id: jobId,
                    edits: [edit]
                })
            })

            if (res.ok) {
                const data = await res.json()
                onEditApplied?.(data)
            }
        } catch (err) {
            console.error('Edit failed:', err)
        } finally {
            setIsApplying(false)
        }
    }

    const resetEdits = async () => {
        if (!jobId) return

        try {
            const res = await fetch(`${apiBase}/api/manual/reset/${jobId}`, { method: 'POST' })
            if (res.ok) {
                onEditApplied?.({ reset: true })
            }
        } catch (err) {
            console.error('Reset failed:', err)
        }
    }

    return (
        <div className="manual-tools">
            <h4>✏️ Editing Tools</h4>

            {/* Tool Selection */}
            <div className="tool-buttons">
                {tools.map(tool => (
                    <button
                        key={tool.id}
                        className={`tool-btn ${activeTool === tool.id ? 'active' : ''}`}
                        onClick={() => setActiveTool(tool.id)}
                        disabled={disabled}
                        title={tool.desc}
                    >
                        <span>{tool.icon}</span>
                        <span>{tool.label}</span>
                    </button>
                ))}
            </div>

            {/* Region Selection */}
            <div className="control-group">
                <label className="control-label">
                    <span>Region X</span>
                    <span className="control-value">{region.x}%</span>
                </label>
                <input
                    type="range"
                    className="slider"
                    min="0" max="80" step="5"
                    value={region.x}
                    onChange={(e) => setRegion(r => ({ ...r, x: parseInt(e.target.value) }))}
                    disabled={disabled}
                />
            </div>

            <div className="control-group">
                <label className="control-label">
                    <span>Region Y</span>
                    <span className="control-value">{region.y}%</span>
                </label>
                <input
                    type="range"
                    className="slider"
                    min="0" max="80" step="5"
                    value={region.y}
                    onChange={(e) => setRegion(r => ({ ...r, y: parseInt(e.target.value) }))}
                    disabled={disabled}
                />
            </div>

            <div className="control-group">
                <label className="control-label">
                    <span>Region Size</span>
                    <span className="control-value">{region.width}%</span>
                </label>
                <input
                    type="range"
                    className="slider"
                    min="5" max="50" step="5"
                    value={region.width}
                    onChange={(e) => {
                        const val = parseInt(e.target.value)
                        setRegion(r => ({ ...r, width: val, height: val }))
                    }}
                    disabled={disabled}
                />
            </div>

            {/* Intensity */}
            {activeTool !== 'flatten' && (
                <div className="control-group">
                    <label className="control-label">
                        <span>{activeTool === 'paint' ? 'Height Change' : 'Strength'}</span>
                        <span className="control-value">
                            {activeTool === 'paint' ? (intensity > 0 ? '+' : '') + intensity.toFixed(2) : intensity.toFixed(2)}
                        </span>
                    </label>
                    <input
                        type="range"
                        className="slider"
                        min={activeTool === 'paint' ? '-0.5' : '0.1'}
                        max={activeTool === 'paint' ? '0.5' : '1.0'}
                        step="0.05"
                        value={intensity}
                        onChange={(e) => setIntensity(parseFloat(e.target.value))}
                        disabled={disabled}
                    />
                </div>
            )}

            {/* Action Buttons */}
            <div className="tool-actions">
                <button
                    className="btn btn-primary"
                    onClick={applyEdit}
                    disabled={disabled || isApplying || !jobId}
                >
                    {isApplying ? '⏳ Applying...' : '✓ Apply Edit'}
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={resetEdits}
                    disabled={disabled || !jobId}
                >
                    ↺ Reset All
                </button>
            </div>
        </div>
    )
}

export default ManualEditTools
