import { ContactCtaBanner, ContactFaqTeaser, ContactSocialLink } from "@/types/cms";

type SocialData  = ContactSocialLink[];
type CtaData     = ContactCtaBanner;
type FaqData     = ContactFaqTeaser;
type SocialLink  = SocialData[number];

interface Props {
  data:           SocialData;
  cta:            CtaData;
  faq:            FaqData;
  onChangeSocial: (d: SocialData) => void;
  onChangeCta:    (d: CtaData)    => void;
  onChangeFaq:    (d: FaqData)    => void;
}

const platformColors: Record<string, string> = {
  twitter:   "text-gray-800 bg-gray-100",
  instagram: "text-pink-600 bg-pink-50",
  snapchat:  "text-yellow-500 bg-yellow-50",
  youtube:   "text-red-600 bg-red-50",
  facebook:  "text-sky-700 bg-sky-50",
  tiktok:    "text-gray-900 bg-gray-100",
};

export default function ContactSocialEditor({ data, cta, faq, onChangeSocial, onChangeCta, onChangeFaq }: Props) {
  const toggleLink = (id: string) => {
    onChangeSocial(data.map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l)));
  };

  const updateLink = (id: string, field: keyof SocialLink, val: string) => {
    onChangeSocial(data.map((l) => (l.id === id ? { ...l, [field]: val } : l)));
  };

  return (
    <div className="p-6 space-y-8">
      {/* Social links */}
      <div>
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-5">
          <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
            <i className="ri-share-forward-line text-pink-600 text-lg" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-800">روابط السوشيال ميديا</h3>
            <p className="text-xs text-gray-500">الأيقونات التي تظهر في الشريط الجانبي</p>
          </div>
        </div>

        <div className="space-y-3">
          {data.map((link) => (
            <div key={link.id} className={`rounded-xl border p-4 transition-all ${link.enabled ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50/50 opacity-60"}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${platformColors[link.id] || "text-gray-600 bg-gray-100"}`}>
                  <i className={`${link.icon} text-lg`} />
                </div>
                <span className="text-sm font-semibold text-gray-700 w-24 flex-shrink-0">{link.label}</span>
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => updateLink(link.id, "url", e.target.value)}
                  disabled={!link.enabled}
                  dir="ltr"
                  placeholder="https://..."
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono text-xs focus:outline-none focus:border-[#2E4E45] transition-all disabled:bg-gray-50 disabled:text-gray-400"
                />
                <button
                  onClick={() => toggleLink(link.id)}
                  className={`relative w-10 h-5 rounded-full transition-all flex-shrink-0 cursor-pointer ${link.enabled ? "bg-[#2E4E45]" : "bg-gray-200"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${link.enabled ? "right-0.5" : "left-0.5"}`} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
          <p className="text-xs text-gray-500 mb-3 font-medium">معاينة الأيقونات النشطة:</p>
          <div className="flex gap-2 flex-wrap">
            {data.filter(l => l.enabled).map((l) => (
              <div key={l.id} className={`w-9 h-9 rounded-xl flex items-center justify-center ${platformColors[l.id] || "text-gray-600 bg-gray-100"}`} title={l.label}>
                <i className={`${l.icon} text-base`} />
              </div>
            ))}
            {data.filter(l => l.enabled).length === 0 && <p className="text-xs text-gray-400">لا توجد منصات نشطة</p>}
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div>
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#2E4E45]/10 flex items-center justify-center">
            <i className="ri-megaphone-line text-[#2E4E45] text-lg" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-800">بانر الحجز (CTA)</h3>
            <p className="text-xs text-gray-500">البانر الداكن الذي يدعو للحجز</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">العنوان</label>
            <input type="text" value={cta.title} onChange={(e) => onChangeCta({ ...cta, title: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] transition-all" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">نص الزر</label>
            <input type="text" value={cta.buttonText} onChange={(e) => onChangeCta({ ...cta, buttonText: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] transition-all" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-gray-500 mb-1 block">الوصف</label>
            <input type="text" value={cta.description} onChange={(e) => onChangeCta({ ...cta, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] transition-all" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">رابط الزر</label>
            <input type="text" value={cta.buttonLink} onChange={(e) => onChangeCta({ ...cta, buttonLink: e.target.value })} dir="ltr" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] transition-all font-mono text-xs" />
          </div>
        </div>

        <div className="rounded-xl overflow-hidden border border-gray-200">
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
            <i className="ri-eye-line text-gray-400 text-sm" />
            <span className="text-xs font-medium text-gray-500">معاينة البانر</span>
          </div>
          <div className="bg-[#2E4E45] p-5 text-center">
            <h4 className="font-black text-white mb-1.5 text-sm">{cta.title}</h4>
            <p className="text-white/60 text-xs mb-3">{cta.description}</p>
            <span className="inline-block bg-[#C8A96E] text-[#2E4E45] font-bold px-4 py-2 rounded-full text-xs">{cta.buttonText}</span>
          </div>
        </div>
      </div>

      {/* FAQ Teaser */}
      <div>
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-5">
          <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
            <i className="ri-question-answer-line text-violet-600 text-lg" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-800">بانر الأسئلة الشائعة</h3>
            <p className="text-xs text-gray-500">الشريط السفلي الذي يوجه للـ FAQ</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">العنوان</label>
            <input type="text" value={faq.title} onChange={(e) => onChangeFaq({ ...faq, title: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] transition-all" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">نص الزر</label>
            <input type="text" value={faq.buttonText} onChange={(e) => onChangeFaq({ ...faq, buttonText: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] transition-all" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-gray-500 mb-1 block">الوصف</label>
            <input type="text" value={faq.description} onChange={(e) => onChangeFaq({ ...faq, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
}
