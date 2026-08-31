import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';
import { INVITATION_CONFIG } from '../config';
import conferenceBannerImg from '../assets/images/conference_banner_1788165737613.jpg';

interface IntroPageProps {
  isActive: boolean;
  onNext?: () => void;
}

export const IntroPage: React.FC<IntroPageProps> = ({ isActive, onNext }) => {
  const { introText, introBannerUrl } = INVITATION_CONFIG;

  return (
    <div className="relative w-full h-full flex flex-col justify-between py-10 px-6 sm:px-8 max-w-lg mx-auto select-none">
      
      {/* 1. Page Title (Left aligned, Dark Grey Large) */}
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="pt-2"
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-[#4A90E2]" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[#56C596]">
            ABOUT CONFERENCE
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2933] tracking-tight">
          大会介绍
        </h2>
      </motion.div>

      {/* 2. Content in White Rounded Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={isActive ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
        className="my-auto bg-white rounded-2xl p-5 sm:p-6 shadow-card-soft border border-[#F0F2F5] relative overflow-hidden"
      >
        {/* 16:9 Image Display Area */}
        <div className="w-full aspect-[16/9] rounded-xl overflow-hidden mb-4 relative bg-gradient-to-tr from-[#DFF4FF]/60 to-[#E3F7EF]/60 border border-[#E2E8F0]/80 shadow-xs group">
          <img
            src={introBannerUrl || conferenceBannerImg}
            alt="大会主题视觉"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Decorative Top subtle line */}
        <div className="w-10 h-1 rounded-full bg-gradient-to-r from-[#4A90E2] to-[#56C596] mb-3.5" />

        {/* Intro Body Text (Line-height 1.8, Medium Grey, Justified) */}
        <p className="text-[13.5px] sm:text-[14.5px] leading-[1.8] text-[#6B7280] text-justify tracking-wide">
          {introText}
        </p>
      </motion.div>

      {/* 3. Bottom Next Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="pb-3 flex justify-center"
      >
        <button
          id="intro-next-btn"
          onClick={onNext}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-[#DFF4FF] shadow-sm text-xs font-medium text-[#4A90E2] hover:bg-white hover:shadow transition-all active:scale-95"
        >
          <span>查看特邀嘉宾</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#56C596]" />
        </button>
      </motion.div>

    </div>
  );
};

