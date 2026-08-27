export interface QuizQuestion {
  id: string;
  category: 'seerah' | 'prophets' | 'quran' | 'fiqh';
  categoryAr: string;
  categoryEn: string;
  questionAr: string;
  questionEn: string;
  optionsAr: string[];
  optionsEn: string[];
  correctIndex: number; // 0-based
  explanationAr: string;
  explanationEn: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const QUIZ_CATEGORIES = [
  { id: 'all', nameAr: 'جميع المجالات', nameEn: 'All Topics', icon: 'Sparkles', color: 'emerald' },
  { id: 'seerah', nameAr: 'السيرة النبوية', nameEn: 'Prophetic Biography', icon: 'Award', color: 'amber' },
  { id: 'prophets', nameAr: 'قصص الأنبياء', nameEn: 'Stories of Prophets', icon: 'Compass', color: 'sky' },
  { id: 'quran', nameAr: 'علوم القرآن', nameEn: 'Quranic Sciences', icon: 'BookOpen', color: 'teal' },
  { id: 'fiqh', nameAr: 'الفقه والعبادات', nameEn: 'Fiqh & Acts of Worship', icon: 'CheckCircle2', color: 'indigo' }
];

export const ISLAMIC_QUIZ_QUESTIONS: QuizQuestion[] = [
  // --- السيرة النبوية ---
  {
    id: 'q-seerah-1',
    category: 'seerah',
    categoryAr: 'السيرة النبوية',
    categoryEn: 'Prophetic Biography',
    questionAr: 'ما هي أول غزوة غزاها النبي ﷺ بنفسه في الإسلام؟',
    questionEn: 'What was the very first military expedition led personally by Prophet Muhammad ﷺ?',
    optionsAr: ['غزوة الأبواء (ودّان)', 'غزوة بدر الكبرى', 'غزوة أحد', 'غزوة بني قينقاع'],
    optionsEn: ['Battle of Al-Abwa (Waddan)', 'Battle of Badr', 'Battle of Uhud', 'Battle of Banu Qaynuqa'],
    correctIndex: 0,
    explanationAr: 'أول غزوة غزاها النبي ﷺ بنفسه هي غزوة الأبواء (وتسمى أيضاً غزوة ودّان) في شهر صفر من السنة الثانية للهجرة، ولم يقع فيها قتال.',
    explanationEn: 'The first expedition the Prophet ﷺ led was Al-Abwa (Waddan) in Safar 2 AH, in which no active fighting occurred.',
    difficulty: 'medium'
  },
  {
    id: 'q-seerah-2',
    category: 'seerah',
    categoryAr: 'السيرة النبوية',
    categoryEn: 'Prophetic Biography',
    questionAr: 'من هو الصحابي الجليل الذي أشار على النبي ﷺ بحفر الخندق في غزوة الأحزاب؟',
    questionEn: 'Which companion suggested the idea of digging the trench in the Battle of the Trench (Al-Ahzab)?',
    optionsAr: ['سلمان الفارسي رضي الله عنه', 'أبو بكر الصديق رضي الله عنه', 'علي بن أبي طالب رضي الله عنه', 'سعد بن معاذ رضي الله عنه'],
    optionsEn: ['Salman Al-Farsi (RA)', 'Abu Bakr Al-Siddiq (RA)', 'Ali ibn Abi Talib (RA)', 'Sa’d ibn Mu’adh (RA)'],
    correctIndex: 0,
    explanationAr: 'أشار الصحابي الجليل سلمان الفارسي رضي الله عنه بحفر الخندق، وكانت حيلة عسكرية مبتكرة لم تكن تعرفها العرب من قبل لحماية المدينة المنورة.',
    explanationEn: 'Salman Al-Farsi (RA) proposed digging the defensive trench around Madinah, a strategy unfamiliar to the Arabs at that time.',
    difficulty: 'easy'
  },
  {
    id: 'q-seerah-3',
    category: 'seerah',
    categoryAr: 'السيرة النبوية',
    categoryEn: 'Prophetic Biography',
    questionAr: 'كم كان عمر النبي ﷺ عندما نزل عليه الوحي لأول مرة في غار حراء؟',
    questionEn: 'How old was the Prophet ﷺ when he received the first revelation in the Cave of Hira?',
    optionsAr: ['٤٠ سنة', '٢٥ سنة', '٣٥ سنة', '٤٣ سنة'],
    optionsEn: ['40 years old', '25 years old', '35 years old', '43 years old'],
    correctIndex: 0,
    explanationAr: 'بُعث النبي ﷺ على رأس أربعين سنة من عمره الشريف، وهي سن اكتمال العقل والرشد، وكان ذلك في شهر رمضان المبارك.',
    explanationEn: 'Prophet Muhammad ﷺ was chosen as Allah’s Messenger at the age of 40, in the blessed month of Ramadan.',
    difficulty: 'easy'
  },
  {
    id: 'q-seerah-4',
    category: 'seerah',
    categoryAr: 'السيرة النبوية',
    categoryEn: 'Prophetic Biography',
    questionAr: 'من هي أول زوجات النبي ﷺ وفاةً بعد انتقاله إلى الرفيق الأعلى؟',
    questionEn: 'Which of the Prophet’s ﷺ wives passed away first after his demise?',
    optionsAr: ['زينب بنت جحش رضي الله عنها', 'عائشة بنت أبي بكر رضي الله عنها', 'سودة بنت زمعة رضي الله عنها', 'حفصة بنت عمر رضي الله عنها'],
    optionsEn: ['Zainab bint Jahsh (RA)', 'Aisha bint Abi Bakr (RA)', 'Sawdah bint Zam’ah (RA)', 'Hafsah bint Umar (RA)'],
    correctIndex: 0,
    explanationAr: 'أم المؤمنين زينب بنت جحش رضي الله عنها؛ وقد قال ﷺ لنسائه: «أسرعكن لحاقاً بي أطولكن يداً»، وكانت كثيرة الصدقة والعمل بيدها للتصدق.',
    explanationEn: 'Zainab bint Jahsh (RA) was known for her immense charity and generosity, fulfilling the Prophet’s ﷺ prophecy.',
    difficulty: 'hard'
  },

  // --- قصص الأنبياء ---
  {
    id: 'q-prophets-1',
    category: 'prophets',
    categoryAr: 'قصص الأنبياء',
    categoryEn: 'Stories of Prophets',
    questionAr: 'من هو النبي الذي سخر الله له الريح تجري بأمره، وأسأل له عين القطر (النحاس المذاب)؟',
    questionEn: 'Which Prophet was granted mastery over the wind and molten copper by Allah’s command?',
    optionsAr: ['سليمان عليه السلام', 'داود عليه السلام', 'موسى عليه السلام', 'يوسف عليه السلام'],
    optionsEn: ['Prophet Sulaiman (Solomon) AS', 'Prophet Dawud (David) AS', 'Prophet Musa (Moses) AS', 'Prophet Yusuf (Joseph) AS'],
    correctIndex: 0,
    explanationAr: 'نبي الله سليمان بن داود عليهما السلام؛ قال تعالى: ﴿وَلِسُلَيْمَانَ الرِّيحَ غُدُوُّهَا شَهْرٌ وَرَوَاحُهَا شَهْرٌ وَأَسَلْنَا لَهُ عَيْنَ الْقِطْرِ﴾ [سبأ: 12].',
    explanationEn: 'Prophet Sulaiman (AS) was gifted power over the wind and molten copper, along with understanding the speech of birds and animals.',
    difficulty: 'easy'
  },
  {
    id: 'q-prophets-2',
    category: 'prophets',
    categoryAr: 'قصص الأنبياء',
    categoryEn: 'Stories of Prophets',
    questionAr: 'كم سنة لبث نبي الله نوح عليه السلام يدعو قومه إلى توحيد الله؟',
    questionEn: 'For how many years did Prophet Nuh (Noah) AS preach monotheism to his people?',
    optionsAr: ['ألف سنة إلا خمسين عاماً (٩٥٠ سنة)', '٥٠٠ سنة', '٧٠٠ سنة', '١٠٠٠ سنة كاملة'],
    optionsEn: ['950 years (a thousand minus fifty)', '500 years', '700 years', '1000 full years'],
    correctIndex: 0,
    explanationAr: 'لبث نوح عليه السلام يدعو قومه ليلاً ونهاراً ٩٥٠ عاماً، كما جاء صريحاً في سورة العنكبوت: ﴿فَلَبِثَ فِيهِمْ أَلْفَ سَنَةٍ إِلَّا خَمْسِينَ عَامًا﴾.',
    explanationEn: 'Prophet Nuh (AS) called his people for 950 years with enduring patience as explicitly stated in Surah Al-Ankabut.',
    difficulty: 'easy'
  },
  {
    id: 'q-prophets-3',
    category: 'prophets',
    categoryAr: 'قصص الأنبياء',
    categoryEn: 'Stories of Prophets',
    questionAr: 'من هو النبي الملقب بـ «ذو النون» الذي التقمه الحوت فنادى في الظلمات؟',
    questionEn: 'Which Prophet is known as "Dhun-Nun" (The Companion of the Fish)?',
    optionsAr: ['يونس عليه السلام', 'أيوب عليه السلام', 'إلياس عليه السلام', 'زكريا عليه السلام'],
    optionsEn: ['Prophet Yunus (Jonah) AS', 'Prophet Ayyub (Job) AS', 'Prophet Ilyas (Elijah) AS', 'Prophet Zakariya (AS)'],
    correctIndex: 0,
    explanationAr: 'نبي الله يونس عليه السلام؛ وسمي بذي النون (النون هو الحوت)، ودعا ربه بالدعاء المشهور: ﴿لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ﴾.',
    explanationEn: 'Prophet Yunus (AS) made the legendary supplication from within the whale’s belly: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers."',
    difficulty: 'easy'
  },
  {
    id: 'q-prophets-4',
    category: 'prophets',
    categoryAr: 'قصص الأنبياء',
    categoryEn: 'Stories of Prophets',
    questionAr: 'ما هي معجزة نبي الله صالح عليه السلام التي أرسلها الله لقوم ثمود؟',
    questionEn: 'What was the miraculous sign given to Prophet Salih (AS) for the people of Thamud?',
    optionsAr: ['الناقة العظيمة وفصيلها', 'العصا التي تحولت إلى حية', 'إحياء الموتى بإذن الله', 'الطوفان العظيم'],
    optionsEn: ['The miraculous She-Camel', 'The turning staff', 'Reviving the dead', 'The Great Flood'],
    correctIndex: 0,
    explanationAr: 'أخرج الله لقوم ثمود ناقة عظيمة من الصخرة الصماء آيةً ومعجزة لصدق نبي الله صالح عليه السلام، ولها شرب يوم ولهم شرب يوم معلوم.',
    explanationEn: 'Allah brought forth the miraculous She-Camel from the solid rock as a divine sign to the tribe of Thamud.',
    difficulty: 'easy'
  },

  // --- علوم القرآن وتدبره ---
  {
    id: 'q-quran-1',
    category: 'quran',
    categoryAr: 'علوم القرآن',
    categoryEn: 'Quranic Sciences',
    questionAr: 'ما هي السورة الوحيدة في القرآن الكريم التي لا تبدأ بالبسملة؟',
    questionEn: 'Which is the only Surah in the Holy Quran that does not begin with Bismillah?',
    optionsAr: ['سورة التوبة (براءة)', 'سورة الأنفال', 'سورة النمل', 'سورة الفلق'],
    optionsEn: ['Surah At-Tawbah (Bara’ah)', 'Surah Al-Anfal', 'Surah An-Naml', 'Surah Al-Falaq'],
    correctIndex: 0,
    explanationAr: 'سورة التوبة لا تبدأ بالبسملة لأنها نزلت بالسيف والبراءة من المشركين والمنافقين، والبسملة رحمة وأمان.',
    explanationEn: 'Surah At-Tawbah does not start with Bismillah because it was revealed with the declaration of disassociation from idolaters.',
    difficulty: 'easy'
  },
  {
    id: 'q-quran-2',
    category: 'quran',
    categoryAr: 'علوم القرآن',
    categoryEn: 'Quranic Sciences',
    questionAr: 'ما هي السورة التي ذكرت فيها البسملة كاملة مرتين؟',
    questionEn: 'In which Surah is the complete Bismillah mentioned twice?',
    optionsAr: ['سورة النمل', 'سورة النحل', 'سورة النور', 'سورة فاطر'],
    optionsEn: ['Surah An-Naml', 'Surah An-Nahl', 'Surah An-Nur', 'Surah Fatir'],
    correctIndex: 0,
    explanationAr: 'سورة النمل فيها بسملتان: الأولى في بدايتها، والثانية في ثناياها في الآية ٣٠: ﴿إِنَّهُ مِنْ سُلَيْمَانَ وَإِنَّهُ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ﴾.',
    explanationEn: 'Surah An-Naml contains Bismillah at the opening and inside verse 30 in the letter from Prophet Sulaiman (AS) to the Queen of Sheba.',
    difficulty: 'medium'
  },
  {
    id: 'q-quran-3',
    category: 'quran',
    categoryAr: 'علوم القرآن',
    categoryEn: 'Quranic Sciences',
    questionAr: 'ما هي أطول آية في القرآن الكريم، وفي أي سورة تقع؟',
    questionEn: 'What is the longest verse in the Holy Quran, and in which Surah is it located?',
    optionsAr: ['آية الدَّيْن (سورة البقرة: 282)', 'آية الكرسي (سورة البقرة: 255)', 'آية الميراث (سورة النساء: 11)', 'آية النور (سورة النور: 35)'],
    optionsEn: ['Ayah of Debt (Al-Baqarah: 282)', 'Ayat al-Kursi (Al-Baqarah: 255)', 'Ayah of Inheritance (An-Nisa: 11)', 'Ayat an-Nur (An-Nur: 35)'],
    correctIndex: 0,
    explanationAr: 'آية الدَّيْن في سورة البقرة (الآية 282) هي أطول آية في كتاب الله تعالى، حيث تستغرق صفحة كاملة وتفصل أحكام توثيق المعاملات المالية.',
    explanationEn: 'The verse of Debt (Surah Al-Baqarah, 282) is the longest verse in the Quran, spanning a full page on financial contracts.',
    difficulty: 'easy'
  },
  {
    id: 'q-quran-4',
    category: 'quran',
    categoryAr: 'علوم القرآن',
    categoryEn: 'Quranic Sciences',
    questionAr: 'كم عدد أحزاب القرآن الكريم وأجزائه؟',
    questionEn: 'How many Juz (Parts) and Ahzab (Sections) are there in the Quran?',
    optionsAr: ['٣٠ جزءاً و ٦٠ حزباً', '٣٠ جزءاً و ٣٠ حزباً', '١١٤ جزءاً و ٦٠ حزباً', '٢٠ جزءاً و ٤٠ حزباً'],
    optionsEn: ['30 Juz and 60 Ahzab', '30 Juz and 30 Ahzab', '114 Juz and 60 Ahzab', '20 Juz and 40 Ahzab'],
    correctIndex: 0,
    explanationAr: 'القرآن الكريم مقسم إلى ٣٠ جزءاً، وكل جزء يشتمل على حزبين، فيكون المجموع ٦٠ حزباً، و ٦٠٤ صفحة في مصحف المدينة النبوية.',
    explanationEn: 'The Quran comprises 30 Juz, each consisting of 2 Ahzab, totaling 60 Ahzab across 604 pages in the standard Mushaf.',
    difficulty: 'easy'
  },

  // --- الفقه والعبادات ---
  {
    id: 'q-fiqh-1',
    category: 'fiqh',
    categoryAr: 'الفقه والعبادات',
    categoryEn: 'Fiqh & Acts of Worship',
    questionAr: 'كم عدد ركعات السنن الرواتب المؤكدة في اليوم والليلة التي رغّب فيها النبي ﷺ؟',
    questionEn: 'How many confirmed daily Sunnah Rawatib rak’ahs did the Prophet ﷺ urge to preserve?',
    optionsAr: ['١٢ ركعة', '٨ ركعات', '١٠ ركعات', '١٤ ركعة'],
    optionsEn: ['12 Rak’ahs', '8 Rak’ahs', '10 Rak’ahs', '14 Rak’ahs'],
    correctIndex: 0,
    explanationAr: '١٢ ركعة: (٢ قبل الفجر، ٤ قبل الظهر و٢ بعدها، ٢ بعد المغرب، ٢ بعد العشاء). قال ﷺ: «مَنْ صَلَّى فِي يَوْمٍ وَلَيْلَةٍ ثِنْتَيْ عَشْرَةَ رَكْعَةً بُنِيَ لَهُ بَيْتٌ فِي الْجَنَّةِ».',
    explanationEn: '12 Rak’ahs: 2 before Fajr, 4 before Dhuhr and 2 after, 2 after Maghrib, 2 after Isha. Allah builds a house in Jannah for whoever preserves them.',
    difficulty: 'medium'
  },
  {
    id: 'q-fiqh-2',
    category: 'fiqh',
    categoryAr: 'الفقه والعبادات',
    categoryEn: 'Fiqh & Acts of Worship',
    questionAr: 'ما هو وقت صلاة الضحى، وما هو أفضل أوقاتها؟',
    questionEn: 'What is the time window for the Duha prayer, and what is its optimal moment?',
    optionsAr: ['من بعد طلوع الشمس بارتفاع قيد رمح حتى قبل الزوال (وأفضلها عند اشتداد الرمضاء)', 'من طلوع الفجر حتى الشروق', 'بين صلاتي الظهر والعصر', 'بعد صلاة العشاء مباشرة'],
    optionsEn: ['From 15 mins after sunrise until before zenith (best when heat intensifies)', 'From dawn until sunrise', 'Between Dhuhr and Asr', 'Immediately after Isha'],
    correctIndex: 0,
    explanationAr: 'يبدأ وقت الضحى بعد شروق الشمس بحوالي ١٥ دقيقة ويمتد حتى قبل أذان الظهر بـ ١٠ دقائق، وأفضل وقتها عند اشتداد حرارة الضحى (صلاة الأوابين).',
    explanationEn: 'Duha starts ~15 mins after sunrise until right before zenith, with its finest time when the ground gets warm (Salat al-Awwabin).',
    difficulty: 'medium'
  },
  {
    id: 'q-fiqh-3',
    category: 'fiqh',
    categoryAr: 'الفقه والعبادات',
    categoryEn: 'Fiqh & Acts of Worship',
    questionAr: 'ما هي الأيام البيض المستحب صيامها من كل شهر هجري؟',
    questionEn: 'Which are the White Days (Al-Ayyam Al-Beed) recommended for voluntary fasting each Hijri month?',
    optionsAr: ['أيام ١٣ و ١٤ و ١٥ من كل شهر هجري', 'أيام ١ و ٢ و ٣ من الشهر', 'أيام ٢٧ و ٢٨ و ٢٩', 'أيام العشر الأواخر فقط'],
    optionsEn: ['13th, 14th, and 15th of each lunar month', '1st, 2nd, and 3rd', '27th, 28th, and 29th', 'Last ten days only'],
    correctIndex: 0,
    explanationAr: 'الأيام البيض هي اليوم الثالث عشر والرابع عشر والخامس عشر من كل شهر قمري، وسميت بيضاً لاكتمال نور القمر فيها كالبدر، وصيامها يعدل صيام الدهر.',
    explanationEn: 'The 13th, 14th, and 15th of every Islamic month when the full moon shines bright. Fasting them is equivalent to fasting the entire year.',
    difficulty: 'easy'
  },
  {
    id: 'q-fiqh-4',
    category: 'fiqh',
    categoryAr: 'الفقه والعبادات',
    categoryEn: 'Fiqh & Acts of Worship',
    questionAr: 'ما هو حكم سجود التلاوة عند المرور بآية سجدة أثناء تلاوة القرآن؟',
    questionEn: 'What is the Islamic ruling on Sujood At-Tilawah (Prostration of Recitation)?',
    optionsAr: ['سُنّة مؤكدة مستحبة', 'فرض عين واجب', 'مكروه تركه فقط في الصلاة', 'مباح لا ثواب فيه'],
    optionsEn: ['Confirmed Sunnah (Mustahabb)', 'Strict Obligation (Fard Ayn)', 'Disliked to omit only in prayer', 'Permissible with no reward'],
    correctIndex: 0,
    explanationAr: 'سجود التلاوة سُنّة مؤكدة يُثاب فاعلها ولا يعاقب تاركها، وسجد النبي ﷺ وسجد الصحابة معه عند سماع أو قراءة آيات السجدة.',
    explanationEn: 'Sujood At-Tilawah is a strongly recommended Sunnah for which a Muslim is rewarded, following the practice of the Prophet ﷺ and his companions.',
    difficulty: 'medium'
  },
  {
    id: 'q-seerah-5',
    category: 'seerah',
    categoryAr: 'السيرة النبوية',
    categoryEn: 'Prophetic Biography',
    questionAr: 'في أي عام هجري فرض صيام شهر رمضان المبارك على المسلمين؟',
    questionEn: 'In which Hijri year was fasting in the month of Ramadan made obligatory for Muslims?',
    optionsAr: ['السنة الثانية للهجرة', 'السنة الأولى للهجرة', 'السنة الثالثة للهجرة', 'السنة الخامسة للهجرة'],
    optionsEn: ['2nd Hijri Year (2 AH)', '1st Hijri Year (1 AH)', '3rd Hijri Year (3 AH)', '5th Hijri Year (5 AH)'],
    correctIndex: 0,
    explanationAr: 'فُرِض صيام رمضان في شهر شعبان من السنة الثانية للهجرة، وهي السنة التي كُتب فيها القتال وفرضت فيها زكاة الفطر.',
    explanationEn: 'Fasting in Ramadan was made obligatory in Sha’ban of 2 AH, the same year that fighting was legislated and Zakat al-Fitr was prescribed.',
    difficulty: 'medium'
  },
  {
    id: 'q-prophets-5',
    category: 'prophets',
    categoryAr: 'قصص الأنبياء',
    categoryEn: 'Stories of Prophets',
    questionAr: 'من هو النبي الذي ابتلاه الله بفقد بصره وولده واشتُهر بصبره الطويل حتى قال: ﴿إِنَّمَا أَشْكُو بَثِّي وَحُزْنِي إِلَى اللَّهِ﴾؟',
    questionEn: 'Which Prophet was trialed with the loss of his sight and his son, and was famous for his patience, saying: "I only complain of my suffering and my grief to Allah"?',
    optionsAr: ['يعقوب عليه السلام', 'أيوب عليه السلام', 'يوسف عليه السلام', 'زكريا عليه السلام'],
    optionsEn: ['Prophet Yaqub (Jacob) AS', 'Prophet Ayyub (Job) AS', 'Prophet Yusuf (Joseph) AS', 'Prophet Zakariya AS'],
    correctIndex: 0,
    explanationAr: 'نبي الله يعقوب عليه السلام حزن على فراق ابنه يوسف حزناً شديداً حتى ابيضّت عيناه من الحزن فهو كظيم، ولم يفقد الأمل في رحمة الله ولطفه.',
    explanationEn: 'Prophet Yaqub (AS) wept for his beloved son Yusuf until he lost his eyesight from grief, yet his faith and patience remained unshaken.',
    difficulty: 'easy'
  },
  {
    id: 'q-quran-5',
    category: 'quran',
    categoryAr: 'علوم القرآن',
    categoryEn: 'Quranic Sciences',
    questionAr: 'كم عدد السور المكية والسور المدنية في القرآن الكريم وفق القول الراجح؟',
    questionEn: 'How many Makki and Madani Surahs are there in the Quran according to the most widely accepted scholarly view?',
    optionsAr: ['٨٦ مكية و ٢٨ مدنية', '٨٢ مكية و ٣٢ مدنية', '٩٠ مكية و ٢٤ مدنية', '٧٥ مكية و ٣٩ مدنية'],
    optionsEn: ['86 Makki and 28 Madani', '82 Makki and 32 Madani', '90 Makki and 24 Madani', '75 Makki and 39 Madani'],
    correctIndex: 0,
    explanationAr: 'القرآن الكريم يضم ١١٤ سورة، الراجح منها أن ٨٦ سورة نزلت قبل الهجرة (مكية)، و ٢٨ سورة نزلت بعد الهجرة في المدينة المنورة (مدنية).',
    explanationEn: 'The Holy Quran consists of 114 Surahs: 86 Surahs are Makki (revealed before the Hijrah to Madinah) and 28 Surahs are Madani.',
    difficulty: 'medium'
  },
  {
    id: 'q-fiqh-5',
    category: 'fiqh',
    categoryAr: 'الفقه والعبادات',
    categoryEn: 'Fiqh & Acts of Worship',
    questionAr: 'ما هي شروط صحة الصلاة التي تجب قبل البدء فيها ولا تسقط بحال مع القدرة؟',
    questionEn: 'What are the essential conditions (Shurut) for the validity of prayer that must be fulfilled before starting?',
    optionsAr: ['الطهارة، دخول الوقت، ستر العورة، استقبال القبلة، النية', 'الركوع، السجود، قراءة الفاتحة، الطمأنينة', 'التشهد الأخير، تكبيرة الإحرام، التسليم', 'الأذان والإقامة وقراءة ما تيسر من القرآن'],
    optionsEn: ['Purity, Time, Covering Awrah, Facing Qiblah, Intention', 'Ruku, Sujood, Reciting Al-Fatihah, Tranquility', 'Final Tashahhud, Opening Takbeer, Tasleem', 'Adhan, Iqamah, Reciting Quran verses'],
    correctIndex: 0,
    explanationAr: 'شروط صحة الصلاة خمسة تسبق الصلاة: ١. الإسلام والعقل والتمييز، ٢. الطهارة (من الحدث والخبث)، ٣. دخول وقت الصلاة، ٤. ستر العورة، ٥. استقبال القبلة والنية.',
    explanationEn: 'The absolute requirements before starting a prayer are ritual purity, entry of the prayer time, covering the private areas (awrah), facing the Qiblah, and making the intention (niyyah).',
    difficulty: 'medium'
  }
];
