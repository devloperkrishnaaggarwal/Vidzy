import { Video, Zap, MousePointerClick, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: <Zap className="w-8 h-8 text-brand-cyan" />,
        title: "Instant Generation",
        description: "Powered by Kie.ai, Vidzy transforms words into videos in just seconds, ensuring rapid workflow and high-quality outputs."
    },
    {
        icon: <MousePointerClick className="w-8 h-8 text-brand-purple" />,
        title: "No Sign-up Required",
        description: "Start creating immediately. We've removed friction so you can focus entirely on your creative vision without roadblocks."
    },
    {
        icon: <Video className="w-8 h-8 text-brand-cyan" />,
        title: "Stunning Realism",
        description: "Benefit from state-of-the-art AI models that understand context, physics, and lighting to produce breathtaking video assets."
    },
    {
        icon: <Sparkles className="w-8 h-8 text-brand-purple" />,
        title: "Limitless Styles",
        description: "From cinematic realism to 3D animation, simply describe the style you want, and Vidzy brings it to life flawlessly."
    }
];

export function Features() {
    return (
        <section className="py-24 px-4 relative z-10 w-full bg-brand-black border-t border-white/5 overflow-hidden">
            {/* Ambient lighting */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-cyan/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-brand-purple/10 rounded-full blur-[120px] -z-10" />

            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Why choose <span className="text-gradient">Vidzy?</span>
                    </h2>
                    <p className="text-brand-cream/60 max-w-2xl mx-auto text-lg font-light">
                        Our platform is designed for simplicity, speed, and uncompromising quality.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            key={idx}
                            className="glass-card p-8 flex flex-col items-start rounded-2xl hover:-translate-y-2 transition-all duration-300 group hover:border-brand-cyan/30 hover:shadow-[0_0_30px_rgba(0,240,255,0.15)] relative overflow-hidden"
                        >
                            {/* Card inner glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

                            <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 px-1 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300 shadow-lg">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4 font-display text-white">{feature.title}</h3>
                            <p className="text-brand-cream/70 leading-relaxed font-sans font-light">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
