import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  QrCode, 
  Sparkles, 
  Send, 
  RotateCcw, 
  Ticket, 
  UserCheck, 
  Building, 
  Phone, 
  Users, 
  FileText,
  Calendar,
  MapPin
} from 'lucide-react';
import { INVITATION_CONFIG } from '../config';
import { RsvpFormData } from '../types';

interface RsvpPageProps {
  isActive: boolean;
  onNext?: () => void;
}

const LOCAL_STORAGE_KEY = 'h5_invitation_rsvp_data';
const PENDING_QUEUE_KEY = 'h5_invitation_pending_queue';

export const RsvpPage: React.FC<RsvpPageProps> = ({ isActive, onNext }) => {
  const { api, theme } = INVITATION_CONFIG;

  const [formData, setFormData] = useState<RsvpFormData>({
    companyName: '',
    attendeeName: '',
    attendeeCount: '',
    phone: '',
    remark: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<RsvpFormData | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Check saved state and process pending retry queue on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSubmittedData(parsed);
      }

      // Auto-retry pending queue if configured
      if (api.autoRetryOnLoad) {
        const pendingQueue = localStorage.getItem(PENDING_QUEUE_KEY);
        if (pendingQueue) {
          const items: RsvpFormData[] = JSON.parse(pendingQueue);
          if (items.length > 0) {
            // Attempt background sync
            fetch(api.rsvpSubmitUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ batch: items }),
            })
              .then((res) => {
                if (res.ok) {
                  localStorage.removeItem(PENDING_QUEUE_KEY);
                }
              })
              .catch(() => {
                // Keep in pending queue silently
              });
          }
        }
      }
    } catch (e) {
      console.warn('Storage check fallback', e);
    }
  }, [api]);

  const [phoneTouched, setPhoneTouched] = useState(false);

  const validatePhone = (phoneStr: string) => {
    const trimmed = phoneStr.trim();
    if (!trimmed) {
      return '请填写联系电话';
    }
    if (trimmed.length !== 11) {
      return `电话号码须为11位数（当前已输入 ${trimmed.length} 位）`;
    }
    if (!/^1[3-9]\d{9}$/.test(trimmed)) {
      return '请输入以1开头的有效11位手机号码';
    }
    return '';
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = '请填写参会方名称';
    }
    if (!formData.attendeeName.trim()) {
      newErrors.attendeeName = '请填写参会人姓名';
    }
    if (!formData.attendeeCount || formData.attendeeCount < 1) {
      newErrors.attendeeCount = '参会人数至少为 1 人';
    }
    
    // Mobile phone format check (11 digits)
    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) {
      newErrors.phone = phoneErr;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const ticketCode = 'VIP-' + Math.floor(100000 + Math.random() * 900000);
    const finalData: RsvpFormData = {
      ...formData,
      submittedAt: new Date().toLocaleString('zh-CN'),
      ticketCode,
    };

    let postSuccess = false;

    // Try posting to API
    try {
      const response = await fetch(api.rsvpSubmitUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });
      if (response.ok) {
        postSuccess = true;
      }
    } catch (err) {
      // Backend not running or offline, add to retry queue
      try {
        const queueStr = localStorage.getItem(PENDING_QUEUE_KEY) || '[]';
        const queue: RsvpFormData[] = JSON.parse(queueStr);
        queue.push(finalData);
        localStorage.setItem(PENDING_QUEUE_KEY, JSON.stringify(queue));
      } catch (e) {
        console.warn(e);
      }
    }

    // Always fallback to localStorage to guarantee data safety
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(finalData));
    } catch (e) {
      console.warn(e);
    }

    setIsSubmitting(false);
    setSubmittedData(finalData);
    setShowSuccessModal(true);
  };

  // Generate and Download Canvas Ticket
  const handleDownloadTicket = () => {
    if (!submittedData) return;
    setIsExportingImage(true);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas size (high-res for crisp mobile retina)
    const w = 750;
    const h = 1100;
    canvas.width = w;
    canvas.height = h;

    // Background Gradient (Sky blue to mint green)
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#DFF4FF');
    bgGrad.addColorStop(0.5, '#E8F9F3');
    bgGrad.addColorStop(1, '#E3F7EF');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Decorative Card inside
    const cardX = 40;
    const cardY = 50;
    const cardW = w - 80;
    const cardH = h - 100;

    // Card white background & round rect
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 10;
    
    // Draw rounded card
    const r = 24;
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

    // Top Card Header Banner
    const bannerGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY);
    bannerGrad.addColorStop(0, '#4A90E2');
    bannerGrad.addColorStop(1, '#56C596');
    ctx.fillStyle = bannerGrad;
    ctx.fillRect(cardX, cardY, cardW, 14);

    // Top Badge
    ctx.fillStyle = '#4A90E2';
    ctx.font = 'bold 24px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('• 电子参会凭证 VIP PASS •', w / 2, cardY + 70);

    // Main Conference Title
    ctx.fillStyle = '#1F2933';
    ctx.font = 'bold 36px -apple-system, sans-serif';
    ctx.fillText(theme.title, w / 2, cardY + 130);

    ctx.fillStyle = '#6B7280';
    ctx.font = '24px -apple-system, sans-serif';
    ctx.fillText(theme.subTitle, w / 2, cardY + 175);

    // Dashed Divider
    ctx.strokeStyle = '#E2E8F0';
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(cardX + 30, cardY + 220);
    ctx.lineTo(cardX + cardW - 30, cardY + 220);
    ctx.stroke();
    ctx.setLineDash([]);

    // Attendee Info Box
    ctx.textAlign = 'left';
    const infoStartY = cardY + 280;
    const labelX = cardX + 50;
    const valueX = cardX + 220;

    const drawField = (label: string, value: string, y: number) => {
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '24px -apple-system, sans-serif';
      ctx.fillText(label, labelX, y);

      ctx.fillStyle = '#1F2933';
      ctx.font = 'bold 26px -apple-system, sans-serif';
      ctx.fillText(value, valueX, y);
    };

    drawField('参会嘉宾', submittedData.attendeeName, infoStartY);
    drawField('所属单位', submittedData.companyName, infoStartY + 60);
    drawField('参会人数', `${submittedData.attendeeCount} 位`, infoStartY + 120);
    drawField('联系电话', submittedData.phone, infoStartY + 180);
    drawField('会议时间', theme.dateText, infoStartY + 240);
    drawField('会议地点', theme.venueText, infoStartY + 300);

    // Pass Code Box
    const codeBoxY = cardY + 650;
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(cardX + 40, codeBoxY, cardW - 80, 110);
    ctx.strokeStyle = '#56C596';
    ctx.lineWidth = 2;
    ctx.strokeRect(cardX + 40, codeBoxY, cardW - 80, 110);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#6B7280';
    ctx.font = '20px -apple-system, sans-serif';
    ctx.fillText('入场核销参会码', w / 2, codeBoxY + 38);

    ctx.fillStyle = '#4A90E2';
    ctx.font = 'bold 38px -apple-system, monospace';
    ctx.fillText(submittedData.ticketCode || 'VIP-2026-8888', w / 2, codeBoxY + 86);

    // Bottom Footer Notes
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '20px -apple-system, sans-serif';
    ctx.fillText('请妥善保管本凭证，凭此码签到入场', w / 2, cardY + cardH - 60);
    ctx.fillText(`主办方：${theme.organizer}`, w / 2, cardY + cardH - 25);

    // Convert to Image and trigger download
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `参会凭证_${submittedData.attendeeName}_${submittedData.ticketCode}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error(e);
    } finally {
      setIsExportingImage(false);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between py-8 px-5 sm:px-8 max-w-lg mx-auto select-none">
      
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
            RSVP REGISTRATION
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2933] tracking-tight">
          参会回执
        </h2>
        <p className="text-sm text-[#6B7280] mt-1">
          请填写以下信息完成报名，我们将为您预留席位
        </p>
      </motion.div>

      {/* 2. Main Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={isActive ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
        className="my-auto bg-white rounded-2xl p-5 sm:p-6 shadow-card-soft border border-[#F0F2F5] relative overflow-hidden max-h-[66vh] overflow-y-auto no-scrollbar"
      >
        {/* If already submitted, show ticket preview banner */}
        {submittedData && (
          <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-[#DFF4FF] to-[#E3F7EF] border border-[#56C596]/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#56C596]" />
              <div className="text-xs">
                <span className="font-semibold text-[#1F2933]">{submittedData.attendeeName}</span>
                <span className="text-[#6B7280]"> 已预留席位</span>
              </div>
            </div>
            <button
              onClick={() => setShowTicketModal(true)}
              className="text-[11px] font-medium text-[#4A90E2] bg-white px-2.5 py-1 rounded-full shadow-xs hover:bg-white/80 transition-all flex items-center gap-1"
            >
              <Ticket className="w-3 h-3 text-[#56C596]" />
              <span>查看凭证</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          
          {/* 1. 参会方名称 * */}
          <div>
            <label className="block text-sm font-semibold text-[#1F2933] mb-1">
              <span className="text-[#4A90E2] mr-1">*</span>参会方名称
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => {
                  setFormData({ ...formData, companyName: e.target.value });
                  if (errors.companyName) setErrors({ ...errors, companyName: '' });
                }}
                placeholder="请输入您的单位 / 机构 / 酒店名称"
                className={`w-full px-3 py-2 text-sm sm:text-base bg-white border rounded-lg outline-none transition-all ${
                  errors.companyName
                    ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                    : 'border-[#E2E8F0] focus:border-[#4A90E2] focus:ring-3 focus:ring-[#4A90E2]/15'
                }`}
              />
            </div>
            {errors.companyName && (
              <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.companyName}
              </p>
            )}
          </div>

          {/* 2. 参会人姓名 * */}
          <div>
            <label className="block text-sm font-semibold text-[#1F2933] mb-1">
              <span className="text-[#4A90E2] mr-1">*</span>参会人姓名
            </label>
            <input
              type="text"
              value={formData.attendeeName}
              onChange={(e) => {
                setFormData({ ...formData, attendeeName: e.target.value });
                if (errors.attendeeName) setErrors({ ...errors, attendeeName: '' });
              }}
              placeholder="请输入参会嘉宾姓名"
              className={`w-full px-3 py-2 text-sm sm:text-base bg-white border rounded-lg outline-none transition-all ${
                errors.attendeeName
                  ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                  : 'border-[#E2E8F0] focus:border-[#4A90E2] focus:ring-3 focus:ring-[#4A90E2]/15'
              }`}
            />
            {errors.attendeeName && (
              <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.attendeeName}
              </p>
            )}
          </div>

          {/* 3. 参会人数 * (Number input, default 1) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-[#1F2933] mb-1">
                <span className="text-[#4A90E2] mr-1">*</span>参会人数
              </label>
              <input
                type="number"
                min={1}
                max={20}
                placeholder="请输入参会人数"
                value={formData.attendeeCount}
                onChange={(e) => {
                  const raw = e.target.value;
                  const val = raw === '' ? '' : Math.min(20, Math.max(1, parseInt(raw) || 1));
                  setFormData({ ...formData, attendeeCount: val });
                }}
                className="w-full px-3 py-2 text-sm sm:text-base bg-white border border-[#E2E8F0] rounded-lg outline-none focus:border-[#4A90E2] focus:ring-3 focus:ring-[#4A90E2]/15"
              />
            </div>

            {/* 4. 联系电话 * (Mobile format - 11 digits check) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-semibold text-[#1F2933]">
                  <span className="text-[#4A90E2] mr-1">*</span>联系电话
                </label>
                {formData.phone.length > 0 && (
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${
                      formData.phone.length === 11
                        ? 'text-[#2E7D5D] bg-[#E3F7EF]'
                        : 'text-amber-600 bg-amber-50'
                    }`}
                  >
                    {formData.phone.length === 11 ? '已输入11位' : `${formData.phone.length}/11 位`}
                  </span>
                )}
              </div>
              <input
                type="tel"
                maxLength={11}
                value={formData.phone}
                onBlur={() => {
                  setPhoneTouched(true);
                  if (formData.phone.trim().length > 0 && formData.phone.trim().length !== 11) {
                    setErrors((prev) => ({
                      ...prev,
                      phone: `电话号码须为11位数（当前仅输入 ${formData.phone.trim().length} 位）`,
                    }));
                  }
                }}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setFormData({ ...formData, phone: val });
                  if (val.length === 11) {
                    if (/^1[3-9]\d{9}$/.test(val)) {
                      setErrors((prev) => ({ ...prev, phone: '' }));
                    } else {
                      setErrors((prev) => ({ ...prev, phone: '请输入以1开头的有效手机号码' }));
                    }
                  } else if (phoneTouched && val.length > 0 && val.length !== 11) {
                    setErrors((prev) => ({
                      ...prev,
                      phone: `电话号码须为11位数（当前为 ${val.length} 位）`,
                    }));
                  } else if (errors.phone && val.length === 0) {
                    setErrors((prev) => ({ ...prev, phone: '' }));
                  }
                }}
                placeholder="11位手机号"
                className={`w-full px-3 py-2 text-sm sm:text-base bg-white border rounded-lg outline-none transition-all ${
                  errors.phone
                    ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/20'
                    : 'border-[#E2E8F0] focus:border-[#4A90E2] focus:ring-3 focus:ring-[#4A90E2]/15'
                }`}
              />
            </div>
          </div>
          {errors.phone && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] text-red-500 font-medium flex items-center gap-1.5 -mt-1 bg-red-50/80 p-1.5 rounded-md border border-red-100"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
              <span>{errors.phone}</span>
            </motion.p>
          )}

          {/* 5. 备注 (Optional Textarea) */}
          <div>
            <label className="block text-sm font-semibold text-[#1F2933] mb-1">
              备注（选填）
            </label>
            <textarea
              rows={2}
              value={formData.remark}
              onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
              placeholder="如有特殊需求请填写..."
              className="w-full px-3 py-2 text-sm sm:text-base bg-white border border-[#E2E8F0] rounded-lg outline-none focus:border-[#4A90E2] focus:ring-3 focus:ring-[#4A90E2]/15 resize-none"
            />
          </div>

          {/* Submit Button (Full Width Gradient Button) */}
          <div className="pt-2">
            <button
              id="rsvp-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#56C596] to-[#4A90E2] text-white text-sm font-semibold shadow-button-glow hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>正在提交报名...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{submittedData ? '更新参会信息' : '提交报名'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-[#F0F2F5] text-center"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-[#DFF4FF] to-[#E3F7EF] flex items-center justify-center text-[#56C596] mb-3">
                <CheckCircle2 className="w-8 h-8 text-[#56C596]" />
              </div>

              <h3 className="text-lg font-bold text-[#1F2933]">
                报名成功，感谢您的莅临！
              </h3>
              <p className="text-xs text-[#6B7280] mt-1 mb-4 leading-relaxed">
                您的参会信息已录入。我们已为您生成专属电子参会凭证，现场凭此码入场。
              </p>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    setShowTicketModal(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#4A90E2] to-[#56C596] text-white text-xs font-semibold shadow-md flex items-center justify-center gap-1.5"
                >
                  <Ticket className="w-4 h-4" />
                  <span>查看并保存电子凭证</span>
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-2 rounded-xl bg-[#F8FAFC] text-[#6B7280] text-xs font-medium hover:bg-[#F1F5F9]"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Electronic Ticket / Pass Voucher Modal */}
      <AnimatePresence>
        {showTicketModal && submittedData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto"
            onClick={() => setShowTicketModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-[#F0F2F5] overflow-hidden"
            >
              {/* Ticket Top Gradient Header */}
              <div className="bg-gradient-to-r from-[#4A90E2] to-[#56C596] p-4 text-white text-center relative">
                <div className="text-[10px] tracking-widest uppercase opacity-90">VIP ADMISSION PASS</div>
                <h3 className="text-base font-bold mt-0.5">{theme.title}</h3>
                <p className="text-xs opacity-90">{theme.subTitle}</p>
              </div>

              {/* Ticket Body Info */}
              <div className="p-5 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#9CA3AF] block text-[11px]">参会嘉宾</span>
                    <span className="font-bold text-[#1F2933] text-sm">{submittedData.attendeeName}</span>
                  </div>
                  <div>
                    <span className="text-[#9CA3AF] block text-[11px]">参会人数</span>
                    <span className="font-bold text-[#1F2933] text-sm">{submittedData.attendeeCount} 位</span>
                  </div>
                </div>

                <div className="text-xs">
                  <span className="text-[#9CA3AF] block text-[11px]">单位名称</span>
                  <span className="font-medium text-[#1F2933]">{submittedData.companyName}</span>
                </div>

                <div className="text-xs">
                  <span className="text-[#9CA3AF] block text-[11px]">会议地点</span>
                  <span className="text-[#6B7280]">{theme.venueText}（{theme.venueDetail}）</span>
                </div>

                {/* Pass Code Barcode simulation */}
                <div className="bg-[#F8FAFC] border border-[#56C596]/40 rounded-xl p-3 text-center my-2">
                  <span className="text-[10px] text-[#6B7280] uppercase tracking-wider block">入场核销参会码</span>
                  <span className="text-lg font-mono font-bold text-[#4A90E2] tracking-wider">
                    {submittedData.ticketCode || 'VIP-2026-8888'}
                  </span>
                </div>

                <p className="text-[10px] text-[#9CA3AF] text-center">
                  支持截图保存或点击下方按钮导出凭证图片
                </p>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-[#F8FAFC] border-t border-[#F0F2F5] flex gap-2">
                <button
                  onClick={handleDownloadTicket}
                  disabled={isExportingImage}
                  className="flex-1 py-2.5 rounded-xl bg-[#4A90E2] text-white text-xs font-semibold shadow-sm hover:bg-[#3B7ECC] transition-all flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isExportingImage ? '正在生成...' : '保存凭证图片'}</span>
                </button>
                <button
                  onClick={() => setShowTicketModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-xs font-medium text-[#6B7280]"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
