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
        {/* Lighter Bottom-Left Corner Accent (balance the visual weight) */}
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-[#E3F7EF]/40 to-transparent rounded-tr-full pointer-events-none" />

        {/* Large Soft Quote Watermark in the background */}
        <div className="absolute -top-6 -left-2 text-[120px] leading-none text-[#DFF4FF]/40 select-none pointer-events-none">
          “
        </div>
        <div className="absolute -bottom-10 -right-3 text-[110px] leading-none text-[#E3F7EF]/50 select-none pointer-events-none">
          ”
        </div>

        {/* Header: Quote Icon + Ornamental Rule */}
        <div className="relative flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4A90E2] to-[#56C596] flex items-center justify-center text-white shadow-md shadow-[#4A90E2]/25">
            <Quote className="w-5 h-5 fill-[#FFFFFF]/20" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-[#4A90E2]/30 via-[#56C596]/25 to-transparent" />
        </div>

        {/* Salutation */}
        <div className="text-base font-semibold text-[#1F2933] mb-4 flex items-center gap-1.5">
          <span className="w-1 h-4 rounded-full bg-gradient-to-b from-[#4A90E2] to-[#56C596]" />
          <span>尊敬的行业贵宾 / 合作伙伴：</span>
        </div>

        {/* Body Content (Line-height 1.9, Medium Grey, Justified) */}
        <p className="text-base sm:text-[17px] leading-[1.95] text-[#6B7280] text-justify tracking-wide indent-6">
          {invitationText}
        </p>

        {/* Signature with ornamental feather line */}
        <div className="mt-9 text-right">
          <p className="text-base font-semibold text-[#1F2933] mb-1.5">{theme.organizer}</p>
          <div className="flex items-center justify-center gap-2 w-full">
            <span className="w-14 h-[1px] rounded-full bg-gradient-to-r from-[#56C596]/0 to-[#56C596]/35" />
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#4A90E2]/70 to-[#56C596]/70" />
            <span className="w-14 h-[1px] rounded-full bg-gradient-to-l from-[#4A90E2]/0 to-[#4A90E2]/35" />
          </div>
        </div>
      </motion.div>

    </div>
  );
};
