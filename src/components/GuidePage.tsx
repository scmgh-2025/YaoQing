import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Navigation, Copy, Check, ExternalLink, Sparkles, X } from 'lucide-react';
import { INVITATION_CONFIG } from '../config';

/** 导航目的地（GCJ-02 坐标系），百度侧通过 coord_type=gcj02 声明，由其自动转为 BD-09 */
const VENUE = {
  name: '贵阳东景希尔顿酒店',
  address: '贵州省贵阳市观山湖区金阳北路277号',
  gcjLat: 26.650689,
  gcjLng: 106.622409,
};

type MapApp = 'amap' | 'baidu' | 'tencent';

/** 三款地图渠道：先尝试原生 URL Scheme 唤起已安装 App，失败后轮询降级到 H5 网页链接 */
const MAPS: Record<
  MapApp,
  {
    label: string;
    short: string;
    accent: string;
    scheme: string;
    web: string;
  }
> = (() => {
  const { name, address, gcjLat, gcjLng } = VENUE;
  const encName = encodeURIComponent(name);
  return {
    amap: {
      label: '高德地图',
      short: '高德',
      accent: '#0091FF',
      // 高德默认 GCJ-02
      scheme: `androidamap://navi?sourceApplication=conference&poiname=${encName}&lat=${gcjLat}&lon=${gcjLng}&dev=0&style=2`,
      web: `https://uri.amap.com/navigation?to=${gcjLng},${gcjLat},${encName}&toName=${encName}&mode=car&coordinate=gaode&callnative=1`,
    },
    tencent: {
      label: '腾讯地图',
      short: '腾讯',
      accent: '#2E7D5D',
      // 腾讯默认 GCJ-02，tocoord 顺序为 lat,lng
      scheme: `qqmap://map/routeplan?type=drive&from=&fromcoord=&to=${encName}&tocoord=${gcjLat},${gcjLng}&referer=conference`,
      web: `https://apis.map.qq.com/uri/v1/routeplan?type=drive&to=${encName}&tocoord=${gcjLat},${gcjLng}&referer=conference`,
    },
    baidu: {
      label: '百度地图',
      short: '百度',
      accent: '#3385FF',
      // 按平台拆分 Scheme：iOS 用 map/navi，Android 用 bdapp://map/direction 经典格式
      scheme: buildBaiduScheme(encName, gcjLat, gcjLng),
      // marker 免 key 单点页：渲染红标+名称的定位页，页面内自带「到这儿去/导航」唤起按钮；
      // 若接口失效（跳回首页），页面上已有「复制地址」按钮可引导用户复制到百度搜索兜底
      web: `https://api.map.baidu.com/marker?location=${gcjLat},${gcjLng}&title=${encName}&content=${encodeURIComponent(address)}&output=html&coord_type=gcj02&src=conference`,
    },
  };
})();

/** 百度地图 Scheme 按平台区分：iOS 用 map/navi，Android 用 bdapp://map/direction */
function buildBaiduScheme(encName: string, lat: number, lng: number): string {
  const isIOS =
    typeof navigator !== 'undefined' && /iP(hone|od|ad)/i.test(navigator.userAgent);
  if (isIOS) {
    return `baidumap://map/navi?location=${lat},${lng}&title=${encName}&coord_type=gcj02&src=conference`;
  }
  // Android / 桌面默认：经典顺向格式，目的地坐标优先、名称辅助
  return `bdapp://map/direction?destination=name:${encName}|latlng:${lat},${lng}&coord_type=gcj02&mode=driving&src=conference`;
}

interface GuidePageProps {
  isActive: boolean;
  onGoToTop?: () => void;
  onOpenSharePoster?: () => void;
}

export const GuidePage: React.FC<GuidePageProps> = ({ isActive, onGoToTop, onOpenSharePoster }) => {
  const { theme } = INVITATION_CONFIG;
  const [copied, setCopied] = useState(false);
  const [showMapSelector, setShowMapSelector] = useState(false);
  const [launchingMap, setLaunchingMap] = useState<{ label: string } | null>(null);

  const handleCopyAddress = () => {
    const textToCopy = theme.venueText || '贵阳东景希尔顿酒店';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      // Fallback
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

  const launchMap = (app: MapApp) => {
    const map = MAPS[app];
    setShowMapSelector(false);
    setLaunchingMap({ label: map.label });

    let finished = false;
    const cleanup = () => {
      window.clearTimeout(timer);
      window.removeEventListener('pagehide', onHide);
      window.removeEventListener('blur', onHide);
      document.removeEventListener('visibilitychange', onVisible);
      setLaunchingMap(null);
    };
    const done = () => {
      if (!finished) {
        finished = true;
        cleanup();
      }
    };
    const onHide = () => done();
    const onVisible = () => {
      if (document.hidden) done();
    };

    // 先尝试原生 Scheme 唤起已安装的地图 App
    window.addEventListener('pagehide', onHide);
    window.addEventListener('blur', onHide);
    document.addEventListener('visibilitychange', onVisible);

    // iOS 上若页面转入后台(隐藏)则说明 App 成功唤起；用 iframe 兼容阻止部分环境
    const schemeFrame = document.createElement('iframe');
    schemeFrame.style.display = 'none';
    schemeFrame.src = map.scheme;
    document.body.appendChild(schemeFrame);
    setTimeout(() => schemeFrame.remove(), 800);

    // 1.8s 内未唤起（未安装或微信拦截）即降级为官方 H5 页面（其亦会尝试唤起 App）
    const timer = window.setTimeout(() => {
      if (!finished) {
        finished = true;
        window.removeEventListener('pagehide', onHide);
        window.removeEventListener('blur', onHide);
        document.removeEventListener('visibilitychange', onVisible);
        setLaunchingMap(null);
        const w = window.open(map.web, '_blank', 'noopener,noreferrer');
        if (!w) window.location.href = map.web;
      }
    }, 1800);
  };

  const openMapSelector = () => setShowMapSelector(true);
  const closeMapSelector = () => setShowMapSelector(false);

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
            <h3 className="text-base font-bold text-[#1F2933]">
              参会地址
            </h3>
          </div>

          <p className="text-base sm:text-[17px] leading-relaxed text-[#6B7280] mb-4">
            {(() => {
              const keyword = theme.venueText;
              const addr = theme.address;
              const idx = addr.indexOf(keyword);
              if (idx >= 0) {
                return (
                  <>
                    {addr.slice(0, idx)}
                    <span className="font-bold text-[#1F2933]">{keyword}</span>
                    {addr.slice(idx + keyword.length)}
                  </>
                );
              }
              return addr;
            })()}
          </p>

          <div className="flex flex-row items-stretch gap-2 pt-2 border-t border-[#F0F2F5]">
            <button
              onClick={openMapSelector}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#DFF4FF]/60 hover:bg-[#DFF4FF] text-[#4A90E2] text-base sm:text-[17px] font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-[#56C596]" />
              <span>一键导航</span>
            </button>
            <button
              onClick={handleCopyAddress}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#6B7280] text-base sm:text-[17px] font-medium flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-[#56C596]" /> : <Copy className="w-4 h-4" />}
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
            <h3 className="text-base font-bold text-[#1F2933]">
              联系咨询
            </h3>
          </div>

          <div className="flex items-baseline justify-between mb-4">
            <span className="text-lg font-bold text-[#1F2933] tracking-wide">
              {theme.contactPhone}
            </span>
            <span className="text-base text-[#6B7280]">
              （联系人：{theme.contactName}）
            </span>
          </div>

          <div className="pt-2 border-t border-[#F0F2F5]">
            <button
              onClick={handleCall}
              className="w-full py-2.5 px-3 rounded-xl bg-[#E3F7EF]/70 hover:bg-[#E3F7EF] text-[#2E7D5D] text-base sm:text-[17px] font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
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
          className="p-3 rounded-xl bg-white/60 border border-white text-center text-base text-[#9CA3AF]">
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

      {/* 5. Map Selector Modal (高德地图 / 百度地图 / 腾讯地图) */}
      <AnimatePresence>
        {showMapSelector && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMapSelector}
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
                  onClick={closeMapSelector}
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
                  {VENUE.address}
                </p>
              </div>

              {/* Map Options List */}
              <div className="mt-3.5 space-y-2">
                {(['amap', 'baidu', 'tencent'] as MapApp[]).map((app) => {
                  const map = MAPS[app];
                  return (
                    <button
                      key={app}
                      onClick={() => launchMap(app)}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-[#F0F2F5] hover:border-[#4A90E2]/40 hover:bg-[#DFF4FF]/30 transition-all active:scale-[0.98] group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0"
                          style={{
                            backgroundColor: `${map.accent}1A`,
                            color: map.accent,
                          }}
                        >
                          {map.short}
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-semibold text-[#1F2933] group-hover:text-[#4A90E2]">
                            {map.label}
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-[#4A90E2]" />
                    </button>
                  );
                })}
              </div>

              {/* Cancel Button */}
              <div className="mt-3.5">
                <button
                  onClick={closeMapSelector}
                  className="w-full py-2.5 rounded-xl bg-[#F8FAFC] text-xs font-medium text-[#6B7280] hover:bg-[#F1F5F9] transition-all"
                >
                  取消
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Launching Map Loading Overlay */}
      <AnimatePresence>
        {launchingMap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/35 backdrop-blur-xs"
          >
            <div className="flex flex-col items-center gap-3 px-6 py-5 rounded-2xl bg-white/95 shadow-2xl border border-[#F0F2F5]">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full border-2 border-[#DFF4FF]" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#4A90E2] animate-spin" />
              </div>
              <p className="text-sm font-semibold text-[#1F2933]">
                正在打开 {launchingMap.label}…
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

