import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { BackgroundEffect } from './components/BackgroundEffect';
import { CoverPage } from './components/CoverPage';
import { InvitationPage } from './components/InvitationPage';
import { IntroPage } from './components/IntroPage';
import { GuestsPage } from './components/GuestsPage';
import { AgendaPage } from './components/AgendaPage';
import { GuidePage } from './components/GuidePage';
import { SharePosterModal } from './components/SharePosterModal';

/* ==========================================================================
 * 微信 JS-SDK 类型声明（无需 npm 依赖，纯 TypeScript 声明）
 * ========================================================================== */
declare global {
  interface Window {
    wx?: {
      config: (opts: WxConfigOpts) => void;
      ready: (fn: () => void) => void;
      error: (fn: (err: any) => void) => void;
      updateAppMessageShareData: (opts: WxShareOpts) => void;
      updateTimelineShareData: (opts: WxShareOpts) => void;
    };
  }
}
interface WxConfigOpts {
  appId: string;
  timestamp: number;
  nonceStr: string;
  signature: string;
  jsApiList: string[];
  openTagList?: string[];
  debug?: boolean;
}
interface WxShareOpts {
  title?: string;
  desc?: string;
  link?: string;
  imgUrl?: string;
}
/* ========================================================================== */

/** 分享素材（与 index.html OG 标签保持一致） */
const SHARE_DATA: WxShareOpts = {
  title: '文旅场景AI智能体创新实践交流大会',
  desc: '【智赋文旅·数启新程】文旅场景AI智能体创新实践交流大会',
  link: 'https://scmgh-2025.github.io/YaoQing/',
  imgUrl: 'https://i.mij.rip/2026/09/02/b104277602872b24747fdcadacbfc34e.jpeg',
};

/**
 * ================================================================
 * ⚠️⚠️⚠️  关键：fetchSignature —— 微信签名占位函数  ⚠️⚠️⚠️
 * ================================================================
 *
 * 【为什么不能纯前端生成签名？】
 *   微信签名需要 access_token，而 access_token 要用公众号 AppSecret 换。
 *   AppSecret 是绝对不能暴露在前端的 —— 任何人 F12 看到就能接管你的公众号。
 *   所以签名必须由【后端服务】生成，再把结果返回给前端。
 *
 * 【后端怎么生成？】
 *   1. 用 AppID + AppSecret 调微信 API → access_token（缓存 7200s）
 *   2. 用 access_token 换 jsapi_ticket（缓存 7200s）
 *   3. 拼串：`jsapi_ticket=xxx&noncestr=yyy&timestamp=zzz&url=<当前URL>`
 *   4. 对上面的串做 SHA1 → 得到 signature
 *   5. 返回 { appId, timestamp, nonceStr, signature } 给前端
 *
 * 【纯前端项目的替代方案】
 *   - GitHub Pages 无后端，可用微信云开发 / Serverless（如腾讯云 SCF、阿里云 FC）
 *   - 或用第三方签名服务：https://github.com/wechatpy/wechatpy （Python）
 *   - 或干脆【只靠 OG 标签】—— 已经能独立生成分享卡片，JS-SDK 只是锦上添花
 *
 * 【上线前 TODO】
 *   ✅ 把后端签名接口地址填到 fetchSignature 的 fetch() 里
 *   ✅ 微信公众号后台「公众号设置 → 功能设置 → JS 接口安全域名」添加
 *     scmgh-2025.github.io
 *   ✅ 公众号后台「开发者接口 → 网页授权域名」添加 scmgh-2025.github.io
 * ================================================================
 */
async function fetchSignature(url: string): Promise<{
  appId: string;
  timestamp: number;
  nonceStr: string;
  signature: string;
} | null> {
  // 示例：调用后端签名 API（需要后端先实现）
  // try {
  //   const res = await fetch(
  //     `/api/wechat/signature?url=${encodeURIComponent(url)}`
  //   );
  //   if (!res.ok) return null;
  //   return await res.json();
  // } catch {
  //   return null;
  // }

  // 当前纯前端占位：返回 null，JS-SDK 配置将跳过（OG 标签方案已生效）
  console.warn('[wx-sdk] fetchSignature 未接入后端，JS-SDK 配置已跳过。OG 标签方案已独立生效，分享卡片不受影响。');
  return null;
}

/** 在微信内自动配置 JS-SDK + 动态覆盖分享内容 */
function setupWxSdk() {
  const wx = window.wx;
  if (!wx) return;
  if (!/MicroMessenger/i.test(navigator.userAgent)) return; // 非微信环境跳过

  // 签名 URL 必须与当前页面 URL（含 hash，不含 # 后内容）完全一致
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const configUrl = location.href.split('#')[0];

  fetchSignature(configUrl).then((sig) => {
    if (!sig) return;
    try {
      wx.config({
        appId: sig.appId,
        timestamp: sig.timestamp,
        nonceStr: sig.nonceStr,
        signature: sig.signature,
        jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'],
        debug: false, // 调试时可改为 true 看弹窗日志
      });
      wx.ready(() => {
        wx.updateAppMessageShareData({ ...SHARE_DATA }); // 分享给朋友
        wx.updateTimelineShareData({ ...SHARE_DATA });   // 分享到朋友圈
      });
      wx.error((err) => {
        console.warn('[wx-sdk] config 失败', err);
      });
    } catch (e) {
      console.warn('[wx-sdk] 配置异常', e);
    }
  });
}

const TOTAL_PAGES = 6;

export default function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const [showSharePoster, setShowSharePoster] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const touchStartYRef = useRef<number>(0);
  const touchStartTimeRef = useRef<number>(0);

  const goToPage = (pageIndex: number) => {
    if (pageIndex < 0 || pageIndex >= TOTAL_PAGES || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentPage(pageIndex);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const handleNextPage = () => {
    if (currentPage < TOTAL_PAGES - 1) {
      goToPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      goToPage(currentPage - 1);
    }
  };

  // Touch Handlers for Vertical Swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
    touchStartTimeRef.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diffY = touchStartYRef.current - touchEndY;
    const duration = Date.now() - touchStartTimeRef.current;

    // Fast flick or standard drag distance threshold (>45px)
    if (Math.abs(diffY) > 45 && duration < 600) {
      if (diffY > 0) {
        handleNextPage(); // Swipe Up -> Next
      } else {
        handlePrevPage(); // Swipe Down -> Prev
      }
    }
  };

  // Mouse Wheel Handler
  const handleWheel = (e: React.WheelEvent) => {
    if (isTransitioning) return;
    if (Math.abs(e.deltaY) > 35) {
      if (e.deltaY > 0) {
        handleNextPage();
      } else {
        handlePrevPage();
      }
    }
  };

  // ============================================================
  // 微信 JS-SDK 自动配置（只在微信环境生效）
  // 注意：签名由 fetchSignature() 负责，纯前端占位返回 null，
  //       当前分享卡片靠 index.html 的 OG 标签方案独立生效
  // ============================================================
  useEffect(() => {
    // 等 jweixin-1.6.0.js 脚本加载完成再配置
    const waitWx = () => {
      if (window.wx && typeof window.wx.config === 'function') {
        setupWxSdk();
      } else {
        setTimeout(waitWx, 200);
      }
    };
    waitWx();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        handleNextPage();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        handlePrevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage]);

  return (
    <main
      id="invitation-app-root"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-screen h-screen overflow-hidden select-none bg-[#DFF4FF] text-[#1F2933]"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {/* 1. Global Subtle Ambient Background */}
      <BackgroundEffect />

      {/* 2. Full-Screen Vertical Pages Container */}
      <section className="relative w-full h-full z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
            className="w-full h-full"
          >
            {currentPage === 0 && <CoverPage isActive={currentPage === 0} />}
            {currentPage === 1 && (
              <InvitationPage
                isActive={currentPage === 1}
                onNext={() => goToPage(2)}
              />
            )}
            {currentPage === 2 && (
              <IntroPage
                isActive={currentPage === 2}
                onNext={() => goToPage(3)}
              />
            )}
            {currentPage === 3 && (
              <GuestsPage
                isActive={currentPage === 3}
                onNext={() => goToPage(4)}
              />
            )}
            {currentPage === 4 && (
              <AgendaPage
                isActive={currentPage === 4}
                onNext={() => goToPage(5)}
              />
            )}
            {currentPage === 5 && (
              <GuidePage
                isActive={currentPage === 5}
                onGoToTop={() => goToPage(0)}
                onOpenSharePoster={() => setShowSharePoster(true)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* 3. Bottom Navigation Page Indicator Dots */}
      <nav id="bottom-indicators" className="fixed bottom-3 inset-x-0 z-40 flex items-center justify-center gap-2 pointer-events-auto">
        {Array.from({ length: TOTAL_PAGES }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToPage(idx)}
            aria-label={`跳转到第 ${idx + 1} 页`}
            className={`transition-all duration-300 rounded-full ${
              currentPage === idx
                ? 'w-6 h-2 bg-gradient-to-r from-[#4A90E2] to-[#56C596] shadow-xs'
                : 'w-2 h-2 bg-[#1F2933]/20 hover:bg-[#1F2933]/40'
            }`}
          />
        ))}
      </nav>

      {/* 4. Downward Gesture Hint (无限循环跳动，最后一页隐藏) */}
      {currentPage < TOTAL_PAGES - 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-9 inset-x-0 z-30 flex flex-col items-center pointer-events-none"
        >
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/70 backdrop-blur-xs text-[11px] text-[#6B7280] shadow-xs animate-bounce-down">
            <span>滑动翻页</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#4A90E2]" />
          </div>
        </motion.div>
      )}

      {/* 7. Modals */}
      <SharePosterModal
        isOpen={showSharePoster}
        onClose={() => setShowSharePoster(false)}
      />
    </main>
  );
}
