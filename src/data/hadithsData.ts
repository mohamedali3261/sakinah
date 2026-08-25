import { Book } from '../types';

/**
 * مجموعة الأحاديث النبوية الصحيحة المخرجة من أصح الكتب:
 * 1. صحيح البخاري (الإمام محمد بن إسماعيل البخاري)
 * 2. صحيح مسلم (الإمام مسلم بن الحجاج القشيري النيسابوري)
 * 3. الأحاديث المتفق عليها (متفق عليه بين البخاري ومسلم)
 */

export const SAHIH_BUKHARI_BOOK: Book = {
  id: 'bukhari-select',
  titleAr: 'صحيح البخاري (الجامع المسند الصحيح)',
  titleEn: 'Sahih Al-Bukhari (Authentic Traditions)',
  authorAr: 'الإمام أمير المؤمنين في الحديث محمد بن إسماعيل البخاري',
  authorEn: 'Imam Muhammad ibn Ismail Al-Bukhari',
  category: 'hadith',
  descriptionAr: 'أصح كتاب بعد كتاب الله عز وجل، يجمع عيون الأحاديث الصحيحة المسندة في العقيدة والأحكام والفضائل والأخلاق والأذكار.',
  descriptionEn: 'The most authentic collection of Hadith after the Holy Quran.',
  chaptersCount: 10,
  colorAccent: 'emerald',
  chapters: [
    {
      id: 'bkh-1',
      hadithNumber: 1,
      titleAr: 'حديث إنما الأعمال بالنيات (صحيح البخاري 1)',
      titleEn: 'Actions are by Intentions (Sahih Bukhari 1)',
      contentAr: 'عَنْ أَمِيرِ الْمُؤْمِنِينَ أَبِي حَفْصٍ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللَّهُ عَنْهُ قَالَ: سَمِعْتُ رَسُولَ اللَّهِ ﷺ يَقُولُ:\n\n«إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ فَهِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ، وَمَنْ كَانَتْ هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا أَوْ امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ». [رواه البخاري في صحيحه - الحديث رقم 1]',
      contentEn: 'Narrated Umar ibn Al-Khattab (may Allah be pleased with him): I heard the Messenger of Allah ﷺ say: "Deeds are evaluated by intentions, and every person will have what they intended..."',
      explanationAr: 'هذا الحديث هو أول حديث افتتح به الإمام البخاري صحيحه، وهو ثلث العلم وأساس قبول الأعمال، وميزان الأعمال الباطنة التي ترتبط بالقصد والإخلاص لله تعالى.',
      explanationEn: 'Essential foundation for sincere intention in every worship and worldly deed.'
    },
    {
      id: 'bkh-2',
      hadithNumber: 6406,
      titleAr: 'حديث كلمتان خفيفتان على اللسان ثقيلتان في الميزان (صحيح البخاري 6406)',
      titleEn: 'Two Words Heavy on the Scale (Sahih Bukhari 6406)',
      contentAr: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ ﷺ:\n\n«كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي المِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ العَظِيمِ». [رواه البخاري في صحيحه - الحديث رقم 6406]',
      contentEn: 'Narrated Abu Hurairah: The Prophet ﷺ said: "Two statements are light on the tongue, heavy in the scale, beloved to the Most Merciful: Subhanallahi wa bihamdihi, Subhanallahil-Azeem."',
      explanationAr: 'هذا هو الحديث الأخير الذي ختم به الإمام البخاري صحيحه العظيم، وفيه تذكير بسعة فضل الله ورحمته وسهولة الذكر وثقل أجره في الميزان.',
      explanationEn: 'The profound conclusion of Sahih Al-Bukhari highlighting immense reward for easy remembrance.'
    },
    {
      id: 'bkh-3',
      hadithNumber: 6407,
      titleAr: 'حديث مثل الذي يذكر ربه والذي لا يذكر ربه (صحيح البخاري 6407)',
      titleEn: 'Example of the One Who Remembers Allah (Sahih Bukhari 6407)',
      contentAr: 'عَنْ أَبِي مُوسَى الأَشْعَرِيِّ رَضِيَ اللَّهُ عَنْهُ قَالَ: قَالَ النَّبِيُّ ﷺ:\n\n«مَثَلُ الَّذِي يَذْكُرُ رَبَّهُ وَالَّذِي لاَ يَذْكُرُ رَبَّهُ، مَثَلُ الحَيِّ وَالمَيِّتِ». [رواه البخاري في صحيحه - الحديث رقم 6407]',
      contentEn: 'Narrated Abu Musa Al-Ash’ari: The Prophet ﷺ said: "The example of the one who remembers his Lord and the one who does not is like the living and the dead."',
      explanationAr: 'بيان أن الذكر هو حياة القلوب ونور الأرواح، والغفلة موت حقيقي وإن كان الجسد حياً.',
      explanationEn: 'Remembrance is the true life of the heart and spiritual essence.'
    },
    {
      id: 'bkh-4',
      hadithNumber: 6306,
      titleAr: 'حديث سيد الاستغفار ودخول الجنة (صحيح البخاري 6306)',
      titleEn: 'The Master of Forgiveness (Sahih Bukhari 6306)',
      contentAr: 'عَنْ شَدَّادِ بْنِ أَوْسٍ رَضِيَ اللَّهُ عَنْهُ عَنِ النَّبِيِّ ﷺ قَالَ:\n\n«سَيِّدُ الاِسْتِغْفَارِ أَنْ تَقُولَ: اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ. وَمَنْ قَالَهَا مِنَ النَّهَارِ مُوقِناً بِهَا، فَمَاتَ مِنْ يَوْمِهِ قَبْلَ أَنْ يُمْسِيَ، فَهُوَ مِنْ أَهْلِ الجَنَّةِ، وَمَنْ قَالَهَا مِنَ اللَّيْلِ وَهُوَ مُوقِنٌ بِهَا، فَمَاتَ قَبْلَ أَنْ يُصْبِحَ، فَهُوَ مِنْ أَهْلِ الجَنَّةِ». [رواه البخاري في صحيحه - الحديث رقم 6306]',
      contentEn: 'Narrated Shaddad ibn Aws: The Prophet ﷺ said: "The master supplication for forgiveness is to say: O Allah, You are my Lord..."',
      explanationAr: 'أعظم صيغ الاستغفار، تتضمن الإقرار بربوبية الله وألوهيته، واعتراف العبد بالنعمة والتقصير وسؤال التوبة.',
      explanationEn: 'The supreme invocation for repentance guaranteeing Paradise when recited with firm belief.'
    },
    {
      id: 'bkh-5',
      hadithNumber: 5027,
      titleAr: 'حديث خيركم من تعلم القرآن وعلمه (صحيح البخاري 5027)',
      titleEn: 'The Best Among You Learn and Teach Quran (Sahih Bukhari 5027)',
      contentAr: 'عَنْ عُثْمَانَ بْنِ عَفَّانَ رَضِيَ اللَّهُ عَنْهُ عَنِ النَّبِيِّ ﷺ قَالَ:\n\n«خَيْرُكُمْ مَنْ تَعَلَّمَ القُرْآنَ وَعَلَّمَهُ». [رواه البخاري في صحيحه - الحديث رقم 5027]',
      contentEn: 'Narrated Uthman ibn Affan: The Prophet ﷺ said: "The best of you are those who learn the Quran and teach it."',
      explanationAr: 'بيان الشرف العظيم لمن يشتغل بكتاب الله قراءة وتدبراً وتعليماً وعملاً.',
      explanationEn: 'Highest spiritual rank accorded to Quran learners and teachers.'
    },
    {
      id: 'bkh-6',
      hadithNumber: 660,
      titleAr: 'حديث السبعة الذين يظلهم الله في ظله (صحيح البخاري 660)',
      titleEn: 'Seven Groups Shaded by Allah (Sahih Bukhari 660)',
      contentAr: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ عَنِ النَّبِيِّ ﷺ قَالَ:\n\n«سَبْعَةٌ يُظِلُّهُمُ اللَّهُ فِي ظِلِّهِ يَوْمَ لاَ ظِلَّ إِلاَّ ظِلُّهُ: الإِمَامُ العَادِلُ، وَشَابٌّ نَشَأَ فِي عِبَادَةِ رَبِّهِ، وَرَجُلٌ قَلْبُهُ مُعَلَّقٌ فِي المَسَاجِدِ، وَرَجُلاَنِ تَحَابَّا فِي اللَّهِ اجْتَمَعَا عَلَيْهِ وَتَفَرَّقَا عَلَيْهِ، وَرَجُلٌ طَلَبَتْهُ امْرَأَةٌ ذَاتُ مَنْصِبٍ وَجَمَالٍ فَقَالَ إِنِّي أَخَافُ اللَّهَ، وَرَجُلٌ تَصَدَّقَ بِصَدَقَةٍ فَأَخْفَاهَا حَتَّى لاَ تَعْلَمَ شِمَالُهُ مَا تُنْفِقُ يَمِينُهُ، وَرَجُلٌ ذَكَرَ اللَّهَ خَالِياً فَفَاضَتْ عَيْنَاهُ». [رواه البخاري في صحيحه - الحديث رقم 660]',
      contentEn: 'Narrated Abu Hurairah: The Prophet ﷺ said: "Seven will be shaded by Allah on the Day when there is no shade but His..."',
      explanationAr: 'بشارة عظمى لأصحاب الأخلاق العالية والأعمال الخفية والمحبة الصادقة في الله بالأمان يوم القيامة.',
      explanationEn: 'Details seven noble qualities providing divine protection on the Day of Judgment.'
    },
    {
      id: 'bkh-7',
      hadithNumber: 6412,
      titleAr: 'حديث نعمتان مغبون فيهما كثير من الناس (صحيح البخاري 6412)',
      titleEn: 'Two Blessings Lost by Many People (Sahih Bukhari 6412)',
      contentAr: 'عَنْ عَبْدِ اللَّهِ بْنِ عَبَّاسٍ رَضِيَ اللَّهُ عَنْهُمَا قَالَ: قَالَ النَّبِيُّ ﷺ:\n\n«نِعْمَتَانِ مَغْبُونٌ فِيهِمَا كَثِيرٌ مِنَ النَّاسِ: الصِّحَّةُ وَالفَرَاغُ». [رواه البخاري في صحيحه - الحديث رقم 6412]',
      contentEn: 'Narrated Ibn Abbas: The Prophet ﷺ said: "Two blessings many people lose: health and free time."',
      explanationAr: 'تنبيه نبوي حكيم لاستغلال نعمة الصحة وأوقات الفراغ في الطاعة والعمل الصالح قبل فوات الأوان.',
      explanationEn: 'Prophetic wisdom urging the active use of health and free time in good deeds.'
    },
    {
      id: 'bkh-8',
      hadithNumber: 6465,
      titleAr: 'حديث أحب الأعمال إلى الله أدومها وإن قل (صحيح البخاري 6465)',
      titleEn: 'Most Beloved Deeds are Continuous Ones (Sahih Bukhari 6465)',
      contentAr: 'عَنْ أُمِّ الْمُؤْمِنِينَ عَائِشَةَ رَضِيَ اللَّهُ عَنْهَا أَنَّ رَسُولَ اللَّهِ ﷺ قَالَ:\n\n«أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ». [رواه البخاري في صحيحه - الحديث رقم 6465]',
      contentEn: 'Narrated Aisha: The Messenger of Allah ﷺ said: "The most beloved deeds to Allah are those done regularly, even if small."',
      explanationAr: 'الحث على الاستقامة والمداومة على الأوراد والعبادات اليومية الخفيفة بدلاً من الحماس المؤقت المنقطع.',
      explanationEn: 'Encourages building consistent, small daily spiritual habits.'
    },
    {
      id: 'bkh-9',
      hadithNumber: 6018,
      titleAr: 'حديث من كان يؤمن بالله واليوم الآخر فليقل خيراً (صحيح البخاري 6018)',
      titleEn: 'Speak Good or Remain Silent (Sahih Bukhari 6018)',
      contentAr: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ عَنْ رَسُولِ اللَّهِ ﷺ قَالَ:\n\n«مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَاليَوْمِ الآخِرِ فَلْيَقُلْ خَيْراً أَوْ لِيَصْمُتْ، وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَاليَوْمِ الآخِرِ فَلْيُكْرِمْ جَارَهُ، وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَاليَوْمِ الآخِرِ فَلْيُكْرِمْ ضَيْفَهُ». [رواه البخاري في صحيحه - الحديث رقم 6018]',
      contentEn: 'Narrated Abu Hurairah: The Prophet ﷺ said: "Whoever believes in Allah and the Last Day should speak good or remain silent..."',
      explanationAr: 'أصل عظيم في حفظ اللسان وحسن الجوار وإكرام الضيف ومن أسباب السلامة والرضوان.',
      explanationEn: 'Core Islamic ethics on safeguarding speech, good neighborliness, and hospitality.'
    },
    {
      id: 'bkh-10',
      hadithNumber: 69,
      titleAr: 'حديث يسّروا ولا تعسّروا، وبشّروا ولا تنفّروا (صحيح البخاري 69)',
      titleEn: 'Make Things Easy and Do Not Make Them Difficult (Sahih Bukhari 69)',
      contentAr: 'عَنْ أَنَسِ بْنِ مَالِكٍ رَضِيَ اللَّهُ عَنْهُ عَنِ النَّبِيِّ ﷺ قَالَ:\n\n«يَسِّرُوا وَلاَ تُعَسِّرُوا، وَبَشِّرُوا وَلاَ تُنَفِّرُوا». [رواه البخاري في صحيحه - الحديث رقم 69]',
      contentEn: 'Narrated Anas ibn Malik: The Prophet ﷺ said: "Facilitate things for people and do not make them difficult, bring glad tidings and do not drive people away."',
      explanationAr: 'قاعدة التيسير والتبشير في الدعوة والعبادة والمعاملات ومراعاة احوال الناس.',
      explanationEn: 'The prophetic principle of ease, encouragement, and moderation.'
    }
  ]
};

export const SAHIH_MUSLIM_BOOK: Book = {
  id: 'muslim-select',
  titleAr: 'صحيح مسلم (المسند الصحيح المختصر)',
  titleEn: 'Sahih Muslim (Authentic Collection)',
  authorAr: 'الإمام أَبُو الحُسَيْنِ مُسْلِمُ بْنُ الحَجَّاجِ النَّيْسَابُورِيُّ',
  authorEn: 'Imam Muslim ibn Al-Hajjaj Al-Naysaburi',
  category: 'hadith',
  descriptionAr: 'ثاني أصح كتاب في السنة النبوية المطهرة، يمتاز بحسن الترتيب وسياق الأسانيد والمتون بدقة ودقة الرواية.',
  descriptionEn: 'The famous authentic collection of Imam Muslim, second only to Bukhari.',
  chaptersCount: 10,
  colorAccent: 'sky',
  chapters: [
    {
      id: 'msl-1',
      hadithNumber: 223,
      titleAr: 'حديث الطهور شطر الإيمان والحمد لله تملأ الميزان (صحيح مسلم 223)',
      titleEn: 'Purification is Half of Faith (Sahih Muslim 223)',
      contentAr: 'عَنْ أَبِي مَالِكٍ الأَشْعَرِيِّ رَضِيَ اللَّهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ ﷺ:\n\n«الطُّهُورُ شَطْرُ الإِيمَانِ، وَالْحَمْدُ لِلَّهِ تَمْلأُ المِيزَانَ، وَسُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ تَمْلَآنِ - أَوْ تَمْلأُ - مَا بَيْنَ السَّمَاوَاتِ وَالأَرْضِ، وَالصَّلاَةُ نُورٌ، وَالصَّدَقَةُ بُرْهَانٌ، وَالصَّبْرُ ضِيَاءٌ، وَالْقُرْآنُ حُجَّةٌ لَكَ أَوْ عَلَيْكَ، كُلُّ النَّاسِ يَغْدُو فَبَائِعٌ نَفْسَهُ فَمُعْتِقُهَا أَوْ مُوبِقُهَا». [رواه مسلم في صحيحه - الحديث رقم 223]',
      contentEn: 'Narrated Abu Malik Al-Ash’ari: The Prophet ﷺ said: "Purification is half of faith, and Alhamdulillah fills the scale..."',
      explanationAr: 'حديث جامع لأصول الإسلام، يبين عظمة الطهارة وفضل التسبيح والتحميد والتزام الصلاة والصبر والقرآن.',
      explanationEn: 'Comprehensive prophetic guidance on physical and spiritual purification.'
    },
    {
      id: 'msl-2',
      hadithNumber: 2691,
      titleAr: 'حديث غفران الذنوب بسُبحان الله وبحمده مائة مرة (صحيح مسلم 2691)',
      titleEn: 'Forgiveness of Sins like Sea Foam (Sahih Muslim 2691)',
      contentAr: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ أَنَّ رَسُولَ اللَّهِ ﷺ قَالَ:\n\n«مَنْ قَالَ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ فِي يَوْمٍ مِائَةَ مَرَّةٍ، حُطَّتْ خَطَايَاهُ وَإِنْ كَانَتْ مِثْلَ زَبَدِ الْبَحْرِ». [رواه مسلم في صحيحه - الحديث رقم 2691]',
      contentEn: 'Narrated Abu Hurairah: The Prophet ﷺ said: "Whoever says Subhanallahi wa bihamdihi 100 times a day, his sins will be forgiven even if they were like the foam of the sea."',
      explanationAr: 'بيان سعة المغفرة الإلهية والترغيب في المحافظة على هذا الذكر الخفيف اليومي.',
      explanationEn: 'Highlights immense divine forgiveness for daily subhanallah recitation.'
    },
    {
      id: 'msl-3',
      hadithNumber: 2137,
      titleAr: 'حديث أحب الكلام إلى الله أربع (صحيح مسلم 2137)',
      titleEn: 'Four Phrases Most Beloved to Allah (Sahih Muslim 2137)',
      contentAr: 'عَنْ سَمُرَةَ بْنِ جُنْدُبٍ رَضِيَ اللَّهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ ﷺ:\n\n«أَحَبُّ الْكَلاَمِ إِلَى اللَّهِ أَرْبَعٌ: سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلاَ إِلَهَ إِلاَّ اللَّهُ، وَاللَّهُ أَكْبَرُ، لاَ يَضُرُّكَ بِأَيِّهِنَّ بَدَأْتَ». [رواه مسلم في صحيحه - الحديث رقم 2137]',
      contentEn: 'Narrated Samurah ibn Jundub: The Prophet ﷺ said: "The most beloved words to Allah are four: Subhanallah, Alhamdulillah, La ilaha illallah, Allahu Akbar..."',
      explanationAr: 'هذه الألفاظ الأربعة هي الباقيات الصالحات وأحب الذكر إلى الله تعالى.',
      explanationEn: 'The four supreme phrases of constant daily remembrance.'
    },
    {
      id: 'msl-4',
      hadithNumber: 2999,
      titleAr: 'حديث عجباً لأمر المؤمن إن أمره كله خير (صحيح مسلم 2999)',
      titleEn: 'The Amazing Affair of the Believer (Sahih Muslim 2999)',
      contentAr: 'عَنْ صُهَيْبٍ رَضِيَ اللَّهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ ﷺ:\n\n«عَجَباً لِأَمْرِ الْمُؤْمِنِ، إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ، وَلَيْسَ ذَاكَ لِأَحَدٍ إِلاَّ لِلْمُؤْمِنِ، إِنْ أَصَابَتْهُ سَرَّاءُ شَكَرَ فَكَانَ خَيْراً لَهُ، وَإِنْ أَصَابَتْهُ ضَرَّاءُ صَبَرَ فَكَانَ خَيْراً لَهُ». [رواه مسلم في صحيحه - الحديث رقم 2999]',
      contentEn: 'Narrated Suhaib: The Prophet ﷺ said: "How wonderful is the affair of the believer! For all of it is good for him..."',
      explanationAr: 'مصدر الطمأنينة النفسية والرضا بالقدر، بتوليد الشكر عند النعم والصبر عند البلاء.',
      explanationEn: 'Complete psychological peace through faith and contentment.'
    },
    {
      id: 'msl-5',
      hadithNumber: 408,
      titleAr: 'حديث من صلى علي صلاة واحدة (صحيح مسلم 408)',
      titleEn: 'Blessings Upon the Prophet Multiplied (Sahih Muslim 408)',
      contentAr: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ أَنَّ رَسُولَ اللَّهِ ﷺ قَالَ:\n\n«مَنْ صَلَّى عَلَيَّ وَاحِدَةً صَلَّى اللَّهُ عَلَيْهِ بِهَا عَشْراً». [رواه مسلم في صحيحه - الحديث رقم 408]',
      contentEn: 'Narrated Abu Hurairah: The Prophet ﷺ said: "Whoever sends blessings upon me once, Allah sends ten blessings upon him."',
      explanationAr: 'فضل الصلاة على الرسول المصطفى ﷺ وأنها سبب في نيل الرحمات الإلهية العشر.',
      explanationEn: 'Ten divine mercies awarded for sending a single blessing upon the Prophet.'
    },
    {
      id: 'msl-6',
      hadithNumber: 1893,
      titleAr: 'حديث من دل على خير فله مثل أجر فاعله (صحيح مسلم 1893)',
      titleEn: 'Guiding to Goodness Earns Equal Reward (Sahih Muslim 1893)',
      contentAr: 'عَنْ أَبِي مَسْعُودٍ العُقْبِيِّ الأَنْصَارِيِّ رَضِيَ اللَّهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ ﷺ:\n\n«مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ». [رواه مسلم في صحيحه - الحديث رقم 1893]',
      contentEn: 'Narrated Abu Mas’ud Al-Ansari: The Prophet ﷺ said: "Whoever guides to good will have a reward like that of its doer."',
      explanationAr: 'ترغيب عظيم في نشر العلم والأذكار والخير، لأن الدال على الخير كفاعله في الأجر.',
      explanationEn: 'Continuous reward generated by sharing beneficial knowledge and prayers.'
    },
    {
      id: 'msl-7',
      hadithNumber: 2699,
      titleAr: 'حديث من سلك طريقاً يطلب فيه علماً (صحيح مسلم 2699)',
      titleEn: 'Seeking Knowledge Opens Path to Paradise (Sahih Muslim 2699)',
      contentAr: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ ﷺ:\n\n«وَمَنْ سَلَكَ طَرِيقاً يَلْتَمِسُ فِيهِ عِلْماً، سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقاً إِلَى الْجَنَّةِ، وَمَا اجْتَمَعَ قَوْمٌ فِي بَيْتٍ مِنْ بُيُوتِ اللَّهِ يَتْلُونَ كِتَابَ اللَّهِ وَيَتَدَارَسُونَهُ بَيْنَهُمْ، إِلاَّ نَزَلَتْ عَلَيْهِمُ السَّكِينَةُ، وَغَشِيَتْهُمُ الرَّحْمَةُ، وَحَفَّتْهُمُ الْمَلاَئِكَةُ، وَذَكَرَهُمُ اللَّهُ فِيمَنْ عِنْدَهُ». [رواه مسلم في صحيحه - الحديث رقم 2699]',
      contentEn: 'Narrated Abu Hurairah: The Prophet ﷺ said: "Whoever treads a path seeking knowledge, Allah makes easy for him a path to Paradise..."',
      explanationAr: 'عظمة طلب العلم الشرعي وقراءة القرآن ومدارسته وما ينزل على أهله من السكينة والرحمة.',
      explanationEn: 'Immense blessings and tranquility granted to students of sacred knowledge.'
    },
    {
      id: 'msl-8',
      hadithNumber: 2588,
      titleAr: 'حديث ما نقصت صدقة من مال (صحيح مسلم 2588)',
      titleEn: 'Charity Does Not Decrease Wealth (Sahih Muslim 2588)',
      contentAr: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ عَنْ رَسُولِ اللَّهِ ﷺ قَالَ:\n\n«مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ، وَمَا زَادَ اللَّهُ عَبْداً بِعَفْوٍ إِلاَّ عِزّاً، وَمَا تَوَاضَعَ أَحَدٌ لِلَّهِ إِلاَّ رَفَعَهُ اللَّهُ». [رواه مسلم في صحيحه - الحديث رقم 2588]',
      contentEn: 'Narrated Abu Hurairah: The Prophet ﷺ said: "Charity does not decrease wealth, Allah elevates the forgiving person..."',
      explanationAr: 'بيان أن الإنفاق والصدقة يزيدان البركة والمال، وأن العفو والتواضع رفعة في الدنيا والآخرة.',
      explanationEn: 'Charity increases spiritual and material barakah, while humility brings true honor.'
    },
    {
      id: 'msl-9',
      hadithNumber: 40,
      titleAr: 'حديث المسلم من سلم المسلمون من لسانه ويده (صحيح مسلم 40)',
      titleEn: 'True Muslim is Safe to Others (Sahih Muslim 40)',
      contentAr: 'عَنْ عَبْدِ اللَّهِ بْنِ عَمْرِو بْنِ الْعَاصِ رَضِيَ اللَّهُ عَنْهُمَا قَالَ: قَالَ رَسُولُ اللَّهِ ﷺ:\n\n«الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ، وَالْمُهَاجِرُ مَنْ هَجَرَ مَا نَهَى اللَّهُ عَنْهُ». [رواه مسلم في صحيحه - الحديث رقم 40]',
      contentEn: 'Narrated Abdullah ibn Amr: The Prophet ﷺ said: "The true Muslim is the one from whose tongue and hand other Muslims are safe..."',
      explanationAr: 'ضابط حقيقة الإسلام النافع في كف الأذى وحفظ الجوارح وحسن المعاملة.',
      explanationEn: 'Core Islamic practical definition of peaceful conduct and self-restraint.'
    },
    {
      id: 'msl-10',
      hadithNumber: 91,
      titleAr: 'حديث لا يدخل الجنة من كان في قلبه مثقال ذرة من كبر (صحيح مسلم 91)',
      titleEn: 'No Arrogance in Paradise (Sahih Muslim 91)',
      contentAr: 'عَنْ عَبْدِ اللَّهِ بْنِ مَسْعُودٍ رَضِيَ اللَّهُ عَنْهُ عَنِ النَّبِيِّ ﷺ قَالَ:\n\n«لاَ يَدْخُلُ الْجَنَّةَ مَنْ كَانَ فِي قَلْبِهِ مِثْقَالُ ذَرَّةٍ مِنْ كِبْرٍ». فَقَالَ رَجُلٌ: إِنَّ الرَّجُلَ يُحِبُّ أَنْ يَكُونَ ثَوْبُهُ حَسَناً وَنَعْلُهُ حَسَنَةً؟ قَالَ: «إِنَّ اللَّهَ جَمِيلٌ يُحِبُّ الْجَمَالَ، الْكِبْرُ بَطَرُ الْحَقِّ وَغَمْطُ النَّاسِ». [رواه مسلم في صحيحه - الحديث رقم 91]',
      contentEn: 'Narrated Abdullah ibn Mas’ud: The Prophet ﷺ said: "No one will enter Paradise who has an atom’s weight of arrogance in his heart..."',
      explanationAr: 'التحذير من الكبر والتطاول على الخلق، وتوضيح أن الكبر هو رد الحق واحتقار الناس.',
      explanationEn: 'Warning against arrogance and explaining that beauty and neatness are beloved to Allah.'
    }
  ]
};

export const MUTTAFAQ_ALAYH_BOOK: Book = {
  id: 'muttafaq-select',
  titleAr: 'اللؤلؤ والمرجان (المتفق عليه بين البخاري ومسلم)',
  titleEn: 'Agreed Upon Authentic Hadiths (Bukhari & Muslim)',
  authorAr: 'فؤاد عبد الباقي (جمع وتخريج)',
  authorEn: 'Fuad Abdul-Baqi Collection',
  category: 'hadith',
  descriptionAr: 'أعلى مراتب الصحة على الإطلاق، يجمع الأحاديث الشريفة التي اتفق الإمامان البخاري ومسلم على روايتها وصحتها.',
  descriptionEn: 'The highest rank of authenticity: Hadiths agreed upon by both Bukhari and Muslim.',
  chaptersCount: 5,
  colorAccent: 'amber',
  chapters: [
    {
      id: 'mtf-1',
      hadithNumber: 1,
      titleAr: 'حديث بني الإسلام على خمس (متفق عليه)',
      titleEn: 'Islam is Built Upon Five Pillars (Agreed Upon)',
      contentAr: 'عَنْ عَبْدِ اللَّهِ بْنِ عُمَرَ رَضِيَ اللَّهُ عَنْهُمَا قَالَ: قَالَ رَسُولُ اللَّهِ ﷺ:\n\n«بُنِيَ الإِسْلَامُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّداً رَسُولُ اللَّهِ، وَإِقَامِ الصَّلاَةِ، وَإِيتَاءِ الزَّكَاةِ، وَالحَجِّ، وَصَوْمِ رَمَضَانَ». [متفق عليه: رواه البخاري (8) ومسلم (16)]',
      contentEn: 'Narrated Ibn Umar: The Prophet ﷺ said: "Islam is built upon five pillars..."',
      explanationAr: 'أركان الإسلام العظام والدعائم التي ينبني عليها دين كل مسلم.',
      explanationEn: 'The fundamental five pillars defining Islamic belief and obligation.'
    },
    {
      id: 'mtf-2',
      hadithNumber: 2,
      titleAr: 'حديث من عاد المريض أو زار أخاً له في الله (متفق عليه)',
      titleEn: 'Visiting the Sick and Visiting Brothers for Allah (Agreed Upon)',
      contentAr: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ عَنِ النَّبِيِّ ﷺ قَالَ:\n\n«حَقُّ الْمُسْلِمِ عَلَى الْمُسْلِمِ خَمْسٌ: رَدُّ السَّلاَمِ، وَعِيَادَةُ الْمَرِيضِ، وَاتِّبَاعُ الْجَنَائِزِ، وَإِجَابَةُ الدَّعْوَةِ، وَتَشْمِيتُ الْعَاطِسِ». [متفق عليه: رواه البخاري (1240) ومسلم (2162)]',
      contentEn: 'Narrated Abu Hurairah: The Prophet ﷺ said: "The rights of a Muslim upon a Muslim are five..."',
      explanationAr: 'توطيد أواصر المحبة والمودة والأخوة الاجتماعية في المجتمع المسلم.',
      explanationEn: 'Social rights strengthening Islamic brotherhood and unity.'
    },
    {
      id: 'mtf-3',
      hadithNumber: 3,
      titleAr: 'حديث اليد العليا خير من اليد السفلى (متفق عليه)',
      titleEn: 'The Upper Hand is Better Than the Lower Hand (Agreed Upon)',
      contentAr: 'عَنْ عَبْدِ اللَّهِ بْنِ عُمَرَ رَضِيَ اللَّهُ عَنْهُمَا أَنَّ رَسُولَ اللَّهِ ﷺ قَالَ:\n\n«الْيَدُ الْعُلْيَا خَيْرٌ مِنَ الْيَدِ السُّفْلَى، وَالْيَدُ الْعُلْيَا هِيَ الْمُنْفِقَةُ، وَالسُّفْلَى هِيَ السَّائِلَةُ». [متفق عليه: رواه البخاري (1429) ومسلم (1033)]',
      contentEn: 'Narrated Ibn Umar: The Prophet ﷺ said: "The upper hand is better than the lower hand..."',
      explanationAr: 'الحث على العمل الشريف والتعفف والكرامة والإنفاق والجود واستغناء الإنسان برزق ربه.',
      explanationEn: 'Encouraging self-reliance, work, dignity, and giving.'
    },
    {
      id: 'mtf-4',
      hadithNumber: 4,
      titleAr: 'حديث آية المنافق ثلاث (متفق عليه)',
      titleEn: 'Signs of the Hypocrite (Agreed Upon)',
      contentAr: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ عَنِ النَّبِيِّ ﷺ قَالَ:\n\n«آيَةُ الْمُنَافِقِ ثَلاَثٌ: إِذَا حَدَّثَ كَذَبَ، وَإِذَا وَعَدَ أَخْلَفَ، وَإِذَا اؤْتُمِنَ خَانَ». [متفق عليه: رواه البخاري (33) ومسلم (59)]',
      contentEn: 'Narrated Abu Hurairah: The Prophet ﷺ said: "The signs of a hypocrite are three: when he speaks he lies, when he promises he breaks it, and when trusted he betrays..."',
      explanationAr: 'التحذير من خصال النفاق العملي وحث المسلم على الصدق والوفاء بالأمانة والعهود.',
      explanationEn: 'Warning against practical hypocrisy and promoting truthfulness and honesty.'
    },
    {
      id: 'mtf-5',
      hadithNumber: 5,
      titleAr: 'حديث لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه (متفق عليه)',
      titleEn: 'Love for Your Brother What You Love for Yourself (Agreed Upon)',
      contentAr: 'عَنْ أَنَسِ بْنِ مَالِكٍ رَضِيَ اللَّهُ عَنْهُ عَنِ النَّبِيِّ ﷺ قَالَ:\n\n«لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ». [متفق عليه: رواه البخاري (13) ومسلم (45)]',
      contentEn: 'Narrated Anas ibn Malik: The Prophet ﷺ said: "None of you truly believes until he loves for his brother what he loves for himself."',
      explanationAr: 'كمال الإيمان وحسن القلوب وسلامة الصدور والتمني الخالص للخير لكل الناس.',
      explanationEn: 'The perfection of faith through genuine love and empathy for others.'
    }
  ]
};

export const ALL_HADITH_BOOKS = [
  SAHIH_BUKHARI_BOOK,
  SAHIH_MUSLIM_BOOK,
  MUTTAFAQ_ALAYH_BOOK
];
