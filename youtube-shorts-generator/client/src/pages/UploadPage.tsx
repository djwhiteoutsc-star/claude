import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Film, Settings, Sparkles } from 'lucide-react';
import { videoApi, VideoMetadata, GenerationPreferences } from '../services/api';

interface UploadPageProps {
  onComplete: (metadata: VideoMetadata, jobId: string) => void;
}

export default function UploadPage({ onComplete }: UploadPageProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preferences, setPreferences] = useState<GenerationPreferences>({
    numberOfShorts: 3,
    duration: 30,
    audioStyle: 'energetic',
    effectsIntensity: 'medium',
    includeHooks: true,
    includeCaptions: false,
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setProgress(10);

    try {
      // Upload video
      setProgress(30);
      const metadata = await videoApi.uploadVideo(file);

      setProgress(50);
      await videoApi.storeMetadata(metadata);

      // Generate shorts
      setProgress(70);
      const { jobId } = await videoApi.generateShorts(
        metadata.id,
        preferences,
        metadata
      );

      setProgress(100);

      // Move to processing page
      setTimeout(() => {
        onComplete(metadata, jobId);
      }, 500);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload video. Please try again.');
      setUploading(false);
      setProgress(0);
    }
  }, [preferences, onComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv']
    },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <div className="glass rounded-2xl p-8">
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
            transition-all duration-200
            ${isDragActive
              ? 'border-pink-500 bg-pink-500/10'
              : 'border-gray-600 hover:border-gray-500 bg-gray-800/30'
            }
            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center gap-4">
            <div className={`
              p-6 rounded-full bg-gradient-to-br transition-all
              ${isDragActive
                ? 'from-pink-500 to-red-500 scale-110'
                : 'from-gray-700 to-gray-800'
              }
            `}>
              {uploading ? (
                <Sparkles className="w-12 h-12 text-white animate-spin" />
              ) : (
                <Upload className="w-12 h-12 text-white" />
              )}
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {uploading
                  ? 'Uploading and processing...'
                  : isDragActive
                  ? 'Drop your video here'
                  : 'Upload your video'
                }
              </h3>
              <p className="text-gray-400">
                {uploading
                  ? `${progress}% complete`
                  : 'Drag & drop or click to browse (MP4, MOV, AVI, MKV)'
                }
              </p>
            </div>

            {uploading && (
              <div className="w-full max-w-md mt-4">
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-red-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="glass rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-pink-500" />
          <h2 className="text-xl font-semibold text-white">Generation Settings</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Number of Shorts */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Number of Shorts
            </label>
            <select
              value={preferences.numberOfShorts}
              onChange={(e) => setPreferences({
                ...preferences,
                numberOfShorts: parseInt(e.target.value)
              })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              disabled={uploading}
            >
              <option value={1}>1 Short</option>
              <option value={2}>2 Shorts</option>
              <option value={3}>3 Shorts</option>
              <option value={4}>4 Shorts</option>
              <option value={5}>5 Shorts</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Duration per Short
            </label>
            <select
              value={preferences.duration}
              onChange={(e) => setPreferences({
                ...preferences,
                duration: parseInt(e.target.value) as 15 | 30 | 60
              })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              disabled={uploading}
            >
              <option value={15}>15 seconds</option>
              <option value={30}>30 seconds</option>
              <option value={60}>60 seconds</option>
            </select>
          </div>

          {/* Audio Style */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Audio Style
            </label>
            <select
              value={preferences.audioStyle}
              onChange={(e) => setPreferences({
                ...preferences,
                audioStyle: e.target.value as any
              })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              disabled={uploading}
            >
              <option value="energetic">Energetic</option>
              <option value="upbeat">Upbeat</option>
              <option value="chill">Chill</option>
              <option value="dramatic">Dramatic</option>
              <option value="none">No Background Audio</option>
            </select>
          </div>

          {/* Effects Intensity */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Effects Intensity
            </label>
            <select
              value={preferences.effectsIntensity}
              onChange={(e) => setPreferences({
                ...preferences,
                effectsIntensity: e.target.value as 'low' | 'medium' | 'high'
              })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              disabled={uploading}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Toggles */}
        <div className="mt-6 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.includeHooks}
              onChange={(e) => setPreferences({
                ...preferences,
                includeHooks: e.target.checked
              })}
              className="w-5 h-5 rounded border-gray-600 text-pink-500 focus:ring-pink-500"
              disabled={uploading}
            />
            <span className="text-gray-300">Include catchy text hooks</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.includeCaptions}
              onChange={(e) => setPreferences({
                ...preferences,
                includeCaptions: e.target.checked
              })}
              className="w-5 h-5 rounded border-gray-600 text-pink-500 focus:ring-pink-500"
              disabled={uploading}
            />
            <span className="text-gray-300">Auto-generate captions</span>
          </label>
        </div>
      </div>

      {/* Features Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-xl p-6 text-center">
          <Film className="w-12 h-12 text-pink-500 mx-auto mb-3" />
          <h3 className="font-semibold text-white mb-2">AI Analysis</h3>
          <p className="text-sm text-gray-400">
            Automatically detects the best moments and highlights
          </p>
        </div>

        <div className="glass rounded-xl p-6 text-center">
          <Sparkles className="w-12 h-12 text-pink-500 mx-auto mb-3" />
          <h3 className="font-semibold text-white mb-2">Pro Effects</h3>
          <p className="text-sm text-gray-400">
            Trending audio, zooms, transitions, and filters
          </p>
        </div>

        <div className="glass rounded-xl p-6 text-center">
          <Upload className="w-12 h-12 text-pink-500 mx-auto mb-3" />
          <h3 className="font-semibold text-white mb-2">YouTube Ready</h3>
          <p className="text-sm text-gray-400">
            Perfect 9:16 format, optimized for engagement
          </p>
        </div>
      </div>
    </div>
  );
}
