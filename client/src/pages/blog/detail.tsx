import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import { usePublicBlog } from "@/hooks/useCMSBlog";

// ─── Article Content ──────────────────────────────────────────────────────────

const articleSections: Record<string, { heading: string; body: string; icon?: string }[]> = {
  "precision-medicine-future": [
    {
      icon: "ri-focus-3-line",
      heading: "لماذا لم تعد الحلول العامة كافية؟",
      body: "الطب التقليدي يعامل المرضى كفئات متجانسة — بروتوكول واحد لكل تشخيص. لكن الواقع البيولوجي مختلف تماماً: كل شخص يحمل جينوماً فريداً، وميكروبيوماً مختلفاً، وتاريخاً صحياً لا يشبه غيره. الطب الدقيق يبدأ من هذه الحقيقة.",
    },
    {
      icon: "ri-stack-line",
      heading: "التقييم متعدد الطبقات: ما وراء الفحص الروتيني",
      body: "في ذا مديكال أفينيو، التقييم لا يبدأ بالشكوى وينتهي بالوصفة. نبدأ بالاستماع العميق (30–45 دقيقة)، ثم نفكك الحالة عبر طبقات سريرية ومخبرية وجينية، ثم نربط بين الحاضر الصحي والمخاطر المستقبلية. الجلسة الواحدة قد تمتد 90–120 دقيقة.",
    },
    {
      icon: "ri-dna-line",
      heading: "DNA Risk Score: قراءة المستقبل الصحي",
      body: "تحليل الـ DNA لا يُستخدم لدينا للاستعراض التقني، بل لفهم الاستعدادات الجينية الحقيقية: هل هناك خطر مرتفع لأمراض القلب؟ السكري؟ الأورام؟ هذه المعلومات تُغير خطة الرعاية من التفاعل مع المرض إلى الاستباق قبل حدوثه.",
    },
    {
      icon: "ri-global-line",
      heading: "الامتداد الدولي: عندما تحتاج الحالة منظوراً أوسع",
      body: "بعض الحالات تتجاوز الإطار المحلي. شبكة علاقاتنا مع مراكز متخصصة في الولايات المتحدة وكوريا الجنوبية تتيح Second Opinion منظماً للحالات المعقدة — ليس كخدمة شكلية، بل كأداة لاتخاذ قرار أكثر اطمئناناً.",
    },
    {
      icon: "ri-user-heart-line",
      heading: "الخطة الشخصية: لا بروتوكولات عامة",
      body: "نهاية كل تقييم ليست وصفة طبية، بل خطة مبنية على بيولوجيتك الخاصة: ماذا تأكل، كيف تتحرك، ما الفحوصات الدورية التي تحتاجها، وكيف تتابع مؤشراتك الصحية. الخطة تتطور مع الوقت بناءً على استجابتك.",
    },
  ],
  "masld-metabolic": [
    {
      icon: "ri-scales-3-line",
      heading: "MASLD: أكثر من مجرد كبد دهني",
      body: "MASLD (Metabolic dysfunction-Associated Steatotic Liver Disease) ليس مجرد تراكم دهون في الكبد. هو مرآة لخلل أيضي عميق يشمل مقاومة الأنسولين، الالتهاب المزمن، واضطراب الميكروبيوم. علاجه يبدأ بفهم هذا الخلل، لا بتقليل الوزن فحسب.",
    },
    {
      icon: "ri-heart-pulse-line",
      heading: "الصلة بين الكبد والقلب والدماغ",
      body: "الخلل الأيضي لا يبقى في الكبد. يرتبط MASLD بزيادة خطر أمراض القلب والأوعية الدموية، مقاومة الأنسولين، وحتى التدهور المعرفي. التقييم الشامل يجب أن يشمل هذه الأبعاد كلها.",
    },
    {
      icon: "ri-test-tube-line",
      heading: "الفحوصات التي تكشف الحقيقة",
      body: "تشخيص MASLD لا يكتفي بالسونار. نحتاج: تقييم مقاومة الأنسولين (HOMA-IR)، مؤشرات الالتهاب (hsCRP)، تحليل الدهون المتقدم (LDL particle size)، وأحياناً تحليل الميكروبيوم. هذه الفحوصات تكشف ما يخفيه الفحص الروتيني.",
    },
    {
      icon: "ri-leaf-line",
      heading: "التدخل الشخصي: ما يناسبك لا يناسب غيرك",
      body: "لا يوجد نظام غذائي واحد لكل مريض MASLD. بعض المرضى يستجيبون للصيام المتقطع، وآخرون للنظام المتوسطي، وثالثون يحتاجون تدخلاً دوائياً. الخطة تُبنى على استجابتك البيولوجية الفعلية.",
    },
    {
      icon: "ri-line-chart-line",
      heading: "المتابعة: المعركة الحقيقية",
      body: "MASLD حالة مزمنة تحتاج متابعة لصيقة. نراقب المؤشرات كل 3 أشهر، نعدّل الخطة بناءً على الاستجابة، ونستخدم التطبيق لمراقبة المؤشرات اليومية. الهدف ليس تحسين الفحوصات فقط، بل تحسين جودة الحياة الفعلية.",
    },
  ],
  "second-opinion-value": [
    {
      icon: "ri-question-answer-line",
      heading: "متى يكون الرأي الثاني ضرورة؟",
      body: "ليس كل حالة تحتاج Second Opinion، لكن بعض الحالات لا تحتمل القرار بدونه: التشخيصات النادرة، الجراحات الكبرى، الأورام، الحالات التي لم تستجب للعلاج المعتاد، أو عندما يشعر المريض بعدم الاطمئنان لقرار طبي مهم.",
    },
    {
      icon: "ri-global-line",
      heading: "Second Opinion الدولي: كيف يعمل؟",
      body: "في ذا مديكال أفينيو، Second Opinion الدولي ليس مجرد إرسال ملف. نُعدّ الحالة بشكل احترافي، نختار المركز المناسب (USA أو Korea أو غيرها)، نُترجم الوثائق، ونُلخص الحالة بلغة علمية دقيقة. ثم نُترجم الرأي الدولي ونشرحه للمريض بوضوح.",
    },
    {
      icon: "ri-shield-check-line",
      heading: "الرأي الثاني لا يعني عدم الثقة",
      body: "كثير من المرضى يترددون في طلب رأي ثانٍ خشية إزعاج طبيبهم. الحقيقة أن الأطباء الواثقين من قراراتهم يرحبون بالرأي الثاني — لأنه يُعزز القرار أو يُصحح مساره. في كلتا الحالتين، المريض يكسب.",
    },
    {
      icon: "ri-file-text-line",
      heading: "ما الذي يتغير بعد Second Opinion؟",
      body: "في دراسات دولية، Second Opinion غيّر التشخيص أو خطة العلاج في 21–62% من الحالات المعقدة. هذا لا يعني أن الطبيب الأول أخطأ — بل يعني أن الطب علم احتمالات، والمزيد من الخبرات يُقلل هامش الخطأ.",
    },
  ],
  "dna-risk-score": [
    {
      icon: "ri-dna-line",
      heading: "ما هو DNA Risk Score؟",
      body: "DNA Risk Score هو تحليل جيني يقيس الاستعداد الوراثي للإصابة بأمراض محددة. يعتمد على تحليل آلاف المتغيرات الجينية (SNPs) المرتبطة بأمراض القلب، السكري، الأورام، وغيرها. النتيجة: درجة خطر شخصية لكل مرض.",
    },
    {
      icon: "ri-bar-chart-line",
      heading: "كيف نستخدم النتائج؟",
      body: "DNA Risk Score ليس حكماً نهائياً — الجينات تحدد الاستعداد، لكن البيئة ونمط الحياة يحددان ما إذا كان هذا الاستعداد سيتحول إلى مرض. نستخدم النتائج لتصميم خطة وقاية شخصية: فحوصات مبكرة، تعديلات غذائية، وتدخلات دوائية وقائية عند الحاجة.",
    },
    {
      icon: "ri-heart-pulse-line",
      heading: "مثال عملي: خطر أمراض القلب",
      body: "شخص بدرجة خطر جيني مرتفعة لأمراض القلب يحتاج: فحص كالسيوم الشرايين التاجية مبكراً، مراقبة دقيقة لمستوى LDL، وربما علاجاً وقائياً قبل ظهور أي أعراض. هذا التدخل المبكر قد يمنع نوبة قلبية بعد 20 سنة.",
    },
    {
      icon: "ri-shield-check-line",
      heading: "الخصوصية والأمان",
      body: "بيانات DNA حساسة للغاية. في ذا مديكال أفينيو، نلتزم بأعلى معايير حماية البيانات الجينية. لا تُشارك النتائج مع أي جهة خارجية، وتُحفظ بتشفير كامل. المريض يملك بياناته الجينية بالكامل.",
    },
  ],
  "biological-aging": [
    {
      icon: "ri-time-line",
      heading: "العمر الزمني مقابل العمر البيولوجي",
      body: "شخصان في الخمسين من العمر قد يكون أحدهما بيولوجياً في الأربعين والآخر في الستين. العمر البيولوجي يقيس مدى تقدم الشيخوخة الخلوية الفعلية، وهو مؤشر أدق بكثير من العمر الزمني في التنبؤ بالصحة المستقبلية.",
    },
    {
      icon: "ri-test-tube-line",
      heading: "كيف نقيس العمر البيولوجي؟",
      body: "نستخدم عدة مؤشرات: ساعة الميثيلة (Epigenetic Clock)، طول التيلومير، مؤشرات الالتهاب المزمن (IL-6, TNF-α)، وظيفة الميتوكوندريا، ومؤشرات الإجهاد التأكسدي. مجموع هذه المؤشرات يعطي صورة دقيقة للعمر البيولوجي الفعلي.",
    },
    {
      icon: "ri-leaf-line",
      heading: "ما الذي يُسرّع الشيخوخة البيولوجية؟",
      body: "الإجهاد المزمن، قلة النوم، التغذية السيئة، الخمول البدني، والتعرض للملوثات البيئية كلها تُسرّع الشيخوخة الخلوية. الخبر الجيد: هذه العوامل قابلة للتعديل، والشيخوخة البيولوجية يمكن إبطاؤها بل وعكسها جزئياً.",
    },
    {
      icon: "ri-arrow-up-circle-line",
      heading: "خطة إبطاء الشيخوخة البيولوجية",
      body: "بناءً على نتائج التقييم، نصمم خطة شخصية تشمل: تحسين النوم، التغذية المضادة للالتهاب، التمارين المناسبة لعمرك البيولوجي، المكملات الغذائية المستهدفة، وإدارة الإجهاد. نُعيد القياس بعد 6 أشهر لنرى التحسن الفعلي.",
    },
  ],
  "psychiatry-depth": [
    {
      icon: "ri-mental-health-line",
      heading: "الطب النفسي التقليدي وحدوده",
      body: "الطب النفسي التقليدي يعتمد على الأعراض الظاهرة لتحديد التشخيص والعلاج. لكن نفس الأعراض قد تنتج عن أسباب بيولوجية مختلفة تماماً: خلل في الناقلات العصبية، التهاب عصبي، خلل هرموني، أو استعداد جيني. علاج الأعراض دون فهم السبب يُعطي نتائج جزئية.",
    },
    {
      icon: "ri-stack-line",
      heading: "التقييم النفسي متعدد الطبقات",
      body: "في ذا مديكال أفينيو، التقييم النفسي يشمل: التاريخ النفسي والاجتماعي، الفحص العصبي النفسي، تحاليل الناقلات العصبية، الهرمونات (الغدة الدرقية، الكورتيزول)، مؤشرات الالتهاب، وأحياناً التحليل الجيني للاستجابة للأدوية (Pharmacogenomics).",
    },
    {
      icon: "ri-dna-line",
      heading: "Pharmacogenomics: الدواء المناسب لجيناتك",
      body: "لماذا يستجيب بعض المرضى لمضادات الاكتئاب ولا يستجيب آخرون؟ الجواب في الجينات. تحليل Pharmacogenomics يكشف كيف يُحلّل جسمك الأدوية النفسية، مما يُساعد في اختيار الدواء الأنسب والجرعة الصحيحة من البداية — بدلاً من التجربة والخطأ.",
    },
    {
      icon: "ri-user-heart-line",
      heading: "الصحة النفسية والجسدية: وجهان لعملة واحدة",
      body: "الاكتئاب يرفع خطر أمراض القلب. القلق المزمن يُسرّع الشيخوخة البيولوجية. الألم المزمن يُغير بنية الدماغ. في ذا مديكال أفينيو، نتعامل مع الصحة النفسية كجزء لا يتجزأ من الصحة العامة، لا كتخصص منفصل.",
    },
  ],
};

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const { posts: blogPosts, categories, loading: listLoading } = usePublicBlog();
  const [localPost, setLocalPost] = useState<any>(null);
  const [localLoading, setLocalLoading] = useState(false);

  const post = blogPosts.find((p) => p.id === id) || localPost;
  const related = blogPosts.filter((p) => p.id !== id).slice(0, 3);
  const sections = id ? (articleSections[id] ?? []) : [];

  useEffect(() => {
    const fetchSinglePost = async () => {
      if (listLoading || !id) return;
      
      const foundInList = blogPosts.find((p) => p.id === id);
      if (foundInList) return;

      try {
        setLocalLoading(true);
        // Try fetching it directly (it might be a draft)
        // We import getPost from api/blog
        const { getPost, adaptPost } = await import("@/api/blog");
        const backendPost = await getPost(id);
        setLocalPost(adaptPost(backendPost, categories));
      } catch (err) {
        console.error("Post not found", err);
        navigate("/blog");
      } finally {
        setLocalLoading(false);
      }
    };

    fetchSinglePost();
  }, [id, listLoading, blogPosts, categories, navigate]);

  useEffect(() => {
    if (post) {
      window.scrollTo(0, 0);
    }
  }, [post]);

  const isLoading = listLoading || localLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-cream-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-forest-200 border-t-brand-forest-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-brand-cream-50 font-sans">
      <Navbar />

      {/* ── Hero Image ────────────────────────────────────────────────────── */}
      <div className="relative pt-20" style={{ height: "460px" }}>
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-forest-950/85 via-brand-forest-900/40 to-transparent"></div>

        {/* Breadcrumb */}
        <div className="absolute top-24 right-0 left-0 max-w-7xl mx-auto px-4 md:px-8">
          <nav className="flex items-center gap-2 text-white/70 text-xs">
            <Link to="/" className="hover:text-white transition-colors cursor-pointer">الرئيسية</Link>
            <i className="ri-arrow-left-s-line"></i>
            <Link to="/blog" className="hover:text-white transition-colors cursor-pointer">المدونة</Link>
            <i className="ri-arrow-left-s-line"></i>
            <span className="text-white/90 font-medium line-clamp-1">{post.title}</span>
          </nav>
        </div>

        <div className="absolute bottom-0 right-0 left-0 p-8 max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-block bg-brand-forest-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              {post.category}
            </span>
            {post.featured && (
              <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                <i className="ri-star-fill text-[10px]"></i>
                مميز
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">{post.title}</h1>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Article ── */}
          <article className="flex-1 min-w-0">

            {/* Meta Bar */}
            <div className="bg-white rounded-2xl border border-brand-cream-200 p-5 mb-8 flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-brand-cream-100 flex-shrink-0">
                  <img src={post.authorImage} alt={post.author} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{post.author}</p>
                  <p className="text-brand-forest-600 text-xs font-medium">{post.authorRole}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-gray-400 mr-auto">
                <span className="flex items-center gap-1.5">
                  <i className="ri-calendar-line text-brand-forest-500"></i>
                  {post.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="ri-time-line text-brand-forest-500"></i>
                  {post.readTime} قراءة
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="ri-eye-line text-brand-forest-500"></i>
                  {post.views.toLocaleString()} مشاهدة
                </span>
              </div>
            </div>

            {/* Excerpt Highlight */}
            <div className="bg-brand-cream-100 border-r-4 border-brand-forest-500 rounded-xl p-5 mb-8">
              <p className="text-brand-forest-800 text-base leading-relaxed font-medium">{post.excerpt}</p>
            </div>

            {/* Sections */}
            <div className="bg-white rounded-2xl border border-brand-cream-200 p-8 mb-8">
              {sections.length > 0 ? (
                <div className="space-y-8">
                  {sections.map((section, i) => (
                    <div key={i}>
                      <h2 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-3">
                        {section.icon ? (
                          <div className="w-8 h-8 flex items-center justify-center bg-brand-cream-100 rounded-lg flex-shrink-0">
                            <i className={`${section.icon} text-brand-forest-600 text-base`}></i>
                          </div>
                        ) : (
                          <span className="w-6 h-6 flex items-center justify-center bg-brand-cream-200 text-brand-forest-700 text-xs font-black rounded-full flex-shrink-0">
                            {i + 1}
                          </span>
                        )}
                        {section.heading}
                      </h2>
                      <p className="text-gray-600 leading-relaxed text-sm pr-11">{section.body}</p>
                      {i < sections.length - 1 && (
                        <div className="mt-6 h-px bg-brand-cream-100"></div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div 
                  className="prose prose-brand max-w-none text-gray-600 leading-relaxed" 
                  dangerouslySetInnerHTML={{ __html: post.content }} 
                />
              )}
            </div>

            {/* Precision Medicine Note */}
            <div className="bg-brand-cream-50 rounded-2xl border border-brand-cream-300 p-5 mb-8 flex items-start gap-4">
              <div className="w-10 h-10 flex items-center justify-center bg-brand-cream-200 rounded-xl flex-shrink-0">
                <i className="ri-dna-line text-brand-forest-600 text-lg"></i>
              </div>
              <div>
                <p className="font-bold text-brand-forest-800 text-sm mb-1">هل تريد تقييماً شخصياً؟</p>
                <p className="text-brand-forest-700 text-xs leading-relaxed">
                  ما تقرأه هنا هو مقدمة علمية. التقييم الحقيقي يبدأ بجلسة عميقة مع أحد استشاريينا — نفهم حالتك الخاصة قبل أن نقترح أي خطة.
                </p>
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-brand-forest-700 bg-brand-cream-200 hover:bg-brand-cream-300 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-calendar-check-line"></i>
                  احجز جلسة تقييم
                </Link>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-brand-cream-100 text-brand-forest-700 text-xs font-medium px-3 py-1.5 rounded-full border border-brand-cream-200"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Share */}
            <div className="bg-white rounded-2xl border border-brand-cream-200 p-5 flex items-center justify-between flex-wrap gap-4">
              <p className="font-bold text-gray-800 text-sm">شارك هذا المقال:</p>
              <div className="flex gap-2">
                {[
                  { icon: "ri-twitter-x-line", label: "تويتر" },
                  { icon: "ri-whatsapp-line", label: "واتساب" },
                  { icon: "ri-linkedin-line", label: "لينكدإن" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    title={s.label}
                    className="w-9 h-9 flex items-center justify-center bg-brand-cream-50 border border-brand-cream-200 hover:bg-brand-forest-600 hover:text-white hover:border-brand-forest-600 rounded-full transition-colors cursor-pointer text-gray-600"
                  >
                    <i className={`${s.icon} text-base`}></i>
                  </a>
                ))}
                <button
                  onClick={handleCopy}
                  className="w-9 h-9 flex items-center justify-center bg-brand-cream-50 border border-brand-cream-200 hover:bg-brand-forest-600 hover:text-white hover:border-brand-forest-600 rounded-full transition-colors cursor-pointer text-gray-600"
                  title="نسخ الرابط"
                >
                  <i className={`${copied ? "ri-check-line" : "ri-link"} text-base`}></i>
                </button>
              </div>
            </div>

            {/* Author Card */}
            <div className="mt-8 bg-white rounded-2xl border border-brand-cream-200 p-6 flex items-start gap-5">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-brand-cream-100 flex-shrink-0">
                <img src={post.authorImage} alt={post.author} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="font-black text-gray-900 mb-0.5">{post.author}</p>
                <p className="text-brand-forest-600 text-xs font-semibold mb-2">{post.authorRole}</p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  استشاري متخصص في ذا مديكال أفينيو — منصة الطب الدقيق والرعاية التخصصية المتقدمة. يؤمن بأن الفهم العميق للحالة هو أساس أي قرار طبي صحيح.
                </p>
                <Link
                  to="/doctors"
                  className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-brand-forest-600 hover:underline cursor-pointer"
                >
                  عرض الملف الكامل
                  <i className="ri-arrow-left-line"></i>
                </Link>
              </div>
            </div>
          </article>

          {/* ── Sidebar ── */}
          <aside className="lg:w-72 flex-shrink-0 space-y-6">

            {/* Book CTA */}
            <div className="bg-brand-forest-800 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 flex items-center justify-center bg-white/15 rounded-xl mx-auto mb-4">
                <i className="ri-calendar-check-line text-white text-2xl"></i>
              </div>
              <h3 className="font-black text-white mb-2">احجز جلسة تقييم</h3>
              <p className="text-brand-cream-300 text-xs mb-4 leading-relaxed">
                تحدث مع أحد استشاريينا حول ما قرأته — التقييم العميق يبدأ من هنا
              </p>
              <Link
                to="/booking"
                className="block w-full bg-brand-cream-300 text-brand-forest-900 font-bold py-2.5 rounded-xl text-sm hover:bg-brand-cream-200 transition-colors whitespace-nowrap cursor-pointer"
              >
                احجز الآن
              </Link>
              <Link
                to="/packages"
                className="block w-full mt-2 border border-white/30 text-white font-medium py-2.5 rounded-xl text-xs hover:bg-white/10 transition-colors whitespace-nowrap cursor-pointer"
              >
                استعرض مستويات الرعاية
              </Link>
            </div>

            {/* Three Dimensions */}
            <div className="bg-white rounded-2xl border border-brand-cream-200 p-5">
              <h3 className="font-black text-gray-900 mb-4 text-sm flex items-center gap-2">
                <div className="w-6 h-6 flex items-center justify-center bg-brand-cream-100 rounded-lg">
                  <i className="ri-focus-3-line text-brand-forest-600 text-xs"></i>
                </div>
                أبعاد الطب الدقيق
              </h3>
              <div className="space-y-3">
                {[
                  { icon: "ri-stethoscope-line", title: "عمق سريري", desc: "جلسات 90–120 دقيقة" },
                  { icon: "ri-dna-line", title: "عمق تقني", desc: "DNA، عمر بيولوجي، مخاطر" },
                  { icon: "ri-global-line", title: "عمق دولي", desc: "USA وكوريا الجنوبية" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-brand-cream-50 rounded-xl">
                    <div className="w-8 h-8 flex items-center justify-center bg-brand-cream-200 rounded-lg flex-shrink-0">
                      <i className={`${item.icon} text-brand-forest-600 text-sm`}></i>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Posts */}
            <div className="bg-white rounded-2xl border border-brand-cream-200 p-5">
              <h3 className="font-black text-gray-900 mb-4 text-sm flex items-center gap-2">
                <div className="w-6 h-6 flex items-center justify-center bg-brand-cream-100 rounded-lg">
                  <i className="ri-article-line text-brand-forest-600 text-xs"></i>
                </div>
                مقالات ذات صلة
              </h3>
              <div className="space-y-4">
                {related.map((rp) => (
                  <Link
                    key={rp.id}
                    to={`/blog/${rp.id}`}
                    className="flex gap-3 group cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-brand-cream-100">
                      <img
                        src={rp.image}
                        alt={rp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-800 leading-tight mb-1 group-hover:text-brand-forest-600 transition-colors line-clamp-2">
                        {rp.title}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <i className="ri-time-line"></i>
                        {rp.readTime}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                to="/blog"
                className="block w-full text-center mt-4 text-brand-forest-600 text-xs font-semibold hover:text-brand-forest-700 cursor-pointer"
              >
                عرض جميع المقالات
                <i className="ri-arrow-left-line mr-1"></i>
              </Link>
            </div>

            {/* Services Quick Links */}
            <div className="bg-brand-cream-50 rounded-2xl border border-brand-cream-200 p-5">
              <h3 className="font-black text-gray-900 mb-3 text-sm">خدمات ذات صلة</h3>
              <div className="space-y-2">
                {[
                  { label: "تقييم المخاطر الصحية", href: "/services" },
                  { label: "DNA Risk Score", href: "/services" },
                  { label: "Second Opinion الدولي", href: "/services" },
                  { label: "مستويات الرعاية", href: "/packages" },
                ].map((link, i) => (
                  <Link
                    key={i}
                    to={link.href}
                    className="flex items-center justify-between text-xs text-gray-700 hover:text-brand-forest-600 transition-colors cursor-pointer py-1.5 border-b border-brand-cream-100 last:border-0"
                  >
                    <span>{link.label}</span>
                    <i className="ri-arrow-left-line text-gray-400"></i>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── More Articles ─────────────────────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-brand-forest-600 rounded-full"></div>
              <h2 className="text-xl font-black text-gray-900">مقالات أخرى</h2>
            </div>
            <Link
              to="/blog"
              className="text-brand-forest-600 text-sm font-semibold hover:underline cursor-pointer whitespace-nowrap"
            >
              عرض الكل
              <i className="ri-arrow-left-line mr-1"></i>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((rp) => (
              <Link
                key={rp.id}
                to={`/blog/${rp.id}`}
                className="group bg-brand-cream-50 rounded-2xl overflow-hidden border border-brand-cream-200 hover:border-brand-forest-300 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col"
              >
                <div className="relative overflow-hidden" style={{ height: "180px" }}>
                  <img
                    src={rp.image}
                    alt={rp.title}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="bg-brand-forest-600/90 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      {rp.category}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-black text-gray-900 text-sm mb-2 leading-tight group-hover:text-brand-forest-700 transition-colors line-clamp-2">
                    {rp.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed flex-1 line-clamp-2">{rp.excerpt}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-brand-cream-100">
                    <span className="text-xs text-gray-500">{rp.author}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <i className="ri-time-line"></i>
                      {rp.readTime}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
