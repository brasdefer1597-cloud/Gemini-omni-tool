import React from 'react';

export const FractalOverlay = ({ type }: { type: 'header' | 'footer' }) => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {/* Digital Noise Grain */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
        </div>

        {/* Geometric Chaos Elements */}
        {type === 'header' ? (
            <>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-fuchsia-600/20 blur-[80px] rounded-full mix-blend-screen animate-pulse"></div>
                <div className="absolute -top-10 -left-10 w-48 h-48 bg-cyan-500/10 blur-[60px] rounded-full mix-blend-screen"></div>

                {/* Asymmetric Cyber Lines */}
                <div className="absolute top-0 left-[20%] w-[1px] h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent transform rotate-12"></div>
                <div className="absolute top-0 right-[15%] w-[1px] h-full bg-gradient-to-b from-transparent via-amber-500/20 to-transparent transform -rotate-12"></div>

                {/* SVG Geometry */}
                <svg className="absolute top-0 left-0 w-full h-full opacity-10" preserveAspectRatio="none">
                    <path d="M0,0 L100,0 L85,100 L0,100 Z" fill="url(#headerGrad)" />
                    <defs>
                        <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#020617" stopOpacity="0" />
                            <stop offset="50%" stopColor="#d946ef" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            </>
        ) : (
            <>
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-600/10 blur-[100px] rounded-full mix-blend-screen"></div>
                <div className="absolute bottom-0 right-0 w-full h-full opacity-[0.03]"
                     style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}>
                </div>
                 <svg className="absolute bottom-0 right-0 w-1/2 h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 L100 0 L100 100 Z" fill="url(#footerGrad)" />
                    <defs>
                        <linearGradient id="footerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0" />
                            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
                        </linearGradient>
                    </defs>
                </svg>
            </>
        )}
    </div>
);
