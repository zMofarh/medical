export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  categoryId: string;
  author: string;
  authorRole: string;
  authorImage: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
  featured: boolean;
  views: number;
  status: "published" | "draft";
}

export interface BlogCategory {
  id: string;
  label: string;
  icon?: string;
  count?: number;
}

export const blogCategories: BlogCategory[] = [
  { id: "all", label: "الكل" },
  { id: "risk-stratification", label: "الطب الدقيق" },
  { id: "obesity-metabolic", label: "الخلل الأيضي" },
  { id: "second-opinion", label: "Second Opinion" },
  { id: "dna-risk", label: "الجينات" },
  { id: "psychiatry", label: "الطب النفسي" },
];

export const blogPosts: BlogPost[] = [
  {
    id: "precision-medicine-future",
    title: "الطب الدقيق: لماذا لم تعد الحلول العامة كافية؟",
    excerpt: "كل مريض يملك بيولوجيا ومسارًا صحيًا مختلفًا. نفهم قبل أن نقرر، ونحلل قبل أن نتدخل، ونستبق قبل أن نطارد.",
    content: "الطب الدقيق ليس مجرد مصطلح علمي، بل نموذج رعاية متكامل يقوم على فهم الفروق البيولوجية بين الأفراد.",
    category: "الطب الدقيق",
    categoryId: "risk-stratification",
    author: "د. فيصل الأحمد",
    authorRole: "استشاري الطب الدقيق وتقييم المخاطر",
    authorImage: "https://readdy.ai/api/search-image?query=professional%20male%20arab%20doctor%20white%20coat%20stethoscope%20clean%20white%20background%20confident%20authoritative%20portrait%20precision%20medicine%20specialist%20senior&width=100&height=100&seq=doc-ma1&orientation=squarish",
    date: "15 أبريل 2026",
    readTime: "6 دقائق",
    image: "https://readdy.ai/api/search-image?query=precision%20medicine%20DNA%20genomics%20advanced%20medical%20technology%20laboratory%20modern%20clinical%20environment%20sophisticated%20diagnostics%20professional%20healthcare%20concept&width=800&height=500&seq=blog-pm1&orientation=landscape",
    tags: ["الطب الدقيق", "DNA", "المخاطر الصحية"],
    featured: true,
    views: 3240,
    status: "published",
  },
  {
    id: "masld-metabolic",
    title: "MASLD والخلل الأيضي: أكثر من مجرد مشكلة وزن",
    excerpt: "لا نختزل الحالة في الوزن، بل نتعامل معها كمسار أيضي ووظيفي معقد يحتاج قراءة أعمق وتدخلًا أكثر تخصيصًا.",
    content: "MASLD أو مرض الكبد الدهني المرتبط بالخلل الأيضي يمثل أحد أكثر الحالات تعقيدًا في الطب الحديث.",
    category: "الخلل الأيضي",
    categoryId: "obesity-metabolic",
    author: "د. سارة المنصور",
    authorRole: "استشارية الخلل الأيضي وMASLD",
    authorImage: "https://readdy.ai/api/search-image?query=professional%20female%20arab%20doctor%20white%20coat%20hijab%20clean%20white%20background%20confident%20smile%20portrait%20metabolic%20medicine%20specialist&width=100&height=100&seq=doc-ma2&orientation=squarish",
    date: "10 أبريل 2026",
    readTime: "8 دقائق",
    image: "https://readdy.ai/api/search-image?query=metabolic%20syndrome%20liver%20disease%20MASLD%20medical%20concept%20advanced%20clinical%20assessment%20laboratory%20modern%20healthcare%20professional%20environment&width=800&height=500&seq=blog-meta1&orientation=landscape",
    tags: ["MASLD", "الخلل الأيضي", "السمنة"],
    featured: true,
    views: 2180,
    status: "published",
  },
  {
    id: "second-opinion-value",
    title: "Second Opinion: متى يكون القرار الطبي الإضافي ضرورة لا رفاهية؟",
    excerpt: "الرأي الطبي الإضافي عندنا ليس خدمة شكلية، بل أداة لاتخاذ قرار أكثر اطمئنانًا واتساعًا في الحالات الحساسة.",
    content: "في الحالات المعقدة، الحصول على رأي طبي ثانٍ من مراكز دولية متخصصة قد يغير مسار العلاج بالكامل.",
    category: "Second Opinion",
    categoryId: "second-opinion",
    author: "د. فيصل الأحمد",
    authorRole: "استشاري الطب الدقيق",
    authorImage: "https://readdy.ai/api/search-image?query=professional%20male%20arab%20doctor%20white%20coat%20stethoscope%20clean%20white%20background%20confident%20authoritative%20portrait%20precision%20medicine%20specialist%20senior&width=100&height=100&seq=doc-ma1&orientation=squarish",
    date: "5 أبريل 2026",
    readTime: "5 دقائق",
    image: "https://readdy.ai/api/search-image?query=international%20medical%20consultation%20second%20opinion%20global%20healthcare%20network%20professional%20doctors%20collaboration%20modern%20clinic%20sophisticated%20environment&width=800&height=500&seq=blog-2op1&orientation=landscape",
    tags: ["Second Opinion", "القرار الطبي", "الخبرة الدولية"],
    featured: false,
    views: 1920,
    status: "published",
  },
  {
    id: "dna-risk-score",
    title: "DNA Risk Score: قراءة مستقبلك الصحي قبل أن يحدث",
    excerpt: "نستخدم تحليل الـ DNA لفهم الاستعدادات والمخاطر المستقبلية، لا لمجرد الانبهار العلمي أو الاستعراض التقني.",
    content: "تحليل DNA Risk Score يكشف الاستعدادات الجينية للأمراض قبل ظهورها، مما يتيح التدخل الوقائي المبكر.",
    category: "الجينات والطب الدقيق",
    categoryId: "dna-risk",
    author: "د. نورة الزهراني",
    authorRole: "استشارية الجينات والطب الدقيق",
    authorImage: "https://readdy.ai/api/search-image?query=professional%20female%20arab%20doctor%20white%20coat%20clean%20white%20background%20friendly%20confident%20portrait%20genetics%20precision%20medicine%20specialist&width=100&height=100&seq=doc-ma4&orientation=squarish",
    date: "1 أبريل 2026",
    readTime: "7 دقائق",
    image: "https://readdy.ai/api/search-image?query=DNA%20genetic%20testing%20risk%20score%20precision%20medicine%20laboratory%20advanced%20genomics%20modern%20clinical%20environment%20sophisticated%20technology%20professional%20healthcare&width=800&height=500&seq=blog-dna1&orientation=landscape",
    tags: ["DNA", "الجينات", "الوقاية المبكرة"],
    featured: false,
    views: 2650,
    status: "published",
  },
  {
    id: "biological-aging",
    title: "العمر البيولوجي: أنت أصغر أو أكبر مما تظن",
    excerpt: "العمر الزمني لا يحكي القصة كاملة. العمر البيولوجي يكشف الحقيقة الفعلية لحالة جسمك على المستوى الخلوي.",
    content: "قياس العمر البيولوجي يتجاوز الأرقام ليكشف مدى تقدم الشيخوخة الخلوية ومدى استجابة الجسم للعوامل البيئية.",
    category: "الطب الدقيق",
    categoryId: "risk-stratification",
    author: "د. نورة الزهراني",
    authorRole: "استشارية الجينات والطب الدقيق",
    authorImage: "https://readdy.ai/api/search-image?query=professional%20female%20arab%20doctor%20white%20coat%20clean%20white%20background%20friendly%20confident%20portrait%20genetics%20precision%20medicine%20specialist&width=100&height=100&seq=doc-ma4&orientation=squarish",
    date: "28 مارس 2026",
    readTime: "6 دقائق",
    image: "https://readdy.ai/api/search-image?query=biological%20aging%20cellular%20health%20precision%20medicine%20advanced%20diagnostics%20modern%20laboratory%20sophisticated%20medical%20technology%20professional%20healthcare%20concept&width=800&height=500&seq=blog-age1&orientation=landscape",
    tags: ["العمر البيولوجي", "الشيخوخة", "الطب الدقيق"],
    featured: false,
    views: 1840,
    status: "published",
  },
  {
    id: "psychiatry-depth",
    title: "الطب النفسي العميق: ما وراء الأعراض",
    excerpt: "التقييم النفسي الحقيقي لا يكتفي بالأعراض، بل يقرأ البنية الكاملة للحالة ويربطها بالعوامل البيولوجية والنفسية.",
    content: "الطب النفسي للبالغين في ذا مديكال أفينيو يقوم على تقييم عميق متعدد الطبقات يتجاوز البروتوكولات التقليدية.",
    category: "الطب النفسي",
    categoryId: "psychiatry",
    author: "د. خالد العمر",
    authorRole: "استشاري الطب النفسي للبالغين",
    authorImage: "https://readdy.ai/api/search-image?query=professional%20male%20arab%20doctor%20white%20coat%20glasses%20clean%20white%20background%20confident%20smile%20portrait%20psychiatrist%20specialist%20senior&width=100&height=100&seq=doc-ma3&orientation=squarish",
    date: "24 مارس 2026",
    readTime: "5 دقائق",
    image: "https://readdy.ai/api/search-image?query=adult%20psychiatry%20mental%20health%20deep%20assessment%20modern%20clinical%20environment%20calm%20professional%20therapeutic%20setting%20sophisticated%20healthcare%20concept&width=800&height=500&seq=blog-psych1&orientation=landscape",
    tags: ["الطب النفسي", "التقييم العميق", "الصحة النفسية"],
    featured: false,
    views: 2120,
    status: "published",
  },
];
