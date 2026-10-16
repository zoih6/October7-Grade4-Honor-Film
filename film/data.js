// ═══════════════════════════════════════════════════════════════════════════
//  data.js — كل بيانات الفيلم: الطلاب، مربية الصف، أزمنة التعليق، أزمنة الأغنية.
//  المصدر: مستودع October7-School-Grade4-Portraits + نصّي التعليق والأغنية اللذين
//  زوّدنا بهما صاحب العمل (الأزمنة منقولة كما هي، مُزاحة بمقدار VO_OFFSET لأن
//  ملف التعليق يبدأ بكلام عند 0 تقريبًا فنُعطيه لحظة تنفّس).
// ═══════════════════════════════════════════════════════════════════════════

const FPS = 30;
const VO_OFFSET = 0.45;                 // الصوت يبدأ عند 0.45s في الفيلم
const VO_DUR = 98.586;                  // مدة ملف التعليق
const SONG_T0 = 99.0;                   // الأغنية تبدأ هنا
const SONG_DUR = 133.968;
const TAIL_T0 = SONG_T0 + SONG_DUR;     // 232.97 — خاتمة شعار ومض
const FILM_DUR = TAIL_T0 + 3.03;        // ≈ 236.0  (3:56)
const MUSIC_IN = 0.6;                   // الموسيقى الخلفية تبدأ

// ── الطلاب: الترتيب، اللقب، الصورة، مقطع الفيديو، بيت الأغنية ──────────────
// vo = [بداية, نهاية] بالثواني بالنسبة لملف التعليق (من الجدول الذي زوّدنا به العميل)
const STUDENTS = [
  { id: 'moataz', n: 1, first: 'معتز',  name: 'معتز أحمد حمود قائد',        rank: 'الأول',        rankShort: 'الأول',        num: '١', tied: false, img: '01', vo: [15, 23.0], song: [31, 35],  line: 'معتز صار الأول الغالي هنا' },
  { id: 'moayed', n: 2, first: 'مؤيد',  name: 'مؤيد جميل محمد أحمد',        rank: 'الأول مكرر',   rankShort: 'الأول مكرر',   num: '١', tied: true,  img: '02', vo: [23.0, 27.0], song: null, line: 'ومؤيد كالبدر أشرق بيننا' },
  { id: 'saad',   n: 3, first: 'سعد',   name: 'سعد معاذ أحمد قاسم',         rank: 'الثاني',       rankShort: 'الثاني',       num: '٢', tied: false, img: '03', vo: [27.0, 30.0], song: [40, 44],  line: 'سعد له أخلاق تسعد قلبنا' },
  { id: 'anhar',  n: 4, first: 'أنهار', name: 'أنهار أمين محمد أحمد',       rank: 'الثاني مكرر',  rankShort: 'الثاني مكرر',  num: '٢', tied: true,  img: '04', vo: [30.0, 33.0], song: [44, 49],  line: 'أنهار تسقي بالنجاح عقولنا' },
  { id: 'shouq',  n: 5, first: 'شوق',   name: 'شوق هاشم سعيد هزاع',         rank: 'الثالث',       rankShort: 'الثالث',       num: '٣', tied: false, img: '07', vo: [33.0, 35.0], song: [49, 53],  line: 'ولشوقنا حلم يحلق فوقنا' },
  { id: 'anas',   n: 6, first: 'أنس',   name: 'أنس عبده سعيد نعمان',        rank: 'الرابع',       rankShort: 'الرابع',       num: '٤', tied: false, img: '06', vo: [35.0, 37.0], song: [53, 58],  line: 'أنس يوزع فرحة في صفنا' },
  { id: 'shomookh', n: 7, first: 'شموخ', name: 'شموخ محمد عبدالسلام',       rank: 'الخامس',       rankShort: 'الخامس',       num: '٥', tied: false, img: '05', vo: [37.0, 40.0], song: [58, 62],  line: 'وشموخ ترفع بالنجاح رؤوسنا' },
  { id: 'samar',  n: 8, first: 'سمر',   name: 'سمر محمد عبدالله فرحان',     rank: 'السادس',       rankShort: 'السادس',       num: '٦', tied: false, img: '08', vo: [40.0, 42.0], song: [62, 66],  line: 'سمر تزيد مع الوليد ضياءنا' },
  { id: 'waleed', n: 9, first: 'وليد',  name: 'وليد صادق حمود فرحان',       rank: 'السادس مكرر',  rankShort: 'السادس مكرر',  num: '٦', tied: true,  img: '09', vo: [42.0, 45.0], song: [62, 66],  line: 'سمر تزيد مع الوليد ضياءنا' },
  { id: 'rashed', n: 10, first: 'راشد', name: 'راشد ماجد قاسم مرشد',        rank: 'السابع',       rankShort: 'السابع',       num: '٧', tied: false, img: '10', vo: [45.0, 47.0], song: [67, 71],  line: 'ولراشد عزم يشدد عزمنا' },
  { id: 'asaadA', n: 11, first: 'أسعد', name: 'أسعد علاء نعمان قائد',       rank: 'الثامن',       rankShort: 'الثامن',       num: '٨', tied: false, img: '12', vo: [47.0, 50.0], song: [71, 75],  line: 'أسعد وأسعد بهجة لقلوبنا' },
  { id: 'asaadF', n: 12, first: 'أسعد', name: 'أسعد فؤاد طاهر يحيى',        rank: 'التاسع',       rankShort: 'التاسع',       num: '٩', tied: false, img: '11', vo: [50.0, 52.0], song: [71, 75],  line: 'أسعد وأسعد بهجة لقلوبنا' },
  { id: 'taher',  n: 13, first: 'طاهر',  name: 'طاهر بلال طاهر محمد',       rank: 'العاشر',       rankShort: 'العاشر',       num: '١٠', tied: false, img: '12b', vo: [52.0, 55.0], song: [75, 80],  line: 'ولطاهر فعل جميل بيننا' },
];
// ملفات الصور الفعلية (المستودع يسمّيها بأرقام مختلفة عن الترتيب)
const IMGFILE = {
  '01': '01_Moataz_Ahmed_Hamoud_Qayed_1st_Place',
  '02': '02_Moayed_Jameel_Mohammed_Ahmed_1st_Place_Tied',
  '03': '03_Saad_Muadh_Ahmed_Qasim_2nd_Place',
  '04': '04_Anhar_Amin_Mohammed_Ahmed_2nd_Place_Tied',
  '05': '05_Shomookh_Mohammed_Abdulsalam_5th_Place',
  '06': '06_Anas_Abduh_Saeed_Noman_4th_Place',
  '07': '07_Shouq_Hashem_Saeed_Hazza_3rd_Place',
  '08': '08_Samar_Mohammed_Abdullah_Farhan_6th_Place',
  '09': '09_Waleed_Sadeq_Hamoud_Farhan_6th_Place_Tied',
  '10': '10_Rashed_Majed_Qasim_Morshed_7th_Place',
  '11': '11_Asaad_Fouad_Taher_Yahya_9th_Place',
  '12': '12_Asaad_Alaa_Noman_Qaid_8th_Place',
  '12b': '12_Taher_Bilal_Taher_Mohammed_10th_Place',
};
const VIDFILE = {
  '01': '01_Moataz_Ahmed_Hamoud_Qayed_1st_Place', '02': '02_Moayed_Jameel_Mohammed_Ahmed_1st_Place_Tied',
  '03': '03_Saad_Muadh_Ahmed_Qasim_2nd_Place', '04': '04_Anhar_Amin_Mohammed_Ahmed_2nd_Place_Tied',
  '05': '05_Shomookh_Mohammed_Abdulsalam_5th_Place', '06': '06_Anas_Abduh_Saeed_Noman_4th_Place',
  '07': '07_Shouq_Hashem_Saeed_Hazza_3rd_Place', '08': '08_Samar_Mohammed_Abdullah_Farhan_6th_Place',
  '09': '09_Waleed_Sadeq_Hamoud_Farhan_6th_Place_Tied', '10': '10_Rashed_Majed_Qasim_Morshed_7th_Place',
  '11': '11_Asaad_Fouad_Taher_Yahya_9th_Place', '12': '12_Asaad_Alaa_Noman_Qaid_8th_Place',
  '12b': '13_Taher_Bilal_Taher_Mohammed_10th_Place',
};
const TEACHER = { name: 'الأستاذة سارة القاسمي', short: 'الأستاذة سارة', family: 'من آل قاسم', vo: [55.0, 65.0] };

// ── جمل التعليق (أزمنة الفيلم = الجدول + VO_OFFSET) ────────────────────────
const VO_LINES = [
  { t: [0, 5],   text: 'في رحاب العلم تزهر الأحلام، وبالاجتهاد تصنع الإنجازات، وتكتب أجمل حكايات النجاح.' },
  { t: [5, 15],  text: 'من مدرسة سبعة أكتوبر، نلتقي اليوم لنحتفي بنجوم الصف الرابع الذين جعلوا من المثابرة طريقاً للتفوق، ومن الطموح بداية لمستقبل مشرق.' },
  { t: [15, 23], text: 'نبارك لأوائل الصف الرابع هذا الإنجاز الجميل، ونبدأ بنجوم الترتيب الأول: معتز أحمد حمود قائد (الأول).' },
  { t: [23, 27], text: 'ومؤيد جميل محمد أحمد (الأول مكرر).' },
  { t: [27, 30], text: 'وسعد معاذ أحمد قاسم (الثاني).' },
  { t: [30, 33], text: 'وأنهار أمين محمد أحمد (الثاني مكرر).' },
  { t: [33, 35], text: 'وشوق هاشم سعيد هزاع (الثالث).' },
  { t: [35, 37], text: 'وأنس عبده سعيد نعمان (الرابع).' },
  { t: [37, 40], text: 'وشموخ محمد عبدالسلام (الخامس).' },
  { t: [40, 42], text: 'وسمر محمد عبدالله فرحان (السادس).' },
  { t: [42, 45], text: 'ووليد صادق حمود فرحان (السادس مكرر).' },
  { t: [45, 47], text: 'وراشد ماجد قاسم مرشد (السابع).' },
  { t: [47, 50], text: 'وأسعد علاء نعمان قائد (الثامن).' },
  { t: [50, 52], text: 'وأسعد فؤاد طاهر يحيى (التاسع).' },
  { t: [52, 55], text: 'وطاهر بلال طاهر محمد (العاشر).' },
  { t: [55, 65], text: 'وكل التحية والتقدير لمربية الصف، الأستاذة سارة القاسمي، التي غرست في قلوب طلابها حب العلم ورعت خطواتهم نحو النجاح، فكان لجهدها أثر جميل في مسيرتهم.' },
  { t: [65, 70], text: 'إلى نجومنا الصغار، أنتم فخر اليوم وأمل الغد، وبكم تحلو حكايات النجاح.' },
  { t: [70, 82], text: 'والآن نهديكم هذه الأغنية احتفاء بتفوقكم وفرحاً بإنجازكم وذكرى جميلة تبقى في قلوبكم، ألف مبارك لكم وإلى مزيد من التألق والنجاح.' },
];
const voT = (t) => t + VO_OFFSET;                      // جدول → زمن الفيلم

// ── الأغنية: كل سطر مع زمنه داخل ملف الأغنية (ثم يُزاح بـ SONG_T0) ─────────
const SONG_LINES = [
  { t: [3, 13],   kind: 'chant', text: 'One, two, three يلا!', who: null,   label: 'أصوات أطفال' },
  { t: [13, 21],  kind: 'chorus', text: 'أكتوبر غنى بأفراح لنا\nوالصف رابع صار نجما بيننا', who: null, label: 'غناء جماعي' },
  { t: [22, 31],  kind: 'chorus', text: 'أكتوبر غنى بأفراح لنا\nوالصف رابع صار نجما بيننا', who: null, label: 'غناء جماعي' },
  { t: [31, 35],  kind: 'solo', text: 'معتز صار الأول الغالي هنا', who: 'moataz', label: 'غناء فردي — ولد' },
  { t: [35, 40],  kind: 'solo', text: 'ومؤيد كالبدر أشرق بيننا', who: 'moayed', label: '' },
  { t: [40, 44],  kind: 'solo', text: 'سعد له أخلاق تسعد قلبنا', who: 'saad', label: '' },
  { t: [44, 49],  kind: 'solo', text: 'أنهار تسقي بالنجاح عقولنا', who: 'anhar', label: '' },
  { t: [49, 53],  kind: 'solo', text: 'ولشوقنا حلم يحلق فوقنا', who: 'shouq', label: 'غناء فردي — بنت' },
  { t: [53, 58],  kind: 'solo', text: 'أنس يوزع فرحة في صفنا', who: 'anas', label: '' },
  { t: [58, 62],  kind: 'solo', text: 'وشموخ ترفع بالنجاح رؤوسنا', who: 'shomookh', label: '' },
  { t: [62, 67],  kind: 'solo', text: 'سمر تزيد مع الوليد ضياءنا', who: 'samar', label: '', who2: 'waleed' },
  { t: [67, 71],  kind: 'solo', text: 'ولراشد عزم يشدد عزمنا', who: 'rashed', label: 'غناء فردي — ولد' },
  { t: [71, 75],  kind: 'solo', text: 'أسعد وأسعد بهجة لقلوبنا', who: 'asaadA', label: '', who2: 'asaadF' },
  { t: [75, 80],  kind: 'solo', text: 'ولطاهر فعل جميل بيننا\nكل الأوائل شمعة في دربنا', who: 'taher', label: '', all: true },
  { t: [84, 93],  kind: 'chorus', text: 'أكتوبر غنى بأفراح لنا\nوالصف رابع صار نجما بيننا', who: null, label: 'غناء جماعي' },
  { t: [93, 97],  kind: 'solo', text: 'أستاذة سارة تنور صفنا', who: 'teacher', label: 'غناء فردي — ولد' },
  { t: [97, 102], kind: 'solo', text: 'من آل قاسم فضلها باق لنا', who: 'teacher', label: '' },
  { t: [102, 106], kind: 'solo', text: 'زرعت بحب درسنا في قلبنا', who: 'teacher', label: '' },
  { t: [106, 110], kind: 'solo', text: 'يا ربي أسعدها وأسعد جمعنا', who: 'teacher', label: 'غناء بنت' },
  { t: [110, 115], kind: 'solo', text: 'يا ربي أسعدها وأسعد جمعنا', who: 'teacher', label: 'غناء بنت — إعادة' },
  { t: [115, 134], kind: 'outro', text: '', who: null, label: 'موسيقى ختامية' },
];
const songT = (t) => SONG_T0 + t;                       // زمن داخل الأغنية → زمن الفيلم

// ── مواضع اللقطات الرئيسية في الفيلم (ثوانٍ) ──────────────────────────────
const S = {
  open:     0.0,                 // ورق وطائرة — «في رحاب العلم»
  school:   voT(5),              // 5.45 — مدرسة سبعة أكتوبر
  stars4:   11.0,                // نجوم الصف الرابع
  hero1:    16.0,                // بطاقة معتز (HERO)
  moayed:   voT(23),             // 23.45
  runStart: voT(27),             // 27.45 — تسلسل سريع
  wall:     voT(40),             // 40.45 — جدار الشرف
  teacher:  voT(55),             // 55.45
  kids:     voT(65),             // 65.45 — سماء النجوم
  bridge:   voT(70),             // 70.45 — «والآن نهديكم»
  song:     SONG_T0,             // 99.0
  tail:     TAIL_T0,             // 232.97
};
