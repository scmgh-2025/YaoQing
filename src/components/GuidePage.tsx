import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Navigation, Copy, Check, ExternalLink, Calendar, Building, Sparkles, X, Info } from 'lucide-react';
import { INVITATION_CONFIG } from '../config';
import { openNav, isIOS, isWeChat, type MapApp, type NavTarget } from '../utils/navigator';

interface GuidePageProps {
  isActive: boolean;
  onGoToTop?: () => void;
  onOpenSharePoster?: () => void;
}

export const GuidePage: React.FC<GuidePageProps> = ({ isActive, onGoToTop, onOpenSharePoster }) => {
  const { theme } = INVITATION_CONFIG;
  const [copied, setCopied] = useState(false);
  const [showMapSelector, setShowMapSelector] = useState(false);

  // 导航目标（WGS-84 基准，由 navigator.ts 自动转坐标系）
  const navTarget: NavTarget = useMemo(() => ({
    name: theme.venueText || '贵阳东景希尔顿酒店',
    wgsLng: theme.longitude,
    wgsLat: theme.latitude,
    address: theme.address,
  }), [theme]);

  const handleCopyAddress = () => {
    const textToCopy = theme.venueText || '贵阳东景希尔顿酒店';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSelectMapApp = (app: MapApp) => {
    const { wechatBlocked } = openNav(app, navTarget);
    if (wechatBlocked) {
      // 微信环境不做跳转，仅关闭弹窗并展示引导（由弹窗内的 wechat-hint 负责）
      // 这里保持弹窗打开，让用户看到引导信息后手动处理
      return;
    }
    setShowMapSelector(false);
  };

  const handleCall = () => {
    window.location.href = `tel:${theme.contactPhoneTel}`;
  };

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
          <div className="w-2 h-2 rounded-full bg-[#56C596]" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[#4A90E2]">
            ATTENDANCE GUIDE
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2933] tracking-tight">
          参会指南
        </h2>
      </motion.div>

      {/* 2. Two White Rounded Cards */}
      <div className="my-auto py-2 space-y-3.5">
        
        {/* Card 1: Address Card (地址卡片) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="bg-white rounded-2xl p-5 shadow-card-soft border border-[#F0F2F5]"
        >
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#DFF4FF] to-[#E3F7EF] flex items-center justify-center text-[#4A90E2] shrink-0">
              <MapPin className="w-4 h-4 text-[#4A90E2]" />
            </div>
            <h3 className="text-sm font-bold text-[#1F2933]">
              参会地址
            </h3>
          </div>

          <p className="text-xs sm:text-[13px] leading-relaxed text-[#6B7280] mb-4">
            {theme.address}
          </p>

          <div className="flex items-center gap-2 pt-2 border-t border-[#F0F2F5]">
            <button
              onClick={() => setShowMapSelector(true)}
              className="flex-1 py-2 px-3 rounded-xl bg-[#DFF4FF]/60 hover:bg-[#DFF4FF] text-[#4A90E2] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-[#56C596]" />
              <span>一键导航</span>
            </button>
            <button
              onClick={handleCopyAddress}
              className="py-2 px-3.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#6B7280] text-xs font-medium flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#56C596]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '已复制' : '复制地址'}</span>
            </button>
          </div>
        </motion.div>

        {/* Card 2: Contact Card (联系卡片) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
          className="bg-white rounded-2xl p-5 shadow-card-soft border border-[#F0F2F5]"
        >
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#DFF4FF] to-[#E3F7EF] flex items-center justify-center text-[#56C596] shrink-0">
              <Phone className="w-4 h-4 text-[#56C596]" />
            </div>
            <h3 className="text-sm font-bold text-[#1F2933]">
              联系咨询
            </h3>
          </div>

          <div className="flex items-baseline justify-between mb-4">
            <span className="text-sm font-bold text-[#1F2933] tracking-wide">
              {theme.contactPhone}
            </span>
            <span className="text-xs text-[#6B7280]">
              （联系人：{theme.contactName}）
            </span>
          </div>

          <div className="pt-2 border-t border-[#F0F2F5]">
            <button
              onClick={handleCall}
              className="w-full py-2.5 px-3 rounded-xl bg-[#E3F7EF]/70 hover:bg-[#E3F7EF] text-[#2E7D5D] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-[#56C596]" />
              <span>拨打电话</span>
            </button>
          </div>
        </motion.div>

        {/* Meeting reminder note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="p-3 rounded-xl bg-white/60 border border-white text-center text-[11px] text-[#9CA3AF]"
        >
          <span>温馨提示：请参会嘉宾提前签到入场</span>
        </motion.div>
      </div>

      {/* 3. Bottom Actions: Return to Top / Share Poster */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ duration: 0.6, delay: 0.55 }}
        className="pb-4 pt-1 flex items-center justify-center gap-3 shrink-0"
      >
        <button
          id="guide-return-top-btn"
          onClick={onGoToTop}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80 border border-[#DFF4FF] shadow-sm text-xs font-medium text-[#6B7280] hover:bg-white transition-all active:scale-95 cursor-pointer"
        >
          <span>返回封面</span>
        </button>

        <button
          id="guide-share-poster-btn"
          onClick={onOpenSharePoster}
          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-gradient-to-r from-[#4A90E2] to-[#56C596] text-white shadow-sm text-xs font-semibold hover:opacity-90 transition-all active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>生成邀请海报</span>
        </button>
      </motion.div>

      {/* 4. Map Selector Modal (高德地图 / 百度地图 / 腾讯地图) */}
      <AnimatePresence>
        {showMapSelector && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMapSelector(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />

            {/* Modal Sheet */}
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-sm bg-white rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl z-10 border border-[#F0F2F5]"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#F0F2F5]">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-[#4A90E2]" />
                  <h4 className="text-sm font-bold text-[#1F2933]">选择导航地图</h4>
                </div>
                <button
                  onClick={() => setShowMapSelector(false)}
                  className="p-1 rounded-full text-[#9CA3AF] hover:text-[#1F2933] hover:bg-[#F8FAFC]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Destination Verification Card */}
              <div className="mt-3.5 p-3 rounded-xl bg-[#F8FAFC] border border-[#F0F2F5]">
                <div className="text-xs font-bold text-[#1F2933] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#56C596]" />
                  <span>目的地：{theme.venueText}</span>
                </div>
                <p className="text-[11px] text-[#6B7280] mt-1 pl-3">
                  {theme.address}
                </p>
              </div>

              {/* 微信环境引导提示（微信内置浏览器会拦截 URL Scheme） */}
              {isWeChat() && (
                <div className="mt-3 p-3 rounded-xl bg-[#FFF7E6] border border-[#FFD591] flex items-start gap-2">
                  <Info className="w-4 h-4 text-[#FA8C16] shrink-0 mt-0.5" />
                  <div className="text-[11.5px] leading-relaxed text-[#AD6800]">
                    当前在微信中打开，地图 App 唤起可能被拦截。
                    <br />
                    请点击右上角 <span className="font-bold">「⋯」</span> →
                    <span className="font-bold">「在浏览器中打开」</span> 后重试。
                  </div>
                </div>
              )}

              {/* Map Options List */}
              <div className="mt-3.5 space-y-2">
                {/* 1. 高德地图 */}
                <button
                  onClick={() => handleSelectMapApp('amap')}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-[#F0F2F5] hover:border-[#4A90E2]/40 hover:bg-[#DFF4FF]/30 transition-all active:scale-[0.98] group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0091FF]/10 text-[#0091FF] flex items-center justify-center font-bold text-xs">
                      高德
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-semibold text-[#1F2933] group-hover:text-[#4A90E2]">
                        高德地图
                      </div>
                      <div className="text-[10px] text-[#9CA3AF] mt-0.5">GCJ-02 · 自动唤起 App</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-[#4A90E2]" />
                </button>

                {/* 2. 百度地图 */}
                <button
                  onClick={() => handleSelectMapApp('baidu')}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-[#F0F2F5] hover:border-[#E1251B]/40 hover:bg-[#FFF5F5] transition-all active:scale-[0.98] group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#3385FF]/10 text-[#3385FF] flex items-center justify-center font-bold text-xs">
                      百度
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-semibold text-[#1F2933] group-hover:text-[#3385FF]">
                        百度地图
                      </div>
                      <div className="text-[10px] text-[#9CA3AF] mt-0.5">BD-09 · 自动唤起 App</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-[#3385FF]" />
                </button>

                {/* 3. 腾讯地图 */}
                <button
                  onClick={() => handleSelectMapApp('tencent')}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-[#F0F2F5] hover:border-[#56C596]/40 hover:bg-[#E3F7EF]/40 transition-all active:scale-[0.98] group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#56C596]/15 text-[#2E7D5D] flex items-center justify-center font-bold text-xs">
                      腾讯
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-semibold text-[#1F2933] group-hover:text-[#2E7D5D]">
                        腾讯地图
                      </div>
                      <div className="text-[10px] text-[#9CA3AF] mt-0.5">GCJ-02 · 自动唤起 App</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-[#2E7D5D]" />
                </button>

                {/* 4. 苹果地图（仅 iOS 显示） */}
                {isIOS() && (
                  <button
                    onClick={() => handleSelectMapApp('apple')}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-[#F0F2F5] hover:border-[#1F2933]/40 hover:bg-[#F1F5F9] transition-all active:scale-[0.98] group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#1F2933]/10 text-[#1F2933] flex items-center justify-center font-bold text-xs">
                        
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-semibold text-[#1F2933] group-hover:text-[#1F2933]">
                          苹果地图
                        </div>
                        <div className="text-[10px] text-[#9CA3AF] mt-0.5">WGS-84 · 系统自带</div>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-[#1F2933]" />
                  </button>
                )}
              </div>

              {/* Cancel Button */}
              <div className="mt-3.5">
                <button
                  onClick={() => setShowMapSelector(false)}
                  className="w-full py-2.5 rounded-xl bg-[#F8FAFC] text-xs font-medium text-[#6B7280] hover:bg-[#F1F5F9] transition-all"
                >
                  取消
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

