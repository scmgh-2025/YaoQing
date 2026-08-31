import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Share2, Sparkles, Check, Image as ImageIcon } from 'lucide-react';
import { INVITATION_CONFIG } from '../config';

interface SharePosterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SharePosterModal: React.FC<SharePosterModalProps> = ({ isOpen, onClose }) => {
  const { theme } = INVITATION_CONFIG;
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setIsGenerating(true);
    // Draw high-resolution share poster via Canvas 2D
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 750;
    const h = 1334; // standard 9:16 mobile poster
    canvas.width = w;
    canvas.height = h;

    // Background Gradient (Sky blue #DFF4FF to Mint green #E3F7EF)
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#DFF4FF');
    bgGrad.addColorStop(0.45, '#EBF9F4');
    bgGrad.addColorStop(1, '#E3F7EF');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Decorative top-right and bottom-left ambient glow
    ctx.save();
    ctx.fillStyle = 'rgba(74, 144, 226, 0.08)';
    ctx.beginPath();
    ctx.arc(w - 50, 100, 260, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(86, 197, 150, 0.08)';
    ctx.beginPath();
    ctx.arc(80, h - 150, 300, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Hotel silhouette vector line at bottom
    ctx.save();
    ctx.strokeStyle = 'rgba(31, 41, 51, 0.12)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, h - 180);
    ctx.lineTo(w, h - 180);
    // Hotel outline
    ctx.moveTo(100, h - 180); ctx.lineTo(100, h - 260); ctx.lineTo(180, h - 260); ctx.lineTo(180, h - 180);
    ctx.moveTo(220, h - 180); ctx.lineTo(220, h - 360); ctx.lineTo(340, h - 360); ctx.lineTo(340, h - 400); ctx.lineTo(375, h - 440); ctx.lineTo(410, h - 400); ctx.lineTo(410, h - 360); ctx.lineTo(530, h - 360); ctx.lineTo(530, h - 180);
    ctx.moveTo(560, h - 180); ctx.lineTo(560, h - 280); ctx.lineTo(650, h - 280); ctx.lineTo(650, h - 180);
    ctx.stroke();
    ctx.restore();

    // Central Card
    const cardX = 40;
    const cardY = 120;
    const cardW = w - 80;
    const cardH = h - 340;
    const r = 24;

    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.07)';
    ctx.shadowBlur = 35;
    ctx.shadowOffsetY = 12;

    ctx.beginPath();
    ctx.moveTo(cardX + r, cardY);
    ctx.lineTo(cardX + cardW - r, cardY);
    ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + r);
    ctx.lineTo(cardX + cardW, cardY + cardH - r);
    ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - r, cardY + cardH);
    ctx.lineTo(cardX + r, cardY + cardH);
    ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - r);
    ctx.lineTo(cardX, cardY + r);
    ctx.quadraticCurveTo(cardX, cardY, cardX + r, cardY);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Card Top Gradient Strip
    const stripGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY);
    stripGrad.addColorStop(0, '#4A90E2');
    stripGrad.addColorStop(1, '#56C596');
    ctx.fillStyle = stripGrad;
    ctx.fillRect(cardX, cardY, cardW, 12);

    // Top Tag
    ctx.fillStyle = '#4A90E2';
    ctx.font = 'bold 22px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('• 2026 智赋文旅・文旅 AI 创新实践交流大会 •', w / 2, cardY + 75);

    // Main Title
    ctx.fillStyle = '#1F2933';
    ctx.font = 'bold 38px -apple-system, sans-serif';
    ctx.fillText(theme.title, w / 2, cardY + 150);

    ctx.fillStyle = '#4B5563';
    ctx.font = '28px -apple-system, sans-serif';
    ctx.fillText(theme.subTitle, w / 2, cardY + 205);

    // Divider
    ctx.strokeStyle = '#F0F2F5';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cardX + 40, cardY + 250);
    ctx.lineTo(cardX + cardW - 40, cardY + 250);
    ctx.stroke();

    // Invitation Copy
    ctx.textAlign = 'left';
    ctx.fillStyle = '#4B5563';
    ctx.font = '24px -apple-system, sans-serif';
    const lines = [
      '衷心邀请您莅临本次文旅场景 AI 智能体创新实践交流大会，',
      '期盼与您相聚贵阳，共探 AI 赋能文旅产业的实践路径，',
      '携手开启文旅数字化崭新格局。'
    ];
    lines.forEach((l, i) => {
      ctx.fillText(l, cardX + 50, cardY + 310 + i * 45);
    });

    // Time & Place Info Card
    const infoBoxY = cardY + 470;
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(cardX + 40, infoBoxY, cardW - 80, 180);
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.strokeRect(cardX + 40, infoBoxY, cardW - 80, 180);

    ctx.fillStyle = '#1F2933';
    ctx.font = 'bold 24px -apple-system, sans-serif';
    ctx.fillText('会议时间：', cardX + 70, infoBoxY + 55);
    ctx.font = '24px -apple-system, sans-serif';
    ctx.fillText(theme.dateText, cardX + 190, infoBoxY + 55);

    ctx.font = 'bold 24px -apple-system, sans-serif';
    ctx.fillText('会议地点：', cardX + 70, infoBoxY + 115);
    ctx.font = '24px -apple-system, sans-serif';
    ctx.fillText(`${theme.venueText}（${theme.venueDetail}）`, cardX + 190, infoBoxY + 115);

    // Organizers inside card
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '20px -apple-system, sans-serif';
    ctx.fillText(`主办：${theme.organizer}`, cardX + 50, cardY + cardH - 70);
    ctx.fillText(`承办：${theme.coOrganizer}`, cardX + 50, cardY + cardH - 35);

    // Bottom Social Share Footer
    ctx.textAlign = 'center';
    ctx.fillStyle = '#1F2933';
    ctx.font = 'bold 24px -apple-system, sans-serif';
    ctx.fillText('长按或保存图片 · 分享好友参会', w / 2, h - 85);

    ctx.fillStyle = '#9CA3AF';
    ctx.font = '18px -apple-system, sans-serif';
    ctx.fillText('扫描 / 微信打开 H5 电子邀请函参与互动回执', w / 2, h - 50);

    try {
      const url = canvas.toDataURL('image/png');
      setPosterUrl(url);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  }, [isOpen, theme]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.92, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm bg-white rounded-2xl p-4 sm:p-5 shadow-2xl border border-[#F0F2F5] flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#F0F2F5]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1F2933]">
              <Sparkles className="w-4 h-4 text-[#4A90E2]" />
              <span>邀请函分享海报</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-[#9CA3AF] hover:bg-[#F0F2F5] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Poster Image Display */}
          <div className="my-3 flex-1 overflow-y-auto no-scrollbar flex items-center justify-center bg-[#F8FAFC] rounded-xl p-2 border border-[#E2E8F0]">
            {isGenerating || !posterUrl ? (
              <div className="py-12 text-center text-xs text-[#9CA3AF]">
                <div className="w-6 h-6 border-2 border-[#4A90E2] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <span>正在生成专属邀请海报...</span>
              </div>
            ) : (
              <img
                src={posterUrl}
                alt="会议邀请海报"
                className="w-full h-auto rounded-lg shadow-sm max-h-[55vh] object-contain"
              />
            )}
          </div>

          <p className="text-[11px] text-[#9CA3AF] text-center mb-3">
            手机端可长按图片保存到相册，或点击下方按钮直接下载
          </p>

          {/* Download & Close Buttons */}
          <div className="flex gap-2">
            <a
              href={posterUrl || '#'}
              download={`文旅AI大会邀请函_${theme.title}.png`}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#4A90E2] to-[#56C596] text-white text-xs font-semibold shadow-sm hover:opacity-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>下载海报图片</span>
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-medium text-[#6B7280]"
            >
              关闭
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
