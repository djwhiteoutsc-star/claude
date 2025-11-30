import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [processedImageUrl, setProcessedImageUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [upscaleFactor, setUpscaleFactor] = useState(2);
  const [removeBackground, setRemoveBackground] = useState(true);
  const [outputFormat, setOutputFormat] = useState('png');
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError(null);
      setProcessedImageUrl(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setError('Please select a valid image file');
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = () => {
    fileInputRef.current.click();
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProgress(0);

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('upscaleFactor', upscaleFactor);
    formData.append('removeBackground', removeBackground);
    formData.append('format', outputFormat);

    try {
      const response = await axios.post(`${API_URL}/api/process-image`, formData, {
        responseType: 'blob',
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 50) / progressEvent.total);
          setProgress(percentCompleted);
        },
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = 50 + Math.round((progressEvent.loaded * 50) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });

      // Create URL for the processed image
      const imageBlob = new Blob([response.data], { type: `image/${outputFormat}` });
      const imageUrl = URL.createObjectURL(imageBlob);
      setProcessedImageUrl(imageUrl);
      setProgress(100);
    } catch (err) {
      console.error('Error processing image:', err);
      setError(err.response?.data?.message || 'Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (processedImageUrl) {
      const link = document.createElement('a');
      link.href = processedImageUrl;
      link.download = `upscaled-${Date.now()}.${outputFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setProcessedImageUrl(null);
    setError(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>🖼️ Image Upscaler & Background Remover</h1>
        <p>Upload images, upscale them, remove backgrounds, and make them print-ready</p>
      </header>

      <main className="main-content">
        <div className="container">
          {/* Upload Section */}
          <div className="section">
            <h2>1. Upload Image</h2>
            <div
              className={`upload-area ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleUpload}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              {previewUrl ? (
                <div className="preview-container">
                  <img src={previewUrl} alt="Preview" className="preview-image" />
                  <p className="file-name">{selectedFile?.name}</p>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <div className="upload-icon">📁</div>
                  <p>Drag & drop an image here or click to browse</p>
                  <span className="upload-hint">Supports: JPG, PNG, WEBP, TIFF</span>
                </div>
              )}
            </div>
          </div>

          {/* Settings Section */}
          {selectedFile && (
            <div className="section">
              <h2>2. Configure Settings</h2>
              <div className="settings">
                <div className="setting-group">
                  <label htmlFor="upscale-factor">
                    Upscale Factor: <strong>{upscaleFactor}x</strong>
                  </label>
                  <input
                    id="upscale-factor"
                    type="range"
                    min="1"
                    max="4"
                    step="0.5"
                    value={upscaleFactor}
                    onChange={(e) => setUpscaleFactor(parseFloat(e.target.value))}
                    className="slider"
                  />
                  <span className="slider-hint">Higher values = larger output</span>
                </div>

                <div className="setting-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={removeBackground}
                      onChange={(e) => setRemoveBackground(e.target.checked)}
                    />
                    Remove Background
                  </label>
                </div>

                <div className="setting-group">
                  <label htmlFor="format">Output Format:</label>
                  <select
                    id="format"
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    className="select"
                  >
                    <option value="png">PNG (Best for transparency)</option>
                    <option value="jpg">JPG (Smaller file size)</option>
                    <option value="tiff">TIFF (Best for print)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Process Button */}
          {selectedFile && (
            <div className="section">
              <button
                onClick={handleProcess}
                disabled={isProcessing}
                className="btn btn-primary btn-large"
              >
                {isProcessing ? `Processing... ${progress}%` : '🚀 Process Image'}
              </button>
            </div>
          )}

          {/* Progress Bar */}
          {isProcessing && (
            <div className="section">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="section">
              <div className="error-message">
                <span>⚠️</span> {error}
              </div>
            </div>
          )}

          {/* Result Section */}
          {processedImageUrl && (
            <div className="section">
              <h2>3. Download Result</h2>
              <div className="result-container">
                <div className="comparison">
                  <div className="image-box">
                    <h3>Original</h3>
                    <img src={previewUrl} alt="Original" className="result-image" />
                  </div>
                  <div className="image-box">
                    <h3>Processed ({upscaleFactor}x)</h3>
                    <img src={processedImageUrl} alt="Processed" className="result-image" />
                  </div>
                </div>
                <div className="result-actions">
                  <button onClick={handleDownload} className="btn btn-success btn-large">
                    ⬇️ Download Processed Image
                  </button>
                  <button onClick={handleReset} className="btn btn-secondary">
                    🔄 Process Another Image
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>Made with ❤️ | Print-ready at 300 DPI | Supports up to 4x upscaling</p>
      </footer>
    </div>
  );
}

export default App;
