function ControlPanel({
    heightScale,
    setHeightScale,
    detailLevel,
    setDetailLevel,
    onConvert,
    onExport,
    canConvert,
    canExport,
    isConverting
}) {
    return (
        <div className="control-panel">
            {/* Height Scale */}
            <div className="control-group">
                <div className="control-label">
                    <span>Height Scale</span>
                    <span className="control-value">{heightScale.toFixed(1)}x</span>
                </div>
                <input
                    type="range"
                    className="slider"
                    min="0.1"
                    max="3.0"
                    step="0.1"
                    value={heightScale}
                    onChange={(e) => setHeightScale(parseFloat(e.target.value))}
                />
            </div>

            {/* Detail Level */}
            <div className="control-group">
                <div className="control-label">
                    <span>Detail Level</span>
                </div>
                <div className="select-wrapper">
                    <select
                        className="select"
                        value={detailLevel}
                        onChange={(e) => setDetailLevel(e.target.value)}
                    >
                        <option value="low">Low (Fast)</option>
                        <option value="medium">Medium (Balanced)</option>
                        <option value="high">High (Detailed)</option>
                    </select>
                    <span className="select-arrow">▼</span>
                </div>
            </div>

            {/* Convert Button */}
            <div className="control-group">
                <button
                    className="btn btn-primary"
                    onClick={onConvert}
                    disabled={!canConvert}
                >
                    {isConverting ? (
                        <>
                            <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}></span>
                            Converting...
                        </>
                    ) : (
                        <>
                            Convert to 3D
                        </>
                    )}
                </button>
            </div>

            {/* Export Button */}
            {canExport && (
                <div className="control-group fade-in">
                    <button
                        className="btn btn-secondary"
                        onClick={() => onExport('glb')}
                    >
                        📥 Download GLB Model
                    </button>
                </div>
            )}
        </div>
    )
}

export default ControlPanel
