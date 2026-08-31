import React from 'react';
import { motion } from 'motion/react';
import { User, Award, ArrowRight, Sparkles } from 'lucide-react';
import { INVITATION_CONFIG } from '../config';

interface GuestsPageProps {
  isActive: boolean;
  onNext?: () => void;
}

export const GuestsPage: React.FC<GuestsPageProps> = ({ isActive, onNext }) => {
  const { guests } = INVITATION_CONFIG;

  return (
    <div className="relative w-full h-full flex flex-col justify-between py-10 px-5 sm:px-8 max-w-lg mx-auto select-none">
      
      {/* 1. Page Title (Left aligned, Dark Grey Large) */}
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="pt-2"
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-[#56C596]" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[#4A90E2]">
            HONORABLE GUESTS
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2933] tracking-tight">
          特邀嘉宾
        </h2>
      </motion.div>

      {/* 2. Vertical Stack (4 Cards) */}
      <div className="my-auto py-2 flex flex-col gap-3 sm:gap-3.5 w-full">
        {guests.map((guest, idx) => {
          const isExpert = guest.roleType === 'expert';

          return (
            <motion.div
              key={guest.id}
              initial={{ opacity: 0, y: 15 }}
              animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 0.5, delay: 0.15 + idx * 0.08, ease: 'easeOut' }}
              className={`rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 flex items-center shadow-card-soft transition-all ${
                isExpert
                  ? 'bg-white border-2 border-[#56C596]/35'
                  : 'bg-white border border-[#F0F2F5]'
              }`}
            >
              <div className="flex items-center gap-4 min-w-0 w-full">
                {/* Enlarged Circular Avatar */}
                <div className="relative shrink-0">
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-2 border-white shadow-sm overflow-hidden"
                    style={{ backgroundColor: guest.avatarBg || '#EBF7FF' }}
                  >
                    <User className="w-8 h-8 sm:w-9 sm:h-9 text-[#9CA3AF]" />
                  </div>
                </div>

                {/* Guest Name & Organization */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-[#1F2933] tracking-tight">
                    {guest.name}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#4A90E2] font-semibold mt-1">
                    {guest.organization}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 3. Bottom Next Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ duration: 0.6, delay: 0.55 }}
        className="pb-4 flex justify-center"
      >
        <button
          id="guests-next-btn"
          onClick={onNext}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-[#DFF4FF] shadow-sm text-xs font-medium text-[#4A90E2] hover:bg-white hover:shadow transition-all active:scale-95"
        >
          <span>查看会议议程</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#56C596]" />
        </button>
      </motion.div>

    </div>
  );
};
