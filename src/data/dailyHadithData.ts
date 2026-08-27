export interface DailyHadith {
  id: string;
  hadithNumber: number;
  textAr: string;
  textEn: string;
  narratorAr: string;
  narratorEn: string;
  sourceAr: string;
  sourceEn: string;
  authenticityAr: string;
  authenticityEn: string;
  topicAr: string;
  topicEn: string;
  explanationAr: string;
  explanationEn: string;
  practicalActionAr: string;
  practicalActionEn: string;
  keywords: string[];
}

export const DAILY_HADITHS_COLLECTION: DailyHadith[] = [
  {
    id: 'hadith-1',
    hadithNumber: 1,
    textAr: 'عَنْ أَمِيرِ المُؤْمِنِينَ عُمَرَ بْنِ الخَطَّابِ رَضِيَ اللهُ عَنْهُ قَالَ: سَمِعْتُ رَسُولَ اللهِ ﷺ يَقُولُ: «إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى اللهِ وَرَسُولِهِ، فَهِجْرَتُهُ إِلَى اللهِ وَرَسُولِهِ، وَمَنْ كَانَتْ هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا أَوْ امْرَأَةٍ يَنْكِحُهَا، فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ».',
    textEn: 'On the authority of the Commander of the Faithful, Umar ibn al-Khattab (RA), who said: I heard the Messenger of Allah ﷺ say: "Actions are but by intentions, and every person will have only what they intended. Whoever migrated for Allah and His Messenger, their migration is for Allah and His Messenger. And whoever migrated for worldly gain or to marry a woman, their migration is to what they migrated for."',
    narratorAr: 'عمر بن الخطاب رضي الله عنه',
    narratorEn: 'Umar ibn Al-Khattab (RA)',
    sourceAr: 'صحيح البخاري (١) وصحيح مسلم (١٩٠٧)',
    sourceEn: 'Sahih Al-Bukhari (1) & Sahih Muslim (1907)',
    authenticityAr: 'حديث صحيح متفق عليه (أصل من أصول الإسلام)',
    authenticityEn: 'Muttafaq ‘Alayh (Highest Grade Authenticity)',
    topicAr: 'الإخلاص واستحضار النية في سائر الأعمال',
    topicEn: 'Sincerity & Pure Intention in All Deeds',
    explanationAr: 'هذا الحديث الشريف هو ميزان الأعمال الباطنة؛ فالنية الصالحة تحول العادات اليومية (كالنوم والأكل والعمل والنفقة على الأهل) إلى عبادات وطاعات يُثاب عليها العبد ثواباً جزيلاً.',
    explanationEn: 'This profound Hadith is the bedrock of internal deeds. Pure intention transforms mundane routines (eating, working, sleeping) into rewarded acts of worship.',
    practicalActionAr: '💡 التطبيق العملي اليوم: قبل أن تخرج لعملك أو تبدأ دراستك أو تنفق على بيتك، قف ثانية وانوِ بذلك إعفاف نفسك وأهلك والتقوي على طاعة الله لتنال أجر المجاهدين والذاكرين.',
    practicalActionEn: '💡 Practical Action Today: Pause before your work, study, or family care, and intend it as a means to seek halal sustenance and honor Allah, transforming routines into worship.',
    keywords: ['النية', 'الإخلاص', 'العمل', 'الهجرة', 'البخاري']
  },
  {
    id: 'hadith-2',
    hadithNumber: 2,
    textAr: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ أَنَّ رَسُولَ اللهِ ﷺ قَالَ: «كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي المِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللهِ وَبِحَمْدِهِ، سُبْحَانَ اللهِ العَظِيمِ».',
    textEn: 'Narrated Abu Huraira (RA): The Prophet ﷺ said: "Two phrases are light on the tongue, heavy in the scales, and beloved to the Most Merciful: Subhan Allahi wa bihamdihi, Subhan Allahil-’Azeem (Glory be to Allah and His is the praise, Glory be to Allah the Supreme)."',
    narratorAr: 'أبو هريرة رضي الله عنه',
    narratorEn: 'Abu Hurairah (RA)',
    sourceAr: 'صحيح البخاري (٦٤٠٦) وصحيح مسلم (٢٦٩٤)',
    sourceEn: 'Sahih Al-Bukhari (6406) & Sahih Muslim (2694)',
    authenticityAr: 'حديث صحيح متفق عليه (خاتمة صحيح البخاري)',
    authenticityEn: 'Sahih (Muttafaq ‘Alayh - Finale of Sahih Al-Bukhari)',
    topicAr: 'فضل الذكر ومضاعفة الأجر العظيم بكلمات يسيرة',
    topicEn: 'Virtues of Dhikr & Immense Rewards of Light Words',
    explanationAr: 'من سعة رحمة الله وفضله أنه جعل الذكر اليسير الذي لا مشقة فيه أثقل في ميزان الحسنات من جبال الحسنات، وأحبه الرحمن جل جلاله لاشتماله على التنزيه والحمد والتعظيم.',
    explanationEn: 'By Allah’s infinite grace, light easy remembrance without physical burden outweighs mountains of deeds on the Day of Judgment because it combines glorification, praise, and majesty.',
    practicalActionAr: '💡 التطبيق العملي اليوم: ردد «سُبْحَانَ اللهِ وَبِحَمْدِهِ، سُبْحَانَ اللهِ العَظِيمِ» ١٠٠ مرة أثناء طريقك أو انتظارك، واملأ صحيفتك بما يحبه الرحمن وتثقل به موازينك.',
    practicalActionEn: '💡 Practical Action Today: Repeat "Subhan Allahi wa bihamdihi, Subhan Allahil-’Azeem" 100 times during commutes or pauses to fill your scale with beloved words to the Most Merciful.',
    keywords: ['تسبيح', 'الذكر', 'الميزان', 'الرحمن', 'البخاري']
  },
  {
    id: 'hadith-3',
    hadithNumber: 3,
    textAr: 'عَنْ أَنَسِ بْنِ مَالِكٍ رَضِيَ اللهُ عَنْهُ عَنِ النَّبِيِّ ﷺ قَالَ: «لا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ».',
    textEn: 'Narrated Anas ibn Malik (RA): The Prophet ﷺ said: "None of you truly believes until he loves for his brother what he loves for himself."',
    narratorAr: 'أنس بن مالك رضي الله عنه',
    narratorEn: 'Anas ibn Malik (RA)',
    sourceAr: 'صحيح البخاري (١٣) وصحيح مسلم (٤٥)',
    sourceEn: 'Sahih Al-Bukhari (13) & Sahih Muslim (45)',
    authenticityAr: 'حديث صحيح متفق عليه',
    authenticityEn: 'Sahih (Muttafaq ‘Alayh)',
    topicAr: 'سلامة الصدر والأخوة الإيمانية وحب الخير للناس',
    topicEn: 'Purity of Heart, Brotherhood & Loving Good for All',
    explanationAr: 'كمال الإيمان وحلاوته تتجلى في طهارة القلب من الحسد والغل والبغضاء، وأن يفرح المسلم بنعمة الله على أخيه ويسعى في تفريج كربته ونفعه.',
    explanationEn: 'Complete faith radiates through a heart cleansed of envy and malice, where a believer genuinely rejoices in others’ blessings and strives to uplift them.',
    practicalActionAr: '💡 التطبيق العملي اليوم: ادعُ بظهر الغيب لشخص تعرفه ببركة في رزقه وأهله وصحته، فإن الملك يقول لك: «ولك بمثل»، وأزِل من قلبك أي غيرة أو حسد.',
    practicalActionEn: '💡 Practical Action Today: Make a secret sincere prayer for a colleague or friend for their health and success; an angel responds: "And to you the same."',
    keywords: ['الأخوة', 'الإيمان', 'سلامة الصدر', 'المحبة', 'الخير']
  },
  {
    id: 'hadith-4',
    hadithNumber: 4,
    textAr: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ أَنَّ رَسُولَ اللهِ ﷺ قَالَ: «مَنْ نَفَّسَ عَنْ مُؤْمِنٍ كُرْبَةً مِنْ كُرَبِ الدُّنْيَا، نَفَّسَ اللهُ عَنْهُ كُرْبَةً مِنْ كُرَبِ يَوْمِ القِيَامَةِ، وَمَنْ يَسَّرَ عَلَى مُعْسِرٍ، يَسَّرَ اللهُ عَلَيْهِ فِي الدُّنْيَا وَالآخِرَةِ، وَمَنْ سَتَرَ مُسْلِماً، سَتَرَهُ اللهُ فِي الدُّنْيَا وَالآخِرَةِ، وَاللهُ فِي عَوْنِ العَبْدِ مَا كَانَ العَبْدُ فِي عَوْنِ أَخِيهِ».',
    textEn: 'Abu Hurairah (RA) reported: The Messenger of Allah ﷺ said: "Whoever relieves a believer’s distress of the distressful aspects of this world, Allah will relieve their distress on the Day of Resurrection. Whoever makes things easy for a person in difficulty, Allah will make things easy for them in this world and in the Hereafter. Whoever covers the faults of a Muslim, Allah will cover them in this world and the Hereafter. Allah helps His servant as long as the servant helps their brother."',
    narratorAr: 'أبو هريرة رضي الله عنه',
    narratorEn: 'Abu Hurairah (RA)',
    sourceAr: 'صحيح مسلم (٢٦٩٩)',
    sourceEn: 'Sahih Muslim (2699)',
    authenticityAr: 'حديث صحيح',
    authenticityEn: 'Sahih (Muslim)',
    topicAr: 'قضاء حوائج الناس والتيسير والستر والمعونة',
    topicEn: 'Relieving Distress, Ease, and Helping Others',
    explanationAr: 'الجزاء من جنس العمل؛ من فرّج عن الناس فرّج الله عنه، ومن كان في خدمة الخلق حظي بمعونة الخالق العظيم وستره ورعايته.',
    explanationEn: 'The reward corresponds precisely to the nature of the deed: whoever aids creations receives the direct help, shield, and relief of the Almighty Creator.',
    practicalActionAr: '💡 التطبيق العملي اليوم: ابحث اليوم عن شخص محتاج لمعونة أو مساعدة بسيطة في عملك أو محيطك وقدمها له برضا وسرور لتكون في رعاية الله ومعونته.',
    practicalActionEn: '💡 Practical Action Today: Find one person who needs help or encouragement today, assist them generously, and unlock Allah’s direct aid in your own affairs.',
    keywords: ['قضاء الحوائج', 'الستر', 'التيسير', 'عون الله', 'مسلم']
  },
  {
    id: 'hadith-5',
    hadithNumber: 5,
    textAr: 'عَنْ عَبْدِ اللهِ بْنِ عَمْرٍو رَضِيَ اللهُ عَنْهُمَا قَالَ: قَالَ رَسُولُ اللهِ ﷺ: «خَيْرُكُمْ مَنْ تَعَلَّمَ القُرْآنَ وَعَلَّمَهُ».',
    textEn: 'Narrated Uthman ibn Affan (RA): The Prophet ﷺ said: "The best among you are those who learn the Quran and teach it."',
    narratorAr: 'عثمان بن عفان رضي الله عنه',
    narratorEn: 'Uthman ibn Affan (RA)',
    sourceAr: 'صحيح البخاري (٥٠٢٧)',
    sourceEn: 'Sahih Al-Bukhari (5027)',
    authenticityAr: 'حديث صحيح',
    authenticityEn: 'Sahih (Bukhari)',
    topicAr: 'فضل تعلم القرآن الكريم وتلاوته وتدبره وتعليمه',
    topicEn: 'Virtue of Learning and Teaching the Quran',
    explanationAr: 'خير الأمة وأشرفها منزلة هم أهل القرآن الذين يتعلمون ألفاظه ومعانيه وأحكامه، ويعلمونه للأجيال ابتغاء وجه الله تعالى.',
    explanationEn: 'The highest nobility in the Ummah belongs to the people of the Quran who dedicate time to learn its letters, meanings, and rules, passing its light to others.',
    practicalActionAr: '💡 التطبيق العملي اليوم: اقرأ اليوم وجهاً واحداً من المصحف بتدبر، أو علّم آية وسورة الفاتحة لأحد أبنائك أو إخوانك لتنال هذه الخيرية النبوية.',
    practicalActionEn: '💡 Practical Action Today: Read at least one page with tafsir reflection, or teach Surah Al-Fatihah/an ayah to someone in your family to embody this prophetic virtue.',
    keywords: ['القرآن', 'التعلم', 'التدبر', 'البخاري', 'خيركم']
  }
];

export function getTodayHadith(): DailyHadith {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  const index = Math.abs(dayOfYear) % DAILY_HADITHS_COLLECTION.length;
  return DAILY_HADITHS_COLLECTION[index];
}
