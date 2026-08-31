import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Clock } from 'lucide-react';
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
        backgroundImage:
          'url(https://telegraph-image-92x.pages.dev/file/57d6c56d418e5590a6f52-bc3eccd93fe3ce15c7.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* 半透明遮罩，保证内容可读性 */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px] pointer-events-none" />
      
      {/* 1. Top Spacer or Header */}
      <div className="w-full pt-4 relative z-10" />

      {/* 2. Middle Main Conference Theme & Time/Location */}
      <div className="my-auto py-4 flex flex-col items-center text-center relative z-10">
        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-2xl sm:text-[28px] font-extrabold text-[#1F2933] tracking-tight leading-snug max-w-sm mb-3"
        >
          {theme.title}
          <span className="block text-lg sm:text-[21px] font-bold text-[#1F2933]/90 mt-2">
            {theme.subTitle}
          </span>
        </motion.h1>

        {/* Meeting Time & Venue - Seamlessly blended with background */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-6 w-full max-w-sm bg-gradient-to-b from-white/55 to-white/25 backdrop-blur-xs rounded-2xl p-4 sm:p-5 text-left space-y-3 shadow-xs"
        >
          {/* Meeting Time */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/80 shadow-xs flex items-center justify-center text-[#4A90E2] shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[#6B7280] tracking-wider">
                会议时间
              </div>
              <div className="text-xs sm:text-[13.5px] font-semibold text-[#1F2933] mt-0.5">
                {theme.dateText}
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-[#4A90E2]/20 to-transparent" />

          {/* Meeting Venue */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/80 shadow-xs flex items-center justify-center text-[#56C596] shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[#6B7280] tracking-wider">
                会议地点
              </div>
              <div className="text-xs sm:text-[13.5px] font-semibold text-[#1F2933] mt-0.5">
                {theme.venueText}
                <span className="text-[#6B7280] font-normal ml-1 text-xs">
                  （{theme.venueDetail}）
                </span>
              </div>
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
        <div className="text-[13.5px] sm:text-[14.5px] text-[#4B5563]">
          主办：<span className="text-[#1F2933] font-semibold">{theme.organizer}</span>
        </div>
        <div className="text-[13.5px] sm:text-[14.5px] text-[#4B5563]">
          承办：<span className="text-[#1F2933] font-semibold">{theme.coOrganizer}</span>
        </div>
      </motion.div>

    </div>
  );
};
