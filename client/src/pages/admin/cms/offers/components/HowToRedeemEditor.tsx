import { useState } from "react";
import { howToRedeemSteps, offersNotifyData, type HowToRedeemStep, type OffersNotifyCMS } from "@/mocks/offersData";

const ICON_OPTIONS = [
  "ri-search-eye-line", "ri-calendar-check-line", "ri-coupon-line", "ri-hospital-line",
  "ri-phone-line", "ri-map-pin-line", "ri-user-line", "ri-shield-check-line",
  "ri-star-line", "ri-heart-pulse-line",
];

export default function HowToRedeemEditor() {
  const [steps, setSteps] = useState<HowToRedeemStep[]>(howToRedeemSteps);
  const [notify, setNotify] = useState<OffersNotifyCMS>(offersNotifyData);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"steps" | "notify">("steps");

  const handleUpdateStep = (index: number, field: keyof HowToRedeemStep, value: string) => {
    const next = [...steps];
    next[index] = { ...next[index], [field]: value };
    setSteps(next);
  };

  const handleDeleteStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleAddStep = () => {
    const newStep: HowToRedeemStep = {
      id: `s${Date.now()}`,
      step: String(steps.length + 1).padStart(2, "0"),
      icon: "ri-star-line",
      title: "خطوة جديدة",
      desc: "وصف الخطوة",
    };
    setSteps([...steps, newStep]);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center bg-[#2E4E45]/10 rounded-lg">
            <i className="ri-route-line text-[#2E4E45] text-lg"></i>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">كيفية الاستفادة والإشعارات</h3>
            <p className="text-xs text-gray-400">خطوات الاستفادة من العروض وقسم الإشعارات</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            saved ? "bg-green-500 text-white" : "bg-[#2E4E45] text-white hover:bg-[#243d36]"
          }`}
        >
          <i className={saved ? "ri-check-line" : "ri-save-line"}></i>
          {saved ? "تم الحفظ!" : "حفظ"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 mb-5 w-fit">
        {[
          { id: "steps", label: "خطوات الاستفادة", icon: "ri-list-ordered" },
          { id: "notify", label: "قسم الإشعارات", icon: "ri-notification-3-line" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id ? "bg-white text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <i className={`${tab.icon} text-xs`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "steps" && (
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={step.id} className="border border-gray-200 rounded-xl p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-start">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">رقم الخطوة</label>
                  <input
                    type="text"
                    value={step.step}
                    onChange={(e) => handleUpdateStep(index, "step", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
                    maxLength={2}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">العنوان</label>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => handleUpdateStep(index, "title", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">الوصف</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={step.desc}
                      onChange={(e) => handleUpdateStep(index, "desc", e.target.value)}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
                    />
                    <button
                      onClick={() => handleDeleteStep(index)}
                      className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer flex-shrink-0"
                    >
                      <i className="ri-delete-bin-line text-sm"></i>
                    </button>
                  </div>
                </div>
                <div className="sm:col-span-2 md:col-span-4">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">الأيقونة</label>
                  <div className="flex flex-wrap gap-2">
                    {ICON_OPTIONS.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => handleUpdateStep(index, "icon", icon)}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all cursor-pointer ${
                          step.icon === icon ? "border-[#2E4E45] bg-[#2E4E45]/10" : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <i className={`${icon} text-base text-gray-700`}></i>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={handleAddStep}
            className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-[#2E4E45] hover:text-[#2E4E45] transition-colors cursor-pointer"
          >
            <i className="ri-add-line ml-1"></i>
            إضافة خطوة
          </button>
        </div>
      )}

      {activeTab === "notify" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">العنوان الرئيسي</label>
            <input
              type="text"
              value={notify.title}
              onChange={(e) => setNotify({ ...notify, title: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">النص التوضيحي</label>
            <textarea
              value={notify.subtitle}
              onChange={(e) => setNotify({ ...notify, subtitle: e.target.value })}
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45] resize-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">نص الزر الأول</label>
              <input
                type="text"
                value={notify.ctaPrimary}
                onChange={(e) => setNotify({ ...notify, ctaPrimary: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">نص الزر الثاني</label>
              <input
                type="text"
                value={notify.ctaSecondary}
                onChange={(e) => setNotify({ ...notify, ctaSecondary: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="mt-4 rounded-xl bg-gradient-to-r from-[#2E4E45] to-[#3a6358] p-6 text-center">
            <div className="text-xl font-black text-white mb-2">{notify.title}</div>
            <div className="text-white/70 text-xs mb-4 max-w-xs mx-auto">{notify.subtitle}</div>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <div className="bg-white text-[#2E4E45] font-bold px-5 py-2 rounded-full text-xs whitespace-nowrap">
                {notify.ctaPrimary}
              </div>
              <div className="border-2 border-white/50 text-white font-bold px-5 py-2 rounded-full text-xs whitespace-nowrap">
                {notify.ctaSecondary}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
