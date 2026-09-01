import React from 'react';
import { motion } from 'motion/react';
import { INVITATION_CONFIG } from '../config';

interface CoverPageProps {
  isActive: boolean;
}

export const CoverPage: React.FC<CoverPageProps> = ({ isActive }) => {
  const { theme } = INVITATION_CONFIG;

  return (
    <div
      className="relative w-full h-full flex flex-col justify-between py-12 px-6 sm:px-8 max-w-lg mx-auto select-none overflow-hidden"
      style={{
        backgroundImage: "url('/YaoQing/cover-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* 半透明遮罩，保证内容可读性 */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px] pointer-events-none" />
      
      {/* 1. Top - 邀请函艺术字 */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
        transition={{ duration: 0.8, delay: 0.05 }}
        className="w-full pt-6 sm:pt-8 relative z-10 text-center"
      >
        <div
          className="inline-block text-5xl sm:text-6xl font-semibold text-transparent bg-clip-text bg-gradient-to-br from-[#2B4C7E] via-[#4A6FA5] to-[#1F3A5F] tracking-[0.2em] drop-shadow-sm"
          style={{ fontFamily: "'Noto Serif SC', 'Source Han Serif SC', 'STSong', 'SimSun', serif" }}
        >
          邀请函
        </div>
        <div className="mt-1 h-px w-32 mx-auto bg-gradient-to-r from-transparent via-[#4A6FA5]/50 to-transparent" />
      </motion.div>

      {/* 2. Middle Main Conference Theme & Time/Location */}
      <div className="my-auto py-4 flex flex-col items-center text-center relative z-10">
        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-3xl sm:text-[38px] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-[#1A2942] to-[#374151] tracking-tight leading-snug max-w-sm mb-3"
        >
          {theme.title}
          <span className="block text-xl sm:text-[26px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#374151] to-[#4B5563] mt-2">
            {theme.subTitle}
          </span>
        </motion.h1>

        {/* Meeting Time & Venue - Seamlessly blended with background */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-6 w-full max-w-sm bg-gradient-to-b from-white/55 to-white/25 backdrop-blur-xs rounded-2xl p-5 sm:p-6 text-left space-y-4 shadow-xs"
        >
          {/* Meeting Time */}
          <div className="text-center">
            <div className="text-base font-semibold text-[#6B7280] tracking-wider">
              会议时间
            </div>
            <div className="text-base sm:text-[17px] font-semibold text-[#1F2933] mt-1">
              {theme.dateText}
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-[#4A90E2]/20 to-transparent" />

          {/* Meeting Venue */}
          <div className="text-center">
            <div className="text-base font-semibold text-[#6B7280] tracking-wider">
              会议地点
            </div>
            <div className="text-base sm:text-[17px] font-semibold text-[#1F2933] mt-1 leading-relaxed">
              <div>{theme.venueText}</div>
              <div className="mt-1">（{theme.venueDetail}）</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 3. Bottom Organizers - Enlarged Font Size */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ duration: 0.7, delay: 0.45 }}
        className="text-center pt-4 pb-6 space-y-1.5 border-t border-[#4A90E2]/15 relative z-10"
      >
        <div className="text-base sm:text-[17px] text-[#4B5563]">
          主办：<span className="text-[#1F2933] font-semibold">{theme.organizer}</span>
        </div>
        <div className="text-base sm:text-[17px] text-[#4B5563]">
          承办：<span className="text-[#1F2933] font-semibold">{theme.coOrganizer}</span>
        </div>
      </motion.div>

    </div>
  );
};
