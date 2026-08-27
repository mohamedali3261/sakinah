export interface AdhanVoice {
  id: string;
  nameAr: string;
  nameEn: string;
  locationAr: string;
  locationEn: string;
  muezzinAr: string;
  muezzinEn: string;
  audioUrl: string;
  backupUrls?: string[];
  isFajrOnly?: boolean;
  descriptionAr: string;
  descriptionEn: string;
  badge: string;
  duration?: string;
  maqamAr?: string;
}

export const ADHAN_VOICES: AdhanVoice[] = [
  {
    id: 'makkah',
    nameAr: 'أذان الحرم المكي الشريف',
    nameEn: 'Makkah Grand Mosque Adhan',
    locationAr: 'مكة المكرمة 🕋',
    locationEn: 'Makkah Al-Mukarramah',
    muezzinAr: 'الشيخ علي أحمد ملا (شيخ مؤذني الحرم)',
    muezzinEn: 'Sheikh Ali Ahmed Mulla',
    audioUrl: 'https://cdn.aladhan.com/audio/adhans/a1.mp3',
    backupUrls: [
      'https://ia800301.us.archive.org/21/items/Adzan_Makkah/Adzan_Makkah.mp3',
      'https://media.sd.ma/assabile/adhan_3397120/0c4a4a821e25.mp3',
      'https://server8.mp3quran.net/athan/001.mp3'
    ],
    descriptionAr: 'الأذان المكي الخاشع والشهير الذي يصدح في جنبات الكعبة المشرفة منذ عقود.',
    descriptionEn: 'The iconic, soul-stirring Makkah call to prayer resonating around the Holy Kaaba.',
    badge: 'الأكثر استماعاً',
    duration: '3:45',
    maqamAr: 'مقام حجاز'
  },
  {
    id: 'madinah',
    nameAr: 'أذان المسجد النبوي الشريف',
    nameEn: 'Madinah Prophet’s Mosque Adhan',
    locationAr: 'المدينة المنورة 🕌',
    locationEn: 'Al-Madinah Al-Munawwarah',
    muezzinAr: 'الشيخ عبد المجيد السريحي / فاروق حضراوي',
    muezzinEn: 'Sheikh Abdul Majeed Al-Surayhi',
    audioUrl: 'https://cdn.aladhan.com/audio/adhans/a2.mp3',
    backupUrls: [
      'https://ia800302.us.archive.org/31/items/Adzan_Madinah/Adzan_Madinah.mp3',
      'https://media.sd.ma/assabile/adhan_3397120/1e0750278788.mp3',
      'https://server8.mp3quran.net/athan/002.mp3'
    ],
    descriptionAr: 'أذان طيبة الطيبة بنبراته الهادئة المفعمة بالسكينة والسلام والوقار النبوي.',
    descriptionEn: 'The serene and peaceful call to prayer echoing from the City of the Prophet ﷺ.',
    badge: 'سكينة وطمأنينة',
    duration: '3:30',
    maqamAr: 'مقام بياتي'
  },
  {
    id: 'alaqsa',
    nameAr: 'أذان المسجد الأقصى المبارك',
    nameEn: 'Al-Aqsa Mosque Adhan',
    locationAr: 'القدس الشريف 🕊️',
    locationEn: 'Al-Quds / Jerusalem',
    muezzinAr: 'مؤذنو المسجد الأقصى المبارك',
    muezzinEn: 'Muezzins of Al-Aqsa',
    audioUrl: 'https://cdn.aladhan.com/audio/adhans/a3.mp3',
    backupUrls: [
      'https://ia800301.us.archive.org/21/items/Adzan_Makkah/Adzan_AlAqsa.mp3',
      'https://server8.mp3quran.net/athan/003.mp3'
    ],
    descriptionAr: 'نداء الصلاة العذب من رحاب أولى القبلتين وثالث الحرمين الشريفين والمسجد الأقصى.',
    descriptionEn: 'The majestic call to prayer from the blessed courtyards of Al-Aqsa Mosque.',
    badge: 'عذب ومهيب',
    duration: '3:50',
    maqamAr: 'مقام نهاوند'
  },
  {
    id: 'abdulbasit',
    nameAr: 'أذان الشيخ عبد الباسط عبد الصمد',
    nameEn: 'Sheikh Abdul Basit Abdus Samad Adhan',
    locationAr: 'مصر 🇪🇬',
    locationEn: 'Egypt',
    muezzinAr: 'فضيلة الشيخ عبد الباسط عبد الصمد',
    muezzinEn: 'Sheikh Abdul Basit Abdus Samad',
    audioUrl: 'https://cdn.aladhan.com/audio/adhans/a4.mp3',
    backupUrls: [
      'https://ia800301.us.archive.org/21/items/AthanAbdul-basitAbdus-samadegypt/Athan-Abdul-basit.mp3',
      'https://server8.mp3quran.net/athan/004.mp3'
    ],
    descriptionAr: 'صوت مدرسة التلاوة الذهبية؛ أذان تاريخي متفرد في الخشوع وجمال المقامات.',
    descriptionEn: 'The legendary, golden-era Egyptian adhan by Sheikh Abdul Basit.',
    badge: 'تراثي ذهبي',
    duration: '4:10',
    maqamAr: 'مقام صبا'
  },
  {
    id: 'rifat',
    nameAr: 'أذان الشيخ محمد رفعت (جامع الأزهر)',
    nameEn: 'Sheikh Muhammad Rifat Historic Adhan',
    locationAr: 'القاهرة - جامع الأزهر 🇪🇬',
    locationEn: 'Cairo - Al-Azhar',
    muezzinAr: 'الشيخ محمد رفعت (قيثارة السماء)',
    muezzinEn: 'Sheikh Muhammad Rifat',
    audioUrl: 'https://cdn.aladhan.com/audio/adhans/a8.mp3',
    backupUrls: [
      'https://ia800201.us.archive.org/22/items/Sheikh-Muhammad-Rifat-Adhan/Rifat_Adhan.mp3',
      'https://cdn.aladhan.com/audio/adhans/a4.mp3'
    ],
    descriptionAr: 'الصوت الروحاني الأصيل لجامع الأزهر الشريف وإذاعة القرآن الكريم من القاهرة.',
    descriptionEn: 'The historic and soulful Egyptian adhan by Sheikh Muhammad Rifat.',
    badge: 'روحاني أصيل',
    duration: '3:55',
    maqamAr: 'مقام سيكاه'
  },
  {
    id: 'alafasy',
    nameAr: 'أذان الشيخ مشاري راشد العفاسي',
    nameEn: 'Sheikh Mishary Alafasy Adhan',
    locationAr: 'الكويت 🇰🇼',
    locationEn: 'Kuwait',
    muezzinAr: 'الشيخ مشاري بن راشد العفاسي',
    muezzinEn: 'Sheikh Mishary Rashid Alafasy',
    audioUrl: 'https://cdn.aladhan.com/audio/adhans/a5.mp3',
    backupUrls: [
      'https://ia800301.us.archive.org/1/items/MisharyRashidAlAfasyAdhan/Mishary_Adhan.mp3',
      'https://media.sd.ma/assabile/adhan_3397120/1e0750278788.mp3'
    ],
    descriptionAr: 'أذان عذب النبرات رقيق الصوت يدخل القلوب برقة وخشوع.',
    descriptionEn: 'The crystal-clear, melodious call to prayer by Sheikh Mishary Alafasy.',
    badge: 'عذب وخاشع',
    duration: '3:20',
    maqamAr: 'مقام كرد'
  },
  {
    id: 'qatami',
    nameAr: 'أذان الشيخ ناصر القطامي',
    nameEn: 'Sheikh Nasser Al-Qatami Adhan',
    locationAr: 'الرياض - السعودية 🇸🇦',
    locationEn: 'Riyadh, Saudi Arabia',
    muezzinAr: 'الشيخ ناصر القطامي',
    muezzinEn: 'Sheikh Nasser Al-Qatami',
    audioUrl: 'https://cdn.aladhan.com/audio/adhans/a6.mp3',
    backupUrls: [
      'https://ia801607.us.archive.org/3/items/NasserAlQatamiAdhan/qatami_adhan.mp3',
      'https://cdn.aladhan.com/audio/adhans/a1.mp3'
    ],
    descriptionAr: 'أذان ندي خاشع يأسر الأسماع بروعته وصفاء نبراته.',
    descriptionEn: 'Deep and contemplative call to prayer by Sheikh Nasser Al-Qatami.',
    badge: 'نديّ ومؤثر',
    duration: '3:40',
    maqamAr: 'مقام راست'
  },
  {
    id: 'salimi',
    nameAr: 'أذان الشيخ منصور السالمي',
    nameEn: 'Sheikh Mansour Al-Salimi Adhan',
    locationAr: 'جدة - السعودية 🇸🇦',
    locationEn: 'Jeddah, Saudi Arabia',
    muezzinAr: 'الشيخ منصور السالمي',
    muezzinEn: 'Sheikh Mansour Al-Salimi',
    audioUrl: 'https://cdn.aladhan.com/audio/adhans/a7.mp3',
    backupUrls: [
      'https://ia801509.us.archive.org/2/items/MansourSalimiAdhan/salimi_adhan.mp3',
      'https://cdn.aladhan.com/audio/adhans/a2.mp3'
    ],
    descriptionAr: 'أداء مفعم بالعاطفة الإيمانية والدعوة إلى الفلاح والنجاة.',
    descriptionEn: 'Heart-touching and emotional adhan by Sheikh Mansour Al-Salimi.',
    badge: 'مؤثر ورقيق',
    duration: '3:35',
    maqamAr: 'مقام عجم'
  },
  {
    id: 'turkey',
    nameAr: 'أذان إسطنبول (جامع السلطان أحمد)',
    nameEn: 'Istanbul Blue Mosque Adhan',
    locationAr: 'إسطنبول - تركيا 🇹🇷',
    locationEn: 'Istanbul, Turkey',
    muezzinAr: 'مؤذنو مساجد إسطنبول التاريخية',
    muezzinEn: 'Muezzins of Istanbul',
    audioUrl: 'https://cdn.aladhan.com/audio/adhans/a9.mp3',
    backupUrls: [
      'https://ia800301.us.archive.org/21/items/Adzan_Makkah/Adzan_Turkey.mp3',
      'https://cdn.aladhan.com/audio/adhans/a3.mp3'
    ],
    descriptionAr: 'الأذان العثماني الرخيم بمقام الرست والصبا المميز للمآذن التاريخية.',
    descriptionEn: 'The traditional Ottoman melodic adhan echoing across Istanbul.',
    badge: 'طراز عثماني',
    duration: '4:15',
    maqamAr: 'مقام رست'
  },
  {
    id: 'fajr_makkah',
    nameAr: 'أذان الفجر المكي (الصلاة خير من النوم)',
    nameEn: 'Makkah Fajr Adhan (Tathweeb)',
    locationAr: 'الحرم المكي - صلاة الفجر 🌙',
    locationEn: 'Makkah Fajr Call',
    muezzinAr: 'مؤذنو الحرم المكي الشريف',
    muezzinEn: 'Makkah Fajr Muezzins',
    audioUrl: 'https://cdn.aladhan.com/audio/adhans/a11.mp3',
    backupUrls: [
      'https://ia800301.us.archive.org/21/items/Adzan_Makkah/Adzan_Fajr_Makkah.mp3',
      'https://cdn.aladhan.com/audio/adhans/a1.mp3'
    ],
    isFajrOnly: true,
    descriptionAr: 'أذان صلاة الفجر متضمناً التثويب الشرعي النبوي "الصَّلَاةُ خَيْرٌ مِنَ النَّوْمِ".',
    descriptionEn: 'The dawn Fajr call including the phrase "Prayer is better than sleep".',
    badge: 'خاص بالفجر 🌙',
    duration: '4:30',
    maqamAr: 'مقام حجاز'
  },
  {
    id: 'fajr_alafasy',
    nameAr: 'أذان الفجر بصوت مشاري العفاسي',
    nameEn: 'Alafasy Fajr Adhan (Tathweeb)',
    locationAr: 'أذان الفجر العذب 🌙',
    locationEn: 'Alafasy Fajr Special',
    muezzinAr: 'الشيخ مشاري بن راشد العفاسي',
    muezzinEn: 'Sheikh Mishary Rashid Alafasy',
    audioUrl: 'https://cdn.aladhan.com/audio/adhans/a12.mp3',
    backupUrls: [
      'https://ia800301.us.archive.org/1/items/MisharyRashidAlAfasyAdhan/Mishary_Fajr.mp3',
      'https://cdn.aladhan.com/audio/adhans/a5.mp3'
    ],
    isFajrOnly: true,
    descriptionAr: 'أذان فجر ندي ورقيق يوقظ القلوب مع نداء "الصلاة خير من النوم".',
    descriptionEn: 'Gentle dawn awakening call to prayer by Sheikh Mishary Alafasy.',
    badge: 'فجر رقيق 🌙',
    duration: '3:45',
    maqamAr: 'مقام كرد'
  }
];

export const DUAA_AFTER_ADHAN = {
  titleAr: 'دعاء ما بعد الأذان',
  titleEn: 'Supplication After Adhan',
  arabic: 'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ القَائِمَةِ، آتِ مُحَمَّداً الوَسِيلَةَ وَالفَضِيلَةَ، وَابْعَثْهُ مَقَاماً مَحْمُوداً الَّذِي وَعَدْتَهُ، [إِنَّكَ لَا تُخْلِفُ المِيعَادَ].',
  english: 'O Allah, Lord of this perfect call and established prayer, grant Muhammad the intercession and distinction, and resurrect him to the praised position that You have promised him.',
  virtueAr: 'قال النبي ﷺ: «مَنْ قَالَ حِينَ يَسْمَعُ النِّدَاءَ... حَلَّتْ لَهُ شَفَاعَتِي يَوْمَ القِيَامَةِ» (صحيح البخاري)',
  audioUrl: 'https://cdn.aladhan.com/audio/adhans/duaa.mp3'
};

export interface IqamahPreset {
  prayerKey: string;
  prayerNameAr: string;
  prayerNameEn: string;
  defaultDelayMin: number;
}

export const DEFAULT_IQAMAH_PRESETS: IqamahPreset[] = [
  { prayerKey: 'fajr', prayerNameAr: 'الفجر', prayerNameEn: 'Fajr', defaultDelayMin: 20 },
  { prayerKey: 'dhuhr', prayerNameAr: 'الظهر', prayerNameEn: 'Dhuhr', defaultDelayMin: 15 },
  { prayerKey: 'asr', prayerNameAr: 'العصر', prayerNameEn: 'Asr', defaultDelayMin: 15 },
  { prayerKey: 'maghrib', prayerNameAr: 'المغرب', prayerNameEn: 'Maghrib', defaultDelayMin: 10 },
  { prayerKey: 'isha', prayerNameAr: 'العشاء', prayerNameEn: 'Isha', defaultDelayMin: 15 }
];
