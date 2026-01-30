import { useState, useEffect } from 'react'

/**
 * Shows real-time AI agent activity and edit history
 */
function AgentActivityPanel({ jobId, isRunning, onRunAgent, apiBase = '' }) {
    const [history, setHistory] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    // Fetch agent status
    useEffect(() => {
        if (!jobId) return

        const fetchStatus = async () => {
            try {
                const res = await fetch(`${apiBase}/api/agent/status/${jobId}`)
                if (res.ok) {
                    const data = await res.json()
                    setHistory(data.agent_history || [])
                }
            } catch (err) {
                console.error('Failed to fetch agent status:', err)
            }
        }

        fetchStatus()
        const interval = setInterval(fetchStatus, 2000)
        return () => clearInterval(interval)
    }, [jobId, isRunning])

    const handleRunAgent = async () => {
        if (!jobId || isLoading) return
        setIsLoading(true)

        try {
            await onRunAgent()
        } finally {
            setIsLoading(false)
        }
    }

    const getToolIcon = (tool) => {
        const icons = {
            'view_3d_map': '',
            'analyze_regions': '',
            'edit_height': '',
            'smooth_area': '',
            'flatten_region': '',
            'finish_editing': ''
        }
        return icons[tool] || ''
    }

    return (
        <div className="agent-panel">
            <div className="agent-header">
                <h4>AI Agent</h4>
                {jobId && (
                    <button
                        className="btn btn-small btn-secondary"
                        onClick={handleRunAgent}
                        disabled={isLoading || isRunning}
                    >
                        {isLoading || isRunning ? '⏳ Running...' : '▶️ Run Agent'}
                    </button>
                )}
            </div>

            <div className="agent-log">
                {history.length === 0 ? (
                    <p className="agent-empty">
                        {jobId
                            ? 'No agent activity yet. Click "Run Agent" to improve the map.'
                            : 'Upload an image first to use the AI agent.'}
                    </p>
                ) : (
                    <ul className="agent-history">
                        {history.map((edit, i) => (
                            <li key={i} className="agent-action fade-in">
                                <span className="action-icon">{getToolIcon(edit.tool)}</span>
                                <span className="action-text">
                                    <strong>{edit.tool.replace('_', ' ')}</strong>
                                    {edit.delta && <span> ({edit.delta > 0 ? '+' : ''}{edit.delta.toFixed(2)})</span>}
                                    {edit.target !== undefined && <span> (height: {edit.target})</span>}
                                    {edit.strength && <span> (strength: {edit.strength})</span>}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default AgentActivityPanel
