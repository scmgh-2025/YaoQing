import React from 'react';
import { motion } from 'motion/react';
import { Clock, UserCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { INVITATION_CONFIG } from '../config';

interface AgendaPageProps {
  isActive: boolean;
  onNext?: () => void;
}

export const AgendaPage: React.FC<AgendaPageProps> = ({ isActive, onNext }) => {
  const { agenda } = INVITATION_CONFIG;

  return (
    <div className="relative w-full h-full flex flex-col justify-between py-10 px-5 sm:px-8 max-w-lg mx-auto select-none">
      
      {/* 1. Page Title (Left aligned, Dark Grey Large) */}
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="pt-2 shrink-0"
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-[#4A90E2]" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[#56C596]">
            CONFERENCE AGENDA
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2933] tracking-tight">
          会议议程
        </h2>
      </motion.div>

      {/* 2. Timeline List in Scrollable Container */}
      <div
        className="my-auto py-2 max-h-[62vh] overflow-y-auto overscroll-contain touch-pan-y no-scrollbar pr-1 relative rounded-2xl border border-[#E2E8F0] bg-white/40"
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Continuous Left Timeline Line */}
        <div className="absolute top-4 bottom-4 left-[15px] w-[2px] bg-[#E2E8F0] z-0" />

        <div className="space-y-3.5 relative z-10">
          {agenda.map((item, idx) => {
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ duration: 0.5, delay: 0.15 + idx * 0.06, ease: 'easeOut' }}
                className="flex items-start gap-3.5"
              >
                {/* Solid Cyan/Mint Round Dot on Timeline */}
                <div className="w-[32px] flex items-center justify-center shrink-0 pt-3">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-[#4A90E2] to-[#56C596] ring-4 ring-white shadow-xs" />
                </div>

                {/* Right Side Agenda Card */}
                <div
                  className={`flex-1 rounded-xl p-3.5 sm:p-4 shadow-card-soft transition-all ${
                    item.isHighlight
                      ? 'bg-white border-l-4 border-l-[#4A90E2] border border-[#F0F2F5]'
                      : 'bg-white border border-[#F0F2F5]'
                  }`}
                >
                  {/* Top: Title & Duration Tag */}
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="text-[13.5px] sm:text-sm font-bold text-[#1F2933] leading-snug">
                      {item.title}
                    </h4>
                    {/* Duration Highlight Tag */}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#DFF4FF] text-[#4A90E2] text-[10px] font-semibold shrink-0 border border-[#4A90E2]/20">
                      <Clock className="w-2.5 h-2.5 text-[#56C596]" />
                      {item.duration}
                    </span>
                  </div>

                  {/* Speaker Details (Indented) */}
                  {item.speaker && (
                    <div className="pl-2 border-l-2 border-[#E3F7EF] mt-1.5 space-y-0.5">
                      <p className="text-xs text-[#4A90E2] font-medium">
                        {item.speaker}
                      </p>
                      {item.speakerTitle && (
                        <p className="text-[11px] text-[#6B7280] leading-tight">
                          {item.speakerTitle}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Sub-items (for Keynote / Launch sessions) */}
                  {item.subItems && item.subItems.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-[#F0F2F5] space-y-1.5">
                      {item.subItems.map((sub, sIdx) => (
                        <div
                          key={sIdx}
                          className="px-2.5 py-2 rounded-lg bg-[#F8FAFC] border border-[#F0F2F5]"
                        >
                          <div className="flex items-start justify-between gap-2 text-xs font-semibold text-[#1F2933]">
                            <span className="leading-snug">{sub.title}</span>
                            <span className="text-[10.5px] text-[#4A90E2] bg-[#DFF4FF] px-1.5 py-0.5 rounded shrink-0 font-medium">
                              {sub.duration}
                            </span>
                          </div>
                          {sub.speaker && (
                            <div className="text-[11px] text-[#6B7280] mt-1">
                              {sub.speaker}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
