import React from 'react';

export const BackgroundEffect: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-gradient-to-b from-[#DFF4FF] via-[#E6F8F3] to-[#E3F7EF]">
      {/* 1. Subtle Fine Grid Pattern (opacity <= 8%) */}
      <div 
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(74, 144, 226, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(86, 197, 150, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />

      {/* 2. Soft Ambient Glowing Orbs / Particles */}
      <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-gradient-to-br from-[#4A90E2]/15 to-[#56C596]/10 blur-3xl animate-pulse-glow" />
      <div className="absolute top-1/3 -right-20 w-72 h-72 rounded-full bg-gradient-to-bl from-[#56C596]/15 to-[#4A90E2]/10 blur-3xl animate-float-slow" />
      <div className="absolute -bottom-20 left-1/4 w-96 h-96 rounded-full bg-gradient-to-t from-[#DFF4FF]/40 to-[#E3F7EF]/30 blur-2xl animate-float-delayed" />

      {/* 3. Floating Micro Particles (Low saturation) */}
      <div className="absolute top-[18%] left-[12%] w-1.5 h-1.5 rounded-full bg-[#4A90E2]/30 animate-float-slow" />
      <div className="absolute top-[45%] right-[15%] w-2 h-2 rounded-full bg-[#56C596]/35 animate-float-delayed" />
      <div className="absolute top-[72%] left-[22%] w-1.5 h-1.5 rounded-full bg-[#4A90E2]/25 animate-float-slow" />
      <div className="absolute top-[30%] right-[32%] w-1 h-1 rounded-full bg-[#56C596]/30 animate-float-delayed" />

      {/* 4. Hotel Architectural Silhouette Line Art at Bottom (opacity <= 12%) */}
      <div className="absolute bottom-0 left-0 right-0 h-44 opacity-[0.11] flex items-end justify-center pointer-events-none">
        <svg
          viewBox="0 0 1200 300"
          preserveAspectRatio="none"
          className="w-full h-full text-[#1F2933]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          {/* Base Ground Line */}
          <line x1="0" y1="290" x2="1200" y2="290" strokeWidth="1.5" />
          
          {/* Main Grand Hotel Tower & Wings Silhouette */}
          <path d="M100,290 L100,230 L160,230 L160,200 L220,200 L220,290" />
          <path d="M240,290 L240,160 L330,160 L330,290" />
          <path d="M350,290 L350,110 L480,110 L480,80 L520,50 L560,80 L560,110 L690,110 L690,290" />
          
          {/* Hotel Tower Grid Windows & Geometry */}
          <line x1="370" y1="130" x2="460" y2="130" strokeDasharray="3 3" />
          <line x1="370" y1="150" x2="460" y2="150" strokeDasharray="3 3" />
          <line x1="370" y1="170" x2="460" y2="170" strokeDasharray="3 3" />
          <line x1="370" y1="190" x2="460" y2="190" strokeDasharray="3 3" />
          <line x1="370" y1="210" x2="460" y2="210" strokeDasharray="3 3" />
          <line x1="370" y1="230" x2="460" y2="230" strokeDasharray="3 3" />
          <line x1="370" y1="250" x2="460" y2="250" strokeDasharray="3 3" />
          <line x1="370" y1="270" x2="460" y2="270" strokeDasharray="3 3" />

          {/* Central Spire & Hilton-like Grand Arch */}
          <path d="M520,50 L520,30" strokeWidth="2" />
          <line x1="575" y1="130" x2="665" y2="130" strokeDasharray="3 3" />
          <line x1="575" y1="150" x2="665" y2="150" strokeDasharray="3 3" />
          <line x1="575" y1="170" x2="665" y2="170" strokeDasharray="3 3" />
          <line x1="575" y1="190" x2="665" y2="190" strokeDasharray="3 3" />
          <line x1="575" y1="210" x2="665" y2="210" strokeDasharray="3 3" />
          <line x1="575" y1="230" x2="665" y2="230" strokeDasharray="3 3" />
          <line x1="575" y1="250" x2="665" y2="250" strokeDasharray="3 3" />
          <line x1="575" y1="270" x2="665" y2="270" strokeDasharray="3 3" />

          {/* Right Pavilion & Modern Conference Wings */}
          <path d="M710,290 L710,170 L800,170 L800,290" />
          <path d="M820,290 L820,210 L890,210 L890,190 L950,190 L950,290" />
          <path d="M970,290 L970,240 L1060,240 L1060,290" />
          
          {/* Canopy / Arch Entry */}
          <path d="M490,290 Q520,255 550,290" strokeWidth="1.5" />

          {/* Abstract AI Tech Waves / Data Rays */}
          <path d="M0,280 Q300,250 600,280 T1200,280" strokeWidth="0.75" strokeDasharray="4 4" />
        </svg>
      </div>
    </div>
  );
};
