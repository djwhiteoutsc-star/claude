import { useState, useEffect } from 'react';
import { Loader2, Sparkles, Film, Wand2, CheckCircle2 } from 'lucide-react';
import { videoApi, Job } from '../services/api';

interface ProcessingPageProps {
  jobId: string;
  onComplete: () => void;
}

export default function ProcessingPage({ jobId, onComplete }: ProcessingPageProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const pollStatus = async () => {
      try {
        const jobData = await videoApi.getJobStatus(jobId);
        setJob(jobData);

        if (jobData.status === 'completed') {
          setTimeout(() => {
            onComplete();
          }, 1000);
        } else if (jobData.status === 'failed') {
          setError(jobData.error || 'Processing failed');
        }
      } catch (err: any) {
        setError(err.message);
      }
    };

    // Poll every 2 seconds
    pollStatus();
    const interval = setInterval(pollStatus, 2000);

    return () => clearInterval(interval);
  }, [jobId, onComplete]);

  const getStatusMessage = () => {
    if (!job) return 'Initializing...';

    switch (job.status) {
      case 'pending':
        return 'Preparing your video...';
      case 'analyzing':
        return 'AI is analyzing your video...';
      case 'generating':
        return 'Creating amazing shorts...';
      case 'completed':
        return 'All done! Redirecting...';
      case 'failed':
        return 'Processing failed';
      default:
        return 'Processing...';
    }
  };

  const getStatusIcon = () => {
    if (!job) return <Loader2 className="w-16 h-16 text-pink-500 animate-spin" />;

    switch (job.status) {
      case 'analyzing':
        return <Sparkles className="w-16 h-16 text-pink-500 animate-pulse" />;
      case 'generating':
        return <Wand2 className="w-16 h-16 text-pink-500 animate-pulse" />;
      case 'completed':
        return <CheckCircle2 className="w-16 h-16 text-green-500" />;
      default:
        return <Loader2 className="w-16 h-16 text-pink-500 animate-spin" />;
    }
  };

  if (error) {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-white mb-4">Processing Failed</h2>
        <p className="text-gray-400 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-medium hover:from-pink-600 hover:to-red-600 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Status Card */}
      <div className="glass rounded-2xl p-12 text-center">
        <div className="flex justify-center mb-6">
          {getStatusIcon()}
        </div>

        <h2 className="text-3xl font-bold text-white mb-4">
          {getStatusMessage()}
        </h2>

        <p className="text-gray-400 mb-8">
          This usually takes 1-3 minutes depending on your video length
        </p>

        {/* Progress Bar */}
        {job && (
          <div className="space-y-4">
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-red-500 transition-all duration-500 ease-out"
                style={{ width: `${job.progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">{job.progress}% complete</p>
          </div>
        )}
      </div>

      {/* Processing Steps */}
      <div className="glass rounded-2xl p-8">
        <h3 className="text-lg font-semibold text-white mb-6">
          What's happening now:
        </h3>

        <div className="space-y-4">
          <ProcessingStep
            icon={<Film className="w-5 h-5" />}
            title="Analyzing Video"
            description="AI is detecting the best moments and highlights"
            completed={job ? job.progress > 30 : false}
            active={job?.status === 'analyzing'}
          />

          <ProcessingStep
            icon={<Sparkles className="w-5 h-5" />}
            title="Generating Shorts"
            description="Creating multiple shorts with effects and audio"
            completed={job ? job.progress > 80 : false}
            active={job?.status === 'generating'}
          />

          <ProcessingStep
            icon={<Wand2 className="w-5 h-5" />}
            title="Finalizing"
            description="Adding hooks, effects, and optimizing for YouTube"
            completed={job?.status === 'completed'}
            active={job ? job.progress > 80 && job.status !== 'completed' : false}
          />
        </div>
      </div>

      {/* Fun Fact */}
      <div className="glass rounded-xl p-6 text-center">
        <p className="text-sm text-gray-400">
          💡 <span className="font-medium text-gray-300">Did you know?</span> YouTube Shorts
          get 30 billion views per day! Your content is about to reach a massive audience.
        </p>
      </div>
    </div>
  );
}

interface ProcessingStepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
}

function ProcessingStep({ icon, title, description, completed, active }: ProcessingStepProps) {
  return (
    <div className={`
      flex items-start gap-4 p-4 rounded-lg transition-all
      ${active ? 'bg-pink-500/10 border border-pink-500/30' : 'bg-gray-800/30'}
    `}>
      <div className={`
        p-2 rounded-lg flex-shrink-0
        ${completed ? 'bg-green-500/20 text-green-500' :
          active ? 'bg-pink-500/20 text-pink-500' :
          'bg-gray-700/50 text-gray-500'}
      `}>
        {completed ? <CheckCircle2 className="w-5 h-5" /> : icon}
      </div>

      <div className="flex-1">
        <h4 className={`font-medium mb-1 ${
          completed ? 'text-green-400' :
          active ? 'text-white' :
          'text-gray-400'
        }`}>
          {title}
        </h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      {active && (
        <Loader2 className="w-5 h-5 text-pink-500 animate-spin flex-shrink-0" />
      )}
    </div>
  );
}
