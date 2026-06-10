import { useState } from "react";
import type { SocialMedia } from "@/hooks/useCMSSettings";

interface Props {
  data: SocialMedia;
  onChange: (d: SocialMedia) => void;
}

const platforms = [
  { id: "instagram", label: "Instagram",  icon: "ri-instagram-line",        color: "text-pink-600 bg-pink-50",    placeholder: "https://instagram.com/yourpage" },
  { id: "twitter",   label: "X (Twitter)", icon: "ri-twitter-x-line",        color: "text-gray-800 bg-gray-100",   placeholder: "https://twitter.com/yourpage" },
  { id: "facebook",  label: "Facebook",   icon: "ri-facebook-circle-line",   color: "text-sky-700 bg-sky-50",      placeholder: "https://facebook.com/yourpage" },
  { id: "snapchat",  label: "Snapchat",   icon: "ri-snapchat-line",          color: "text-yellow-500 bg-yellow-50", placeholder: "اسم المستخدم على سناب شات" },
  { id: "tiktok",    label: "TikTok",     icon: "ri-tiktok-line",            color: "text-gray-900 bg-gray-100",   placeholder: "@yourpage" },
  { id: "youtube",   label: "YouTube",    icon: "ri-youtube-line",           color: "text-red-600 bg-red-50",      placeholder: "https://youtube.com/@yourpage" },
  { id: "linkedin",  label: "LinkedIn",   icon: "ri-linkedin-box-line",      color: "text-sky-700 bg-sky-50",      placeholder: "https://linkedin.com/company/yourpage" },
] as const;

type PlatformId = typeof platforms[number]["id"];

export default function SocialMediaSection({ data, onChange }: Props) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(platforms.map((p) => [p.id, true]))
  );

  const handleChange = (id: PlatformId, value: string) => {
    onChange({ ...data, [id]: value });
  };

  const togglePlatform = (id: string) => {
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const activePlatforms = platforms.filter((p) => enabled[p.id] && (data as Record<string, string>)[p.id]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
          <i className="ri-share-forward-line text-pink-600 text-lg" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-800">السوشيال ميديا</h3>
          <p className="text-xs text-gray-500">روابط حسابات العيادة على منصات التواصل الاجتماعي</p>
        </div>
        <div className="mr-auto px-3 py-1.5 rounded-full bg-pink-50 text-pink-700 text-xs font-medium">
          {activePlatforms.length} منصة نشطة
        </div>
      </div>

      {/* Platforms */}
      <div className="space-y-3">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className={`rounded-xl border transition-all ${
              enabled[platform.id] ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50/50 opacity-60"
            }`}
          >
            <div className="flex items-center gap-4 p-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${platform.color}`}>
                <i className={`${platform.icon} text-lg`} />
              </div>
              <div className="w-24 flex-shrink-0">
                <p className="text-sm font-semibold text-gray-700">{platform.label}</p>
              </div>
              <input
                type="url"
                value={(data as Record<string, string>)[platform.id] || ""}
                onChange={(e) => handleChange(platform.id, e.target.value)}
                placeholder={platform.placeholder}
                disabled={!enabled[platform.id]}
                dir="ltr"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all disabled:bg-gray-50 disabled:text-gray-400"
              />
              <div className="flex items-center gap-2 flex-shrink-0">
                {(data as Record<string, string>)[platform.id] && enabled[platform.id] && (
                  <a
                    href={(data as Record<string, string>)[platform.id]}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-[#2E4E45] hover:border-[#2E4E45] transition-colors"
                  >
                    <i className="ri-external-link-line text-sm" />
                  </a>
                )}
                <button
                  onClick={() => togglePlatform(platform.id)}
                  className={`relative w-10 h-5 rounded-full transition-all cursor-pointer ${
                    enabled[platform.id] ? "bg-[#2E4E45]" : "bg-gray-200"
                  }`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${
                    enabled[platform.id] ? "right-0.5" : "left-0.5"
                  }`} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview */}
      {activePlatforms.length > 0 && (
        <div className="p-4 rounded-xl bg-[#2E4E45]/5 border border-[#2E4E45]/10">
          <p className="text-xs font-semibold text-[#2E4E45] mb-3 flex items-center gap-1.5">
            <i className="ri-eye-line" />
            معاينة أيقونات السوشيال (كما تظهر في الفوتر)
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            {activePlatforms.map((platform) => (
              <div
                key={platform.id}
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${platform.color}`}
                title={platform.label}
              >
                <i className={`${platform.icon} text-base`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Display settings */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">إعدادات العرض</label>
        <div className="space-y-2">
          {[
            { label: "إظهار أيقونات السوشيال في الفوتر", checked: true },
            { label: "إظهار أيقونات السوشيال في صفحة التواصل", checked: true },
            { label: "إظهار عدد المتابعين (إذا كان متاحاً)", checked: false },
            { label: "فتح الروابط في نافذة جديدة", checked: true },
          ].map((setting) => (
            <label key={setting.label} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input type="checkbox" defaultChecked={setting.checked} className="w-4 h-4 rounded border-gray-300" />
              <span className="text-sm text-gray-700">{setting.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
