import React from 'react';
import { motion } from 'motion/react';
import { MailOpen, Quote, Sparkles, Send } from 'lucide-react';
import { INVITATION_CONFIG } from '../config';

interface InvitationPageProps {
  isActive: boolean;
  onNext?: () => void;
}

export const InvitationPage: React.FC<InvitationPageProps> = ({ isActive, onNext }) => {
  const { invitationText, theme } = INVITATION_CONFIG;

  return (
    <div className="relative w-full h-full flex flex-col justify-between py-12 px-6 sm:px-8 max-w-lg mx-auto select-none">
      
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
            INVITATION LETTER
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2933] tracking-tight">
          诚挚邀请
        </h2>
      </motion.div>

      {/* 2. White Rounded Card (Soft Shadow, Line-height 1.8, Justified) */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={isActive ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
        className="my-auto bg-white rounded-2xl p-7 sm:p-8 shadow-card-soft border border-[#F0F2F5] relative overflow-hidden"
      >
        {/* Subtle Decorative Top-Right Corner Accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#DFF4FF]/50 via-[#E3F7EF]/30 to-transparent rounded-bl-full pointer-events-none" />
        
        {/* Quote Icon */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#DFF4FF] to-[#E3F7EF] flex items-center justify-center text-[#4A90E2] mb-5">
          <Quote className="w-5 h-5 text-[#4A90E2] fill-[#4A90E2]/15" />
        </div>

        {/* Salutation */}
        <div className="text-sm font-semibold text-[#1F2933] mb-3 flex items-center gap-1.5">
          <span>尊敬的行业贵宾 / 合作伙伴：</span>
        </div>

        {/* Body Content (Line-height 1.8, Medium Grey, Justified) */}
        <p className="text-[15px] sm:text-base leading-[1.85] text-[#6B7280] text-justify tracking-wide indent-6">
          {invitationText}
        </p>

        {/* Signature */}
        <div className="mt-8 text-right">
          <p className="text-xs font-semibold text-[#1F2933]">{theme.organizer}</p>
        </div>
      </motion.div>

      {/* 3. Bottom Next Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="pb-4 flex justify-center"
      >
        <button
          id="invitation-next-btn"
          onClick={onNext}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-[#DFF4FF] shadow-sm text-xs font-medium text-[#4A90E2] hover:bg-white hover:shadow transition-all active:scale-95"
        >
          <span>查看大会介绍</span>
          <Send className="w-3.5 h-3.5 text-[#56C596]" />
        </button>
      </motion.div>

    </div>
  );
};
