import { useState, useEffect } from 'react';
import { Download, RotateCcw, Play, ExternalLink, CheckCircle } from 'lucide-react';
import { videoApi, Job, Short } from '../services/api';

interface ResultsPageProps {
  jobId: string;
  onReset: () => void;
}

export default function ResultsPage({ jobId, onReset }: ResultsPageProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [downloading, setDownloading] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const jobData = await videoApi.getJobStatus(jobId);
        setJob(jobData);
      } catch (error) {
        console.error('Failed to fetch job:', error);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleDownload = async (short: Short) => {
    if (!short.downloadUrl) return;

    setDownloading(prev => new Set(prev).add(short.id));

    try {
      const url = videoApi.downloadShort(short.id);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${short.title.replace(/\s+/g, '_')}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(prev => {
        const next = new Set(prev);
        next.delete(short.id);
        return next;
      });
    }
  };

  const handleDownloadAll = () => {
    if (!job) return;

    job.shorts
      .filter(short => short.status === 'completed' && short.downloadUrl)
      .forEach(short => handleDownload(short));
  };

  if (!job) {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <div className="animate-spin text-4xl mb-4">⏳</div>
        <p className="text-gray-400">Loading results...</p>
      </div>
    );
  }

  const completedShorts = job.shorts.filter(s => s.status === 'completed');

  return (
    <div className="space-y-8">
      {/* Success Header */}
      <div className="glass rounded-2xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-3xl font-bold text-white mb-3">
          {completedShorts.length} Shorts Ready! 🎉
        </h2>

        <p className="text-gray-400 mb-6">
          Your YouTube Shorts have been generated and are ready to download
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={handleDownloadAll}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-medium hover:from-pink-600 hover:to-red-600 transition inline-flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download All Shorts
          </button>

          <button
            onClick={onReset}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition inline-flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Create More
          </button>
        </div>
      </div>

      {/* Shorts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {job.shorts.map((short, index) => (
          <ShortCard
            key={short.id}
            short={short}
            index={index + 1}
            onDownload={() => handleDownload(short)}
            downloading={downloading.has(short.id)}
          />
        ))}
      </div>

      {/* Tips Section */}
      <div className="glass rounded-2xl p-8">
        <h3 className="text-xl font-semibold text-white mb-4">
          📱 Tips for Uploading to YouTube Shorts
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TipItem
            title="Optimal Title"
            description="Keep it short (40-50 chars) and include trending keywords"
          />
          <TipItem
            title="Hashtags"
            description="Use #Shorts and 2-3 relevant hashtags in description"
          />
          <TipItem
            title="Best Time"
            description="Post during peak hours: 6-9 PM in your target timezone"
          />
          <TipItem
            title="Thumbnail"
            description="YouTube auto-generates, but you can customize for better CTR"
          />
        </div>
      </div>
    </div>
  );
}

interface ShortCardProps {
  short: Short;
  index: number;
  onDownload: () => void;
  downloading: boolean;
}

function ShortCard({ short, index, onDownload, downloading }: ShortCardProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="glass rounded-xl overflow-hidden group">
      {/* Thumbnail */}
      <div className="relative aspect-[9/16] bg-gray-800">
        {short.thumbnailUrl ? (
          <img
            src={short.thumbnailUrl}
            alt={short.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play className="w-16 h-16 text-gray-600" />
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={() => setShowPreview(true)}
            className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white font-medium hover:bg-white/30 transition inline-flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Preview
          </button>
        </div>

        {/* Duration Badge */}
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/80 rounded text-xs text-white font-medium">
          {Math.round(short.duration)}s
        </div>

        {/* Index Badge */}
        <div className="absolute top-2 left-2 w-8 h-8 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {index}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-white mb-1">{short.title}</h3>
          <p className="text-sm text-gray-400 line-clamp-2">{short.hook}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onDownload}
            disabled={downloading || short.status !== 'completed'}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg text-sm font-medium hover:from-pink-600 hover:to-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            {downloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download
              </>
            )}
          </button>

          {short.downloadUrl && (
            <a
              href={videoApi.downloadShort(short.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Status */}
        {short.status !== 'completed' && (
          <div className="text-xs text-gray-500 text-center">
            Status: {short.status}
          </div>
        )}
      </div>
    </div>
  );
}

interface TipItemProps {
  title: string;
  description: string;
}

function TipItem({ title, description }: TipItemProps) {
  return (
    <div className="flex gap-3">
      <div className="w-1.5 bg-gradient-to-b from-pink-500 to-red-500 rounded-full flex-shrink-0" />
      <div>
        <h4 className="font-medium text-white mb-1">{title}</h4>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
  );
}
