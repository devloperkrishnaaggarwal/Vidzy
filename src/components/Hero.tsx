import { motion } from 'framer-motion';
import { Wand2 } from 'lucide-react';

interface HeroProps {
    onTryNow: () => void;
}

export function Hero({ onTryNow }: HeroProps) {
    const handleTryNow = (e: React.FormEvent) => {
        e.preventDefault();
        onTryNow();
    };

    return (
        <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-12 relative overflow-hidden">
            {/* Dark theme background lighting/glow effects */}
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-brand-cyan/20 rounded-full blur-[150px] -z-10 animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-purple/20 rounded-full blur-[150px] -z-10 animate-pulse-slow" style={{ animationDelay: '2s' }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center max-w-4xl mx-auto z-10"
            >


                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-2xl">
                    Turn your words into <br />
                    <span className="text-gradient">Stunning Videos</span>
                </h1>

                <p className="text-lg md:text-xl text-brand-cream/70 mb-12 max-w-2xl mx-auto font-light">
                    The fastest way to generate high-quality, engaging videos directly from text prompts. No login required for your first creation.
                </p>

                <motion.form
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    onSubmit={handleTryNow}
                    className="bg-brand-dark/50 backdrop-blur-xl border border-white/10 p-2 flex flex-col sm:flex-row items-center max-w-3xl mx-auto w-full group focus-within:ring-2 focus-within:ring-brand-cyan/50 focus-within:border-brand-cyan/40 transition-all rounded-[2rem] shadow-2xl"
                >
                    <div className="flex-1 w-full pl-6 pr-4 py-3 sm:py-0">
                        <input
                            type="text"
                            placeholder="Describe the video you want to create..."
                            className="w-full bg-transparent outline-none text-white placeholder:text-white/30 text-lg font-light"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full sm:w-auto bg-brand-cyan hover:bg-white text-brand-black px-8 py-4 rounded-[1.5rem] font-bold flex items-center justify-center gap-2 transition-all duration-300 m-1 glow-effect hover:shadow-[0_0_40px_rgba(0,240,255,0.6)]"
                    >
                        <Wand2 className="w-5 h-5" />
                        Try Now
                    </button>
                </motion.form>

                {/* Video Mockup Section */}
                <div className="mt-20 relative mx-auto max-w-4xl rounded-2xl overflow-hidden glass-card border-white/10 p-2 shadow-[0_0_50px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
                    <div className="aspect-video bg-black rounded-xl flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-brand-black via-transparent to-brand-purple/20 z-10" />
                        <div className="absolute inset-0 opacity-40 mix-blend-screen bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" />
                        <button
                            onClick={onTryNow}
                            className="z-20 w-20 h-20 bg-brand-cyan/10 backdrop-blur-xl border border-brand-cyan/30 rounded-full flex items-center justify-center hover:bg-brand-cyan/30 hover:scale-110 transition-all duration-300 group shadow-[0_0_30px_rgba(0,240,255,0.2)]"
                        >
                            <Wand2 className="w-8 h-8 text-brand-cyan group-hover:text-white transition-colors drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
