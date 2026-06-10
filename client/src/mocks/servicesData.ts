export interface ServicePriceItem {
  name: string;
  price: number;
  duration?: string;
  note?: string;
}

export interface ServiceProcedure {
  icon: string;
  title: string;
  desc: string;
}

export interface ServiceDoctor {
  name: string;
  role: string;
  image: string;
  experience: string;
}

export interface ServiceFAQ {
  q: string;
  a: string;
}

export interface ServiceDetail {
  id: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  icon: string;
  accentColor: string;
  image: string;
  heroImage: string;
  category: string;
  stats: { label: string; value: string }[];
  procedures: ServiceProcedure[];
  prices: ServicePriceItem[];
  doctors: ServiceDoctor[];
  faqs: ServiceFAQ[];
  relatedServices: string[];
}

export const servicesData: ServiceDetail[] = [
  {
    id: "risk-stratification",
    name: "تقييم المخاطر الصحية — Risk Stratification",
    tagline: "نستبق قبل أن نطارد",
    description: "قراءة عميقة للمخاطر الحالية والمستقبلية — نربط بين الحاضر الصحي والمخاطر المستقبلية",
    longDescription: "Risk Stratification في ذا مديكال أفينيو ليس مجرد فحص دوري — بل تقييم عميق متعدد الطبقات يفكك الحالة ويقرأ ما وراء العرض. نجمع بين التاريخ الصحي، التحاليل الوظيفية والأيضية، والمؤشرات الجينية لبناء صورة شاملة عن المخاطر الحالية والمستقبلية. الهدف ليس علاج ما ظهر، بل استباق ما لم يظهر بعد.",
    icon: "ri-radar-line",
    accentColor: "teal",
    image: "https://readdy.ai/api/search-image?query=advanced%20medical%20risk%20assessment%20precision%20medicine%20laboratory%20modern%20clinical%20environment%20dark%20teal%20background%20sophisticated%20diagnostic%20technology%20professional%20healthcare&width=600&height=400&seq=srv-risk-ma1&orientation=landscape",
    heroImage: "https://readdy.ai/api/search-image?query=risk%20stratification%20precision%20medicine%20advanced%20diagnostics%20modern%20clinical%20environment%20sophisticated%20technology%20professional%20healthcare%20concept&width=1200&height=500&seq=srv-risk-hero&orientation=landscape",
    category: "الطب الدقيق",
    stats: [
      { label: "دقيقة لكل جلسة تقييم", value: "90–120" },
      { label: "طبقة تقييم متكاملة", value: "5+" },
      { label: "نسبة رضا المرضى", value: "99%" },
      { label: "سنة خبرة سريرية", value: "+18" },
    ],
    procedures: [
      { icon: "ri-radar-line", title: "تقييم المخاطر القلبية الأيضية", desc: "تحليل شامل لعوامل الخطر القلبية والأيضية مع قراءة المسار المستقبلي" },
      { icon: "ri-dna-line", title: "DNA Risk Score", desc: "تحليل جيني يكشف الاستعدادات الوراثية للأمراض قبل ظهورها" },
      { icon: "ri-flask-line", title: "التحاليل الوظيفية المتقدمة", desc: "تحاليل أيضية ووظيفية تتجاوز الفحوصات التقليدية لقراءة أعمق" },
      { icon: "ri-heart-pulse-line", title: "تقييم صحة القلب والأوعية", desc: "فحص متكامل لصحة الجهاز القلبي الوعائي مع قراءة المخاطر المستقبلية" },
      { icon: "ri-brain-line", title: "تقييم المخاطر العصبية", desc: "قراءة مبكرة لمخاطر التنكس العصبي والزهايمر والأمراض المعرفية" },
      { icon: "ri-file-chart-line", title: "تقرير المخاطر الشامل", desc: "تقرير سريري مفصل يحدد المخاطر ويضع خطة استباقية شخصية" },
    ],
    prices: [
      { name: "جلسة تقييم المخاطر الأساسية", price: 800, duration: "90 دقيقة" },
      { name: "جلسة تقييم المخاطر المتكاملة", price: 1400, duration: "120 دقيقة" },
      { name: "DNA Risk Score", price: 1800, duration: "نتائج خلال 10 أيام" },
      { name: "تحاليل وظيفية متقدمة", price: 650, duration: "30 دقيقة" },
      { name: "تقييم العمر البيولوجي", price: 900, duration: "45 دقيقة" },
      { name: "باقة تقييم المخاطر الشاملة", price: 2800, duration: "يوم كامل", note: "تشمل DNA + تحاليل + تقييم + تقرير + خطة شخصية" },
    ],
    doctors: [
      { name: "د. فيصل الأحمد", role: "استشاري الطب الدقيق وتقييم المخاطر", image: "https://readdy.ai/api/search-image?query=professional%20male%20arab%20doctor%20white%20coat%20stethoscope%20clean%20white%20background%20confident%20authoritative%20portrait%20precision%20medicine%20specialist%20senior&width=200&height=200&seq=doc-risk1&orientation=squarish", experience: "18 سنة خبرة" },
      { name: "د. نورة الزهراني", role: "استشارية الجينات والطب الدقيق", image: "https://readdy.ai/api/search-image?query=professional%20female%20arab%20doctor%20white%20coat%20clean%20white%20background%20friendly%20confident%20portrait%20genetics%20precision%20medicine%20specialist&width=200&height=200&seq=doc-risk2&orientation=squarish", experience: "12 سنة خبرة" },
    ],
    faqs: [
      { q: "ما الفرق بين Risk Stratification والفحص الدوري التقليدي؟", a: "الفحص الدوري التقليدي يقيس ما هو موجود الآن. Risk Stratification يقرأ المخاطر المستقبلية ويبني صورة شاملة عن المسار الصحي المحتمل، مما يتيح التدخل الاستباقي قبل ظهور الأعراض." },
      { q: "من يحتاج إلى تقييم المخاطر؟", a: "كل من لديه تاريخ عائلي لأمراض مزمنة، أو يعاني من أعراض غير محددة لم تُفسَّر بشكل كافٍ، أو يريد فهمًا حقيقيًا لمساره الصحي المستقبلي." },
      { q: "كم تستغرق جلسة التقييم؟", a: "جلسات التقييم في ذا مديكال أفينيو تمتد من 90 إلى 120 دقيقة — لأن بعض الملفات لا تُفهم في دقائق." },
    ],
    relatedServices: ["dna-risk", "obesity-metabolic", "second-opinion"],
  },
  {
    id: "obesity-metabolic",
    name: "السمنة والخلل الأيضي وMASLD",
    tagline: "لا نختزل الحالة في الوزن",
    description: "نتعامل مع السمنة والخلل الأيضي كمسار أيضي ووظيفي معقد يحتاج قراءة أعمق",
    longDescription: "في ذا مديكال أفينيو، لا نختزل السمنة في الوزن ولا نعالج MASLD كمجرد دهون في الكبد. نتعامل مع هذه الحالات كمسار أيضي ووظيفي معقد يشمل الاضطرابات الهرمونية، الالتهاب المزمن، خلل الميكروبيوم، والعوامل الجينية. نقدم تقييمًا عميقًا متعدد الطبقات مع خطة علاجية شخصية تتجاوز الحمية والتمارين.",
    icon: "ri-scales-line",
    accentColor: "orange",
    image: "https://readdy.ai/api/search-image?query=metabolic%20medicine%20obesity%20treatment%20advanced%20clinical%20assessment%20modern%20medical%20laboratory%20precision%20diagnostics%20professional%20healthcare%20environment&width=600&height=400&seq=srv-meta-ma1&orientation=landscape",
    heroImage: "https://readdy.ai/api/search-image?query=metabolic%20syndrome%20MASLD%20liver%20disease%20advanced%20medical%20assessment%20laboratory%20modern%20healthcare%20professional%20environment%20precision%20medicine&width=1200&height=500&seq=srv-meta-hero&orientation=landscape",
    category: "الطب الأيضي",
    stats: [
      { label: "حالة أيضية تحت الرعاية", value: "+500" },
      { label: "استشاري متخصص", value: "4" },
      { label: "نسبة تحسن الحالات", value: "94%" },
      { label: "سنة خبرة سريرية", value: "+14" },
    ],
    procedures: [
      { icon: "ri-scales-line", title: "التقييم الأيضي الشامل", desc: "تحليل متكامل للمسار الأيضي يشمل الهرمونات، الالتهاب، وظائف الكبد والبنكرياس" },
      { icon: "ri-flask-line", title: "تحاليل MASLD المتخصصة", desc: "تحاليل متقدمة لتقييم درجة التليف الكبدي والالتهاب الأيضي" },
      { icon: "ri-scan-2-line", title: "تصوير الكبد المتقدم", desc: "Fibroscan وتصوير بالموجات فوق الصوتية لتقييم صحة الكبد بدقة" },
      { icon: "ri-dna-line", title: "التقييم الجيني الأيضي", desc: "فحص الاستعدادات الجينية للخلل الأيضي والسمنة" },
      { icon: "ri-heart-pulse-line", title: "تقييم المخاطر القلبية الأيضية", desc: "قراءة شاملة للمخاطر القلبية المرتبطة بالخلل الأيضي" },
      { icon: "ri-user-heart-line", title: "خطة علاجية شخصية", desc: "بروتوكول علاجي مخصص يتجاوز الحمية التقليدية ويعالج الجذر الأيضي" },
    ],
    prices: [
      { name: "جلسة تقييم أيضي أولية", price: 900, duration: "90 دقيقة" },
      { name: "تحاليل MASLD المتخصصة", price: 750, duration: "30 دقيقة" },
      { name: "Fibroscan الكبد", price: 600, duration: "30 دقيقة" },
      { name: "التقييم الجيني الأيضي", price: 1200, duration: "نتائج خلال 7 أيام" },
      { name: "باقة السمنة والخلل الأيضي الشاملة", price: 2200, duration: "يومان", note: "تقييم + تحاليل + تصوير + خطة علاجية + متابعة 3 أشهر" },
      { name: "متابعة شهرية", price: 400, duration: "45 دقيقة" },
    ],
    doctors: [
      { name: "د. سارة المنصور", role: "استشارية الخلل الأيضي وMASLD", image: "https://readdy.ai/api/search-image?query=professional%20female%20arab%20doctor%20white%20coat%20hijab%20clean%20white%20background%20confident%20smile%20portrait%20metabolic%20medicine%20specialist&width=200&height=200&seq=doc-meta1&orientation=squarish", experience: "14 سنة خبرة" },
      { name: "د. طارق الغامدي", role: "استشاري الكبد والجهاز الهضمي الأيضي", image: "https://readdy.ai/api/search-image?query=professional%20male%20arab%20doctor%20white%20coat%20clean%20white%20background%20confident%20smile%20portrait%20gastroenterologist%20hepatologist%20specialist&width=200&height=200&seq=doc-meta2&orientation=squarish", experience: "11 سنة خبرة" },
    ],
    faqs: [
      { q: "ما هو MASLD وكيف يختلف عن الكبد الدهني العادي؟", a: "MASLD هو مرض الكبد الدهني المرتبط بالخلل الأيضي — وهو أكثر تعقيدًا من مجرد تراكم الدهون. يرتبط بالمقاومة للأنسولين، الالتهاب المزمن، والخلل الأيضي الشامل. علاجه يتطلب تقييمًا أعمق من مجرد إنقاص الوزن." },
      { q: "هل السمنة مجرد مشكلة غذائية؟", a: "لا. السمنة في كثير من الحالات هي نتيجة لخلل أيضي معقد يشمل اضطرابات هرمونية، التهابًا مزمنًا، عوامل جينية، وخللًا في الميكروبيوم. نتعامل معها كمسار أيضي ووظيفي، لا كمشكلة إرادة أو نظام غذائي فقط." },
      { q: "كم تستغرق رحلة العلاج؟", a: "تختلف حسب الحالة، لكن في الغالب نضع خطة علاجية لـ 6–12 شهرًا مع متابعة لصيقة ومراجعة دورية للخطة بناءً على الاستجابة." },
    ],
    relatedServices: ["risk-stratification", "dna-risk", "iv-therapy"],
  },
  {
    id: "second-opinion",
    name: "Second Opinion الدولي",
    tagline: "قرار أكثر اطمئنانًا في الحالات الحساسة",
    description: "أداة لاتخاذ قرار طبي أكثر اطمئنانًا واتساعًا — ليس خدمة شكلية",
    longDescription: "Second Opinion في ذا مديكال أفينيو ليس مجرد إرسال ملف إلكتروني. هو خدمة منظمة تبدأ بتقييم عميق للحالة محليًا، ثم إعداد ملف سريري متكامل، وإرساله إلى مراكز طبية متخصصة في الولايات المتحدة وجنوب كوريا وغيرها، مع ترجمة الرأي الطبي وشرحه للمريض بشكل واضح ومطمئن.",
    icon: "ri-global-line",
    accentColor: "teal",
    image: "https://readdy.ai/api/search-image?query=international%20medical%20consultation%20second%20opinion%20global%20healthcare%20network%20professional%20doctors%20meeting%20modern%20clinic%20sophisticated%20environment&width=600&height=400&seq=srv-2op-ma1&orientation=landscape",
    heroImage: "https://readdy.ai/api/search-image?query=international%20medical%20second%20opinion%20global%20healthcare%20collaboration%20professional%20doctors%20USA%20Korea%20modern%20clinic%20sophisticated%20environment&width=1200&height=500&seq=srv-2op-hero&orientation=landscape",
    category: "الخبرة الدولية",
    stats: [
      { label: "مركز طبي دولي شريك", value: "12+" },
      { label: "دولة في الشبكة", value: "5" },
      { label: "حالة تمت مراجعتها دوليًا", value: "+300" },
      { label: "يوم متوسط وقت الاستجابة", value: "7–14" },
    ],
    procedures: [
      { icon: "ri-file-text-line", title: "إعداد الملف السريري", desc: "تجميع وتنظيم كامل الملف الطبي بصورة احترافية تناسب المراكز الدولية" },
      { icon: "ri-translate-2", title: "الترجمة الطبية المتخصصة", desc: "ترجمة دقيقة للوثائق الطبية مع الحفاظ على الدقة السريرية" },
      { icon: "ri-global-line", title: "التواصل مع المراكز الدولية", desc: "إرسال الملف إلى المراكز المتخصصة في USA وKorea وغيرها" },
      { icon: "ri-chat-3-line", title: "شرح الرأي الطبي", desc: "جلسة مع الاستشاري لشرح الرأي الدولي وترجمته إلى خطة عملية" },
      { icon: "ri-video-line", title: "استشارة مرئية دولية", desc: "إمكانية استشارة مرئية مباشرة مع الطبيب الدولي عند الحاجة" },
      { icon: "ri-route-line", title: "تنسيق السفر للعلاج", desc: "دعم لوجستي كامل لمن يحتاج السفر للعلاج في الخارج" },
    ],
    prices: [
      { name: "Second Opinion — مراجعة الملف", price: 1500, duration: "7–14 يوم", note: "رأي طبي مكتوب من مركز دولي" },
      { name: "Second Opinion — استشارة مرئية", price: 2500, duration: "7–14 يوم", note: "يشمل جلسة مرئية مع الطبيب الدولي" },
      { name: "إعداد الملف السريري", price: 400, duration: "3–5 أيام" },
      { name: "الترجمة الطبية المتخصصة", price: 300, duration: "2–3 أيام" },
      { name: "باقة Second Opinion الشاملة", price: 3500, duration: "14–21 يوم", note: "إعداد ملف + ترجمة + رأي دولي + استشارة مرئية + شرح النتائج" },
    ],
    doctors: [
      { name: "د. فيصل الأحمد", role: "منسق Second Opinion الدولي", image: "https://readdy.ai/api/search-image?query=professional%20male%20arab%20doctor%20white%20coat%20stethoscope%20clean%20white%20background%20confident%20authoritative%20portrait%20precision%20medicine%20specialist%20senior&width=200&height=200&seq=doc-2op1&orientation=squarish", experience: "18 سنة خبرة" },
    ],
    faqs: [
      { q: "ما الحالات التي تستفيد من Second Opinion الدولي؟", a: "الحالات المعقدة أو النادرة، الحالات التي لم تستجب للعلاج المعتاد، قرارات جراحية كبرى، تشخيصات غير مؤكدة، أو أي حالة يشعر فيها المريض بعدم الاطمئنان الكافي للقرار الطبي." },
      { q: "كم يستغرق الحصول على الرأي الدولي؟", a: "في الغالب من 7 إلى 14 يومًا من تاريخ إرسال الملف الكامل. الحالات العاجلة يمكن تسريعها." },
      { q: "هل يمكن التواصل مباشرة مع الطبيب الدولي؟", a: "نعم، في باقة Second Opinion الشاملة يمكن ترتيب استشارة مرئية مباشرة مع الطبيب الدولي." },
    ],
    relatedServices: ["risk-stratification", "alzheimer", "osteoporosis"],
  },
  {
    id: "dna-risk",
    name: "DNA Risk Score",
    tagline: "نقرأ مستقبلك الصحي قبل أن يحدث",
    description: "تحليل جيني يكشف الاستعدادات والمخاطر المستقبلية — لا للاستعراض التقني",
    longDescription: "DNA Risk Score في ذا مديكال أفينيو أداة سريرية حقيقية، لا استعراض تقني. نستخدم تحليل الـ DNA لفهم الاستعدادات الجينية للأمراض المستقبلية، ونترجم هذه النتائج إلى خطة وقائية شخصية قابلة للتطبيق. الهدف ليس إخافة المريض بأرقام جينية، بل تمكينه من قرارات صحية أكثر ذكاءً.",
    icon: "ri-dna-line",
    accentColor: "violet",
    image: "https://readdy.ai/api/search-image?query=DNA%20genetic%20testing%20precision%20medicine%20laboratory%20advanced%20genomics%20modern%20clinical%20environment%20sophisticated%20technology%20professional%20healthcare&width=600&height=400&seq=srv-dna-ma1&orientation=landscape",
    heroImage: "https://readdy.ai/api/search-image?query=DNA%20risk%20score%20genetic%20testing%20precision%20medicine%20advanced%20genomics%20laboratory%20modern%20clinical%20environment%20sophisticated%20technology%20professional%20healthcare&width=1200&height=500&seq=srv-dna-hero&orientation=landscape",
    category: "الجينات والطب الدقيق",
    stats: [
      { label: "مرض يمكن تقييم خطره جينيًا", value: "50+" },
      { label: "دقة التحليل الجيني", value: "99.9%" },
      { label: "يوم للحصول على النتائج", value: "10–14" },
      { label: "سنة خبرة في الطب الجيني", value: "+12" },
    ],
    procedures: [
      { icon: "ri-dna-line", title: "تحليل DNA Risk Score الشامل", desc: "تحليل جيني يغطي أكثر من 50 مرضًا ومخاطر صحية مستقبلية" },
      { icon: "ri-heart-pulse-line", title: "المخاطر القلبية الجينية", desc: "تقييم الاستعداد الجيني لأمراض القلب والأوعية الدموية" },
      { icon: "ri-brain-line", title: "مخاطر التنكس العصبي", desc: "تقييم الاستعداد الجيني للزهايمر والأمراض العصبية التنكسية" },
      { icon: "ri-scales-line", title: "الاستعداد الجيني للخلل الأيضي", desc: "فهم الجذر الجيني للسمنة والسكري والخلل الأيضي" },
      { icon: "ri-mental-health-line", title: "DNA النفسي", desc: "تقييم الاستعداد الجيني للاضطرابات النفسية والمزاجية" },
      { icon: "ri-file-chart-line", title: "تقرير وخطة وقائية", desc: "ترجمة النتائج الجينية إلى خطة وقائية شخصية قابلة للتطبيق" },
    ],
    prices: [
      { name: "DNA Risk Score الأساسي", price: 1800, duration: "10–14 يوم", note: "يشمل 20 مرضًا رئيسيًا" },
      { name: "DNA Risk Score الشامل", price: 2800, duration: "10–14 يوم", note: "يشمل 50+ مرضًا ومخاطر" },
      { name: "DNA النفسي", price: 1500, duration: "10–14 يوم" },
      { name: "تقييم العمر البيولوجي", price: 900, duration: "45 دقيقة" },
      { name: "باقة DNA الشاملة", price: 4200, duration: "14–21 يوم", note: "DNA Risk Score + DNA نفسي + عمر بيولوجي + جلسة تفسير + خطة وقائية" },
    ],
    doctors: [
      { name: "د. نورة الزهراني", role: "استشارية الجينات والطب الدقيق", image: "https://readdy.ai/api/search-image?query=professional%20female%20arab%20doctor%20white%20coat%20clean%20white%20background%20friendly%20confident%20portrait%20genetics%20precision%20medicine%20specialist&width=200&height=200&seq=doc-dna1&orientation=squarish", experience: "12 سنة خبرة" },
      { name: "د. فيصل الأحمد", role: "استشاري الطب الدقيق", image: "https://readdy.ai/api/search-image?query=professional%20male%20arab%20doctor%20white%20coat%20stethoscope%20clean%20white%20background%20confident%20authoritative%20portrait%20precision%20medicine%20specialist%20senior&width=200&height=200&seq=doc-dna2&orientation=squarish", experience: "18 سنة خبرة" },
    ],
    faqs: [
      { q: "هل DNA Risk Score يعني أنني سأصاب بالمرض حتمًا؟", a: "لا. الجينات تحدد الاستعداد، لا المصير. DNA Risk Score يكشف الاحتمالات ليتمكن الطبيب من وضع خطة وقائية تقلل هذه المخاطر. كثير من الأمراض يمكن تأخيرها أو منعها بالتدخل المبكر الصحيح." },
      { q: "كيف يتم أخذ العينة؟", a: "العينة تؤخذ بمسحة بسيطة من الفم أو عينة دم صغيرة — إجراء غير مؤلم تمامًا." },
      { q: "هل النتائج سرية؟", a: "نعم، نتائج DNA Risk Score سرية تمامًا ولا تُشارك مع أي جهة خارجية دون إذن صريح من المريض." },
    ],
    relatedServices: ["risk-stratification", "obesity-metabolic", "alzheimer"],
  },
  {
    id: "iv-therapy",
    name: "العلاجات الوريدية المتخصصة",
    tagline: "بروتوكولات مبنية على التقييم الأيضي",
    description: "علاجات وريدية مخصصة مبنية على التقييم الأيضي والوظيفي — لا بروتوكولات عامة",
    longDescription: "العلاجات الوريدية في ذا مديكال أفينيو ليست جلسات عامة — بل بروتوكولات مخصصة تُبنى على التقييم الأيضي والوظيفي لكل مريض. نحدد التركيبة المناسبة بناءً على نتائج التحاليل والتقييم السريري، لضمان أقصى فعالية وأعلى أمان.",
    icon: "ri-drop-line",
    accentColor: "cyan",
    image: "https://readdy.ai/api/search-image?query=intravenous%20IV%20therapy%20specialized%20medical%20treatment%20modern%20clinical%20room%20clean%20professional%20healthcare%20environment%20sophisticated%20equipment&width=600&height=400&seq=srv-iv-ma1&orientation=landscape",
    heroImage: "https://readdy.ai/api/search-image?query=IV%20therapy%20specialized%20intravenous%20treatment%20modern%20clinical%20environment%20professional%20healthcare%20sophisticated%20medical%20equipment&width=1200&height=500&seq=srv-iv-hero&orientation=landscape",
    category: "العلاجات المتخصصة",
    stats: [
      { label: "بروتوكول وريدي متخصص", value: "15+" },
      { label: "جلسة شهريًا", value: "+200" },
      { label: "نسبة رضا المرضى", value: "98%" },
      { label: "سنة خبرة", value: "+10" },
    ],
    procedures: [
      { icon: "ri-drop-line", title: "بروتوكول الطاقة الخلوية", desc: "تركيبة وريدية لدعم وظيفة الميتوكوندريا وتحسين إنتاج الطاقة الخلوية" },
      { icon: "ri-shield-flash-line", title: "بروتوكول مضادات الأكسدة", desc: "جرعات عالية من مضادات الأكسدة لمكافحة الإجهاد التأكسدي والالتهاب المزمن" },
      { icon: "ri-heart-pulse-line", title: "بروتوكول صحة القلب الأيضي", desc: "تركيبة وريدية لدعم صحة القلب والأوعية الدموية على المستوى الأيضي" },
      { icon: "ri-brain-line", title: "بروتوكول الدعم العصبي", desc: "تركيبة وريدية لدعم وظائف الدماغ والجهاز العصبي" },
      { icon: "ri-scales-line", title: "بروتوكول الدعم الأيضي", desc: "تركيبة مخصصة لدعم التوازن الأيضي وتحسين حساسية الأنسولين" },
      { icon: "ri-flask-line", title: "تحاليل ما قبل الجلسة", desc: "تحاليل وظيفية لتحديد التركيبة المناسبة لكل مريض" },
    ],
    prices: [
      { name: "جلسة وريدية أساسية", price: 450, duration: "60–90 دقيقة" },
      { name: "بروتوكول الطاقة الخلوية", price: 750, duration: "90 دقيقة" },
      { name: "بروتوكول مضادات الأكسدة العالية", price: 850, duration: "90 دقيقة" },
      { name: "بروتوكول الدعم العصبي", price: 900, duration: "90 دقيقة" },
      { name: "باقة 5 جلسات مخصصة", price: 3200, duration: "شهر", note: "تشمل تحاليل + 5 جلسات + متابعة" },
      { name: "باقة 10 جلسات مخصصة", price: 5800, duration: "شهرين", note: "تشمل تحاليل + 10 جلسات + متابعة" },
    ],
    doctors: [
      { name: "د. ريم الحربي", role: "استشارية العلاجات الوريدية المتخصصة", image: "https://readdy.ai/api/search-image?query=professional%20female%20arab%20doctor%20white%20coat%20hijab%20clean%20white%20background%20confident%20smile%20portrait%20IV%20therapy%20specialist%20medical%20professional&width=200&height=200&seq=doc-iv1&orientation=squarish", experience: "10 سنوات خبرة" },
      { name: "د. سارة المنصور", role: "استشارية الخلل الأيضي", image: "https://readdy.ai/api/search-image?query=professional%20female%20arab%20doctor%20white%20coat%20hijab%20clean%20white%20background%20confident%20smile%20portrait%20metabolic%20medicine%20specialist&width=200&height=200&seq=doc-iv2&orientation=squarish", experience: "14 سنة خبرة" },
    ],
    faqs: [
      { q: "هل العلاجات الوريدية آمنة؟", a: "نعم، عند تطبيقها بشكل صحيح بناءً على تقييم سريري ومخبري دقيق. في ذا مديكال أفينيو، كل جلسة تسبقها تحاليل لتحديد التركيبة المناسبة وضمان السلامة." },
      { q: "كم عدد الجلسات المطلوبة؟", a: "يختلف حسب الحالة والهدف العلاجي. في الغالب نبدأ بـ 4–6 جلسات ثم نقيّم الاستجابة ونعدّل الخطة." },
      { q: "هل يمكن الجمع بين العلاجات الوريدية وبروتوكولات أخرى؟", a: "نعم، العلاجات الوريدية غالبًا تكون جزءًا من خطة علاجية متكاملة تشمل تعديلات غذائية وأدوية وتغييرات في نمط الحياة." },
    ],
    relatedServices: ["obesity-metabolic", "risk-stratification", "osteoporosis"],
  },
  {
    id: "psychiatry",
    name: "الطب النفسي للبالغين",
    tagline: "تقييم عميق ما وراء الأعراض",
    description: "تقييم نفسي عميق متعدد الطبقات مع خطط علاجية شخصية تربط البيولوجي بالنفسي",
    longDescription: "الطب النفسي في ذا مديكال أفينيو يتجاوز البروتوكولات التقليدية. نقدم تقييمًا نفسيًا عميقًا يربط بين الأبعاد البيولوجية والنفسية والاجتماعية، مع استخدام أدوات متقدمة كـ DNA النفسي لفهم الاستعدادات الجينية للاضطرابات النفسية. خطتنا العلاجية شخصية ومبنية على فهم حقيقي للحالة.",
    icon: "ri-mental-health-line",
    accentColor: "rose",
    image: "https://readdy.ai/api/search-image?query=adult%20psychiatry%20mental%20health%20consultation%20modern%20clinical%20environment%20calm%20professional%20therapeutic%20setting%20sophisticated%20healthcare&width=600&height=400&seq=srv-psych-ma1&orientation=landscape",
    heroImage: "https://readdy.ai/api/search-image?query=adult%20psychiatry%20mental%20health%20deep%20assessment%20modern%20clinical%20environment%20calm%20professional%20therapeutic%20setting%20sophisticated%20healthcare%20concept&width=1200&height=500&seq=srv-psych-hero&orientation=landscape",
    category: "الطب النفسي",
    stats: [
      { label: "حالة تحت الرعاية", value: "+400" },
      { label: "استشاري نفسي", value: "3" },
      { label: "نسبة رضا المرضى", value: "97%" },
      { label: "سنة خبرة", value: "+16" },
    ],
    procedures: [
      { icon: "ri-mental-health-line", title: "التقييم النفسي الشامل", desc: "جلسة تقييم 90 دقيقة تفكك الحالة وتقرأ الأبعاد البيولوجية والنفسية والاجتماعية" },
      { icon: "ri-dna-line", title: "DNA النفسي", desc: "تقييم الاستعداد الجيني للاضطرابات النفسية والمزاجية" },
      { icon: "ri-brain-line", title: "تقييم الوظائف المعرفية", desc: "اختبارات معرفية متخصصة لتقييم الذاكرة والتركيز والوظائف التنفيذية" },
      { icon: "ri-heart-pulse-line", title: "تقييم الصحة النفسية الجسدية", desc: "ربط الأعراض النفسية بالعوامل البيولوجية والهرمونية" },
      { icon: "ri-user-heart-line", title: "خطة علاجية شخصية", desc: "بروتوكول علاجي مخصص يجمع بين الدواء والعلاج النفسي وتعديل نمط الحياة" },
      { icon: "ri-calendar-check-line", title: "متابعة لصيقة", desc: "جلسات متابعة منتظمة مع تعديل الخطة بناءً على الاستجابة" },
    ],
    prices: [
      { name: "جلسة تقييم نفسي أولية", price: 900, duration: "90 دقيقة" },
      { name: "جلسة متابعة", price: 500, duration: "60 دقيقة" },
      { name: "DNA النفسي", price: 1500, duration: "10–14 يوم" },
      { name: "تقييم الوظائف المعرفية", price: 700, duration: "90 دقيقة" },
      { name: "باقة الرعاية النفسية الشاملة", price: 3500, duration: "3 أشهر", note: "تقييم + DNA نفسي + 6 جلسات متابعة + خطة علاجية" },
    ],
    doctors: [
      { name: "د. خالد العمر", role: "استشاري الطب النفسي للبالغين", image: "https://readdy.ai/api/search-image?query=professional%20male%20arab%20doctor%20white%20coat%20glasses%20clean%20white%20background%20confident%20smile%20portrait%20psychiatrist%20specialist%20senior&width=200&height=200&seq=doc-psych1&orientation=squarish", experience: "16 سنة خبرة" },
    ],
    faqs: [
      { q: "ما الذي يميز الطب النفسي في ذا مديكال أفينيو؟", a: "نقدم تقييمًا نفسيًا عميقًا يتجاوز الأعراض ليفهم الجذور البيولوجية والنفسية والاجتماعية للحالة. نستخدم DNA النفسي لفهم الاستعدادات الجينية، ونضع خطة علاجية شخصية لا بروتوكولًا عامًا." },
      { q: "هل الطب النفسي يعني الأدوية فقط؟", a: "لا. خطتنا العلاجية تجمع بين الدواء (عند الحاجة)، العلاج النفسي، تعديل نمط الحياة، والتدخلات البيولوجية. الهدف هو معالجة الجذر، لا إدارة الأعراض فقط." },
      { q: "هل الجلسات سرية؟", a: "نعم، جميع الجلسات والمعلومات سرية تمامًا ومحمية بموجب أعلى معايير الخصوصية الطبية." },
    ],
    relatedServices: ["dna-risk", "risk-stratification", "iv-therapy"],
  },
  {
    id: "osteoporosis",
    name: "هشاشة العظام المكثفة",
    tagline: "رعاية متخصصة ومكثفة لا بروتوكول عام",
    description: "رعاية متخصصة ومكثفة لهشاشة العظام مع خطط علاجية شخصية وقراءة مخاطر مستقبلية",
    longDescription: "هشاشة العظام في ذا مديكال أفينيو تُعالَج كحالة أيضية وهرمونية معقدة، لا كمجرد نقص في الكالسيوم. نقدم تقييمًا عميقًا يشمل كثافة العظام، الهرمونات، العوامل الجينية، والمخاطر المستقبلية للكسور، مع خطة علاجية مكثفة ومتابعة لصيقة.",
    icon: "ri-body-scan-line",
    accentColor: "amber",
    image: "https://readdy.ai/api/search-image?query=osteoporosis%20bone%20density%20advanced%20medical%20treatment%20modern%20clinical%20environment%20professional%20healthcare%20sophisticated%20diagnostics&width=600&height=400&seq=srv-osteo-ma1&orientation=landscape",
    heroImage: "https://readdy.ai/api/search-image?query=osteoporosis%20intensive%20care%20bone%20health%20advanced%20medical%20assessment%20modern%20clinical%20environment%20sophisticated%20diagnostics%20professional%20healthcare&width=1200&height=500&seq=srv-osteo-hero&orientation=landscape",
    category: "العظام والأيض",
    stats: [
      { label: "حالة تحت الرعاية", value: "+350" },
      { label: "استشاري متخصص", value: "2" },
      { label: "نسبة تحسن كثافة العظام", value: "89%" },
      { label: "سنة خبرة", value: "+15" },
    ],
    procedures: [
      { icon: "ri-scan-line", title: "قياس كثافة العظام DEXA", desc: "قياس دقيق لكثافة العظام في مناطق متعددة مع تحليل مفصل للنتائج" },
      { icon: "ri-flask-line", title: "تحاليل الأيض العظمي", desc: "تحاليل متخصصة لمؤشرات بناء وهدم العظام والعوامل الهرمونية" },
      { icon: "ri-dna-line", title: "التقييم الجيني لهشاشة العظام", desc: "فحص الاستعدادات الجينية لهشاشة العظام والكسور" },
      { icon: "ri-heart-pulse-line", title: "تقييم مخاطر الكسور", desc: "حساب FRAX وتقييم شامل لمخاطر الكسور المستقبلية" },
      { icon: "ri-syringe-line", title: "العلاجات البيولوجية المتخصصة", desc: "بروتوكولات علاجية متقدمة تشمل العلاجات البيولوجية الحديثة" },
      { icon: "ri-calendar-check-line", title: "متابعة مكثفة", desc: "متابعة دورية مع قياس كثافة العظام وتعديل الخطة العلاجية" },
    ],
    prices: [
      { name: "جلسة تقييم هشاشة العظام", price: 700, duration: "90 دقيقة" },
      { name: "قياس كثافة العظام DEXA", price: 350, duration: "30 دقيقة" },
      { name: "تحاليل الأيض العظمي الشاملة", price: 550, duration: "30 دقيقة" },
      { name: "التقييم الجيني لهشاشة العظام", price: 1200, duration: "10–14 يوم" },
      { name: "باقة هشاشة العظام المكثفة", price: 2500, duration: "6 أشهر", note: "تقييم + تحاليل + DEXA + خطة علاجية + متابعة 6 أشهر" },
    ],
    doctors: [
      { name: "د. محمد الراشد", role: "استشاري هشاشة العظام المكثفة", image: "https://readdy.ai/api/search-image?query=professional%20male%20arab%20doctor%20white%20coat%20clean%20white%20background%20confident%20smile%20portrait%20orthopedic%20bone%20specialist%20senior&width=200&height=200&seq=doc-osteo1&orientation=squarish", experience: "15 سنة خبرة" },
    ],
    faqs: [
      { q: "هل هشاشة العظام قابلة للعلاج؟", a: "نعم، مع التشخيص المبكر والعلاج المناسب يمكن تحسين كثافة العظام بشكل ملحوظ وتقليل مخاطر الكسور. العلاجات البيولوجية الحديثة أحدثت ثورة في علاج هشاشة العظام الشديدة." },
      { q: "من يحتاج إلى فحص كثافة العظام؟", a: "النساء بعد سن اليأس، الرجال فوق 65 سنة، من لديهم تاريخ عائلي لهشاشة العظام، من يتناولون الكورتيزون لفترات طويلة، ومن عانوا من كسور بسبب صدمات بسيطة." },
    ],
    relatedServices: ["risk-stratification", "iv-therapy", "second-opinion"],
  },
  {
    id: "alzheimer",
    name: "الزهايمر والتنكس العصبي",
    tagline: "تقييم مبكر وخطط وقائية للحالات عالية الخطورة",
    description: "تقييم مبكر للمخاطر العصبية التنكسية مع خطط وقائية شخصية قبل ظهور الأعراض",
    longDescription: "في ذا مديكال أفينيو، نتعامل مع الزهايمر والتنكس العصبي كحالات يمكن استباقها، لا مجرد انتظار ظهورها. نقدم تقييمًا مبكرًا شاملًا يشمل الاستعدادات الجينية، المؤشرات الحيوية العصبية، والوظائف المعرفية، مع خطة وقائية شخصية تهدف إلى تأخير أو منع التنكس العصبي.",
    icon: "ri-brain-line",
    accentColor: "violet",
    image: "https://readdy.ai/api/search-image?query=Alzheimer%20neurodegeneration%20brain%20health%20advanced%20medical%20assessment%20modern%20clinical%20environment%20sophisticated%20diagnostics%20professional%20healthcare&width=600&height=400&seq=srv-alz-ma1&orientation=landscape",
    heroImage: "https://readdy.ai/api/search-image?query=Alzheimer%20prevention%20early%20detection%20brain%20health%20advanced%20medical%20assessment%20modern%20clinical%20environment%20sophisticated%20diagnostics%20professional%20healthcare&width=1200&height=500&seq=srv-alz-hero&orientation=landscape",
    category: "الطب العصبي الوقائي",
    stats: [
      { label: "حالة تحت المتابعة الوقائية", value: "+200" },
      { label: "استشاري متخصص", value: "2" },
      { label: "سنة مبكرة يمكن الكشف فيها", value: "10–20" },
      { label: "سنة خبرة", value: "+12" },
    ],
    procedures: [
      { icon: "ri-brain-line", title: "تقييم الوظائف المعرفية", desc: "اختبارات معرفية متخصصة لتقييم الذاكرة والتركيز والوظائف التنفيذية" },
      { icon: "ri-dna-line", title: "التقييم الجيني للزهايمر", desc: "فحص جينات APOE وغيرها من المؤشرات الجينية للتنكس العصبي" },
      { icon: "ri-scan-2-line", title: "تصوير الدماغ المتقدم", desc: "MRI وظيفي وتصوير متقدم لتقييم صحة الدماغ والكشف المبكر" },
      { icon: "ri-flask-line", title: "المؤشرات الحيوية العصبية", desc: "تحاليل متخصصة للمؤشرات الحيوية المرتبطة بالتنكس العصبي" },
      { icon: "ri-shield-flash-line", title: "خطة وقائية شخصية", desc: "بروتوكول وقائي مخصص يشمل التدخلات الغذائية والدوائية ونمط الحياة" },
      { icon: "ri-calendar-check-line", title: "متابعة سنوية", desc: "تقييم سنوي لمتابعة المؤشرات وتعديل الخطة الوقائية" },
    ],
    prices: [
      { name: "جلسة تقييم مخاطر الزهايمر", price: 900, duration: "90 دقيقة" },
      { name: "تقييم الوظائف المعرفية", price: 700, duration: "90 دقيقة" },
      { name: "التقييم الجيني للزهايمر", price: 1500, duration: "10–14 يوم" },
      { name: "MRI دماغ متقدم", price: 1200, duration: "60 دقيقة" },
      { name: "باقة الوقاية من الزهايمر الشاملة", price: 3800, duration: "شهر", note: "تقييم + جيني + MRI + تحاليل + خطة وقائية + متابعة سنة" },
    ],
    doctors: [
      { name: "د. فيصل الأحمد", role: "استشاري الطب الدقيق والوقاية العصبية", image: "https://readdy.ai/api/search-image?query=professional%20male%20arab%20doctor%20white%20coat%20stethoscope%20clean%20white%20background%20confident%20authoritative%20portrait%20precision%20medicine%20specialist%20senior&width=200&height=200&seq=doc-alz1&orientation=squarish", experience: "18 سنة خبرة" },
      { name: "د. نورة الزهراني", role: "استشارية الجينات والطب الدقيق", image: "https://readdy.ai/api/search-image?query=professional%20female%20arab%20doctor%20white%20coat%20clean%20white%20background%20friendly%20confident%20portrait%20genetics%20precision%20medicine%20specialist&width=200&height=200&seq=doc-alz2&orientation=squarish", experience: "12 سنة خبرة" },
    ],
    faqs: [
      { q: "هل يمكن الوقاية من الزهايمر؟", a: "الأبحاث الحديثة تشير إلى أن التدخل المبكر يمكن أن يؤخر أو يقلل من خطر الإصابة بالزهايمر بشكل ملحوظ. التقييم المبكر للمخاطر يتيح وضع خطة وقائية قبل ظهور الأعراض بسنوات." },
      { q: "من يحتاج إلى تقييم مخاطر الزهايمر؟", a: "من لديهم تاريخ عائلي للزهايمر، من يلاحظون تراجعًا في الذاكرة أو التركيز، ومن يرغبون في تقييم مخاطرهم المستقبلية بشكل استباقي." },
    ],
    relatedServices: ["dna-risk", "risk-stratification", "second-opinion"],
  },
  {
    id: "mitochondrial",
    name: "خلل الميتوكوندريا",
    tagline: "طاقة خلوية أعمق من المظهر",
    description: "تشخيص وعلاج اضطرابات الطاقة الخلوية بأحدث التقنيات — خدمة تبني الهيبة العلمية",
    longDescription: "خلل الميتوكوندريا من أكثر الحالات التي تُفوَّت في الطب التقليدي. في ذا مديكال أفينيو، نقدم تقييمًا متخصصًا لوظيفة الميتوكوندريا وإنتاج الطاقة الخلوية، مع بروتوكولات علاجية مخصصة تشمل التدخلات الغذائية والمكملات المتخصصة والعلاجات الوريدية.",
    icon: "ri-flashlight-line",
    accentColor: "green",
    image: "https://readdy.ai/api/search-image?query=mitochondrial%20dysfunction%20cellular%20energy%20medicine%20advanced%20laboratory%20precision%20diagnostics%20modern%20clinical%20environment%20professional%20healthcare&width=600&height=400&seq=srv-mito-ma1&orientation=landscape",
    heroImage: "https://readdy.ai/api/search-image?query=mitochondrial%20health%20cellular%20energy%20advanced%20medical%20assessment%20laboratory%20precision%20diagnostics%20modern%20clinical%20environment%20professional%20healthcare&width=1200&height=500&seq=srv-mito-hero&orientation=landscape",
    category: "الطب الخلوي",
    stats: [
      { label: "حالة تحت الرعاية", value: "+150" },
      { label: "استشاري متخصص", value: "2" },
      { label: "نسبة تحسن مستوى الطاقة", value: "91%" },
      { label: "سنة خبرة", value: "+10" },
    ],
    procedures: [
      { icon: "ri-flashlight-line", title: "تقييم وظيفة الميتوكوندريا", desc: "تحاليل متخصصة لتقييم كفاءة إنتاج الطاقة الخلوية" },
      { icon: "ri-flask-line", title: "تحاليل الإجهاد التأكسدي", desc: "قياس مستوى الإجهاد التأكسدي والالتهاب الخلوي" },
      { icon: "ri-dna-line", title: "التقييم الجيني للميتوكوندريا", desc: "فحص الطفرات الجينية المرتبطة بخلل الميتوكوندريا" },
      { icon: "ri-drop-line", title: "بروتوكول الدعم الميتوكوندري الوريدي", desc: "تركيبة وريدية متخصصة لدعم وظيفة الميتوكوندريا" },
      { icon: "ri-user-heart-line", title: "خطة علاجية شخصية", desc: "بروتوكول علاجي يشمل التدخلات الغذائية والمكملات والعلاجات الوريدية" },
    ],
    prices: [
      { name: "جلسة تقييم الميتوكوندريا", price: 800, duration: "90 دقيقة" },
      { name: "تحاليل الإجهاد التأكسدي", price: 600, duration: "30 دقيقة" },
      { name: "التقييم الجيني للميتوكوندريا", price: 1500, duration: "10–14 يوم" },
      { name: "باقة دعم الميتوكوندريا الشاملة", price: 3200, duration: "3 أشهر", note: "تقييم + تحاليل + جيني + 6 جلسات وريدية + متابعة" },
    ],
    doctors: [
      { name: "د. سارة المنصور", role: "استشارية الخلل الأيضي والميتوكوندري", image: "https://readdy.ai/api/search-image?query=professional%20female%20arab%20doctor%20white%20coat%20hijab%20clean%20white%20background%20confident%20smile%20portrait%20metabolic%20medicine%20specialist&width=200&height=200&seq=doc-mito1&orientation=squarish", experience: "14 سنة خبرة" },
    ],
    faqs: [
      { q: "ما أعراض خلل الميتوكوندريا؟", a: "التعب المزمن غير المفسَّر، ضعف العضلات، صعوبة التركيز، حساسية للضوء والصوت، وأعراض متعددة لا تُفسَّر بتشخيص واحد. كثير من هذه الحالات تُفوَّت في الطب التقليدي." },
      { q: "هل خلل الميتوكوندريا قابل للعلاج؟", a: "مع التشخيص الصحيح والبروتوكول العلاجي المناسب، يمكن تحسين وظيفة الميتوكوندريا بشكل ملحوظ وتقليل الأعراض." },
    ],
    relatedServices: ["iv-therapy", "obesity-metabolic", "risk-stratification"],
  },
];
