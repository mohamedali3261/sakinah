import { AthkarCategory } from '../../types';

export const foodAthkar: AthkarCategory = {
  id: 'food',
  titleAr: 'أذكار الطعام والشراب والضيافة',
  titleEn: 'Food, Drink & Hospitality Remembrances',
  descriptionAr: 'بركة المأكل والمشرب وشكر المنعم وإكرام الضيف',
  descriptionEn: 'Blessings of sustenance, dining gratitude, and hospitality prayers',
  iconName: 'Sparkles',
  items: [
    {
      id: 'fd-1',
      textAr: 'بِسْمِ اللَّهِ (وإن نسي في أوله فليقل: بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ).',
      textEn: 'In the name of Allah (and if forgotten at the start: In the name of Allah at its beginning and its end).',
      transliteration: "Bismillah (or: Bismillahi awwalahu wa akhirahu).",
      count: 1,
      referenceAr: 'سنن أبي داود والترمذي',
      referenceEn: 'Sunan Abi Dawud & At-Tirmidhi',
      fadlAr: 'طرد الشيطان من مشاركة الطعام وحلول البركة فيه.',
      fadlEn: 'Prevents the devil from partaking in the meal and invokes divine blessing.'
    },
    {
      id: 'fd-2',
      textAr: 'الحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ.',
      textEn: 'Praise be to Allah Who fed me this and provided it for me without any power or strength on my part.',
      transliteration: "Al-hamdu lillahil-ladhi at'amani hadha wa razaqaneehi min ghayri hawlin minni wa la quwwah.",
      count: 1,
      referenceAr: 'سنن أبي داود والترمذي',
      referenceEn: 'Sunan Abi Dawud & At-Tirmidhi',
      fadlAr: 'غُفر له ما تقدم من ذنبه.',
      fadlEn: 'All previous minor sins are forgiven upon reciting after a meal.'
    },
    {
      id: 'fd-3',
      textAr: 'اللَّهُمَّ بَارِكْ لَهُمْ فِيمَا رَزَقْتَهُمْ، وَاغْفِرْ لَهُمْ، وَارْحَمْهُمْ.',
      textEn: 'O Allah, bless for them what You have provided them, forgive them, and have mercy upon them.',
      transliteration: "Allahumma barik lahum feema razaqtahum, waghfir lahum, warhamhum.",
      count: 1,
      referenceAr: 'دعاء الضيف لأهل الطعام - صحيح مسلم (2042)',
      referenceEn: 'Guest’s prayer for the host - Sahih Muslim',
      fadlAr: 'بركة في الرزق ومغفرة ورحمة لصاحب البيت والمضيف.',
      fadlEn: 'Brings immense barakah and forgiveness to the generous host.'
    }
  ]
};
