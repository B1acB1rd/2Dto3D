import { useRef, useCallback, useState } from 'react'

function ImageUploader({ onImageSelect, uploadedImage }) {
    const inputRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false)
    const [previewUrl, setPreviewUrl] = useState(null)

    // Handle file selection
    const handleFile = useCallback((file) => {
        if (file && file.type.startsWith('image/')) {
            onImageSelect(file)

            // Create preview URL
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }, [onImageSelect])

    // Click to open file dialog
    const handleClick = () => {
        inputRef.current?.click()
    }

    // Handle file input change
    const handleChange = (e) => {
        const file = e.target.files?.[0]
        if (file) handleFile(file)
    }

    // Drag and drop handlers
    const handleDragEnter = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        const file = e.dataTransfer.files?.[0]
        if (file) handleFile(file)
    }

    return (
        <div
            className={`upload-zone ${isDragging ? 'dragging' : ''} ${previewUrl ? 'has-image' : ''}`}
            onClick={handleClick}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                style={{ display: 'none' }}
            />

            {previewUrl ? (
                <>
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="preview-image"
                    />
                    <div className="preview-overlay">
                        <span style={{ color: 'white', fontSize: '14px' }}>Click to change image</span>
                    </div>
                </>
            ) : (
                <>
                    <div className="upload-icon">📤</div>
                    <h3>Drop your map image here</h3>
                    <p>or click to browse files</p>
                    <p style={{ marginTop: '8px', fontSize: '11px' }}>
                        Supports PNG, JPG, WebP
                    </p>
                </>
            )}
        </div>
    )
}

export default ImageUploader
