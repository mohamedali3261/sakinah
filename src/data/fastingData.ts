export interface FastingOccasion {
  id: string;
  titleAr: string;
  titleEn: string;
  type: 'weekly' | 'monthly' | 'annual';
  badgeAr: string;
  badgeEn: string;
  descriptionAr: string;
  descriptionEn: string;
  hadithAr: string;
  hadithEn: string;
  rewardAr: string;
  rewardEn: string;
  isUpcomingSoon?: boolean;
}

export const SUNNAH_FASTING_TYPES: FastingOccasion[] = [
  {
    id: 'mon_thu',
    titleAr: 'صيام الإثنين والخميس',
    titleEn: 'Mondays & Thursdays Fasting',
    type: 'weekly',
    badgeAr: 'سُنّة أسبوعية مؤكدة',
    badgeEn: 'Weekly Sunnah',
    descriptionAr: 'يومان عظيمان تُعرض فيهما أعمال العباد على الله تبارك وتعالى، وكان النبي ﷺ يحب أن يُعرض عمله وهو صائم.',
    descriptionEn: 'The days deeds are presented to Allah, and the Prophet ﷺ loved that his deeds be presented while fasting.',
    hadithAr: 'قال رسول الله ﷺ: «تُعْرَضُ الأَعْمَالُ يَوْمَ الاثْنَيْنِ وَالْخَمِيسِ، فَأُحِبُّ أَنْ يُعْرَضَ عَمَلِي وَأَنَا صَائِمٌ» [رواه الترمذي].',
    hadithEn: 'The Prophet ﷺ said: "Deeds are shown (to Allah) on Mondays and Thursdays, and I love that my deeds be shown while I am fasting."',
    rewardAr: 'عرض الأعمال في طاعة وصيام، ومغفرة الذنوب لمن لا يشرك بالله ولا يشاحن.',
    rewardEn: 'Deeds presented in devotion, and forgiveness of sins for monotheists without rancor.'
  },
  {
    id: 'white_days',
    titleAr: 'صيام الأيام البيض (١٣، ١٤، ١٥)',
    titleEn: 'White Days (13th, 14th, 15th)',
    type: 'monthly',
    badgeAr: 'صيام الدهر كله',
    badgeEn: 'Year-Round Fasting Reward',
    descriptionAr: 'الأيام الثلاثة التي يكتمل فيها نور القمر بدراً في كل شهر هجري، صيامها مع الحسنة بعشر أمثالها يعدل صيام السنة كلها.',
    descriptionEn: 'The 3 days each lunar month when the moon is full. With each good deed multiplied by ten, it equals fasting the whole month/year.',
    hadithAr: 'قال رسول الله ﷺ لأبي ذر: «إِذَا صُمْتَ مِنَ الشَّهْرِ ثَلاثَةَ أَيَّامٍ، فَصُمْ ثَلاثَ عَشْرَةَ، وَأَرْبَعَ عَشْرَةَ، وَخَمْسَ عَشْرَةَ» [رواه الترمذي والنسائي].',
    hadithEn: 'The Messenger of Allah ﷺ said: "If you fast three days of the month, then fast the 13th, 14th, and 15th."',
    rewardAr: 'صيام ثلاثة أيام من كل شهر كصيام الدهر كله، وتطهير النفس من الضغائن والأحقاد.',
    rewardEn: 'Equivalent to fasting the entire lifetime, cleansing the heart and spirit.'
  },
  {
    id: 'arafah',
    titleAr: 'صيام يوم عرفة (٩ ذو الحجة)',
    titleEn: 'Day of Arafah Fasting',
    type: 'annual',
    badgeAr: 'تكفير سنتين',
    badgeEn: 'Expiation for 2 Years',
    descriptionAr: 'أفضل أيام العام، صيامه لغير الحاج يكفّر ذنوب السنة الماضية والسنة القادمة.',
    descriptionEn: 'The greatest day of the year; fasting it for non-pilgrims expiates sins of the preceding and upcoming year.',
    hadithAr: 'قال النبي ﷺ: «صِيَامُ يَوْمِ عَرَفَةَ أَحْتَسِبُ عَلَى اللهِ أَنْ يُكَفِّرَ السَّنَةَ الَّتِي قَبْلَهُ، وَالسَّنَةَ الَّتِي بَعْدَهُ» [رواه مسلم].',
    hadithEn: 'The Prophet ﷺ said: "Fasting the day of Arafah expiates sins of the previous year and the coming year."',
    rewardAr: 'مغفرة ذنوب عامين كاملين، والعتق من النيران وإجابة الدعوات.',
    rewardEn: 'Two full years of expiated sins and immense freedom from the Fire.'
  },
  {
    id: 'ashura',
    titleAr: 'صيام عاشوراء وتاسوعاء (٩ و ١٠ محرم)',
    titleEn: 'Day of Ashura & Tasu’a (9 & 10 Muharram)',
    type: 'annual',
    badgeAr: 'تكفير سنة ماضية',
    badgeEn: 'Expiation for 1 Year',
    descriptionAr: 'اليوم الذي نجى الله فيه نبيّه موسى عليه السلام وقومه من فرعون وجنوده، فيصام شكراً لله وتكفيراً لسنة مضت.',
    descriptionEn: 'The day Allah saved Prophet Musa (AS) and his people from Pharaoh; fasted in gratitude and expiation of past sins.',
    hadithAr: 'قال النبي ﷺ: «وَصِيَامُ يَوْمِ عَاشُورَاءَ أَحْتَسِبُ عَلَى اللهِ أَنْ يُكَفِّرَ السَّنَةَ الَّتِي قَبْلَهُ» [رواه مسلم].',
    hadithEn: 'The Prophet ﷺ said: "Fasting the day of Ashura expiates the sins of the past year."',
    rewardAr: 'تكفير ذنوب السنة السابقة كاملة، وإحياء سُنّة الأنبياء والشكر لله.',
    rewardEn: 'Total forgiveness of the preceding year’s minor sins.'
  },
  {
    id: 'shawwal_six',
    titleAr: 'صيام الست من شوال',
    titleEn: 'Six Days of Shawwal',
    type: 'annual',
    badgeAr: 'كصيام الدهر مع رمضان',
    badgeEn: 'Year of Fasting',
    descriptionAr: 'من صام رمضان ثم أتبعه بستة أيام من شوال كان كصيام الدهر كله، لأن الحسنة بعشر أمثالها (٣٠ يوم رمضان = ٣٠٠ يوم، و ٦ شوال = ٦٠ يوماً = ٣٦٠ يوماً سنة كاملة).',
    descriptionEn: 'Whoever fasts Ramadan followed by six days of Shawwal, it is as if they fasted the entire year.',
    hadithAr: 'قال رسول الله ﷺ: «مَنْ صَامَ رَمَضَانَ ثُمَّ أَتْبَعَهُ سِتًّا مِنْ شَوَّالٍ كَانَ كَصِيَامِ الدَّهْرِ» [رواه مسلم].',
    hadithEn: 'The Messenger of Allah ﷺ said: "Whoever fasts Ramadan and follows it with six days of Shawwal, it is as if he fasted all the time."',
    rewardAr: 'استكمال أجر صيام سنة كاملة وجبر أي نقص في فريضة رمضان.',
    rewardEn: 'Full year of fasting rewards and perfection of the Ramadan fast.'
  },
  {
    id: 'ten_dhulhijjah',
    titleAr: 'صيام العشر الأوائل من ذي الحجة',
    titleEn: 'First 9 Days of Dhul-Hijjah',
    type: 'annual',
    badgeAr: 'أحب الأيام إلى الله',
    badgeEn: 'Most Beloved Days',
    descriptionAr: 'الأيام العشر المباركة التي أقسم الله بها في القرآن، والعمل الصالح فيها أحب إلى الله من أي أيام أخرى.',
    descriptionEn: 'The sacred ten days sworn by in the Quran; righteous deeds therein are more beloved to Allah than any other time.',
    hadithAr: 'قال النبي ﷺ: «مَا مِنْ أَيَّامٍ الْعَمَلُ الصَّالِحُ فِيهَا أَحَبُّ إِلَى اللهِ مِنْ هَذِهِ الأَيَّامِ» [رواه البخاري].',
    hadithEn: 'The Prophet ﷺ said: "There are no days during which good deeds are more beloved to Allah than during these ten days."',
    rewardAr: 'مضاعفة الحسنات ومغفرة السيئات وعظم الأجر عند الله.',
    rewardEn: 'Multiplied rewards and immense spiritual elevation.'
  }
];

export interface FastingDua {
  id: string;
  titleAr: string;
  titleEn: string;
  textAr: string;
  textEn: string;
  referenceAr: string;
  when: 'iftar' | 'suhoor' | 'intention';
}

export const FASTING_DUAS: FastingDua[] = [
  {
    id: 'dua-iftar-1',
    titleAr: 'دعاء النبي ﷺ الثابت عند الإفطار',
    titleEn: 'Prophet’s Authentic Iftar Dua',
    textAr: 'ذَهَبَ الظَّمَأُ، وَابْتَلَّتِ العُرُوقُ، وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللهُ.',
    textEn: 'Thahaba ath-thama’u, wabtallat al-’urooq, wa thabata al-ajru in sha Allah. (The thirst is gone, the veins are moistened, and the reward is confirmed, if Allah wills).',
    referenceAr: 'رواه أبو داود وصححه الألباني',
    when: 'iftar'
  },
  {
    id: 'dua-iftar-2',
    titleAr: 'دعاء الصائم المستجاب عند فطره',
    titleEn: 'Accepted Supplication at Iftar',
    textAr: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ بِرَحْمَتِكَ الَّتِي وَسِعَتْ كُلَّ شَيْءٍ أَنْ تَغْفِرَ لِي.',
    textEn: 'Allahumma inni as’aluka bi rahmatika allati wasi’at kulla shay’in an taghfira li. (O Allah, I ask You by Your mercy which encompasses all things to forgive me).',
    referenceAr: 'رواه ابن ماجه',
    when: 'iftar'
  },
  {
    id: 'dua-iftar-guest',
    titleAr: 'دعاء الصائم إذا أفطر عند قوم',
    titleEn: 'Dua when breaking fast with hosts',
    textAr: 'أَفْطَرَ عِنْدَكُمُ الصَّائِمُونَ، وَأَكَلَ طَعَامَكُمُ الأَبْرَارُ، وَصَلَّتْ عَلَيْكُمُ المَلائِكَةُ.',
    textEn: 'Aftara ‘indakum as-sa’imoon, wa akala ta’amakum al-abrar, wa sallat ‘alaykum al-mala’ikah. (May fasting people break fast with you, the pious eat your food, and angels pray for you).',
    referenceAr: 'رواه أبو داود والنسائي',
    when: 'iftar'
  },
  {
    id: 'dua-niyyah',
    titleAr: 'نية صيام التطوع المستحب',
    titleEn: 'Voluntary Fasting Intention',
    textAr: 'نَوَيْتُ صِيَامَ يَوْمِ غَدٍ تَطَوُّعاً وَتَقَرُّباً إِلَى اللهِ تَعَالَى، اللَّهُمَّ تَقَبَّلْ مِنِّي وَأَعِنِّي عَلَى طَاعَتِكَ.',
    textEn: 'I intend to fast tomorrow voluntarily for the sake of Allah. O Allah, accept from me and assist me in Your obedience.',
    referenceAr: 'النية محلها القلب ويجوز عقد نية صيام النفل نهاراً قبل الزوال ما لم يطعم.',
    when: 'intention'
  }
];

// Determine the next upcoming Sunnah fasting date based on day of the week & month
export function getNextUpcomingFasting(): { nameAr: string; nameEn: string; dateStr: string; daysLeft: number; type: string } {
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, 4 = Thursday

  // Monday is day 1, Thursday is day 4
  let daysUntilMonday = (1 - currentDayOfWeek + 7) % 7;
  let daysUntilThursday = (4 - currentDayOfWeek + 7) % 7;

  if (daysUntilMonday === 0) daysUntilMonday = 7; // if today is Monday, next is 7 days away or today
  if (daysUntilThursday === 0) daysUntilThursday = 7;

  const isTodayMonday = currentDayOfWeek === 1;
  const isTodayThursday = currentDayOfWeek === 4;

  if (isTodayMonday) {
    return {
      nameAr: 'صيام الإثنين (اليوم! 🌿)',
      nameEn: 'Fasting Monday (Today! 🌿)',
      dateStr: today.toLocaleDateString('ar-SA'),
      daysLeft: 0,
      type: 'mon_thu'
    };
  }

  if (isTodayThursday) {
    return {
      nameAr: 'صيام الخميس (اليوم! 🌿)',
      nameEn: 'Fasting Thursday (Today! 🌿)',
      dateStr: today.toLocaleDateString('ar-SA'),
      daysLeft: 0,
      type: 'mon_thu'
    };
  }

  // Choose the closest between next Monday and next Thursday
  if (daysUntilMonday <= daysUntilThursday) {
    const nextDate = new Date();
    nextDate.setDate(today.getDate() + daysUntilMonday);
    return {
      nameAr: `صيام الإثنين القادم (${daysUntilMonday === 1 ? 'غداً' : `بعد ${daysUntilMonday} أيام`})`,
      nameEn: `Next Monday Fasting (in ${daysUntilMonday} days)`,
      dateStr: nextDate.toLocaleDateString('ar-SA'),
      daysLeft: daysUntilMonday,
      type: 'mon_thu'
    };
  } else {
    const nextDate = new Date();
    nextDate.setDate(today.getDate() + daysUntilThursday);
    return {
      nameAr: `صيام الخميس القادم (${daysUntilThursday === 1 ? 'غداً' : `بعد ${daysUntilThursday} أيام`})`,
      nameEn: `Next Thursday Fasting (in ${daysUntilThursday} days)`,
      dateStr: nextDate.toLocaleDateString('ar-SA'),
      daysLeft: daysUntilThursday,
      type: 'mon_thu'
    };
  }
}
