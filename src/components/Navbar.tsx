
interface NavbarProps {
    onTryNow: () => void;
}

export function Navbar({ onTryNow }: NavbarProps) {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-card px-6 py-4 flex items-center justify-between border-b border-brand-cyan/20">
            <div className="flex items-center gap-2">
                <span className="font-display font-bold text-2xl tracking-wider text-gradient drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]">
                    VIDZY
                </span>
            </div>
            <div className="flex gap-4">
                <button className="px-4 py-2 text-sm font-medium hover:text-white transition-all drop-shadow-[0_0_10px_rgba(255,255,255,0)] hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                    Features
                </button>
                <button
                    onClick={onTryNow}
                    className="px-6 py-2 bg-white text-brand-black font-bold rounded-full hover:bg-brand-cyan hover:text-black transition-all glow-effect hover:scale-105 active:scale-95 duration-200"
                >
                    Try Now
                </button>
            </div>
        </nav>
    );
}
