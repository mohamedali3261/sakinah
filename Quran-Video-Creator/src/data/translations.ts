export const TRANSLATIONS = {
  en: {
    appTitle: "Tilawah",
    appSubtitle: "Automatic Quran Video Creator",
    tagline: "Create breathtaking Quran recitation videos with authentic Arabic calligraphy, nature backgrounds, and audio synchronization in seconds.",
    languageToggle: "العربية",
    
    // Steps
    step1Title: "1. Configure",
    step1Desc: "Select your desired verses, reciter, background, and aspect ratio",
    step2Title: "2. Live Preview",
    step2Desc: "Instant playback with synchronized calligraphy and audio",
    step3Title: "3. Export Video",
    step3Desc: "Render & download your finished high-definition video",

    // Options
    surahLabel: "Surah",
    surahPlaceholder: "Select a Surah...",
    searchSurah: "Search by name or number...",
    startAyahLabel: "Starting Verse",
    ayahCountLabel: "Number of Verses",
    versesRange: "Verses to include",
    versesRangeText: (start: number, end: number, total: number) => `Verses ${start} to ${end} (of ${total} total)`,
    
    backgroundLabel: "Automatic Nature Video Background",
    bgTypeLabel: "Background Type",
    bgTypeVideo: "Nature Videos (HD)",
    bgTypeImage: "Scenic Photos (HD)",
    choosePreset: "Curated Nature Media",
    tabVideos: "Nature Videos (HD)",
    tabImages: "Nature Photos (HD)",
    tabUrl: "Direct Video URL",
    tabUpload: "Upload from Device",
    uploadCustom: "Upload Your Own Video / Photo",
    dropVideoHere: "Drag & drop video (MP4, WebM) or photo (JPG, PNG) here or browse",
    customVideoSelected: "Custom media selected",
    changeVideo: "Change Background",
    enterVideoUrl: "Direct Video or Photo URL",
    videoUrlPlaceholder: "Paste direct MP4/JPG link...",
    applyVideoUrl: "Apply Media",
    openPexelsVideos: "Explore Free Nature Videos ↗",
    openPexelsPhotos: "Explore Free Nature Photos ↗",
    pexelsNotice: "Tip: You can use our curated HD nature footage or upload your own video clips!",
    natureRealFootage: "HD Nature Footage & Photos",
    continuousRecitation: "Continuous Recitation (Seamless)",
    
    versePositionLabel: "Verse Placement",
    positionBottom: "Bottom (Cinematic Reels)",
    positionCenter: "Center",
    
    reciterLabel: "Quran Reciter / Voice",
    selectReciter: "Choose a reciter",
    
    formatLabel: "Video Format / Aspect Ratio",
    formatVertical: "9:16 Vertical",
    formatVerticalSub: "Reels • TikTok • Shorts",
    formatLandscape: "16:9 Landscape",
    formatLandscapeSub: "YouTube • Widescreen",
    formatSquare: "1:1 Square",
    formatSquareSub: "Instagram • Feeds",

    // Toggles
    subtitlesLabel: "English Translation Subtitles",
    subtitlesDesc: "Display Sahih International English translation under Arabic verses",
    particlesLabel: "Golden Dust Particles",
    particlesDesc: "Subtle atmospheric glowing particles",
    fontSizeLabel: "Arabic Font Size",
    fontSizeMedium: "Balanced",
    fontSizeLarge: "Large",
    fontSizeExtraLarge: "Grand Display",
    
    // Slow Motion & Random BG
    randomBgLabel: "Auto-select Random Nature Background",
    randomBgDesc: "Picks a random beautiful nature video automatically every time you generate a video",
    randomizeBtn: "Randomize Background 🎲",
    slowMotionLabel: "Background Video Slow-Motion Speed",
    slowMotionDesc: "Slow down background nature movement for a serene, meditative feel",
    speedSuperSlow: "Super Slow 0.25x",
    speedSlow: "Slow Motion 0.5x",
    speedCinematic: "Cinematic 0.75x",
    speedNormal: "Normal 1.0x",
    directDownloadBtn: "Render & Download Video 📥",

    // Action buttons
    generateBtn: "Generate Quran Video ✨",
    generatingBtn: "Generating Video...",
    renderVideoBtn: "Render Video File",
    renderingBtn: "Rendering Video...",
    downloadBtn: "Download Video (.webm)",
    reconfigureBtn: "Change Settings",
    previewAgain: "Replay Video",

    // Statuses
    statusFetching: "Fetching authentic Quran verses...",
    statusAudio: "Loading recitation audio...",
    statusSyncing: "Synchronizing verses with audio waveform...",
    statusRendering: "Rendering video frames (auto-crops to format)...",
    statusCompleted: "Video rendered successfully! Ready to download.",
    statusError: "An error occurred while preparing media. Please retry.",

    // Player
    verseNumber: "Ayah",
    totalDuration: "Duration",
    nowPlaying: "Now Reciting",
    bismillah: "In the name of Allah, the Entirely Merciful, the Especially Merciful",
    videoReadyHeadline: "Your Quran Video is Ready",
    videoReadySub: "Review the synchronized recitation below or download the rendered video file.",

    // Info & Badges
    meccan: "Meccan",
    medinan: "Medinan",
    ayahsWord: "Ayahs",
    formatBadge: "Format",
    reciterBadge: "Reciter",
    surahBadge: "Surah",
    durationBadge: "Est. Duration",
    
    // Quick presets
    quickPicks: "Popular Selections",
    quickPickFatihah: "Al-Fatihah (1-7)",
    quickPickKursi: "Ayat Al-Kursi (2:255)",
    quickPickMulk: "Al-Mulk (1-5)",
    quickPickRahman: "Ar-Rahman (1-13)",
    quickPickIkhlas: "Al-Ikhlas (1-4)",
    
    // Modal
    close: "Close",
    select: "Select"
  },
  ar: {
    appTitle: "تلاوة",
    appSubtitle: "صانع فيديوهات القرآن الكريم تلقائياً",
    tagline: "أنشئ فيديوهات قرآنية خاشعة ومؤثرة بالخط العثماني وأصوات كبار القراء وخلفيات الطبيعة الهادئة بضغطة زر واحدة.",
    languageToggle: "English",
    
    // Steps
    step1Title: "1. الإعدادات",
    step1Desc: "اختر السورة والآيات والقارئ وخلفية الطبيعة ومقاس الفيديو",
    step2Title: "2. المعاينة المباشرة",
    step2Desc: "مشاهدة فورية متزامنة بدقة مع الصوت والخط العثماني",
    step3Title: "3. تصدير وتحميل",
    step3Desc: "رندرة وتحميل الفيديو بجودة عالية وبدون علامات مائية",

    // Options
    surahLabel: "السورة الكريمة",
    surahPlaceholder: "اختر السورة...",
    searchSurah: "ابحث باسم السورة أو رقمها...",
    startAyahLabel: "آية البداية",
    ayahCountLabel: "عدد الآيات",
    versesRange: "الآيات المحددة",
    versesRangeText: (start: number, end: number, total: number) => `من الآية ${start} إلى ${end} (من إجمالي ${total} آية)`,
    
    backgroundLabel: "خلفية الفيديو الطبيعية تلقائياً",
    bgTypeLabel: "نوع خلفية الطبيعة",
    bgTypeVideo: "فيديوهات طبيعية متحركة HD",
    bgTypeImage: "صور طبيعية عالية الدقة HD",
    choosePreset: "مكتبة الفيديوهات الطبيعية المختارة",
    tabVideos: "فيديوهات طبيعية HD",
    tabImages: "صور طبيعية HD",
    tabUrl: "رابط فيديو مباشر",
    tabUpload: "رفع من جهازك",
    uploadCustom: "رفع فيديو أو صورة من جهازك",
    dropVideoHere: "اسحب ملف الفيديو (MP4, WebM) أو الصورة (JPG, PNG) هنا أو انقر للاختيار",
    customVideoSelected: "تم اختيار ملف وسائط خاص",
    changeVideo: "تغيير الخلفية",
    enterVideoUrl: "رابط مباشر لفيديو أو صورة",
    videoUrlPlaceholder: "ألصق رابط MP4 أو JPG مباشر...",
    applyVideoUrl: "استخدام هذا الرابط",
    openPexelsVideos: "تصفح مكتبة الفيديوهات الطبيعية ↗",
    openPexelsPhotos: "تصفح الصور الطبيعية ↗",
    pexelsNotice: "يمكنك استخدام فيديوهات الطبيعة المتاحة أو رفع ملف فيديو من جهازك مباشرة!",
    natureRealFootage: "مشاهد طبيعية فائقة الجودة 1080p",
    continuousRecitation: "تلاوة متصلة مستمرة (بدون توقف بين الآيات)",
    
    versePositionLabel: "موضع الآيات الكريمة",
    positionBottom: "أسفل الفيديو (سينمائي - ريلز)",
    positionCenter: "وسط الفيديو",
    
    reciterLabel: "القارئ / الصوت الشريف",
    selectReciter: "اختر القارئ",
    
    formatLabel: "مقاس وأبعاد الفيديو",
    formatVertical: "9:16 طولي",
    formatVerticalSub: "ريلز • تيك توك • شورتس",
    formatLandscape: "16:9 عرضي",
    formatLandscapeSub: "يوتيوب • شاشات عريضة",
    formatSquare: "1:1 مربع",
    formatSquareSub: "إنستغرام • منشورات",

    // Toggles
    subtitlesLabel: "الترجمة الإنجليزية للآيات",
    subtitlesDesc: "إظهار ترجمة معاني الآيات باللغة الإنجليزية أسفل النص العربي",
    particlesLabel: "ذرات الغبار الذهبية المتلألئة",
    particlesDesc: "تأثير جزيئات ضوئية هادئة تعزز الخشوع والجمال",
    fontSizeLabel: "حجم الخط القرآني",
    fontSizeMedium: "متناسق",
    fontSizeLarge: "كبير",
    fontSizeExtraLarge: "جلي عريض",

    // Slow Motion & Random BG
    randomBgLabel: "اختيار فيديو طبيعة عشوائي تلقائياً",
    randomBgDesc: "يتم اختيار مشاهد طبيعية رائعة بشكل عشوائي تلقائياً مع كل فيديو جديد تقوم بإنشائه",
    randomizeBtn: "تغيير خلفية عشوائية الآن 🎲",
    slowMotionLabel: "سرعة الحركة وخلفية الفيديو (سلو موشن)",
    slowMotionDesc: "تبطيء حركة المشاهد الطبيعية لإضافة انسيابية وخشوع وسينمائية هادئة على الفيديو",
    speedSuperSlow: "بطيء جداً 0.25x",
    speedSlow: "سلو موشن خاشع 0.5x",
    speedCinematic: "سينمائي 0.75x",
    speedNormal: "سرعة عادية 1.0x",
    directDownloadBtn: "تحميل الفيديو 📥",

    // Action buttons
    generateBtn: "إنشاء فيديو القرآن الكريم ✨",
    generatingBtn: "جاري إنشاء وتجهيز الفيديو...",
    renderVideoBtn: "بدء رندرة الفيديو",
    renderingBtn: "جاري رندرة الفيديو...",
    downloadBtn: "تحميل",
    reconfigureBtn: "تعديل الإعدادات",
    previewAgain: "إعادة التشغيل",

    // Statuses
    statusFetching: "جاري جلب الآيات الكريمة بالرسم العثماني الموثق...",
    statusAudio: "جاري تحميل التلاوة الصوتية للقارئ...",
    statusSyncing: "جاري مزامنة الآيات بدقة مع الصوت...",
    statusRendering: "جاري معالجة وتوليد الفيديو بالمقاس المختار...",
    statusCompleted: "تم إنشاء الفيديو بنجاح! جاهز للتحميل الآن.",
    statusError: "حدث خطأ أثناء جلب الوسائط. يرجى المحاولة مرة أخرى.",

    // Player
    verseNumber: "الآية",
    totalDuration: "المدة الإجمالية",
    nowPlaying: "الآية المتلوّة الآن",
    bismillah: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    videoReadyHeadline: "فيديو القرآن جاهز للمعاينة والتحميل",
    videoReadySub: "يمكنك الاستماع للتلاوة المتزامنة أدناه أو تحميل الفيديو المكتمل مباشرة.",

    // Info & Badges
    meccan: "مكية",
    medinan: "مدنية",
    ayahsWord: "آية",
    formatBadge: "المقاس",
    reciterBadge: "القارئ",
    surahBadge: "السورة",
    durationBadge: "المدة التقديرية",

    // Quick presets
    quickPicks: "اختيارات قرآنية شهيرة وسريعة",
    quickPickFatihah: "سورة الفاتحة (1-7)",
    quickPickKursi: "آية الكرسي (البقرة 255)",
    quickPickMulk: "سورة الملك (1-5)",
    quickPickRahman: "سورة الرحمن (1-13)",
    quickPickIkhlas: "سورة الإخلاص (1-4)",

    // Modal
    close: "إغلاق",
    select: "اختيار"
  }
};
