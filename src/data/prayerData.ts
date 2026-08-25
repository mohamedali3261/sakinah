import { CityPrayer } from '../types';

export interface CalculationMethod {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  fajrAngle: number;
  ishaAngleOrMin: string;
}

export const CALCULATION_METHODS: CalculationMethod[] = [
  {
    id: 'egypt',
    nameAr: 'الهيئة المصرية العامة للمساحة',
    nameEn: 'Egyptian General Authority of Survey',
    descriptionAr: 'الفجر ١٩.٥° - العشاء ١٧.٥° (مصر، إفريقيا، الشرق الأوسط)',
    fajrAngle: 19.5,
    ishaAngleOrMin: '17.5°'
  },
  {
    id: 'makkah',
    nameAr: 'جامعة أم القرى - مكة المكرمة',
    nameEn: 'Umm Al-Qura University, Makkah',
    descriptionAr: 'الفجر ١٨.٥° - العشاء ٩٠ دقيقة بعد المغرب (السعودية والخليج)',
    fajrAngle: 18.5,
    ishaAngleOrMin: '90 min'
  },
  {
    id: 'mwl',
    nameAr: 'رابطة العالم الإسلامي',
    nameEn: 'Muslim World League (MWL)',
    descriptionAr: 'الفجر ١٨° - العشاء ١٧° (أوروبا، الشرق الأقصى، أجزاء من أمريكا)',
    fajrAngle: 18.0,
    ishaAngleOrMin: '17°'
  },
  {
    id: 'diyanet',
    nameAr: 'رئاسة الشؤون الدينية التركية (Diyanet)',
    nameEn: 'Presidency of Religious Affairs (Turkey)',
    descriptionAr: 'الفجر ١٨° - العشاء ١٧° (تركيا وبلاد القوقاز)',
    fajrAngle: 18.0,
    ishaAngleOrMin: '17°'
  },
  {
    id: 'karachi',
    nameAr: 'جامعة العلوم الإسلامية بكراتشي',
    nameEn: 'University of Islamic Sciences, Karachi',
    descriptionAr: 'الفجر ١٨° - العشاء ١٨° (باكستان، الهند، بنغلاديش)',
    fajrAngle: 18.0,
    ishaAngleOrMin: '18°'
  },
  {
    id: 'isna',
    nameAr: 'الجمعية الإسلامية لأمريكا الشمالية (ISNA)',
    nameEn: 'Islamic Society of North America',
    descriptionAr: 'الفجر ١٥° - العشاء ١٥° (الولايات المتحدة وكندا)',
    fajrAngle: 15.0,
    ishaAngleOrMin: '15°'
  }
];

export const CITIES_PRAYERS: CityPrayer[] = [
  {
    cityAr: 'القاهرة',
    cityEn: 'Cairo',
    countryAr: 'مصر',
    countryEn: 'Egypt',
    fajr: '04:54',
    sunrise: '06:20',
    dhuhr: '12:08',
    asr: '15:37',
    maghrib: '17:55',
    isha: '19:14',
    qiblaAngle: 136
  },
  {
    cityAr: 'الإسكندرية',
    cityEn: 'Alexandria',
    countryAr: 'مصر',
    countryEn: 'Egypt',
    fajr: '04:58',
    sunrise: '06:26',
    dhuhr: '12:13',
    asr: '15:43',
    maghrib: '18:00',
    isha: '19:21',
    qiblaAngle: 138
  },
  {
    cityAr: 'مكة المكرمة',
    cityEn: 'Makkah',
    countryAr: 'المملكة العربية السعودية',
    countryEn: 'Saudi Arabia',
    fajr: '05:04',
    sunrise: '06:21',
    dhuhr: '12:28',
    asr: '15:52',
    maghrib: '18:34',
    isha: '20:04',
    qiblaAngle: 0
  },
  {
    cityAr: 'المدينة المنورة',
    cityEn: 'Madinah',
    countryAr: 'المملكة العربية السعودية',
    countryEn: 'Saudi Arabia',
    fajr: '05:02',
    sunrise: '06:22',
    dhuhr: '12:29',
    asr: '15:56',
    maghrib: '18:35',
    isha: '20:05',
    qiblaAngle: 172
  },
  {
    cityAr: 'القدس الشريف',
    cityEn: 'Jerusalem',
    countryAr: 'فلسطين',
    countryEn: 'Palestine',
    fajr: '04:47',
    sunrise: '06:11',
    dhuhr: '11:58',
    asr: '15:24',
    maghrib: '17:44',
    isha: '19:04',
    qiblaAngle: 154
  },
  {
    cityAr: 'الرياض',
    cityEn: 'Riyadh',
    countryAr: 'المملكة العربية السعودية',
    countryEn: 'Saudi Arabia',
    fajr: '04:46',
    sunrise: '06:05',
    dhuhr: '12:08',
    asr: '15:33',
    maghrib: '18:10',
    isha: '19:40',
    qiblaAngle: 243
  },
  {
    cityAr: 'دبي',
    cityEn: 'Dubai',
    countryAr: 'الإمارات العربية المتحدة',
    countryEn: 'UAE',
    fajr: '05:12',
    sunrise: '06:30',
    dhuhr: '12:32',
    asr: '15:53',
    maghrib: '18:32',
    isha: '19:50',
    qiblaAngle: 258
  },
  {
    cityAr: 'أبو ظبي',
    cityEn: 'Abu Dhabi',
    countryAr: 'الإمارات العربية المتحدة',
    countryEn: 'UAE',
    fajr: '05:15',
    sunrise: '06:33',
    dhuhr: '12:35',
    asr: '15:56',
    maghrib: '18:36',
    isha: '19:53',
    qiblaAngle: 260
  },
  {
    cityAr: 'بغداد',
    cityEn: 'Baghdad',
    countryAr: 'العراق',
    countryEn: 'Iraq',
    fajr: '05:08',
    sunrise: '06:32',
    dhuhr: '12:18',
    asr: '15:39',
    maghrib: '18:04',
    isha: '19:28',
    qiblaAngle: 198
  },
  {
    cityAr: 'دمشق',
    cityEn: 'Damascus',
    countryAr: 'سوريا',
    countryEn: 'Syria',
    fajr: '04:52',
    sunrise: '06:18',
    dhuhr: '12:05',
    asr: '15:28',
    maghrib: '17:51',
    isha: '19:12',
    qiblaAngle: 161
  },
  {
    cityAr: 'عمّان',
    cityEn: 'Amman',
    countryAr: 'الأردن',
    countryEn: 'Jordan',
    fajr: '04:49',
    sunrise: '06:13',
    dhuhr: '12:01',
    asr: '15:26',
    maghrib: '17:48',
    isha: '19:07',
    qiblaAngle: 157
  },
  {
    cityAr: 'بيروت',
    cityEn: 'Beirut',
    countryAr: 'لبنان',
    countryEn: 'Lebanon',
    fajr: '04:56',
    sunrise: '06:21',
    dhuhr: '12:07',
    asr: '15:30',
    maghrib: '17:53',
    isha: '19:15',
    qiblaAngle: 162
  },
  {
    cityAr: 'الكويت',
    cityEn: 'Kuwait City',
    countryAr: 'الكويت',
    countryEn: 'Kuwait',
    fajr: '04:55',
    sunrise: '06:17',
    dhuhr: '12:15',
    asr: '15:38',
    maghrib: '18:12',
    isha: '19:35',
    qiblaAngle: 226
  },
  {
    cityAr: 'الدوحة',
    cityEn: 'Doha',
    countryAr: 'قطر',
    countryEn: 'Qatar',
    fajr: '04:51',
    sunrise: '06:10',
    dhuhr: '12:10',
    asr: '15:32',
    maghrib: '18:10',
    isha: '19:30',
    qiblaAngle: 247
  },
  {
    cityAr: 'المنامة',
    cityEn: 'Manama',
    countryAr: 'البحرين',
    countryEn: 'Bahrain',
    fajr: '04:50',
    sunrise: '06:10',
    dhuhr: '12:11',
    asr: '15:33',
    maghrib: '18:11',
    isha: '19:32',
    qiblaAngle: 244
  },
  {
    cityAr: 'مسقط',
    cityEn: 'Muscat',
    countryAr: 'سلطنة عمان',
    countryEn: 'Oman',
    fajr: '05:03',
    sunrise: '06:20',
    dhuhr: '12:20',
    asr: '15:42',
    maghrib: '18:20',
    isha: '19:35',
    qiblaAngle: 268
  },
  {
    cityAr: 'صنعاء',
    cityEn: 'Sanaa',
    countryAr: 'اليمن',
    countryEn: 'Yemen',
    fajr: '04:58',
    sunrise: '06:14',
    dhuhr: '12:16',
    asr: '15:37',
    maghrib: '18:17',
    isha: '19:32',
    qiblaAngle: 334
  },
  {
    cityAr: 'الخرطوم',
    cityEn: 'Khartoum',
    countryAr: 'السودان',
    countryEn: 'Sudan',
    fajr: '04:52',
    sunrise: '06:08',
    dhuhr: '12:10',
    asr: '15:33',
    maghrib: '18:11',
    isha: '19:25',
    qiblaAngle: 47
  },
  {
    cityAr: 'طرابلس',
    cityEn: 'Tripoli',
    countryAr: 'ليبيا',
    countryEn: 'Libya',
    fajr: '05:43',
    sunrise: '07:07',
    dhuhr: '13:08',
    asr: '16:32',
    maghrib: '19:08',
    isha: '20:30',
    qiblaAngle: 116
  },
  {
    cityAr: 'تونس',
    cityEn: 'Tunis',
    countryAr: 'تونس',
    countryEn: 'Tunisia',
    fajr: '05:35',
    sunrise: '07:03',
    dhuhr: '13:02',
    asr: '16:21',
    maghrib: '19:00',
    isha: '20:25',
    qiblaAngle: 114
  },
  {
    cityAr: 'الجزائر',
    cityEn: 'Algiers',
    countryAr: 'الجزائر',
    countryEn: 'Algeria',
    fajr: '05:54',
    sunrise: '07:23',
    dhuhr: '13:20',
    asr: '16:38',
    maghrib: '19:16',
    isha: '20:41',
    qiblaAngle: 104
  },
  {
    cityAr: 'الرباط',
    cityEn: 'Rabat',
    countryAr: 'المغرب',
    countryEn: 'Morocco',
    fajr: '05:42',
    sunrise: '07:09',
    dhuhr: '13:38',
    asr: '17:03',
    maghrib: '20:07',
    isha: '21:30',
    qiblaAngle: 96
  },
  {
    cityAr: 'الدار البيضاء',
    cityEn: 'Casablanca',
    countryAr: 'المغرب',
    countryEn: 'Morocco',
    fajr: '05:45',
    sunrise: '07:13',
    dhuhr: '13:41',
    asr: '17:06',
    maghrib: '20:09',
    isha: '21:33',
    qiblaAngle: 96
  },
  {
    cityAr: 'إسطنبول',
    cityEn: 'Istanbul',
    countryAr: 'تركيا',
    countryEn: 'Turkey',
    fajr: '05:38',
    sunrise: '07:11',
    dhuhr: '13:08',
    asr: '16:21',
    maghrib: '19:04',
    isha: '20:30',
    qiblaAngle: 150
  },
  {
    cityAr: 'لندن',
    cityEn: 'London',
    countryAr: 'المملكة المتحدة',
    countryEn: 'United Kingdom',
    fajr: '04:22',
    sunrise: '06:05',
    dhuhr: '13:03',
    asr: '16:55',
    maghrib: '20:01',
    isha: '21:38',
    qiblaAngle: 119
  },
  {
    cityAr: 'باريس',
    cityEn: 'Paris',
    countryAr: 'فرنسا',
    countryEn: 'France',
    fajr: '05:22',
    sunrise: '06:58',
    dhuhr: '13:48',
    asr: '17:34',
    maghrib: '20:38',
    isha: '22:08',
    qiblaAngle: 119
  },
  {
    cityAr: 'نيويورك',
    cityEn: 'New York',
    countryAr: 'الولايات المتحدة',
    countryEn: 'USA',
    fajr: '05:14',
    sunrise: '06:42',
    dhuhr: '13:01',
    asr: '16:38',
    maghrib: '19:19',
    isha: '20:47',
    qiblaAngle: 58
  },
  {
    cityAr: 'كوالالمبور',
    cityEn: 'Kuala Lumpur',
    countryAr: 'ماليزيا',
    countryEn: 'Malaysia',
    fajr: '05:58',
    sunrise: '07:12',
    dhuhr: '13:21',
    asr: '16:35',
    maghrib: '19:28',
    isha: '20:39',
    qiblaAngle: 293
  },
  {
    cityAr: 'جاكرتا',
    cityEn: 'Jakarta',
    countryAr: 'إندونيسيا',
    countryEn: 'Indonesia',
    fajr: '04:40',
    sunrise: '05:54',
    dhuhr: '11:58',
    asr: '15:15',
    maghrib: '18:01',
    isha: '19:11',
    qiblaAngle: 295
  }
];

export const POST_PRAYER_ATHKAR = [
  {
    id: 'post-1',
    textAr: 'أَسْتَغْفِرُ اللهَ (ثَلاثاً)، اللَّهُمَّ أَنْتَ السَّلامُ وَمِنْكَ السَّلامُ، تَبَارَكْتَ يَا ذَا الجَلالِ وَالإِكْرَامِ.',
    textEn: 'I seek Allah’s forgiveness (3 times). O Allah, You are Peace and from You is peace; blessed are You, Possessor of Glory and Honor.',
    count: 3,
    fadlAr: 'سُنّة مؤكدة مباشرة بعد التسليم من الفريضة.'
  },
  {
    id: 'post-2',
    textAr: 'لا إِلَهَ إِلاَّ اللهُ وَحْدَهُ لا شَرِيكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، اللَّهُمَّ لا مَانِعَ لِمَا أَعْطَيْتَ، وَلا مُعْطِيَ لِمَا مَنَعْتَ، وَلا يَنْفَعُ ذَا الجَدِّ مِنْكَ الجَدُّ.',
    textEn: 'None has the right to be worshipped except Allah alone, without partner. To Him belongs all dominion and praise...',
    count: 1,
    fadlAr: 'دعاء النبي ﷺ بعد كل صلاة مكتوبة.'
  },
  {
    id: 'post-3',
    textAr: 'سُبْحَانَ اللهِ (٣٣)، الحَمْدُ للهِ (٣٣)، اللهُ أَكْبَرُ (٣٣)، وتَمَامُ المِائَةِ: لا إِلَهَ إِلاَّ اللهُ وَحْدَهُ لا شَرِيكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.',
    textEn: 'SubhanAllah (33), Alhamdulillah (33), Allahu Akbar (33), and complete 100 with La ilaha illallah...',
    count: 33,
    fadlAr: 'غُفِرَتْ خَطَايَاهُ وَإِنْ كَانَتْ مِثْلَ زَبَدِ البَحْرِ.'
  },
  {
    id: 'post-4',
    textAr: 'قراءة آية الكرسي: ﴿اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...﴾ [البقرة: 255]',
    textEn: 'Reciting Ayat al-Kursi (Surah Al-Baqarah: 255).',
    count: 1,
    fadlAr: 'مَنْ قَرَأَ آيَةَ الْكُرْسِيِّ دُبُرَ كُلِّ صَلَاةٍ مَكْتُوبَةٍ لَمْ يَمْنَعْهُ مِنْ دُخُولِ الْجَنَّةِ إِلَّا أَنْ يَمُوتَ.'
  },
  {
    id: 'post-5',
    textAr: 'قراءة المعوذات: سورة الإخلاص، سورة الفلق، وسورة الناس.',
    textEn: 'Reciting Surah Al-Ikhlas, Al-Falaq, and An-Nas.',
    count: 1,
    fadlAr: 'حفظ ووقاية دبر كل صلاة مكتوبة.'
  }
];

export const DAILY_INSPIRATIONS = [
  {
    id: 'insp-1',
    ayahAr: '﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾',
    ayahEn: '"Unquestionably, by the remembrance of Allah hearts are assured."',
    surahAr: 'سورة الرعد: 28',
    surahEn: 'Surah Ar-Ra’d: 28',
    reflectionAr: 'ذكر الله هو بلسَم النفوس المضطربة، وسكينة الروح في زحام الحياة وشتات الأفكار.',
    reflectionEn: 'Remembrance of Allah is the balm for anxious souls and the sanctuary of inner peace.'
  },
  {
    id: 'insp-2',
    ayahAr: '﴿وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ﴾',
    ayahEn: '"And My mercy encompasses all things."',
    surahAr: 'سورة الأعراف: 156',
    surahEn: 'Surah Al-A’raf: 156',
    reflectionAr: 'مهما تعاظمت الذنوب أو اشتدت الكروب، فإن رحمة الله وسعت كل المخلوقات فلن تضيق عنك.',
    reflectionEn: 'No matter how great the trial or sin, Allah’s mercy embraces every corner of the cosmos.'
  },
  {
    id: 'insp-3',
    ayahAr: '﴿فَإِنَّ مَعَ الْعُسْرِ يُسْرًا * إِنَّ مَعَ الْعُسْرِ يُسْرًا﴾',
    ayahEn: '"For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease."',
    surahAr: 'سورة الشرح: 5-6',
    surahEn: 'Surah Ash-Sharh: 5-6',
    reflectionAr: 'لن يغلب عسر يسرين؛ بعد كل ضائقة فجر قريب ونور يمحو ظلام الشدائد.',
    reflectionEn: 'No difficulty can defeat double ease; after every constriction comes dawn and expansion.'
  }
];

// Helper to get formatted Hijri Date with day offset
export function getFormattedHijriDate(lang: 'ar' | 'en', dayOffset: number = 0): string {
  try {
    const date = new Date();
    if (dayOffset !== 0) {
      date.setDate(date.getDate() + dayOffset);
    }
    const formatter = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA-u-ca-islamic' : 'en-US-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    return formatter.format(date);
  } catch {
    return lang === 'ar' ? '١٤٤٨ هـ' : '1448 AH';
  }
}
