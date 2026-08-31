import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { BackgroundEffect } from './components/BackgroundEffect';
import { CoverPage } from './components/CoverPage';
import { InvitationPage } from './components/InvitationPage';
import { IntroPage } from './components/IntroPage';
import { GuestsPage } from './components/GuestsPage';
import { AgendaPage } from './components/AgendaPage';
import { RsvpPage } from './components/RsvpPage';
import { GuidePage } from './components/GuidePage';
import { SharePosterModal } from './components/SharePosterModal';

const TOTAL_PAGES = 7;

export default function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const [showGestureHint, setShowGestureHint] = useState(true);
  const [showSharePoster, setShowSharePoster] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const touchStartYRef = useRef<number>(0);
  const touchStartTimeRef = useRef<number>(0);

  // Auto-hide gesture hint after 3.5 seconds or on interaction
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGestureHint(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const goToPage = (pageIndex: number) => {
    if (pageIndex < 0 || pageIndex >= TOTAL_PAGES || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentPage(pageIndex);
    setShowGestureHint(false);
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
              <RsvpPage
                isActive={currentPage === 5}
                onNext={() => goToPage(6)}
              />
            )}
            {currentPage === 6 && (
              <GuidePage
                isActive={currentPage === 6}
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

      {/* 4. Initial Downward Gesture Hint (Auto-fades after 3s) */}
      <AnimatePresence>
        {showGestureHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-9 inset-x-0 z-30 flex flex-col items-center pointer-events-none"
          >
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/70 backdrop-blur-xs text-[11px] text-[#6B7280] shadow-xs animate-bounce-down">
              <span>向下滑动翻页</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#4A90E2]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. Modals */}
      <SharePosterModal
        isOpen={showSharePoster}
        onClose={() => setShowSharePoster(false)}
      />
    </main>
  );
}
