
export function Footer() {
    return (
        <footer className="py-8 px-6 border-t border-white/10 bg-brand-black text-center text-brand-cream/40 text-sm">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="font-display font-bold text-lg text-white/80 tracking-widest drop-shadow-md">
                    VIDZY
                </div>
                <p className="font-light">© {new Date().getFullYear()} Vidzy. All rights reserved.</p>
                <div className="flex gap-4 font-light">
                    <button className="hover:text-brand-cyan transition-colors">Terms of Service</button>
                    <button className="hover:text-brand-cyan transition-colors">Privacy Policy</button>
                </div>
            </div>
        </footer>
    );
}
