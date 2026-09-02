import React from 'react';
import { motion } from 'motion/react';
import { User } from 'lucide-react';
import { INVITATION_CONFIG } from '../config';

interface GuestsPageProps {
  isActive: boolean;
  onNext?: () => void;
}

export const GuestsPage: React.FC<GuestsPageProps> = ({ isActive }) => {
  const { guests } = INVITATION_CONFIG;

  return (
    <div className="relative w-full h-full flex flex-col justify-between py-10 px-5 sm:px-8 max-w-lg mx-auto select-none">
      
      {/* 1. Page Title */}
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
          特邀专家
        </h2>
      </motion.div>

      {/* 2. Guest Cards */}
      <div className="my-auto py-2 flex flex-col gap-4 sm:gap-5 w-full">
        {guests.map((guest, idx) => {
          const orgList = Array.isArray(guest.organization)
            ? guest.organization
            : [guest.organization];

          return (
            <motion.div
              key={guest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.55, delay: 0.15 + idx * 0.1, ease: 'easeOut' }}
              className="relative rounded-2xl overflow-hidden bg-white shadow-sm border border-[#F0F2F5]"
            >
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4A90E2] via-[#56C596] to-[#4A90E2]" />

              <div className="flex gap-4 sm:gap-5 p-5 sm:p-6">
                {/* 3:4 Portrait Avatar */}
                <div className="shrink-0">
                  {guest.avatarUrl ? (
                    <img
                      src={guest.avatarUrl}
                      alt={guest.name}
                      className="w-28 sm:w-32 aspect-[3/4] object-cover rounded-xl shadow-sm border border-white/60"
                    />
                  ) : (
                    <div
                      className="w-28 sm:w-32 aspect-[3/4] rounded-xl overflow-hidden shadow-sm border border-white/60 flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${guest.avatarBg || '#EBF7FF'} 0%, #FFFFFF 100%)`,
                      }}
                    >
                      <User className="w-10 h-10 sm:w-12 sm:h-12 text-[#9CA3AF]" />
                    </div>
                  )}
                </div>

                {/* Info Column */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    {/* Role Tag */}
                    <span className="inline-block text-xs font-semibold tracking-wider px-2.5 py-1 rounded-md bg-[#4A90E2]/10 text-[#4A90E2] mb-2">
                      {guest.roleLabel || '特邀嘉宾'}
                    </span>

                    {/* Name */}
                    <h3 className="text-lg sm:text-xl font-bold text-[#1F2933] tracking-tight">
                      {guest.name}
                    </h3>
                  </div>

                  {/* Organizations as stacked list */}
                  <div className="mt-2 space-y-1">
                    {orgList.map((line, i) => (
                      <p
                        key={i}
                        className="text-xs sm:text-[13px] text-[#4B5563] leading-relaxed flex items-start gap-1.5"
                      >
                        <span className="inline-block w-1 h-1 rounded-full bg-[#56C596] mt-1.5 shrink-0" />
                        <span>{line}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};
