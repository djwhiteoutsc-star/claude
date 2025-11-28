import { useState } from 'react';
import { Upload } from 'lucide-react';
import UploadPage from './pages/UploadPage';
import ProcessingPage from './pages/ProcessingPage';
import ResultsPage from './pages/ResultsPage';
import { VideoMetadata } from './services/api';

type AppState = 'upload' | 'processing' | 'results';

interface AppData {
  videoMetadata?: VideoMetadata;
  jobId?: string;
}

function App() {
  const [state, setState] = useState<AppState>('upload');
  const [data, setData] = useState<AppData>({});

  const handleUploadComplete = (metadata: VideoMetadata, jobId: string) => {
    setData({ videoMetadata: metadata, jobId });
    setState('processing');
  };

  const handleProcessingComplete = () => {
    setState('results');
  };

  const handleReset = () => {
    setData({});
    setState('upload');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-pink-500 to-red-600 rounded-lg">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                YouTube Shorts Generator
              </h1>
              <p className="text-sm text-gray-400">
                AI-powered video to shorts converter
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {state === 'upload' && (
          <UploadPage onComplete={handleUploadComplete} />
        )}

        {state === 'processing' && data.jobId && (
          <ProcessingPage
            jobId={data.jobId}
            onComplete={handleProcessingComplete}
          />
        )}

        {state === 'results' && data.jobId && (
          <ResultsPage jobId={data.jobId} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-400">
            Create engaging YouTube Shorts with AI-powered editing
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
