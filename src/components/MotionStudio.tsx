import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Film,
  Sparkles,
  Heart,
  Volume2,
  VolumeX,
  Share2,
  Check,
  Loader2,
  Download,
  BookOpen,
  UserCheck,
  Send,
  MessageSquareHeart,
  Camera,
  Maximize2,
  Sparkle,
} from 'lucide-react';
import { MotionTemplateId, MotionTemplate } from '../types.ts';
import { playAffirmationSound, playPluckChime } from '../utils/soundEffects.ts';
import { renderCartoonScene } from '../utils/cartoonRenderer.ts';

import storyCoupleImg from '../assets/images/story_couple_love_1792472267007.jpg';
import storyMomChildImg from '../assets/images/story_mom_child_1792472249381.jpg';
import storyTeacherStudentImg from '../assets/images/story_teacher_student_1792472284603.jpg';
import storySistersImg from '../assets/images/story_sisters_friendship_1792472300540.jpg';

interface MotionStudioProps {
  isDarkTheme: boolean;
  onOpenCardStudio?: () => void;
}

const STORY_TEMPLATES: MotionTemplate[] = [
  {
    id: 'couple-romance',
    name: 'Thư Tỏ Tình & Nụ Cười Em',
    subtitle: 'Chàng trai bước tới trao thư tỏ tình & bó hoa hồng đỏ thắm',
    storyTitle: 'Cặp Đôi Lãng Mạn',
    themeColor: 'from-rose-500 to-red-600',
    badge: 'Tình Cặp Đôi',
    icon: '💌',
    accentHex: '#E11D48',
    desc: 'Chàng trai bước đi nhịp nhàng, trao bức thư tỏ tình và bó hoa hồng; cô gái bẽn lẽn đỏ mặt mỉm cười hạnh phúc, phong thư mở bung ngàn tim bay.',
    imageSrc: storyCoupleImg,
    defaultRecipient: 'Em Yêu Của Anh',
    defaultSender: 'Anh Yêu',
    defaultMessage: 'Chúc em 20/10 ngập tràn niềm vui, luôn xinh đẹp và rạng rỡ. Cảm ơn em đã đến và biến cuộc đời anh thành bản tình ca ngọt ngào nhất!',
    storyNarrative: 'Trái tim anh rung động mỗi khi nhìn thấy nụ cười em...',
  },
  {
    id: 'mom-child',
    name: 'Bé Con Lon Ton Tặng Hoa Mẹ',
    subtitle: 'Bé con chạy lon ton dâng đóa sen thơm ôm chầm lấy Mẹ',
    storyTitle: 'Tình Mẫu Tử Thiêng Liêng',
    themeColor: 'from-amber-400 to-rose-500',
    badge: 'Tình Mẫu Tử',
    icon: '🌸',
    accentHex: '#F59E0B',
    desc: 'Bé con hoạt hình chạy lon ton nhún nhảy, nâng cao bó hoa thơm tặng Mẹ; Mẹ hiền dịu dàng cúi xuống ôm con vào lòng trong ánh ban mai.',
    imageSrc: storyMomChildImg,
    defaultRecipient: 'Mẹ Kính Yêu',
    defaultSender: 'Con Của Mẹ',
    defaultMessage: 'Con kính chúc Mẹ ngày 20/10 luôn an yên, mạnh khỏe và ngập tràn nụ cười. Cảm ơn Mẹ vì cả đời tảo tần hy sinh vì chúng con!',
    storyNarrative: 'Đóa hoa thơm thay ngàn lời cảm ơn con gửi trọn đến Mẹ...',
  },
  {
    id: 'teacher-student',
    name: 'Bông Hoa Điểm Mười Ơn Cô',
    subtitle: 'Học trò dâng hoa tươi và bài điểm 10 bên bục giảng phấn trắng',
    storyTitle: 'Tri Ân Nghĩa Cô Trò',
    themeColor: 'from-emerald-500 to-teal-600',
    badge: 'Nghĩa Cô Trò',
    icon: '📚',
    accentHex: '#10B981',
    desc: 'Bên bục giảng bảng đen hoa bay, học trò lễ phép cúi đầu dâng hoa và bài kiểm tra điểm mười đỏ chói; Cô giáo áo dài mỉm cười đón nhận trìu mến.',
    imageSrc: storyTeacherStudentImg,
    defaultRecipient: 'Cô Giáo Kính Mến',
    defaultSender: 'Học Trò Nhỏ',
    defaultMessage: 'Kính chúc Cô ngày 20/10 luôn vui tươi, dồi dào sức khỏe và ngập tràn hạnh phúc. Cảm ơn Cô đã tận tụy dìu dắt bao ước mơ bay xa!',
    storyNarrative: 'Bụi phấn bay bay trên bục giảng, ơn cô khắc sâu trong tim...',
  },
  {
    id: 'sisters-bff',
    name: 'Hộp Quà Bất Ngờ Tri Kỷ',
    subtitle: 'Bất ngờ tặng hộp quà phép thuật, hoa và bóng bay tung bay',
    storyTitle: 'Chị Em & Bạn Thân',
    themeColor: 'from-purple-500 to-pink-500',
    badge: 'Tri Kỷ & Bạn Thân',
    icon: '🎁',
    accentHex: '#8B5CF6',
    desc: 'Hai cô bạn gái thời trang cute cùng mở hộp quà bất ngờ, bóng bay trái tim và pháo hoa rực rỡ bừng sáng cùng tiếng cười rộn rã.',
    imageSrc: storySistersImg,
    defaultRecipient: 'Cô Bạn Tri Kỷ',
    defaultSender: 'Bạn Thân Của Cậu',
    defaultMessage: 'Chúc người bạn tuyệt vời ngày 20/10 nhận quà mỏi tay, luôn trẻ đẹp, tự tin tỏa sáng và mãi là tri kỷ sát cánh bên nhau nhé!',
    storyNarrative: 'Cùng nhau đi qua thanh xuân, chúc chúng ta mãi rạng rỡ như hoa...',
  },
];

const QUICK_WISHES_BY_STORY: Record<string, string[]> = {
  'couple-romance': [
    'Chúc em 20/10 ngập tràn niềm vui, luôn xinh đẹp và rạng rỡ. Cảm ơn em đã đến và biến cuộc đời anh thành bản tình ca ngọt ngào nhất!',
    'Gửi người con gái anh yêu nhất: Chúc em luôn hạnh phúc, nụ cười luôn nở trên môi và mãi là công chúa nhỏ của riêng anh!',
    'Ngày 20/10 anh chẳng mong ước gì hơn là được thấy em luôn bình an, rạng rỡ và tay trong tay cùng anh đi hết những năm tháng ngọt ngào.',
  ],
  'mom-child': [
    'Con kính chúc Mẹ ngày 20/10 luôn an yên, mạnh khỏe và ngập tràn nụ cười. Cảm ơn Mẹ vì cả đời tảo tần hy sinh vì chúng con!',
    'Mẹ là món quà tuyệt vời nhất mà cuộc đời ban tặng cho con. Con yêu Mẹ nhiều hơn tất cả mọi điều trên thế gian!',
    'Chúc Mẹ yêu của con ngày 20/10 thật hạnh phúc. Con hứa sẽ luôn ngoan ngoãn để nụ cười mãi nở trên môi Mẹ!',
  ],
  'teacher-student': [
    'Kính chúc Cô ngày 20/10 luôn vui tươi, dồi dào sức khỏe và ngập tràn hạnh phúc. Cảm ơn Cô đã tận tụy dìu dắt bao ước mơ bay xa!',
    'Dưới ánh mặt trời không có nghề nào cao quý hơn nghề dạy học. Em xin gửi trọn đóa hoa tươi và lòng biết ơn sâu sắc nhất tới Cô!',
    'Kính chúc Cô luôn giữ mãi ngọn lửa đam mê, luôn là người lái đò tận tâm đưa chúng em cập bến bờ tri thức.',
  ],
  'sisters-bff': [
    'Chúc người bạn tuyệt vời ngày 20/10 nhận quà mỏi tay, luôn trẻ đẹp, tự tin tỏa sáng và mãi là tri kỷ sát cánh bên nhau nhé!',
    'Chúc chị em ta mãi xinh như hoa, tiền đầy túi, tình đầy tim và sớm tìm được hoàng tử như ý nguyện nha!',
    'Cảm ơn vì đã luôn ở bên tớ qua mọi giông bão. Chúc cậu một ngày 20/10 ngập tràn yêu thương và bất ngờ ngọt ngào!',
  ],
};

export const MotionStudio: React.FC<MotionStudioProps> = ({ isDarkTheme }) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<MotionTemplateId>('couple-romance');
  const currentTemplate =
    STORY_TEMPLATES.find((t) => t.id === selectedTemplateId) || STORY_TEMPLATES[0];

  // Customization State - Default is Horizontal 16:9
  const [recipientName, setRecipientName] = useState<string>(currentTemplate.defaultRecipient);
  const [senderName, setSenderName] = useState<string>(currentTemplate.defaultSender);
  const [message, setMessage] = useState<string>(currentTemplate.defaultMessage);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [durationSec, setDurationSec] = useState<number>(10);
  const [includeMusic, setIncludeMusic] = useState<boolean>(true);
  const [showConfetti, setShowConfetti] = useState<boolean>(true);
  const [showHearts, setShowHearts] = useState<boolean>(true);

  // Playback & Export State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportedVideoUrl, setExportedVideoUrl] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(performance.now());
  const lastTimeRef = useRef<number>(performance.now());
  const elapsedRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(true);

  const scrubberTrackRef = useRef<HTMLDivElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const timeDisplayRef = useRef<HTMLSpanElement | null>(null);

  // Synchronize render params continuously so typing NEVER resets playback or causes stutter
  const renderParamsRef = useRef({
    templateId: selectedTemplateId,
    recipientName,
    senderName,
    message,
    durationSec,
    showConfetti,
    showHearts,
  });

  useEffect(() => {
    renderParamsRef.current = {
      templateId: selectedTemplateId,
      recipientName,
      senderName,
      message,
      durationSec,
      showConfetti,
      showHearts,
    };
  }, [selectedTemplateId, recipientName, senderName, message, durationSec, showConfetti, showHearts]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    lastTimeRef.current = performance.now();
  }, [isPlaying]);

  // When switching templates, automatically update presets and rewind smoothly
  const handleSelectTemplate = (template: MotionTemplate) => {
    setSelectedTemplateId(template.id);
    setRecipientName(template.defaultRecipient);
    setSenderName(template.defaultSender);
    setMessage(template.defaultMessage);
    elapsedRef.current = 0;
    lastTimeRef.current = performance.now();
    startTimeRef.current = performance.now();
    setIsPlaying(true);
    isPlayingRef.current = true;
    playPluckChime(587.33, 0.9, 0.05);
  };

  const getCanvasDimensions = () => {
    if (aspectRatio === '16:9') return { width: 1280, height: 720 };
    if (aspectRatio === '9:16') return { width: 720, height: 1280 };
    return { width: 1080, height: 1080 };
  };

  // 60 FPS Procedural Cartoon Animation Render Loop (Ultra Smooth, Zero React Re-render Lag)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = getCanvasDimensions();
    canvas.width = width;
    canvas.height = height;

    // Atmospheric falling petals
    const petals: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      rot: number;
      rotSpeed: number;
      color: string;
      alpha: number;
    }> = [];

    const petalColors = ['#FDA4AF', '#FB7185', '#FFF1F2', '#FECDD3', '#F43F5E'];
    for (let i = 0; i < 40; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 14 + 8,
        speedY: Math.random() * 1.4 + 0.8,
        speedX: Math.random() * 1.2 - 0.6,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        alpha: Math.random() * 0.4 + 0.5,
      });
    }

    let isRunning = true;
    lastTimeRef.current = performance.now();

    const render = (now: number) => {
      if (!isRunning) return;

      const delta = Math.min(0.1, (now - lastTimeRef.current) / 1000);
      lastTimeRef.current = now;

      const dur = renderParamsRef.current.durationSec;
      if (isPlayingRef.current) {
        elapsedRef.current = (elapsedRef.current + delta) % dur;
      }

      const elapsed = elapsedRef.current;
      const progress = dur > 0 ? elapsed / dur : 0; // 0 to 1

      // Direct DOM progress updates to completely eliminate 60fps React re-render overhead!
      if (progressFillRef.current) {
        progressFillRef.current.style.width = `${Math.min(100, Math.max(0, progress * 100))}%`;
      }
      if (timeDisplayRef.current) {
        timeDisplayRef.current.textContent = `${elapsed.toFixed(1)}s / ${dur.toFixed(0)}s`;
      }

      ctx.clearRect(0, 0, width, height);

      const params = renderParamsRef.current;

      // 1. Render Cartoon Scene with moving characters & unfolding love letter
      renderCartoonScene({
        ctx,
        width,
        height,
        progress,
        elapsed,
        duration: dur,
        templateId: params.templateId as 'couple-romance' | 'mom-child' | 'teacher-student' | 'sisters-bff',
        recipientName: params.recipientName,
        senderName: params.senderName,
        message: params.message,
        showConfetti: params.showConfetti,
        showHearts: params.showHearts,
      });

      // 2. Foreground 3D Petals & Sparkle Drift
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(progress * Math.PI * 4 + i) * 1.4;
        p.rot += p.rotSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [aspectRatio, selectedTemplateId]);

  // Scrub timeline to specified position
  const handleScrub = (clientX: number) => {
    if (!scrubberTrackRef.current) return;
    const rect = scrubberTrackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newElapsed = ratio * durationSec;
    elapsedRef.current = newElapsed;
    lastTimeRef.current = performance.now();
    if (progressFillRef.current) {
      progressFillRef.current.style.width = `${ratio * 100}%`;
    }
    if (timeDisplayRef.current) {
      timeDisplayRef.current.textContent = `${newElapsed.toFixed(1)}s / ${durationSec.toFixed(0)}s`;
    }
  };

  // Replay from beginning
  const handleReplay = () => {
    elapsedRef.current = 0;
    lastTimeRef.current = performance.now();
    startTimeRef.current = performance.now();
    setIsPlaying(true);
    isPlayingRef.current = true;
    playAffirmationSound();
  };

  // High-Definition Widescreen Video Export (with optional harp soundtrack)
  const handleExportVideo = async () => {
    if (!canvasRef.current || isExporting) return;
    const canvas = canvasRef.current;

    try {
      setIsExporting(true);
      setExportProgress(8);
      playAffirmationSound();

      // Reset playback
      startTimeRef.current = performance.now();
      setIsPlaying(true);

      const stream = canvas.captureStream(30);

      let audioCtx: AudioContext | null = null;
      if (includeMusic) {
        try {
          const AudioContextClass =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          if (AudioContextClass) {
            audioCtx = new AudioContextClass();
            const dest = audioCtx.createMediaStreamDestination();

            // Pentatonic harp melody adapting dynamically to video duration
            const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 880.0];
            const startT = audioCtx.currentTime;
            const noteCount = Math.ceil(durationSec / 0.40) + 4;
            for (let i = 0; i < noteCount; i++) {
              const noteT = startT + i * 0.40;
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(notes[i % notes.length], noteT);

              gain.gain.setValueAtTime(0.0001, noteT);
              gain.gain.exponentialRampToValueAtTime(0.07, noteT + 0.04);
              gain.gain.exponentialRampToValueAtTime(0.0001, noteT + 1.2);

              osc.connect(gain);
              gain.connect(dest);
              osc.start(noteT);
              osc.stop(noteT + 1.3);
            }

            dest.stream.getAudioTracks().forEach((track) => stream.addTrack(track));
          }
        } catch (e) {
          console.debug('Synthesizer audio track skipped', e);
        }
      }

      // Detect supported mimeTypes
      let mimeType = 'video/webm;codecs=vp9';
      if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')) {
        mimeType = 'video/mp4;codecs=avc1';
      } else if (MediaRecorder.isTypeSupported('video/mp4')) {
        mimeType = 'video/mp4';
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
        mimeType = 'video/webm;codecs=vp8';
      } else if (MediaRecorder.isTypeSupported('video/webm')) {
        mimeType = 'video/webm';
      }

      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 4500000,
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      const recordTime = durationSec * 1000;
      const progressTimer = setInterval(() => {
        const elapsedRec = performance.now() - startTimeRef.current;
        const pct = Math.min(95, Math.floor((elapsedRec / recordTime) * 100));
        setExportProgress(pct);
      }, 200);

      recorder.onstop = () => {
        clearInterval(progressTimer);
        const blob = new Blob(chunks, { type: mimeType });
        const videoUrl = URL.createObjectURL(blob);
        setExportedVideoUrl(videoUrl);
        setExportProgress(100);
        setIsExporting(false);
        playAffirmationSound();

        if (audioCtx) {
          audioCtx.close().catch(() => {});
        }
      };

      recorder.start();
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      }, recordTime);
    } catch (err) {
      console.error('Export video failed:', err);
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  // Instant High-Resolution Snapshot (.png)
  const handleSaveSnapshot = () => {
    if (!canvasRef.current) return;
    playAffirmationSound();
    const dataUrl = canvasRef.current.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `Hoat_Canh_20-10_${recipientName.replace(/\s+/g, '_')}.png`;
    link.click();
  };

  // Share Video
  const handleShareVideo = async () => {
    if (!exportedVideoUrl) return;
    try {
      const response = await fetch(exportedVideoUrl);
      const blob = await response.blob();
      const ext = blob.type.includes('mp4') ? 'mp4' : 'webm';
      const file = new File([blob], `Hoat_Anh_Cartoon_20-10_${recipientName}.${ext}`, {
        type: blob.type,
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Video hoạt ảnh hoạt hình 20/10 gửi ${recipientName}`,
          text: `Chúc mừng Ngày Phụ Nữ Việt Nam 20/10!`,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    } catch (e) {
      console.debug('Share error', e);
    }
  };

  return (
    <section
      id="hoat-anh"
      className={`relative w-full py-16 px-4 sm:px-6 lg:px-12 transition-colors duration-500 border-t ${
        isDarkTheme
          ? 'bg-[#140C10] border-rose-950/40 text-stone-100'
          : 'bg-[#FAF6F4] border-rose-100 text-[#2C2224]'
      }`}
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 bg-rose-500/10 text-rose-500 border border-rose-500/20">
            <Film size={14} />
            <span>Xưởng Video Hoạt Hình Cốt Truyện 20·10</span>
            <span aria-hidden="true">·</span>
            <span>Khung Ngang 16:9</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Video Hoạt Ảnh Trao Thư & Cốt Truyện Tình Cảm
          </h2>
          <p
            className={`mt-3 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto ${
              isDarkTheme ? 'text-stone-300' : 'text-stone-600'
            }`}
          >
            Nhân vật chuyển động kiểu hoạt hình (cartoon): <strong>Chàng trai trao thư tỏ tình & hoa hồng</strong>, <strong>Bé con ôm hoa tặng Mẹ</strong>, <strong>Học trò dâng hoa Cô giáo</strong>... Điền tên người tặng và người nhận để tải video lưu ngay về máy!
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Customization Form (lg:col-span-5) */}
          <div
            className={`lg:col-span-5 rounded-3xl p-6 sm:p-7 border backdrop-blur-md shadow-xl transition-all ${
              isDarkTheme
                ? 'bg-stone-900/75 border-stone-800'
                : 'bg-white/95 border-rose-200/80 shadow-rose-100/50'
            }`}
          >
            {/* Step 1: Storyline Picker */}
            <div className="mb-6">
              <label className="text-xs font-semibold uppercase tracking-wider text-rose-500 mb-2.5 flex items-center gap-1.5">
                <BookOpen size={14} />
                <span>1. Chọn Cốt Truyện & Nhân Vật Cartoon</span>
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {STORY_TEMPLATES.map((tmpl) => {
                  const isSelected = selectedTemplateId === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleSelectTemplate(tmpl)}
                      className={`flex items-center gap-3.5 p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-rose-500 bg-rose-500/15 ring-2 ring-rose-500/30 shadow-md'
                          : isDarkTheme
                          ? 'border-stone-800 bg-stone-800/40 hover:border-stone-700'
                          : 'border-rose-100 bg-rose-50/30 hover:border-rose-200'
                      }`}
                    >
                      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center text-xl shrink-0 shadow-sm">
                        {tmpl.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-serif-luxury text-sm font-bold truncate">
                            {tmpl.name}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-500 font-semibold shrink-0">
                            {tmpl.badge}
                          </span>
                        </div>
                        <p
                          className={`text-xs mt-0.5 line-clamp-1 ${
                            isDarkTheme ? 'text-stone-400' : 'text-stone-500'
                          }`}
                        >
                          {tmpl.subtitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Recipient & Sender Names */}
            <div className="space-y-4 mb-6 pt-4 border-t border-rose-200/40">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-rose-500 mb-1.5 flex items-center gap-1.5">
                  <UserCheck size={13} />
                  <span>2. Tên Người Được Tặng (Người Nhận)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="VD: Em Yêu Của Anh, Mẹ Kính Yêu..."
                    className={`flex-1 px-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${
                      isDarkTheme
                        ? 'bg-stone-800/80 border-stone-700 text-stone-100 focus:border-rose-400'
                        : 'bg-rose-50/50 border-rose-200 text-stone-900 focus:border-rose-400'
                    }`}
                  />
                </div>
                {/* Quick Name Tags */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {['Em Yêu', 'Mẹ Kính Yêu', 'Cô Giáo Thân Thương', 'Bé Bỏng', 'Chị Gái'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setRecipientName(tag)}
                      className={`text-[11px] px-2 py-0.5 rounded-md border transition-all ${
                        recipientName === tag
                          ? 'bg-rose-500 text-white border-rose-500'
                          : isDarkTheme
                          ? 'border-stone-700 text-stone-400 hover:text-stone-200'
                          : 'border-rose-100 text-stone-600 hover:text-stone-900 bg-white'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-rose-500 mb-1.5 flex items-center gap-1.5">
                  <Send size={13} />
                  <span>3. Tên Người Tặng (Người Gửi)</span>
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="VD: Anh Yêu, Con Của Mẹ, Học Trò Nhỏ..."
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${
                    isDarkTheme
                      ? 'bg-stone-800/80 border-stone-700 text-stone-100 focus:border-rose-400'
                      : 'bg-rose-50/50 border-rose-200 text-stone-900 focus:border-rose-400'
                  }`}
                />
                {/* Quick Sender Tags */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {['Anh Yêu', 'Con Của Mẹ', 'Học Trò Nhỏ', 'Bạn Thân', 'Người Luôn Yêu Em'].map((stag) => (
                    <button
                      key={stag}
                      type="button"
                      onClick={() => setSenderName(stag)}
                      className={`text-[11px] px-2 py-0.5 rounded-md border transition-all ${
                        senderName === stag
                          ? 'bg-rose-500 text-white border-rose-500'
                          : isDarkTheme
                          ? 'border-stone-700 text-stone-400 hover:text-stone-200'
                          : 'border-rose-100 text-stone-600 hover:text-stone-900 bg-white'
                      }`}
                    >
                      {stag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                    <MessageSquareHeart size={13} />
                    <span>4. Lời Tỏ Tình / Lời Chúc Trong Thư</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMessage(currentTemplate.defaultMessage);
                      playPluckChime(659.25, 0.7, 0.04);
                    }}
                    className="text-[11px] text-rose-400 hover:text-rose-500 flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw size={11} />
                    <span>Mặc định</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Nhập lời tỏ tình hoặc lời chúc ngọt ngào..."
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border leading-relaxed focus:outline-none transition-all ${
                    isDarkTheme
                      ? 'bg-stone-800/80 border-stone-700 text-stone-100 focus:border-rose-400'
                      : 'bg-rose-50/50 border-rose-200 text-stone-900 focus:border-rose-400'
                  }`}
                />

                {/* Quick Wish Suggestions for Current Story */}
                <div className="mt-2.5">
                  <span className="text-[11px] font-medium text-stone-400 block mb-1.5">
                    ✨ Gợi ý câu chúc hay theo cốt truyện:
                  </span>
                  <div className="space-y-1.5">
                    {(QUICK_WISHES_BY_STORY[selectedTemplateId] || []).map((w, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setMessage(w);
                          playPluckChime(523.25, 0.6, 0.04);
                        }}
                        className={`w-full text-left p-2 rounded-lg text-xs transition-all border ${
                          message === w
                            ? 'bg-rose-500/10 border-rose-400 text-rose-500'
                            : isDarkTheme
                            ? 'bg-stone-800/40 border-stone-800 text-stone-300 hover:border-stone-700'
                            : 'bg-stone-50 border-stone-200/70 text-stone-700 hover:border-rose-200'
                        }`}
                      >
                        <p className="line-clamp-2 italic">"{w}"</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Format & Audio Settings */}
            <div className="pt-4 border-t border-rose-200/40 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Aspect Ratio */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
                    Tỉ Lệ Khung Hình
                  </label>
                  <div className="flex gap-1.5">
                    {(['16:9', '9:16', '1:1'] as const).map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setAspectRatio(ratio)}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                          aspectRatio === ratio
                            ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                            : isDarkTheme
                            ? 'border-stone-700 bg-stone-800/60 text-stone-300'
                            : 'border-rose-200 bg-white text-stone-700'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration Picker */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
                    Thời Lượng Video
                  </label>
                  <div className="flex gap-1.5">
                    {[8, 10, 12, 15].map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => {
                          setDurationSec(sec);
                          startTimeRef.current = performance.now();
                        }}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                          durationSec === sec
                            ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                            : isDarkTheme
                            ? 'border-stone-700 bg-stone-800/60 text-stone-300'
                            : 'border-rose-200 bg-white text-stone-700'
                        }`}
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Extra Fun Controls & Audio */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-rose-200/30">
                {/* Music Toggle */}
                <button
                  type="button"
                  onClick={() => setIncludeMusic((prev) => !prev)}
                  className={`py-1.5 px-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    includeMusic
                      ? 'bg-rose-500/20 border-rose-400 text-rose-500'
                      : isDarkTheme
                      ? 'border-stone-700 bg-stone-800 text-stone-400'
                      : 'border-stone-200 bg-stone-100 text-stone-500'
                  }`}
                >
                  {includeMusic ? <Volume2 size={13} /> : <VolumeX size={13} />}
                  <span>{includeMusic ? 'Nhạc Hạc' : 'Tắt Nhạc'}</span>
                </button>

                {/* Confetti Toggle */}
                <button
                  type="button"
                  onClick={() => setShowConfetti((prev) => !prev)}
                  className={`py-1.5 px-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    showConfetti
                      ? 'bg-amber-500/20 border-amber-400 text-amber-500 dark:text-amber-400'
                      : isDarkTheme
                      ? 'border-stone-700 bg-stone-800 text-stone-400'
                      : 'border-stone-200 bg-stone-100 text-stone-500'
                  }`}
                >
                  <Sparkles size={13} />
                  <span>{showConfetti ? 'Pháo Hoa' : 'Tắt Pháo'}</span>
                </button>

                {/* Hearts Toggle */}
                <button
                  type="button"
                  onClick={() => setShowHearts((prev) => !prev)}
                  className={`py-1.5 px-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    showHearts
                      ? 'bg-rose-500/20 border-rose-400 text-rose-500'
                      : isDarkTheme
                      ? 'border-stone-700 bg-stone-800 text-stone-400'
                      : 'border-stone-200 bg-stone-100 text-stone-500'
                  }`}
                >
                  <Heart size={13} className={showHearts ? 'fill-current' : ''} />
                  <span>{showHearts ? 'Bắn Tim' : 'Tắt Tim'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Live 60FPS Widescreen Stage & Export (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* Live Canvas Widescreen Stage */}
            <div
              className={`relative rounded-3xl overflow-hidden shadow-2xl border transition-all duration-500 flex items-center justify-center ${
                aspectRatio === '16:9'
                  ? 'w-full aspect-[16/9]'
                  : aspectRatio === '9:16'
                  ? 'w-full max-w-[320px] sm:max-w-[360px] aspect-[9/16]'
                  : 'w-full max-w-[340px] sm:max-w-[420px] aspect-square'
              } ${
                isDarkTheme
                  ? 'border-rose-900/40 bg-black shadow-rose-950/40'
                  : 'border-rose-200/90 bg-[#1A0B12] shadow-rose-200/60'
              }`}
            >
              {/* Actual HTML5 Canvas */}
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain cursor-pointer"
                onClick={() => setIsPlaying((p) => !p)}
                title="Nhấp để Tạm dừng / Phát tiếp"
              />

              {/* Widescreen HD badge */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/65 text-white text-[10px] tracking-wider font-mono backdrop-blur-md border border-white/10 select-none">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{aspectRatio === '16:9' ? '16:9 HD' : aspectRatio === '9:16' ? '9:16 Story' : '1:1 Vuông'}</span>
              </div>

              {/* Story tag */}
              <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/65 text-white/90 text-[10px] font-medium backdrop-blur-md border border-white/10 flex items-center gap-1 select-none">
                <span>{currentTemplate.icon}</span>
                <span className="hidden xs:inline sm:inline truncate max-w-[130px]">{currentTemplate.name}</span>
              </div>

              {/* Overlay Play Button when paused */}
              {!isPlaying && (
                <div
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 bg-black/45 flex items-center justify-center backdrop-blur-[2px] cursor-pointer"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500 text-white shadow-2xl scale-110 transition-transform">
                    <Play size={28} className="translate-x-0.5 fill-current" />
                  </div>
                </div>
              )}
            </div>

            {/* Playback Controls Bar */}
            <div
              className={`mt-4 w-full rounded-2xl px-3 sm:px-5 py-2.5 sm:py-3 border flex items-center justify-between gap-2.5 sm:gap-4 backdrop-blur-md ${
                isDarkTheme
                  ? 'bg-stone-900/70 border-stone-800'
                  : 'bg-white/90 border-rose-200/80 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-md transition-transform active:scale-95"
                >
                  {isPlaying ? <Pause size={15} /> : <Play size={15} className="translate-x-0.5" />}
                </button>
                <button
                  type="button"
                  onClick={handleReplay}
                  className={`h-8 w-8 sm:h-9 sm:w-9 rounded-full border flex items-center justify-center transition-colors ${
                    isDarkTheme
                      ? 'border-stone-700 hover:bg-stone-800 text-stone-300'
                      : 'border-rose-200 hover:bg-rose-50 text-stone-700'
                  }`}
                  title="Phát lại từ đầu"
                >
                  <RotateCcw size={14} />
                </button>
              </div>

              {/* Timeline scrubber bar (Interactive Click & Drag) */}
              <div className="flex-1 flex items-center gap-2 min-w-0">
                <div
                  ref={scrubberTrackRef}
                  onPointerDown={(e) => {
                    handleScrub(e.clientX);
                    const onPointerMove = (moveEvent: PointerEvent) => {
                      handleScrub(moveEvent.clientX);
                    };
                    const onPointerUp = () => {
                      window.removeEventListener('pointermove', onPointerMove);
                      window.removeEventListener('pointerup', onPointerUp);
                    };
                    window.addEventListener('pointermove', onPointerMove);
                    window.addEventListener('pointerup', onPointerUp);
                  }}
                  className="w-full h-3.5 flex items-center cursor-pointer group select-none py-1"
                  title="Kéo hoặc nhấp để tua nhanh / xem lại từng giây"
                >
                  <div className="w-full h-2 rounded-full bg-stone-300/40 dark:bg-stone-700/60 overflow-hidden relative group-hover:h-2.5 transition-all">
                    <div
                      ref={progressFillRef}
                      className="h-full bg-gradient-to-r from-rose-400 via-pink-500 to-rose-600 rounded-full transition-none w-0"
                    />
                  </div>
                </div>
                <span
                  ref={timeDisplayRef}
                  className="font-mono text-[10px] sm:text-[11px] text-stone-500 shrink-0 select-none tabular-nums"
                >
                  0.0s / {durationSec.toFixed(0)}s
                </span>
              </div>

              {/* Snapshot Button */}
              <button
                type="button"
                onClick={handleSaveSnapshot}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl border text-[11px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-1.5 transition-all shrink-0 ${
                  isDarkTheme
                    ? 'border-stone-700 bg-stone-800 text-stone-300 hover:text-white'
                    : 'border-rose-200 bg-white text-stone-700 hover:border-rose-400'
                }`}
                title="Tải ảnh chụp khoảnh khắc hiện tại"
              >
                <Camera size={13} className="text-rose-500" />
                <span className="hidden sm:inline">Chụp Ảnh</span>
              </button>
            </div>

            {/* Action Buttons: Export Video & Direct Download */}
            <div className="mt-5 w-full flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleExportVideo}
                disabled={isExporting}
                className="flex-1 py-3 sm:py-3.5 px-4 sm:px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white font-semibold text-xs sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-rose-500/25 transition-all transform active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed text-center"
              >
                {isExporting ? (
                  <>
                    <Loader2 size={18} className="animate-spin shrink-0" />
                    <span>Đang thu video hoạt hình... {exportProgress}%</span>
                  </>
                ) : (
                  <>
                    <Download size={18} className="shrink-0" />
                    <span className="hidden sm:inline">Tải Video Hoạt Hình 20/10 Về Máy (.mp4 / .webm)</span>
                    <span className="sm:hidden">Tải Video Hoạt Hình (.mp4 / .webm)</span>
                  </>
                )}
              </button>
            </div>

            {/* Success Video Ready Player & Share Modal */}
            {exportedVideoUrl && (
              <div
                className={`mt-6 w-full rounded-3xl p-5 border shadow-xl transition-all ${
                  isDarkTheme
                    ? 'bg-stone-900/90 border-emerald-500/40 text-stone-100'
                    : 'bg-emerald-50/90 border-emerald-300 text-stone-900'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                    <Check size={18} className="text-emerald-500" />
                    <span>Video hoạt ảnh hoạt hình đã tạo xong thành công!</span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600">
                    Full HD · Khung Ngang
                  </span>
                </div>

                <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-black mb-4 border border-emerald-500/20 shadow-inner">
                  <video
                    src={exportedVideoUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href={exportedVideoUrl}
                    download={`Video_Hoat_Hinh_20-10_${recipientName.replace(/\s+/g, '_')}.webm`}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <Download size={15} />
                    <span>Tải Ngay Về Máy</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleShareVideo}
                    className="py-2.5 px-4 rounded-xl border border-emerald-500/30 bg-white/50 dark:bg-stone-800 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-emerald-100/50 transition-all"
                  >
                    <Share2 size={15} />
                    <span>{copiedLink ? 'Đã sao chép link!' : 'Chia sẻ video'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
