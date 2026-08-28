import { VideoFormat, QuranAyah, RenderedVideoOutput, SurahMeta, FontSizeOption } from '../types';
import { updateCachedAudioDuration } from './quranService';

export interface RenderOptions {
  canvas: HTMLCanvasElement;
  videoElement?: HTMLVideoElement | null;
  imageElement?: HTMLImageElement | null;
  mediaElement?: HTMLVideoElement | HTMLImageElement | null;
  slideshowImages?: HTMLImageElement[];
  verses: QuranAyah[];
  surah: SurahMeta;
  format: VideoFormat;
  showTranslation: boolean;
  showParticles: boolean;
  showSurahHeader?: boolean;
  showVerseNumbers?: boolean;
  fontSize: FontSizeOption;
  verseStyle?: string;
  versePosition?: 'bottom' | 'center';
  onProgress?: (percent: number, currentTime: number, totalDuration: number) => void;
  showLogo?: boolean;
  logoUrl?: string;
  logoOpacity?: number;
  logoSize?: number;
}

const loadedSlideshowCache: Map<string, HTMLImageElement> = new Map();

export function preloadSlideshowImages(imageUrls: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(
    imageUrls.map((url) => {
      if (loadedSlideshowCache.has(url)) {
        return Promise.resolve(loadedSlideshowCache.get(url)!);
      }
      return new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = url;
        img.onload = () => {
          loadedSlideshowCache.set(url, img);
          resolve(img);
        };
        img.onerror = () => {
          resolve(img);
        };
      });
    })
  );
}

export function drawKenBurnsSlideshow(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  slideshowImages: HTMLImageElement[]
): boolean {
  if (!slideshowImages || slideshowImages.length === 0) return false;

  const validImages = slideshowImages.filter(
    (img) => (img.complete || img.naturalWidth > 0) && (img.naturalWidth || img.width) > 0
  );
  if (validImages.length === 0) return false;

  const slideDuration = 5.0; // 5s per nature photo
  const transDuration = 1.2; // 1.2s crossfade transition
  const K = validImages.length;

  const currentIdx = Math.floor(time / slideDuration) % K;
  const nextIdx = (currentIdx + 1) % K;
  const localTime = time % slideDuration;
  const slideProgress = localTime / slideDuration;

  const renderSingleSlide = (img: HTMLImageElement, progress: number, patternIdx: number, opacity: number) => {
    const mWidth = img.naturalWidth || img.width;
    const mHeight = img.naturalHeight || img.height;
    if (!mWidth || !mHeight) return;

    const mRatio = mWidth / mHeight;
    const cRatio = width / height;

    let sWidth = mWidth;
    let sHeight = mHeight;
    let sx = 0;
    let sy = 0;

    if (mRatio > cRatio) {
      sWidth = mHeight * cRatio;
      sx = (mWidth - sWidth) / 2;
    } else {
      sHeight = mWidth / cRatio;
      sy = (mHeight - sHeight) / 2;
    }

    const pattern = patternIdx % 4;
    let scale = 1.0;
    let dx = 0;
    let dy = 0;

    if (pattern === 0) {
      // Zoom In Center (1.00 -> 1.28)
      scale = 1.00 + progress * 0.28;
    } else if (pattern === 1) {
      // Zoom Out Center (1.28 -> 1.00)
      scale = 1.28 - progress * 0.28;
    } else if (pattern === 2) {
      // Zoom In + Smooth Pan Top-Left to Bottom-Right
      scale = 1.05 + progress * 0.22;
      dx = (progress - 0.5) * width * 0.06;
      dy = (progress - 0.5) * height * 0.06;
    } else {
      // Zoom Out + Smooth Pan Bottom-Right to Top-Left
      scale = 1.28 - progress * 0.22;
      dx = (0.5 - progress) * width * 0.06;
      dy = (0.5 - progress) * height * 0.06;
    }

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
    ctx.translate(width / 2 + dx, height / 2 + dy);
    ctx.scale(scale, scale);
    ctx.drawImage(img, sx, sy, sWidth, sHeight, -width / 2, -height / 2, width, height);
    ctx.restore();
  };

  if (localTime >= slideDuration - transDuration && validImages.length > 1) {
    const transProgress = (localTime - (slideDuration - transDuration)) / transDuration;
    // Current slide fading out
    renderSingleSlide(validImages[currentIdx], slideProgress, currentIdx, 1.0 - transProgress);
    // Next slide fading in
    renderSingleSlide(validImages[nextIdx], 0, nextIdx, transProgress);
  } else {
    // Normal single slide
    renderSingleSlide(validImages[currentIdx], slideProgress, currentIdx, 1.0);
  }

  return true;
}

export interface Particle {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  alpha: number;
  maxAlpha: number;
  twinkleSpeed: number;
}

export function getResolutionForFormat(format: VideoFormat): { width: number; height: number } {
  switch (format) {
    case '9:16':
      return { width: 720, height: 1280 };
    case '16:9':
      return { width: 1280, height: 720 };
    case '1:1':
      return { width: 720, height: 720 };
    default:
      return { width: 720, height: 1280 };
  }
}

// Convert numbers to Arabic-Indic digits (always return English digits now)
export function toArabicDigits(num: number): string {
  return String(num);
}

// Draw a single frame of the Quran video onto the canvas
export function drawQuranFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  totalDuration: number,
  verses: QuranAyah[],
  surah: SurahMeta,
  mediaElement: HTMLVideoElement | HTMLImageElement | null,
  options: {
    format: VideoFormat;
    showTranslation: boolean;
    showParticles: boolean;
    showSurahHeader?: boolean;
    showVerseNumbers?: boolean;
    fontSize: FontSizeOption;
    verseStyle?: string;
    versePosition?: 'bottom' | 'center';
    particles?: Particle[];
    slideshowImages?: HTMLImageElement[];
    showLogo?: boolean;
    logoOpacity?: number;
    logoImage?: HTMLImageElement | null;
    logoSize?: number;
  }
) {
  // 1. Draw Background: Nature Video, Animated Slideshow, Single Photo, or Fallback
  let mediaDrawn = false;

  if (options.slideshowImages && options.slideshowImages.length > 0) {
    mediaDrawn = drawKenBurnsSlideshow(ctx, width, height, time, options.slideshowImages);
  }

  if (!mediaDrawn && mediaElement) {
    try {
      const isVideo = typeof HTMLVideoElement !== 'undefined' && mediaElement instanceof HTMLVideoElement;
      let mWidth = 0;
      let mHeight = 0;
      let isReady = false;

      if (isVideo) {
        const vid = mediaElement as HTMLVideoElement;
        mWidth = vid.videoWidth;
        mHeight = vid.videoHeight;
        isReady = vid.readyState >= 2 && mWidth > 0;
      } else {
        const img = mediaElement as HTMLImageElement;
        mWidth = img.naturalWidth || img.width;
        mHeight = img.naturalHeight || img.height;
        isReady = (img.complete || img.naturalWidth > 0) && mWidth > 0;
      }

      if (isReady && mWidth > 0 && mHeight > 0) {
        const mRatio = mWidth / mHeight;
        const cRatio = width / height;

        let sWidth = mWidth;
        let sHeight = mHeight;
        let sx = 0;
        let sy = 0;

        if (mRatio > cRatio) {
          sWidth = mHeight * cRatio;
          sx = (mWidth - sWidth) / 2;
        } else {
          sHeight = mWidth / cRatio;
          sy = (mHeight - sHeight) / 2;
        }

        if (!isVideo) {
          // Subtle majestic cinematic slow zoom (1.0 to 1.04) for nature photos
          const progress = Math.max(0, Math.min(1, time / Math.max(1, totalDuration)));
          const zoom = 1.0 + progress * 0.04;
          ctx.save();
          ctx.translate(width / 2, height / 2);
          ctx.scale(zoom, zoom);
          ctx.drawImage(mediaElement, sx, sy, sWidth, sHeight, -width / 2, -height / 2, width, height);
          ctx.restore();
        } else {
          ctx.drawImage(mediaElement, sx, sy, sWidth, sHeight, 0, 0, width, height);
        }
        mediaDrawn = true;
      }
    } catch {
      mediaDrawn = false;
    }
  }

  if (!mediaDrawn) {
    // Procedural peaceful nature gradient with gentle floating mist
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#03110d'); // Deep Quranic emerald night
    bgGradient.addColorStop(0.5, '#06231a');
    bgGradient.addColorStop(1, '#020b08');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Subtle drifting celestial radial glow
    const glowX = width / 2 + Math.sin(time * 0.5) * 50;
    const glowY = height * 0.4 + Math.cos(time * 0.4) * 40;
    const glowGrad = ctx.createRadialGradient(glowX, glowY, 20, glowX, glowY, width * 0.6);
    glowGrad.addColorStop(0, 'rgba(16, 185, 129, 0.15)');
    glowGrad.addColorStop(0.5, 'rgba(212, 175, 55, 0.08)');
    glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, width, height);
  }

  // 2. Cinematic Atmospheric Vignette & Contrast Overlays
  // Ensures 100% readability of sacred text while allowing nature footage to remain bright and vivid
  const isBottom = options.versePosition !== 'center';

  if (mediaDrawn) {
    if (isBottom) {
      // Soft vignette letting the upper nature scenery glow
      const vignette = ctx.createRadialGradient(
        width / 2,
        height * 0.4,
        width * 0.2,
        width / 2,
        height * 0.4,
        Math.max(width, height) * 0.8
      );
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0.05)');
      vignette.addColorStop(0.6, 'rgba(0, 0, 0, 0.22)');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      // Top subtle fade for Surah title header
      const topFade = ctx.createLinearGradient(0, 0, 0, height * 0.18);
      topFade.addColorStop(0, 'rgba(0, 0, 0, 0.60)');
      topFade.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = topFade;
      ctx.fillRect(0, 0, width, height * 0.18);

      // Bottom atmospheric dark gradient where verses sit
      const bottomFade = ctx.createLinearGradient(0, height * 0.45, 0, height);
      bottomFade.addColorStop(0, 'rgba(0, 0, 0, 0)');
      bottomFade.addColorStop(0.4, 'rgba(2, 10, 8, 0.45)');
      bottomFade.addColorStop(1, 'rgba(1, 5, 4, 0.88)');
      ctx.fillStyle = bottomFade;
      ctx.fillRect(0, height * 0.45, width, height * 0.55);
    } else {
      // Centered placement overlay
      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        width * 0.2,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75
      );
      vignette.addColorStop(0, 'rgba(5, 15, 12, 0.35)');
      vignette.addColorStop(0.65, 'rgba(3, 10, 8, 0.60)');
      vignette.addColorStop(1, 'rgba(2, 6, 5, 0.85)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);
    }
  } else {
    // Procedural background vignette
    const vignette = ctx.createRadialGradient(
      width / 2,
      height / 2,
      width * 0.2,
      width / 2,
      height / 2,
      Math.max(width, height) * 0.75
    );
    vignette.addColorStop(0, 'rgba(5, 15, 12, 0.45)');
    vignette.addColorStop(0.65, 'rgba(3, 10, 8, 0.72)');
    vignette.addColorStop(1, 'rgba(2, 6, 5, 0.92)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  }

  // 3. Glowing Golden Particles
  if (options.showParticles && options.particles) {
    ctx.save();
    options.particles.forEach((p) => {
      // Update particle position
      p.y -= p.speedY;
      p.x += p.speedX;
      p.alpha += p.twinkleSpeed;
      if (p.alpha > p.maxAlpha || p.alpha < 0.05) {
        p.twinkleSpeed = -p.twinkleSpeed;
      }
      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      // Draw particle
      const particleRadius = Math.max(0.1, p.radius || 1);
      ctx.beginPath();
      ctx.arc(p.x, p.y, particleRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(234, 179, 8, ${Math.max(0, Math.min(1, p.alpha))})`;
      ctx.shadowColor = 'rgba(234, 179, 8, 0.8)';
      ctx.shadowBlur = 8;
      ctx.fill();
    });
    ctx.restore();
  }

  // 4. Calculate Active Ayah based on current timestamp
  let accumulatedTime = 0;
  let activeVerseIndex = 0;
  let verseProgress = 0; // 0 to 1 inside current verse

  for (let i = 0; i < verses.length; i++) {
    const vDuration = verses[i].duration || 5;
    if (time >= accumulatedTime && time < accumulatedTime + vDuration) {
      activeVerseIndex = i;
      verseProgress = (time - accumulatedTime) / vDuration;
      break;
    }
    accumulatedTime += vDuration;
    if (i === verses.length - 1) {
      activeVerseIndex = i;
      verseProgress = 1;
    }
  }

  const currentAyah = verses[activeVerseIndex];
  if (!currentAyah) return;

  // Smooth continuous transition opacity between verses (soft crossfade)
  const fadeDuration = 0.22; // seconds
  let verseAlpha = 1.0;
  const currentDuration = currentAyah.duration || 5;
  const timeIntoVerse = verseProgress * currentDuration;
  const timeRemainingInVerse = currentDuration - timeIntoVerse;

  if (timeIntoVerse < fadeDuration) {
    verseAlpha = Math.max(0.35, timeIntoVerse / fadeDuration);
  } else if (timeRemainingInVerse < fadeDuration && activeVerseIndex < verses.length - 1) {
    verseAlpha = Math.max(0.35, timeRemainingInVerse / fadeDuration);
  }

  // 5. Surah Header Banner (Top section)
  if (options.showSurahHeader !== false) {
    ctx.save();
    
    // Higher up position for reels, squares, and landscape
    const headerY = options.format === '9:16' ? height * 0.075 : (options.format === '16:9' ? height * 0.07 : height * 0.08);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '600 16.5px "Amiri", "Scheherazade New", serif';
    
    // Dynamic text including Surah name and current ayah
    const textString = `﴿ ${surah.name} ﴾ • الآية ${currentAyah.numberInSurah}`;
    const textWidth = ctx.measureText(textString).width;
    
    // Dynamic appropriate banner width with safe padding
    const bannerWidth = Math.max(textWidth + 48, 160);
    const bannerHeight = 38;
    const bannerX = (width - bannerWidth) / 2;
    const bannerY = headerY - bannerHeight / 2;

    // Draw Ornamental Pill Backdrop for Surah Name & Ayah Indicator
    ctx.fillStyle = 'rgba(4, 22, 16, 0.76)';
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.55)';
    ctx.lineWidth = 1.25;
    roundRect(ctx, bannerX, bannerY, bannerWidth, bannerHeight, bannerHeight / 2);
    ctx.fill();
    ctx.stroke();

    // Draw Text Centered
    ctx.fillStyle = '#FEF08A'; // Elegant yellow-gold
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 4;
    ctx.fillText(textString, width / 2, headerY);

    ctx.restore();
  }

  // 6. Card / Backdrop for Quranic Text
  ctx.save();
  ctx.globalAlpha = verseAlpha;

  const isLandscape = options.format === '16:9';
  const isBottomPlacement = options.versePosition !== 'center';
  const cardWidth = isLandscape ? width * 0.82 : width * 0.90;
  const maxWidth = cardWidth - (isLandscape ? 48 : 36);

  // 7. Calculate Font Sizes and Line Wraps
  let arabicFontSize = 32;
  if (options.fontSize === 'small') arabicFontSize = isLandscape ? 20 : 22;
  else if (options.fontSize === 'medium') arabicFontSize = isLandscape ? 26 : 28;
  else if (options.fontSize === 'large') arabicFontSize = isLandscape ? 32 : 34;
  else if (options.fontSize === 'extra-large') arabicFontSize = isLandscape ? 38 : 42;
  else if (options.fontSize === 'huge') arabicFontSize = isLandscape ? 46 : 52;

  // Ayah number is completely deleted as requested
  const ayahSymbol = '';
  const fullArabicText = currentAyah.text;
  const arabicLineHeight = arabicFontSize * 1.65;

  ctx.font = `600 ${arabicFontSize}px "Amiri Quran", "Scheherazade New", serif`;
  const arabicLines = wrapText(ctx, fullArabicText, maxWidth);

  const hasBismillah = currentAyah.numberInSurah === 1 && surah.number !== 1 && surah.number !== 9;
  const bismillahHeight = hasBismillah ? (isLandscape ? 38 : 44) : 0;

  const translationFontSize = isLandscape ? 15 : 16;
  const transLineHeight = translationFontSize * 1.45;
  let translationLines: string[] = [];
  if (options.showTranslation && currentAyah.translation) {
    ctx.font = `400 ${translationFontSize}px "Outfit", sans-serif`;
    translationLines = wrapText(ctx, `"${currentAyah.translation}"`, maxWidth);
  }
  const translationHeight = translationLines.length > 0 ? translationLines.length * transLineHeight + 28 : 0;

  const paddingY = isLandscape ? 20 : 24;
  const totalContentHeight = bismillahHeight + (arabicLines.length * arabicLineHeight) + translationHeight;
  const cardHeight = totalContentHeight + paddingY * 2;
  const cardX = (width - cardWidth) / 2;

  let cardY: number;
  if (isBottomPlacement) {
    // Bottom placement (Default) - leave space for bottom waveform visualizer at height * 0.92
    const bottomWaveMargin = isLandscape ? height * 0.12 : height * 0.09;
    cardY = Math.max(height * 0.32, height - bottomWaveMargin - cardHeight);
  } else {
    // Center placement
    cardY = Math.max(height * 0.18, (height - cardHeight) / 2);
  }

  const vStyle = options.verseStyle || 'border';

  if (vStyle === 'card') {
    // Soft translucent glassmorphism container
    ctx.fillStyle = 'rgba(3, 16, 12, 0.72)';
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
    ctx.lineWidth = 1;
    roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 16);
    ctx.fill();
    ctx.stroke();

    // Subtle ornamental corner brackets
    drawCornerDecorations(ctx, cardX, cardY, cardWidth, cardHeight);
  } else if (vStyle === 'border') {
    // Border only (faint background)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.65)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 8);
    ctx.fill();
    ctx.stroke();
  } else if (vStyle === 'badge') {
    // Fully rounded pill badge shape (perfect capsule!)
    ctx.fillStyle = 'rgba(4, 20, 15, 0.82)';
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, cardX, cardY, cardWidth, cardHeight, cardHeight / 2);
    ctx.fill();
    ctx.stroke();
  } else if (vStyle === 'glowing') {
    // Glowing borders and background
    ctx.save();
    ctx.shadowBlur = 20;
    ctx.shadowColor = 'rgba(234, 179, 8, 0.55)';
    ctx.fillStyle = 'rgba(3, 12, 10, 0.75)';
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.55)';
    ctx.lineWidth = 1.2;
    roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 16);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  } else if (vStyle === 'minimal') {
    // Minimal: text draws directly on background with custom deep drop shadow
  }

  // 8. Bismillah if starting verse
  let currentY = cardY + paddingY;
  if (hasBismillah) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(234, 179, 8, 0.95)';
    ctx.font = '700 22px "Amiri Quran", "Amiri", serif';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 8;
    ctx.fillText('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', width / 2, currentY + 18);
    currentY += bismillahHeight;
  }

  // 9. Render Arabic Quran Text
  ctx.textAlign = 'center';
  ctx.font = `600 ${arabicFontSize}px "Amiri Quran", "Scheherazade New", serif`;
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;

  arabicLines.forEach((line, index) => {
    ctx.fillText(line, width / 2, currentY + (index + 0.8) * arabicLineHeight);
  });

  currentY += arabicLines.length * arabicLineHeight;

  // 10. Render English Translation / Subtitles (Optional)
  if (translationLines.length > 0) {
    // Subtle gold separator
    const sepY = currentY + 10;
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 55, sepY);
    ctx.lineTo(width / 2 + 55, sepY);
    ctx.stroke();

    // Diamond center accent
    ctx.fillStyle = '#EAB308';
    ctx.beginPath();
    ctx.arc(width / 2, sepY, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = `400 ${translationFontSize}px "Outfit", sans-serif`;
    ctx.fillStyle = '#F1F5F9';
    ctx.shadowBlur = 6;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';

    translationLines.forEach((line, index) => {
      ctx.fillText(line, width / 2, currentY + 24 + (index + 0.8) * transLineHeight);
    });
  }

  ctx.restore();

  // 10. Subtle Audio Waveform Visualizer & Progress Bar (Bottom section)
  ctx.save();
  const waveY = options.format === '9:16' ? height * 0.92 : height * 0.90;
  const barCount = 28;
  const barWidth = 3;
  const barGap = 4;
  const totalWaveWidth = barCount * (barWidth + barGap);
  const waveStartX = (width - totalWaveWidth) / 2;

  for (let b = 0; b < barCount; b++) {
    // Animate wave height based on audio playback time and sin waves
    const freq = b * 0.3 + time * 6.5;
    const waveAmp = Math.abs(Math.sin(freq) * Math.cos(freq * 0.7));
    const barHeight = 4 + waveAmp * 18;

    const bx = waveStartX + b * (barWidth + barGap);
    const by = waveY - barHeight / 2;

    const grad = ctx.createLinearGradient(0, by, 0, by + barHeight);
    grad.addColorStop(0, '#FACC15');
    grad.addColorStop(1, '#059669');

    ctx.fillStyle = grad;
    roundRect(ctx, bx, by, barWidth, barHeight, 1.5);
    ctx.fill();
  }

  // 11. Draw Brand Logo Overlay (Custom logo on top right)
  if (options.showLogo && options.logoImage) {
    ctx.save();
    ctx.globalAlpha = options.logoOpacity ?? 0.9;
    
    const logoImg = options.logoImage;
    const logoAspect = logoImg.naturalWidth / logoImg.naturalHeight || 1;
    
    // Target logo width depends on video resolution & layout format
    let targetWidth = width * 0.12; 
    if (options.format === '9:16') {
      targetWidth = width * 0.15;
    } else if (options.format === '16:9') {
      targetWidth = width * 0.08;
    }
    
    // Apply user's custom size scale (logoSize is e.g. 30 to 250, default 100)
    const scaleFactor = (options.logoSize ?? 100) / 100;
    targetWidth = targetWidth * scaleFactor;
    
    // Maintain reasonable logo size limits (neither too small nor huge)
    targetWidth = Math.max(15, Math.min(targetWidth, 450));
    
    let dw = targetWidth;
    let dh = targetWidth / logoAspect;
    
    // Scale height down if it takes too much space vertically
    const maxHeight = height * 0.085;
    if (dh > maxHeight) {
      dh = maxHeight;
      dw = maxHeight * logoAspect;
    }
    
    // Coordinates for top-right alignment
    const paddingX = options.format === '16:9' ? width * 0.035 : width * 0.05;
    const paddingY = options.format === '16:9' ? height * 0.045 : height * 0.035;
    
    const dx = width - dw - paddingX;
    const dy = paddingY;
    
    // Subtle shadow for absolute visibility against bright backgrounds
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 1.5;
    
    try {
      ctx.drawImage(logoImg, dx, dy, dw, dh);
    } catch (e) {
      console.warn("Failed to draw logo overlay:", e);
    }
    ctx.restore();
  }

  ctx.restore();
}

// Text wrapping utility for Canvas
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

// Rounded rectangle helper with strict safety guards against zero/negative dimensions or radius
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  if (width <= 0 || height <= 0) return;
  const safeRadius = Math.max(0, Math.min(radius, width / 2, height / 2));
  if (safeRadius <= 0) {
    ctx.rect(x, y, width, height);
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x + safeRadius, y);
  ctx.arcTo(x + width, y, x + width, y + height, safeRadius);
  ctx.arcTo(x + width, y + height, x, y + height, safeRadius);
  ctx.arcTo(x, y + height, x, y, safeRadius);
  ctx.arcTo(x, y, x + width, y, safeRadius);
  ctx.closePath();
}

// Subtle Islamic ornamental corner brackets
function drawCornerDecorations(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const size = 14;
  ctx.strokeStyle = 'rgba(234, 179, 8, 0.55)';
  ctx.lineWidth = 1.5;

  // Top-left
  ctx.beginPath();
  ctx.moveTo(x + 6, y + 6 + size);
  ctx.lineTo(x + 6, y + 6);
  ctx.lineTo(x + 6 + size, y + 6);
  ctx.stroke();

  // Top-right
  ctx.beginPath();
  ctx.moveTo(x + w - 6 - size, y + 6);
  ctx.lineTo(x + w - 6, y + 6);
  ctx.lineTo(x + w - 6, y + 6 + size);
  ctx.stroke();

  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(x + 6, y + h - 6 - size);
  ctx.lineTo(x + 6, y + h - 6);
  ctx.lineTo(x + 6 + size, y + h - 6);
  ctx.stroke();

  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(x + w - 6 - size, y + h - 6);
  ctx.lineTo(x + w - 6, y + h - 6);
  ctx.lineTo(x + w - 6, y + h - 6 - size);
  ctx.stroke();
}

// Generate initial floating particles
export function createParticles(count = 35, width = 720, height = 1280): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      speedY: Math.random() * 0.6 + 0.2,
      speedX: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.6 + 0.1,
      maxAlpha: Math.random() * 0.5 + 0.4,
      twinkleSpeed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1)
    });
  }
  return particles;
}

// Fetch and concatenate all verses audio into a single Web Audio AudioBuffer
export async function concatenateVersesAudio(
  audioCtx: AudioContext,
  verses: QuranAyah[]
): Promise<AudioBuffer> {
  const audioBuffers: AudioBuffer[] = [];

  for (const v of verses) {
    try {
      const resp = await fetch(v.audioUrl);
      if (!resp.ok) throw new Error(`Audio fetch failed ${resp.status}`);
      const arrayBuffer = await resp.arrayBuffer();
      const decoded = await audioCtx.decodeAudioData(arrayBuffer);
      // Synchronize exact decoded audio duration down to microsecond
      v.duration = decoded.duration;
      updateCachedAudioDuration(v.audioUrl, decoded.duration);
      audioBuffers.push(decoded);
    } catch (err) {
      console.warn(`Failed to decode audio for ayah ${v.numberInSurah}, synthesizing silence:`, err);
      // Fallback: create silent audio buffer for calculated duration
      const duration = v.duration || 5;
      const silentBuffer = audioCtx.createBuffer(
        2,
        Math.floor(audioCtx.sampleRate * duration),
        audioCtx.sampleRate
      );
      audioBuffers.push(silentBuffer);
    }
  }

  // Calculate total duration in samples
  const totalLength = audioBuffers.reduce((acc, b) => acc + b.length, 0);
  const numberOfChannels = audioBuffers[0]?.numberOfChannels || 2;
  const mergedBuffer = audioCtx.createBuffer(
    numberOfChannels,
    totalLength,
    audioCtx.sampleRate
  );

  let offset = 0;
  for (const buf of audioBuffers) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const inputChannel = channel < buf.numberOfChannels ? channel : 0;
      mergedBuffer.copyToChannel(buf.getChannelData(inputChannel), channel, offset);
    }
    offset += buf.length;
  }

  return mergedBuffer;
}

// Convert Web Audio AudioBuffer into a browser-playable 16-bit PCM WAV Blob
export function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const samples = buffer.length;
  const dataSize = samples * blockAlign;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;

  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);

  function writeString(offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  writeString(0, 'RIFF');
  view.setUint32(4, totalSize - 8, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  const channelData: Float32Array[] = [];
  for (let ch = 0; ch < numChannels; ch++) {
    channelData.push(buffer.getChannelData(ch));
  }

  let offset = 44;
  for (let i = 0; i < samples; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      let sample = channelData[ch][i];
      sample = Math.max(-1, Math.min(1, sample));
      const intSample = sample < 0 ? sample * 32768 : sample * 32767;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

// Builds a single seamless continuous audio track for uninterrupted tilawah
export async function createContinuousAudioTrack(
  verses: QuranAyah[],
  audioCtx: AudioContext
): Promise<{ blobUrl: string; totalDuration: number }> {
  const mergedBuffer = await concatenateVersesAudio(audioCtx, verses);
  const wavBlob = audioBufferToWavBlob(mergedBuffer);
  const blobUrl = URL.createObjectURL(wavBlob);
  return { blobUrl, totalDuration: mergedBuffer.duration };
}

// Main Video Render Function: records canvas and audio into high quality video
export async function renderQuranVideo(options: RenderOptions): Promise<RenderedVideoOutput> {
  const {
    canvas,
    videoElement,
    imageElement,
    mediaElement = videoElement || imageElement || null,
    verses,
    surah,
    format,
    showTranslation,
    showParticles,
    fontSize,
    verseStyle,
    versePosition = 'bottom',
    onProgress
  } = options;

  const { width, height } = getResolutionForFormat(format);
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const audioCtx = new AudioContextClass();

  // Load and merge all recitation audios
  const mergedAudio = await concatenateVersesAudio(audioCtx, verses);
  const totalDuration = mergedAudio.duration;

  // Load brand logo image for offline rendering if requested
  let loadedLogoImg: HTMLImageElement | null = null;
  if (options.showLogo && options.logoUrl) {
    loadedLogoImg = await new Promise<HTMLImageElement | null>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => {
        console.warn('Failed to load logo image for offline render');
        resolve(null);
      };
      img.src = options.logoUrl!;
    });
  }

  // Setup Web Audio nodes for MediaRecorder
  const destination = audioCtx.createMediaStreamDestination();
  const sourceNode = audioCtx.createBufferSource();
  sourceNode.buffer = mergedAudio;
  sourceNode.connect(destination);

  // Setup Canvas Stream safely across browsers
  const canvasWithStream = canvas as HTMLCanvasElement & { captureStream?: (fps?: number) => MediaStream; mozCaptureStream?: (fps?: number) => MediaStream };
  const canvasStream = canvasWithStream.captureStream ? canvasWithStream.captureStream(30) : canvasWithStream.mozCaptureStream ? canvasWithStream.mozCaptureStream(30) : null;
  if (!canvasStream) {
    throw new Error('Canvas recording is not supported in this browser environment.');
  }

  const combinedStream = new MediaStream([
    ...canvasStream.getVideoTracks(),
    ...destination.stream.getAudioTracks()
  ]);

  // Determine optimal supported MIME type (prioritize MP4 format)
  let mimeType = 'video/mp4';
  const candidates = [
    'video/mp4;codecs=avc1,mp4a.40.2',
    'video/mp4;codecs=avc1',
    'video/mp4',
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm'
  ];
  if (typeof MediaRecorder !== 'undefined') {
    for (const cand of candidates) {
      if (MediaRecorder.isTypeSupported(cand)) {
        mimeType = cand;
        break;
      }
    }
  }

  const mediaRecorder = new MediaRecorder(combinedStream, {
    mimeType,
    videoBitsPerSecond: 3_500_000 // High quality 3.5 Mbps
  });

  const chunks: Blob[] = [];
  mediaRecorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  const particles = createParticles(40, width, height);

  return new Promise((resolve, reject) => {
    let animationFrameId: number;
    let startTime: number | null = null;

    mediaRecorder.onstop = () => {
      cancelAnimationFrame(animationFrameId);
      audioCtx.close().catch(() => {});
      const outputType = mimeType.includes('mp4') ? 'video/mp4' : 'video/mp4';
      const blob = new Blob(chunks, { type: outputType });
      const blobUrl = URL.createObjectURL(blob);
      const safeSurahName = surah.englishName.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `Quran_${safeSurahName}_v${verses[0].numberInSurah}-${verses[verses.length - 1].numberInSurah}_${format.replace(':', 'x')}.mp4`;

      resolve({
        blobUrl,
        fileName,
        duration: totalDuration,
        fileSizeBytes: blob.size
      });
    };

    mediaRecorder.onerror = (e) => {
      cancelAnimationFrame(animationFrameId);
      audioCtx.close().catch(() => {});
      reject(e);
    };

    // Start video playback if available and is video element
    if (mediaElement && typeof HTMLVideoElement !== 'undefined' && mediaElement instanceof HTMLVideoElement) {
      mediaElement.currentTime = 0;
      mediaElement.play().catch(() => {});
    }

    // Start Audio and Recording
    sourceNode.start(0);
    mediaRecorder.start(250); // Slice chunks every 250ms

    // Frame rendering loop
    function renderLoop(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;

      // Draw active frame
      drawQuranFrame(ctx!, width, height, elapsed, totalDuration, verses, surah, mediaElement, {
        format,
        showTranslation,
        showParticles,
        showSurahHeader: options.showSurahHeader,
        showVerseNumbers: options.showVerseNumbers,
        fontSize,
        verseStyle,
        versePosition,
        particles,
        slideshowImages: options.slideshowImages,
        showLogo: options.showLogo,
        logoOpacity: options.logoOpacity,
        logoImage: loadedLogoImg,
        logoSize: options.logoSize
      });

      // Progress reporting
      const percent = Math.min(100, Math.floor((elapsed / totalDuration) * 100));
      onProgress?.(percent, elapsed, totalDuration);

      if (elapsed < totalDuration) {
        animationFrameId = requestAnimationFrame(renderLoop);
      } else {
        // Complete
        mediaRecorder.stop();
      }
    }

    animationFrameId = requestAnimationFrame(renderLoop);
  });
}
