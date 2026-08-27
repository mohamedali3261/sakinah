import { Book } from '../types';
import { ALL_HADITH_BOOKS } from './hadithsData';

export const BOOKS_DATA: Book[] = [
  ...ALL_HADITH_BOOKS,
  {
    id: 'nawawi-40',
    titleAr: 'الأربعون النووية',
    titleEn: 'The Forty Hadiths of An-Nawawi',
    authorAr: 'الإمام يحيى بن شرف النووي',
    authorEn: 'Imam Yahya ibn Sharaf An-Nawawi',
    category: 'hadith',
    descriptionAr: 'قواعد الإسلام ومجامع الكلم النبوية التي يدور عليها أمر الدين',
    descriptionEn: 'The core foundations of Islam and the Prophet’s profound wisdoms',
    chaptersCount: 7,
    colorAccent: 'emerald',
    chapters: [
      {
        id: 'n-1',
        hadithNumber: 1,
        titleAr: 'الحديث الأول: إنما الأعمال بالنيات',
        titleEn: 'Hadith 1: Actions are by Intentions',
        contentAr: 'عَنْ أَمِيرِ الْمُؤْمِنِينَ أَبِي حَفْصٍ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللهُ عَنْهُ قَالَ: سَمِعْتُ رَسُولَ اللَّهِ ﷺ يَقُولُ:\n\n«إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ فَهِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ، وَمَنْ كَانَتْ هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا أَوْ امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ». [رواه البخاري ومسلم]',
        contentEn: 'Narrated by the Commander of the Faithful, Umar ibn Al-Khattab (may Allah be pleased with him), who said: I heard the Messenger of Allah ﷺ say:\n\n"Actions are according to intentions, and every person will have only what they intended. So whoever emigrated for Allah and His Messenger, his emigration is for Allah and His Messenger; and whoever emigrated for worldly gain or a woman to marry, his emigration is for what he emigrated for."',
        explanationAr: 'هذا الحديث أصل عظيم من أصول الإسلام، وهو ثلث العلم؛ فكل عمل لا يبتغى به وجه الله باطل لا أجر فيه. النية تفرّق بين العادة والعبادة، وبها يسمو العمل الدنيوي ليصير طاعة وقربة.',
        explanationEn: 'This hadith is one of the greatest pillars of Islam. It establishes that the value of every single deed is determined by the purity of the heart’s intention before Allah.'
      },
      {
        id: 'n-2',
        hadithNumber: 2,
        titleAr: 'الحديث الثاني: حديث جبريل في الإسلام والإيمان والإحسان',
        titleEn: 'Hadith 2: The Hadith of Jibril (Islam, Iman, Ihsan)',
        contentAr: 'عَنْ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللهُ عَنْهُ أَيْضاً قَالَ: بَيْنَمَا نَحْنُ جُلُوسٌ عِنْدَ رَسُولِ اللَّهِ ﷺ ذَاتَ يَوْمٍ إِذْ طَلَعَ عَلَيْنَا رَجُلٌ شَدِيدُ بَيَاضِ الثِّيَابِ شَدِيدُ سَوَادِ الشَّعْرِ، لاَ يُرَى عَلَيْهِ أَثَرُ السَّفَرِ وَلاَ يَعْرِفُهُ مِنَّا أَحَدٌ، حَتَّى جَلَسَ إِلَى النَّبِيِّ ﷺ...\n\nقَالَ: «يَا مُحَمَّدُ أَخْبِرْنِي عَنِ الإِسْلاَمِ»... فَقَالَ ﷺ: «الإِسْلاَمُ أَنْ تَشْهَدَ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّداً رَسُولُ اللَّهِ، وَتُقِيمَ الصَّلاَةَ، وَتُؤْتِيَ الزَّكَاةَ، وَتَصُومَ رَمَضَانَ، وَتَحُجَّ الْبَيْتَ إِنِ اسْتَطَعْتَ إِلَيْهِ سَبِيلاً»...\n\nقَالَ: «فَأَخْبِرْنِي عَنِ الإِيمَانِ»، قَالَ: «أَنْ تُؤْمِنَ بِاللَّهِ، وَمَلاَئِكَتِهِ، وَكُتُبِهِ، وَرُسُلِهِ، وَالْيَوْمِ الآخِرِ، وَتُؤْمِنَ بِالْقَدَرِ خَيْرِهِ وَشَرِّهِ»...\n\nقَالَ: «فَأَخْبِرْنِي عَنِ الإِحْسَانِ»، قَالَ: «أَنْ تَعْبُدَ اللَّهَ كَأَنَّكَ تَرَاهُ، فَإِنْ لَمْ تَكُنْ تَرَاهُ فَإِنَّهُ يَرَاكَ»... ثُمَّ قَالَ ﷺ: «فَإِنَّهُ جِبْرِيلُ أَتَاكُمْ يُعَلِّمُكُمْ دِينَكُمْ». [رواه مسلم]',
        contentEn: 'Umar ibn Al-Khattab narrated: One day while we were sitting with the Messenger of Allah ﷺ, there appeared before us a man whose clothes were exceedingly white and whose hair was exceedingly black... He asked about Islam, Iman, and Ihsan. The Prophet answered: "Ihsan is to worship Allah as though you see Him, and if you cannot see Him, then know that He sees you." At the end, the Prophet said: "That was Jibril who came to teach you your religion."',
        explanationAr: 'يُسمى "أمّ السُّنة"؛ لأنه جمع مراتب الدين الثلاث: الأعمال الظاهرة (الإسلام)، العقائد الباطنة (الإيمان)، وكمال المراقبة والإخلاص واستحضار عظمة الله (الإحسان).',
        explanationEn: 'Known as the Mother of the Sunnah because it encapsulates the three ascending dimensions of faith: outward practice (Islam), inward conviction (Iman), and supreme presence (Ihsan).'
      },
      {
        id: 'n-3',
        hadithNumber: 3,
        titleAr: 'الحديث الخامس: النهي عن الابتداع ومتابعة الشرع',
        titleEn: 'Hadith 5: Rejection of Innovation and Pure Compliance',
        contentAr: 'عَنْ أُمِّ الْمُؤْمِنِينَ أُمِّ عَبْدِ اللَّهِ عَائِشَةَ رَضِيَ اللَّهُ عَنْهَا قَالَتْ: قَالَ رَسُولُ اللَّهِ ﷺ:\n\n«مَنْ أَحْدَثَ فِي أَمْرِنَا هَذَا مَا لَيْسَ مِنْهُ فَهُوَ رَدٌّ». [رواه البخاري ومسلم]\nوفي رواية لمسلم: «مَنْ عَمِلَ عَمَلاً لَيْسَ عَلَيْهِ أَمْرُنَا فَهُوَ رَدٌّ».',
        contentEn: 'Narrated by the Mother of the Believers, Aisha (may Allah be pleased with her): The Messenger of Allah ﷺ said: "Whoever innovates in this matter of ours what is not part of it, will have it rejected."',
        explanationAr: 'ميزان الأعمال الظاهرة؛ كما أن حديث النيات ميزان الأعمال الباطنة. لا يقبل العمل عند الله إلا بشرطين: الإخلاص لله، والمتابعة لسنة رسوله ﷺ.',
        explanationEn: 'The outward criterion of deeds: any worship requires sincere devotion to God alone and alignment with the Prophet’s authentic teachings.'
      },
      {
        id: 'n-4',
        hadithNumber: 13,
        titleAr: 'الحديث الثالث عشر: محبة الخير للآخرين وكمال الإيمان',
        titleEn: 'Hadith 13: Love for Your Brother What You Love for Yourself',
        contentAr: 'عَنْ أَبِي حَمْزَةَ أَنَسِ بْنِ مَالِكٍ رَضِيَ اللهُ عَنْهُ، خَادِمِ رَسُولِ اللَّهِ ﷺ عَنِ النَّبِيِّ ﷺ قَالَ:\n\n«لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ». [رواه البخاري ومسلم]',
        contentEn: 'Narrated by Abu Hamzah Anas ibn Malik (may Allah be pleased with him): The Prophet ﷺ said: "None of you truly believes until he loves for his brother what he loves for himself."',
        explanationAr: 'تزكية النفس من الحسد والبغضاء، وغرس روح التكافل والمحبة والرحمة بين أفراد المجتمع الإنساني والإسلامي.',
        explanationEn: 'Purifying the soul from envy, nurturing universal compassion and seeking good for all fellows.'
      },
      {
        id: 'n-5',
        hadithNumber: 15,
        titleAr: 'الحديث الخامس عشر: إكرام الجار والضيف وحفظ اللسان',
        titleEn: 'Hadith 15: Speaking Good, Honoring Neighbors and Guests',
        contentAr: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ أَنَّ رَسُولَ اللَّهِ ﷺ قَالَ:\n\n«مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْراً أَوْ لِيَصْمُتْ، وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ جَارَهُ، وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ ضَيْفَهُ». [رواه البخاري ومسلم]',
        contentEn: 'Abu Hurairah (may Allah be pleased with him) reported that the Messenger of Allah ﷺ said: "Whoever believes in Allah and the Last Day, let him speak good or remain silent; and whoever believes in Allah and the Last Day, let him honor his neighbor; and whoever believes in Allah and the Last Day, let him honor his guest."',
        explanationAr: 'أدب عظيم يضبط اللسان من آفات الغيبة والنميمة واللغو، ويؤسس لروابط الجوار الكريمة وحسن المعاشرة والضيافة.',
        explanationEn: 'The supreme discipline of speech and cultivating community harmony and hospitality.'
      },
      {
        id: 'n-6',
        hadithNumber: 16,
        titleAr: 'الحديث السادس عشر: النهي عن الغضب وضبط الانفعال',
        titleEn: 'Hadith 16: Do Not Become Angry',
        contentAr: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ أَنَّ رَجُلاً قَالَ لِلنَّبِيِّ ﷺ: أَوْصِنِي، قَالَ:\n\n«لاَ تَغْضَبْ». فَرَدَّدَ مِرَاراً، قَالَ: «لاَ تَغْضَبْ». [رواه البخاري]',
        contentEn: 'Abu Hurairah reported that a man said to the Prophet ﷺ: "Counsel me." He said: "Do not become angry." The man repeated his request several times, and the Prophet replied each time: "Do not become angry."',
        explanationAr: 'النهي عن أسباب الغضب وتجنب آثاره، فالغضب جمرة تشعل الخصومات والندم، والحلم وضبط النفس شيمة الأقوياء الحقيقيين.',
        explanationEn: 'Controlling one’s temper and emotional restraint is the true mark of spiritual strength.'
      },
      {
        id: 'n-7',
        hadithNumber: 18,
        titleAr: 'الحديث الثامن عشر: تقوى الله وحسن الخلق',
        titleEn: 'Hadith 18: Fear Allah and Display Good Character',
        contentAr: 'عَنْ أَبِي ذَرٍّ جُنْدُبِ بْنِ جُنَادَةَ، وَأَبِي عَبْدِ الرَّحْمَنِ مُعَاذِ بْنِ جَبَلٍ رَضِيَ اللَّهُ عَنْهُمَا، عَنْ رَسُولِ اللَّهِ ﷺ قَالَ:\n\n«اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ». [رواه الترمذي وقال: حديث حسن]',
        contentEn: 'Abu Dharr and Mu’adh ibn Jabal reported: The Messenger of Allah ﷺ said: "Fear Allah wherever you may be; follow up a bad deed with a good deed and it will wipe it out; and treat people with good character."',
        explanationAr: 'وصية ثلاثية جامعة: حق الله بالتقوى في السر والعلن، وحق النفس بتدارك الخطأ بالطاعات، وحق العباد باللطف وبشاشة الوجه وحسن المعاملة.',
        explanationEn: 'A holistic Triad of wisdom: God-consciousness everywhere, continuous self-rectification through good deeds, and kindness with people.'
      }
    ]
  },
  {
    id: 'riyad-salihin',
    titleAr: 'رياض الصالحين (فصول مختارة)',
    titleEn: 'Gardens of the Righteous (Selections)',
    authorAr: 'الإمام محيي الدين النووي',
    authorEn: 'Imam Muhyi Ad-Din An-Nawawi',
    category: 'tazkiyah',
    descriptionAr: 'منهاج السالكين في تهذيب الأخلاق والترقي في مراتب العبودية',
    descriptionEn: 'The path of spiritual refinement, ethical nobility and continuous awareness of God',
    chaptersCount: 9,
    colorAccent: 'amber',
    chapters: [
      {
        id: 'r-1',
        titleAr: 'باب الصبر واليقين عند الشدائد',
        titleEn: 'Chapter on Patience and Steadfastness',
        contentAr: 'قال تعالى: {يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ}.\n\nوعن أبي يحيى صهيب بن سنان رضي الله عنه قال: قال رسول الله ﷺ:\n«عَجَباً لِأَمْرِ الْمُؤْمِنِ، إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ، وَلَيْسَ ذَاكَ لِأَحَدٍ إِلَّا لِلْمُؤْمِنِ، إِنْ أَصَابَتْهُ سَرَّاءُ شَكَرَ فَكَانَ خَيْراً لَهُ، وَإِنْ أَصَابَتْهُ ضَرَّاءُ صَبَرَ فَكَانَ خَيْراً لَهُ». [رواه مسلم]',
        contentEn: 'Allah says: "O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient."\n\nSuhaib ibn Sinan reported that the Messenger of Allah ﷺ said: "How wonderful is the affair of the believer, for all of it is good, and that is for none except the believer. If something good happens to him, he is grateful and that is good for him; and if something bad happens to him, he is patient and that is good for him."',
        explanationAr: 'المؤمن يعيش بين جناحي الشكر في الرخاء والصبر في البلاء، فتتحول كل تقلبات الحياة إلى أجور ورفعة درجات.',
        explanationEn: 'The believer navigates life between gratitude in ease and patience in hardship, finding divine reward in every state.'
      },
      {
        id: 'r-2',
        titleAr: 'باب المراقبة واستشعار معية الله',
        titleEn: 'Chapter on Muraqaba (Mindfulness of God)',
        contentAr: 'قال تعالى: {وَهُوَ مَعَكُمْ أَيْنَ مَا كُنْتُمْ وَاللَّهُ بِمَا تَعْمَلُونَ بَصِيرٌ}.\n\nوعن عبد الله بن عباس رضي الله عنهما قال: كنت خلف النبي ﷺ يوماً فقال:\n«يَا غُلَامُ إِنِّي أُعَلِّمُكَ كَلِمَاتٍ: احْفَظِ اللَّهَ يَحْفَظْكَ، احْفَظِ اللَّهَ تَجِدْهُ تُجَاهَكَ، إِذَا سَأَلْتَ فَاسْأَلِ اللَّهَ، وَإِذَا اسْتَعَنْتَ فَاسْتَعِنْ بِاللَّهِ، وَاعْلَمْ أَنَّ الْأُمَّةَ لَوْ اجْتَمَعَتْ عَلَى أَنْ يَنْفَعُوكَ بِشَيْءٍ لَمْ يَنْفَعُوكَ إِلَّا بِشَيْءٍ قَدْ كَتَبَهُ اللَّهُ لَكَ، وَلَوْ اجْتَمَعُوا عَلَى أَنْ يَضُرُّوكَ بِشَيْءٍ لَمْ يَضُرُّوكَ إِلَّا بِشَيْءٍ قَدْ كَتَبَهُ اللَّهُ عَلَيْكَ، رُفِعَتِ الْأَقْلَامُ وَجَفَّتِ الصُّحُفُ». [رواه الترمذي]',
        contentEn: 'Ibn Abbas narrated: One day I was behind the Prophet ﷺ and he said: "O young man, I will teach you some words: Be mindful of Allah and He will protect you. Be mindful of Allah and you will find Him before you. If you ask, ask Allah; and if you seek help, seek help from Allah. And know that if the nation were to gather together to benefit you with something, they could not benefit you except with something Allah has written for you..."',
        explanationAr: 'ترسيخ التوحيد الخالص، وبث الشجاعة والسكينة في القلب، والاعتماد المطلق على الله دون الخوف من الخلق.',
        explanationEn: 'Embedding pure monotheism, mental peace, and total reliance on God beyond worldly fear.'
      },
      {
        id: 'r-3',
        titleAr: 'باب التقوى وثمارها العاجلة والآجلة',
        titleEn: 'Chapter on Taqwa (God-Consciousness)',
        contentAr: 'قال تعالى: {وَمَنْ يَتَّقِ اللَّهَ يَجْعَلْ لَهُ مَخْرَجاً * وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ}.\n\nوعن أبي هريرة رضي الله عنه سئل رسول الله ﷺ عن أكثر ما يدخل الناس الجنة؟ فقال: «تَقْوَى اللَّهِ وَحُسْنُ الخُلُقِ». [رواه الترمذي]',
        contentEn: 'Allah says: "And whoever fears Allah - He will make for him a way out and will provide for him from where he does not expect."\n\nThe Prophet ﷺ was asked about what most often enters people into Paradise. He said: "Taqwa of Allah and good character."',
        explanationAr: 'التقوى هي وقاية النفس من مساخط الله باتباع أمره واجتناب نهيه، وهي سبب تيسير العسير وفتح أبواب الرزق والفرقان.',
        explanationEn: 'Taqwa is the shield protecting the heart from transgression, bringing ease, sustenance, and clarity of discernment.'
      },
      {
        id: 'r-4',
        titleAr: 'باب التوكل على الله وحسن الظن به',
        titleEn: 'Chapter on Tawakkul (Trust in God)',
        contentAr: 'قال تعالى: {وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ}.\n\nوعن عمر بن الخطاب رضي الله عنه قال: سمعت رسول الله ﷺ يقول:\n«لَوْ أَنَّكُمْ تَتَوَكَّلُونَ عَلَى اللَّهِ حَقَّ تَوَكُّلِهِ لَرَزَقَكُمْ كَمَا يَرْزُقُ الطَّيْرَ؛ تَغْدُو خِمَاصاً وَتَرُوحُ بِطَاناً». [رواه الترمذي]',
        contentEn: 'Umar ibn Al-Khattab reported: I heard the Messenger of Allah ﷺ say: "If you were to rely upon Allah with the required reliance, He would provide for you just as He provides for the birds: they go out in the morning hungry and return in the evening full."',
        explanationAr: 'التوكل يجمع بين الأخذ بالأسباب الدنيوية والتعلق القلبي التام بمسبب الأسباب وخالق الكون سبحانه.',
        explanationEn: 'True Tawakkul harmonizes active effort in taking practical causes with complete reliance of the heart upon God.'
      },
      {
        id: 'r-5',
        titleAr: 'باب التوبة والرجوع إلى الله',
        titleEn: 'Chapter on Repentance (Tawbah)',
        contentAr: 'قال تعالى: {وَتُوبُوا إِلَى اللَّهِ جَمِيعاً أَيُّهَا الْمُؤْمِنُونَ لَعَلَّكُمْ تُفْلِحُونَ}.\n\nوعن أبي حمزة أنس بن مالك الأنصاري خادم رسول الله ﷺ رضي الله عنه قال: قال رسول الله ﷺ:\n«للَّهُ أَفْرَحُ بِتَوْبَةِ عَبْدِهِ مِنْ أَحَدِكُمْ سَقَطَ عَلَى بَعِيرِهِ وَقَدْ أَضَلَّهُ فِي أَرْضِ فَلَاةٍ». [متفق عليه]',
        contentEn: 'Allah says: "And turn to Allah in repentance, all of you, O believers, that you might succeed."\n\nAnas ibn Malik reported that the Messenger of Allah ﷺ said: "Allah is more pleased with the repentance of His servant than any one of you who finds his camel after having lost it in a barren desert."',
        explanationAr: 'التوبة هي أولى منازل السالكين وعماد العبودية، وفيها إثبات سعة رحمة الله تبارك وتعالى وفرحه بعودة التائبين إليه مهما كثرت ذنوبهم.',
        explanationEn: 'Repentance is the foundation of spiritual path, illustrating Allah’s boundless mercy and joy in the return of a penitent servant.'
      },
      {
        id: 'r-6',
        titleAr: 'باب بر الوالدين وصلة الأرحام',
        titleEn: 'Chapter on Kindness to Parents & Kinship',
        contentAr: 'قال تعالى: {وَقَضَى رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَاناً}.\n\nوعن أبي هريرة رضي الله عنه عن النبي ﷺ قال:\n«رَغِمَ أَنْفُ، ثُمَّ رَغِمَ أَنْفُ، ثُمَّ رَغِمَ أَنْفُ مَنْ أَدْرَكَ أَبَوَيْهِ عِنْدَ الْكِبَرِ، أَحَدَهُمَا أَوْ كِلَيْهِمَا فَلَمْ يَدْخُلِ الْجَنَّةَ». [رواه مسلم]',
        contentEn: 'Allah says: "And your Lord has decreed that you not worship except Him, and to parents, good treatment."\n\nAbu Hurairah reported that the Prophet ﷺ said: "May he be disgraced, then may he be disgraced, then may he be disgraced, who finds his parents, one or both of them, in old age, and does not enter Paradise [through serving them]."',
        explanationAr: 'بر الوالدين من أعظم القربات إلى الله تعالى وهو قرين التوحيد، وفيه بيان أن الإحسان إليهما عند كبرهما سبب مباشر في نيل الجنة ورضا الرحمن.',
        explanationEn: 'Serving and honoring parents is coupled with Monotheism, and doing so in their old age is a direct gateway to Paradise.'
      },
      {
        id: 'r-7',
        titleAr: 'باب الصدق وفضيلته',
        titleEn: 'Chapter on Truthfulness (Sidq)',
        contentAr: 'قال تعالى: {يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَكُونُوا مَعَ الصَّادِقِينَ}.\n\nوعن عبد الله بن مسعود رضي الله عنه عن النبي ﷺ قال:\n«إِنَّ الصِّدْقَ يَهْدِي إِلَى الْبِرِّ، وَإِنَّ الْبِرَّ يَهْدِي إِلَى الْجَنَّةِ، وَإِنَّ الرَّجُلَ لَيَصْدُقُ حَتَّى يُكْتَبَ عِنْدَ اللَّهِ صِدِّيقاً، وَإِنَّ الْكَذِبَ يَهْدِي إِلَى الْفُجُورِ، وَإِنَّ الْفُجُورَ يَهْدِي إِلَى النَّارِ، وَإِنَّ الرَّجُلَ لَيَكْذِبُ حَتَّى يُكْتَبَ عِنْدَ اللَّهِ كَذَّاباً». [متفق عليه]',
        contentEn: 'Allah says: "O you who have believed, fear Allah and be with those who are true."\n\nIbn Mas’ud reported that the Prophet ﷺ said: "Truthfulness leads to righteousness, and righteousness leads to Paradise. A man continues to tell the truth until he is written with Allah as a truthful person..."',
        explanationAr: 'الصدق هو مطابقة الظاهر للباطن، وهو أصل الهداية والنجاة وسبب الطمأنينة النفسية، والتحذير من الكذب وأنه يقود للفجور والهلاك.',
        explanationEn: 'Truthfulness brings spiritual peace, integrity and leads to Paradise, while dishonesty breeds corruption and misery.'
      },
      {
        id: 'r-8',
        titleAr: 'باب فضل قراءة القرآن وحفظه',
        titleEn: 'Chapter on Virtues of Reciting the Quran',
        contentAr: 'قال تعالى: {إِنَّ الَّذِينَ يَتْلُونَ كِتَابَ اللَّهِ وَأَقَامُوا الصَّلَاةَ وَأَنفَقُوا مِمَّا رَزَقْنَاهُمْ سِرّاً وَعَلَانِيَةً يَرْجُونَ تِجَارَةً لَّن تَبُورَ}.\n\nوعن أبي أمامة رضي الله عنه قال: سمعت رسول الله ﷺ يقول:\n«اقْرَؤُوا القُرْآنَ فإنَّه يَأْتي يَومَ القِيامَةِ شَفِيعاً لأَصْحابِهِ». [رواه مسلم]',
        contentEn: 'Allah says: "Indeed, those who recite the Book of Allah and establish prayer and spend out of what We have provided them... hope for a transaction that will never perish."\n\nAbu Umama reported: I heard the Messenger of Allah ﷺ say: "Recite the Quran, for it will come on the Day of Resurrection as an intercessor for its companions."',
        explanationAr: 'الترغيب العظيم في ملازمة كتاب الله تلاوة وتدبراً وعملاً، وبشارة قارئ القرآن بالشفاعة العظمى من كلام الله يوم القيامة.',
        explanationEn: 'Strong encouragement to maintain a close relationship with the Quran, guaranteeing its intercession on Resurrection Day.'
      },
      {
        id: 'r-9',
        titleAr: 'باب فضل الذكر والتحريض عليه',
        titleEn: 'Chapter on the Virtues of Dhikr',
        contentAr: 'قال تعالى: {فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ}.\n\nوعن أبي هريرة رضي الله عنه قال: قال رسول الله ﷺ: «يَقُولُ اللَّهُ تَعَالَى: أَنَا عِنْدَ ظَنِّ عَبْدِي بِي، وَأَنَا مَعَهُ إِذَا ذَكَرَنِي، فَإِنْ ذَكَرَنِي فِي نَفْسِهِ ذَكَرْتُهُ فِي نَفْسِي، وَإِنْ ذَكَرَنِي فِي مَلَأٍ ذَكَرْتُهُ فِي مَلَأٍ خَيْرٍ مِنْهُمْ». [متفق عليه]',
        contentEn: 'Allah says: "So remember Me; I will remember you. And be grateful to Me and do not deny Me."\n\nAbu Hurairah reported that the Prophet ﷺ said: "Allah says: I am as My servant thinks of Me, and I am with him when he remembers Me. If he remembers Me in himself, I remember him in Myself; and if he remembers Me in a gathering, I remember him in a gathering better than them..."',
        explanationAr: 'هذا الحديث القدسي من أرجى الأحاديث وأعظمها فضلاً؛ يبين المعية الخاصة والمحبة الإلهية التي يظفر بها الذاكرون الله كثيراً والذاكرات في كافة أحوالهم.',
        explanationEn: 'This divine narration highlights the immense companionship and love Allah bestows upon those who frequently remember Him in solitude and in public.'
      }
    ]
  },
  {
    id: 'quran-short-surahs',
    titleAr: 'قصار السور وتأملات الهداية',
    titleEn: 'Short Surahs & Quranic Reflections',
    authorAr: 'القرآن الكريم وخواطر التدبر',
    authorEn: 'The Holy Quran & Tadabbur Insights',
    category: 'quran',
    descriptionAr: 'معاني قصار السور التي نرددها في صلواتنا اليومية وكنوزها البيانية',
    descriptionEn: 'Reflections and deeper meanings of frequently recited chapters',
    chaptersCount: 4,
    colorAccent: 'sky',
    chapters: [
      {
        id: 'qs-1',
        titleAr: 'سورة الفاتحة (أمّ الكتاب والسبع المثاني)',
        titleEn: 'Surah Al-Fatihah (The Opening)',
        contentAr: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ (1) الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ (2) الرَّحْمَٰنِ الرَّحِيمِ (3) مَالِكِ يَوْمِ الدِّينِ (4) إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ (5) اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ (6) صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ (7)',
        contentEn: 'In the name of Allah, the Entirely Merciful, the Especially Merciful. (1) [All] praise is [due] to Allah, Lord of the worlds - (2) The Entirely Merciful, the Especially Merciful, (3) Sovereign of the Day of Recompense. (4) It is You we worship and You we ask for help. (5) Guide us to the straight path - (6) The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray. (7)',
        explanationAr: 'الفاتحة هي أعظم سورة في القرآن، جمعت التوحيد، والثناء، وإفراد الله بالعبادة والاستعانة، والدعاء بأهم حاجة للعبد: الهداية والثبات.',
        explanationEn: 'The greatest chapter of the Quran, establishing praising the Divine, sole devotion, and the supreme prayer for guidance.'
      },
      {
        id: 'qs-2',
        titleAr: 'سورة الإخلاص (ثلث القرآن)',
        titleEn: 'Surah Al-Ikhlas (Purity of Faith)',
        contentAr: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ هُوَ اللَّهُ أَحَدٌ (1) اللَّهُ الصَّمَدُ (2) لَمْ يَلِدْ وَلَمْ يُولَدْ (3) وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ (4)',
        contentEn: 'Say: He is Allah, [who is] One. (1) Allah, the Eternal Refuge. (2) He neither begets nor is born, (3) Nor is there to Him any equivalent. (4)',
        explanationAr: 'سورة التوحيد الخالص، تنزه الله تعالى عن الشبيه والولد والنقص، وتثبت له صفات الكمال والجلال المطلق.',
        explanationEn: 'The chapter of pure Monotheism, affirming the unique perfection and transcendence of Allah.'
      },
      {
        id: 'qs-3',
        titleAr: 'سورة العصر (قانون الفلاح وخسارة الزمن)',
        titleEn: 'Surah Al-Asr (The Declining Time)',
        contentAr: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nوَالْعَصْرِ (1) إِنَّ الْإِنسَانَ لَفِي خُسْرٍ (2) إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ (3)',
        contentEn: 'By time, (1) Indeed, mankind is in loss, (2) Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience. (3)',
        explanationAr: 'قال الإمام الشافعي: "لو ما أنزل الله حجة على خلقه إلا هذه السورة لكفتهم". جمعت أركان النجاة الأربعة: الإيمان، العمل الصالح، الدعوة للحق، والتواصي بالصبر.',
        explanationEn: 'Imam Ash-Shafi’i noted that this Surah alone contains the comprehensive formula of human salvation: faith, righteous actions, mutual advocacy of truth, and steadfast patience.'
      },
      {
        id: 'qs-4',
        titleAr: 'سورة الكوثر (عطاء الله ومحبة نبيه)',
        titleEn: 'Surah Al-Kawthar (Abundance)',
        contentAr: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nإِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ (1) فَصَلِّ لِرَبِّكَ وَانْحَرْ (2) إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ (3)',
        contentEn: 'Indeed, We have granted you, [O Muhammad], al-Kawthar. (1) So pray to your Lord and offer sacrifice [to Him alone]. (2) Indeed, your enemy is the one cut off. (3)',
        explanationAr: 'أقصر سورة في القرآن وفيها أعظم البشائر بالنصر والخير العميم للرسول ﷺ، وحفظ ذكره المبارك إلى قيام الساعة.',
        explanationEn: 'The shortest chapter filled with profound divine consolations, eternal honor for the Prophet ﷺ, and pure devotion.'
      }
    ]
  },
  {
    id: 'seerah-gems',
    titleAr: 'قبسات من السيرة والشمائل النبوية',
    titleEn: 'Gems from the Prophetic Biography',
    authorAr: 'مختارات السيرة النبوية العطرة',
    authorEn: 'Selected Chronicles of Prophetic Character',
    category: 'seerah',
    descriptionAr: 'مواقف خالدة في الرحمة والعدل وحسن المعاشرة والتواضع',
    descriptionEn: 'Timeless moments illustrating compassion, justice, humility, and character',
    chaptersCount: 3,
    colorAccent: 'indigo',
    chapters: [
      {
        id: 's-1',
        titleAr: 'رحمة النبي ﷺ في فتح مكة وعفوه عند المقدرة',
        titleEn: 'The Prophet’s Mercy at the Conquest of Makkah',
        contentAr: 'حين دخل النبي ﷺ مكة فاتحاً منتصراً، دخل مطأطئاً رأسه تواضعاً لله حتى كادت لحيته تمس واسطة رحله، ووقف أمام الذين حاربوه وأخرجوه وعذبوا أصحابه وقال:\n«مَا تَرَوْنَ أَنِّي فَاعِلٌ بِكُمْ؟» قالوا: خيراً، أخٌ كريم وابن أخٍ كريم. فقال ﷺ:\n«لَا تَثْرِيبَ عَلَيْكُمُ الْيَوْمَ، يَغْفِرُ اللَّهُ لَكُمْ، اذْهَبُوا فَأَنْتُمُ الطُّلَقَاءُ».',
        contentEn: 'Upon entering Makkah victorious, the Prophet ﷺ bowed his head with utter humility before Allah. He addressed those who had persecuted him and expelled his companions: "What do you think I will do to you?" They replied: "Good, a noble brother and son of a noble brother." He ﷺ proclaimed: "No blame is on you today. Go, for you are free."',
        explanationAr: 'قمة النبل والشهامة والعفو عند المقدرة، وتحويل العداوات إلى محبة وأمان بالرحمة النبوية السامية.',
        explanationEn: 'The peak of forgiveness when in power, demonstrating unmatched mercy and spiritual nobility.'
      },
      {
        id: 's-2',
        titleAr: 'تواضعه ﷺ ولطفه مع الصغار والضعفاء',
        titleEn: 'His Humility and Gentle Touch with Children and Weak',
        contentAr: 'كان رسول الله ﷺ ألين الناس عريكة، يسلّم على الصبيان، ويمازحهم، ويجيب دعوة المملوك والمسكين، ولا يأنف أن يمشي مع الأرملة والمحتاج حتى يقضي له حاجته. وكان إذا صافح أحداً لا ينزع يده حتى يكون الرجل هو الذي ينزعها.',
        contentEn: 'The Messenger of Allah ﷺ was the most gentle of people. He would greet children, visit the poor, respond to invitations of servants, and walk alongside widows and needy persons until their needs were fulfilled.',
        explanationAr: 'القدوة العملية في كسر الكبر والغرور، ومراعاة مشاعر الضعفاء وبث الفرح والألفة في قلوبهم.',
        explanationEn: 'The living model of dissolving arrogance, spreading warmth and honoring the dignity of every person.'
      },
      {
        id: 's-3',
        titleAr: 'حلمه ﷺ مع الأعرابي والرفق في التعليم',
        titleEn: 'Patience and Wisdom in Teaching Others',
        contentAr: 'بينما كان النبي ﷺ يمشي ومعه أنس بن مالك، أدركه أعرابي فجبذه برداء كان عليه جبذة شديدة حتى أثرت حاشية البرد في صفحة عاتقه، ثم قال: يا محمد مر لي من مال الله الذي عندك! فالتفت إليه رسول الله ﷺ فضحك، ثم أمر له بعطاء.',
        contentEn: 'While walking, a desert bedouin grabbed the Prophet ﷺ violently by his cloak, leaving a mark on his neck, and demanded: "O Muhammad, give me from Allah’s wealth with you!" The Prophet turned to him, smiled warmly, and ordered generous gifts to be given to him.',
        explanationAr: 'الصبر العظيم والرفق في مقابلة الجفاء بالإحسان والابتسامة، وهو مفتاح قلوب البشر وهدايتهم.',
        explanationEn: 'Meeting harshness with grace, patience, and a warm smile—the quintessential key to unlocking hearts.'
      }
    ]
  }
];
