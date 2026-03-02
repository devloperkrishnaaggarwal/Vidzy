import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Download, RotateCcw, Zap, Film, CheckCircle, Clock, XCircle } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type ModelId = 'grok' | 'sora';
type GenState = 'idle' | 'creating' | 'polling' | 'done' | 'error';

interface Model {
    id: ModelId;
    name: string;
    tag: string;
    description: string;
    icon: string;
    gradient: string;
    border: string;
    apiModel: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MODELS: Model[] = [
    {
        id: 'grok',
        name: 'Grok Imagine',
        tag: 'Fast',
        description: 'Lightning-fast generations with vibrant, creative outputs.',
        icon: '⚡',
        gradient: 'from-purple-500/20 via-pink-500/10 to-transparent',
        border: 'border-purple-500/40',
        apiModel: 'grok-imagine/text-to-video',
    },
    {
        id: 'sora',
        name: 'Sora 2',
        tag: 'Premium',
        description: 'OpenAI\'s flagship model. Cinematic quality, stunning realism.',
        icon: '✨',
        gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
        border: 'border-cyan-500/40',
        apiModel: 'sora-2-text-to-video',
    },
];

const API_BASE = 'https://api.kie.ai/api/v1/jobs';
const POLL_INTERVAL = 5000; // 5 s
const API_KEY = import.meta.env.VITE_KIE_API_KEY ?? '';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildPayload(modelId: ModelId, prompt: string) {
    if (modelId === 'grok') {
        return {
            model: 'grok-imagine/text-to-video',
            input: {
                prompt,
                aspect_ratio: '16:9',
                mode: 'normal',
                duration: '6',
                resolution: '720p',
            },
        };
    }
    // sora
    return {
        model: 'sora-2-text-to-video',
        input: {
            prompt,
            aspect_ratio: 'landscape',
            n_frames: '10',
            remove_watermark: true,
            upload_method: 's3',
        },
    };
}

// ─── Component ────────────────────────────────────────────────────────────────

interface VideoGeneratorProps {
    onBack: () => void;
}

export function VideoGenerator({ onBack }: VideoGeneratorProps) {
    const [selectedModel, setSelectedModel] = useState<ModelId>('sora');
    const [prompt, setPrompt] = useState('');
    const [genState, setGenState] = useState<GenState>('idle');
    const [taskId, setTaskId] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [statusMsg, setStatusMsg] = useState('');
    const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── API helpers ──────────────────────────────────────────────────────────

    const createTask = async () => {
        if (!prompt.trim()) return;
        setGenState('creating');
        setErrorMsg('');
        setVideoUrl(null);
        setStatusMsg('Submitting your request…');

        try {
            const res = await fetch(`${API_BASE}/createTask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${API_KEY}`,
                },
                body: JSON.stringify(buildPayload(selectedModel, prompt)),
            });
            const json = await res.json();
            if (json.code !== 200) throw new Error(json.msg ?? 'Failed to create task');
            const id: string = json.data.taskId;
            setTaskId(id);
            setGenState('polling');
            setStatusMsg('Video is being generated… this may take a minute.');
            schedulePoll(id);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            setGenState('error');
            setErrorMsg(msg);
        }
    };

    const schedulePoll = (id: string) => {
        pollTimerRef.current = setTimeout(() => pollStatus(id), POLL_INTERVAL);
    };

    const pollStatus = async (id: string) => {
        try {
            const res = await fetch(`${API_BASE}/recordInfo?taskId=${id}`, {
                headers: { Authorization: `Bearer ${API_KEY}` },
            });
            const json = await res.json();
            if (json.code !== 200) throw new Error(json.msg ?? 'Polling failed');
            const { state, resultJson } = json.data as {
                state: 'waiting' | 'success' | 'fail';
                resultJson?: string;
                failMsg?: string;
            };

            if (state === 'success') {
                const result = JSON.parse(resultJson ?? '{}') as { resultUrls?: string[] };
                const url = result.resultUrls?.[0] ?? '';
                setVideoUrl(url);
                setGenState('done');
                setStatusMsg('');
            } else if (state === 'fail') {
                throw new Error(json.data.failMsg ?? 'Generation failed');
            } else {
                // still waiting – poll again
                schedulePoll(id);
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            setGenState('error');
            setErrorMsg(msg);
        }
    };

    const handleReset = () => {
        if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
        setGenState('idle');
        setTaskId(null);
        setVideoUrl(null);
        setErrorMsg('');
        setStatusMsg('');
        setPrompt('');
    };

    // ── Derived ──────────────────────────────────────────────────────────────

    const isLoading = genState === 'creating' || genState === 'polling';
    const activeModel = MODELS.find((m) => m.id === selectedModel)!;

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <section className="min-h-screen flex flex-col items-center px-4 pt-28 pb-16 relative overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-brand-cyan/10 rounded-full blur-[180px] -z-10 animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[180px] -z-10 animate-pulse-slow" style={{ animationDelay: '2s' }} />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-4xl"
            >
                {/* Back button */}
                <button
                    onClick={onBack}
                    className="mb-8 text-white/40 hover:text-white text-sm flex items-center gap-2 transition-colors group"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                    Back to Home
                </button>

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-brand-cyan text-sm font-medium mb-4">
                        <Film className="w-4 h-4" />
                        Video Studio
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">
                        Create your <span className="text-gradient">AI Video</span>
                    </h1>
                    <p className="text-white/50 text-lg">Choose a model, describe your vision, and let AI do the rest.</p>
                </div>

                {/* ── Step 1: Model Selection ── */}
                <div className="mb-8">
                    <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">1 — Choose a model</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {MODELS.map((model) => (
                            <motion.button
                                key={model.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => !isLoading && setSelectedModel(model.id)}
                                disabled={isLoading}
                                className={`relative p-5 rounded-2xl border text-left transition-all duration-300 overflow-hidden
                  ${selectedModel === model.id
                                        ? `${model.border} bg-gradient-to-br ${model.gradient} shadow-[0_0_30px_rgba(0,240,255,0.15)]`
                                        : 'border-white/10 bg-white/5 hover:border-white/20'
                                    }
                  ${isLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                            >
                                {/* selected ring */}
                                {selectedModel === model.id && (
                                    <motion.div
                                        layoutId="model-ring"
                                        className={`absolute inset-0 rounded-2xl border-2 ${model.border}`}
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}

                                <div className="flex items-start gap-3 relative z-10">
                                    <span className="text-3xl">{model.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-white text-base">{model.name}</span>
                                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                                                {model.tag}
                                            </span>
                                        </div>
                                        <p className="text-sm text-white/50 leading-relaxed">{model.description}</p>
                                    </div>
                                    {selectedModel === model.id && (
                                        <CheckCircle className="w-5 h-5 text-brand-cyan shrink-0 mt-0.5" />
                                    )}
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* ── Step 2: Prompt ── */}
                <div className="mb-8">
                    <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">2 — Describe your video</p>
                    <div className={`rounded-2xl border bg-white/5 backdrop-blur-xl transition-all duration-300
            ${isLoading ? 'border-white/10 opacity-75' : 'border-white/10 focus-within:border-brand-cyan/40 focus-within:shadow-[0_0_20px_rgba(0,240,255,0.1)]'}`}>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={isLoading}
                            rows={4}
                            placeholder={
                                selectedModel === 'grok'
                                    ? 'E.g. A futuristic city at night with neon lights reflecting off a rain-soaked street…'
                                    : 'E.g. A professor stands at the front of a lively classroom, enthusiastically giving a lecture…'
                            }
                            className="w-full bg-transparent outline-none text-white placeholder:text-white/25 text-base font-light p-5 resize-none"
                        />
                        <div className="px-5 pb-4 flex items-center justify-between">
                            <span className={`text-xs ${prompt.length > (selectedModel === 'sora' ? 9500 : 4900) ? 'text-red-400' : 'text-white/25'}`}>
                                {prompt.length} / {selectedModel === 'sora' ? '10,000' : '5,000'}
                            </span>
                            <Zap className="w-4 h-4 text-white/20" />
                        </div>
                    </div>
                </div>

                {/* ── Generate button ── */}
                <motion.button
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    onClick={createTask}
                    disabled={isLoading || !prompt.trim()}
                    className="w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3
            bg-gradient-to-r from-brand-cyan to-brand-purple text-white
            hover:shadow-[0_0_50px_rgba(0,240,255,0.4)] transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                    {isLoading ? (
                        <>
                            <Wand2 className="w-5 h-5 animate-spin" />
                            Generating…
                        </>
                    ) : (
                        <>
                            <Wand2 className="w-5 h-5" />
                            Generate Video with {activeModel.name}
                        </>
                    )}
                </motion.button>

                {/* ── Status / Progress ── */}
                <AnimatePresence>
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            className="mt-6 flex items-center gap-3 text-white/60 bg-white/5 border border-white/10 rounded-xl px-5 py-4"
                        >
                            <Clock className="w-4 h-4 text-brand-cyan animate-pulse shrink-0" />
                            <span className="text-sm">{statusMsg}</span>
                            {taskId && (
                                <span className="ml-auto text-xs text-white/25 font-mono truncate max-w-[120px]">{taskId}</span>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Error state ── */}
                <AnimatePresence>
                    {genState === 'error' && (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-6 flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4"
                        >
                            <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                                <p className="text-red-300 font-semibold text-sm mb-1">Generation failed</p>
                                <p className="text-red-400/70 text-xs break-words">{errorMsg || 'An unexpected error occurred. Please try again.'}</p>
                            </div>
                            <button
                                onClick={handleReset}
                                className="shrink-0 text-xs text-red-400 hover:text-white border border-red-500/30 rounded-lg px-3 py-1.5 transition-colors"
                            >
                                Retry
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Video result ── */}
                <AnimatePresence>
                    {genState === 'done' && videoUrl && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.97, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                            className="mt-10"
                        >
                            {/* Success badge */}
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                <span className="text-green-300 font-semibold text-sm">Video generated successfully!</span>
                            </div>

                            {/* Video player */}
                            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(0,240,255,0.1)] bg-black">
                                <video
                                    key={videoUrl}
                                    src={videoUrl}
                                    controls
                                    autoPlay
                                    loop
                                    muted
                                    className="w-full aspect-video object-contain"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mt-5">
                                <a
                                    href={videoUrl}
                                    download="vidzy-output.mp4"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-brand-cyan/40
                    text-brand-cyan font-semibold text-sm hover:bg-brand-cyan/10 transition-all duration-200"
                                >
                                    <Download className="w-4 h-4" />
                                    Download Video
                                </a>
                                <button
                                    onClick={handleReset}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10
                    text-white/60 font-semibold text-sm hover:border-white/20 hover:text-white transition-all duration-200"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Generate Another
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </section>
    );
}
