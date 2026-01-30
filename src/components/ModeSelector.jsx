import { useState } from 'react'

/**
 * Mode selector component with 3 tabs:
 * - Automatic: Engine works alone
 * - AI-Assisted: Agent + Engine
 * - Manual: User editing
 */
function ModeSelector({ mode, setMode, disabled }) {
    const modes = [
        { id: 'automatic', label: 'Automatic', desc: 'Engine works alone' },
        { id: 'ai-assisted', label: 'AI-Assisted', desc: 'Agent helps improve' },
        { id: 'manual', label: 'Manual', desc: 'You edit directly' }
    ]

    return (
        <div className="mode-selector">
            <label className="mode-label">Conversion Mode</label>
            <div className="mode-tabs">
                {modes.map(m => (
                    <button
                        key={m.id}
                        className={`mode-tab ${mode === m.id ? 'active' : ''}`}
                        onClick={() => !disabled && setMode(m.id)}
                        disabled={disabled}
                        title={m.desc}
                    >

                        <span className="mode-name">{m.label}</span>
                    </button>
                ))}
            </div>
            <p className="mode-description">
                {modes.find(m => m.id === mode)?.desc}
            </p>
        </div>
    )
}

export default ModeSelector
