import { useState, useCallback } from "react";
import AdminLayout from "@/pages/admin/components/AdminLayout";
import { useCMSSettings } from "@/hooks/useCMSSettings";
import ClinicInfoSection from "./components/ClinicInfoSection";
import WorkingHoursSection from "./components/WorkingHoursSection";
import ContactSection from "./components/ContactSection";
import SocialMediaSection from "./components/SocialMediaSection";
import LocationSection from "./components/LocationSection";

const tabs = [
  { id: "clinic",   label: "معلومات العيادة",   icon: "ri-hospital-line",          desc: "الاسم، الشعار، الوصف" },
  { id: "hours",    label: "ساعات العمل",        icon: "ri-time-line",              desc: "أوقات الفتح والإغلاق" },
  { id: "contact",  label: "التواصل",            icon: "ri-phone-line",             desc: "الهاتف، البريد، واتساب" },
  { id: "social",   label: "السوشيال ميديا",     icon: "ri-share-line",             desc: "روابط المنصات" },
  { id: "location", label: "الموقع الجغرافي",    icon: "ri-map-pin-line",           desc: "العنوان والخريطة" },
];

export default function AdminCMSSettings() {
  const [activeTab, setActiveTab] = useState("clinic");

  const {
    info, hours, social, emergency,
    saveStatus, hasChanges,
    updateInfo, updateHours, updateSocial, updateEmergency,
    save, reset,
  } = useCMSSettings();

  const handleSave = useCallback(async () => {
    await save();
  }, [save]);

  const activeTabData = tabs.find((t) => t.id === activeTab);
  const openDays = hours.filter((d) => d.isOpen).length;
  const activeSocial = Object.values(social).filter(Boolean).length;

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-800">الإعدادات العامة</h2>
            <p className="text-sm text-gray-500 mt-1">إدارة معلومات العيادة وبيانات التواصل وساعات العمل</p>
          </div>
          <div className="flex items-center gap-3">
            {hasChanges && (
              <button
                onClick={reset}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
              >
                <i className="ri-refresh-line" />
                إعادة تعيين
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={saveStatus === "saving" || !hasChanges}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                hasChanges
                  ? "bg-[#2E4E45] text-white hover:bg-[#243d36] disabled:opacity-60 cursor-pointer"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {saveStatus === "saving" ? (
                <><i className="ri-loader-4-line animate-spin" /> جاري الحفظ...</>
              ) : saveStatus === "saved" ? (
                <><i className="ri-check-double-line" /> تم الحفظ!</>
              ) : (
                <><i className="ri-save-line" /> حفظ التغييرات</>
              )}
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "أيام العمل",     value: `${openDays} أيام`,    icon: "ri-calendar-check-line",    color: "text-emerald-600 bg-emerald-50" },
            { label: "قنوات التواصل",  value: "5 قنوات",             icon: "ri-customer-service-2-line", color: "text-[#C8A96E] bg-amber-50" },
            { label: "منصات سوشيال",   value: `${activeSocial} منصات`, icon: "ri-share-forward-line",   color: "text-pink-600 bg-pink-50" },
            { label: "آخر تحديث",      value: hasChanges ? "غير محفوظ" : "محفوظ", icon: "ri-refresh-line", color: hasChanges ? "text-amber-600 bg-amber-50" : "text-[#2E4E45] bg-[#2E4E45]/10" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${stat.color}`}>
                <i className={`${stat.icon} text-lg`} />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Unsaved changes banner */}
        {hasChanges && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200">
            <i className="ri-error-warning-line text-amber-500" />
            <p className="text-sm text-amber-700 flex-1">لديك تغييرات غير محفوظة — اضغط "حفظ التغييرات" لتطبيقها على الموقع</p>
            <button onClick={handleSave} className="text-xs font-semibold text-amber-700 underline cursor-pointer whitespace-nowrap">
              حفظ الآن
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden sticky top-24">
              <div className="px-4 py-3 border-b border-gray-50">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">الأقسام</p>
              </div>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-right px-4 py-3 flex items-center gap-3 transition-all border-b border-gray-50 last:border-0 cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-[#2E4E45]/5 text-[#2E4E45] border-r-2 border-r-[#2E4E45]"
                      : "text-gray-500 hover:bg-gray-50/70 hover:text-gray-700"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    activeTab === tab.id ? "bg-[#2E4E45]/10" : "bg-gray-50"
                  }`}>
                    <i className={`${tab.icon} text-sm`} />
                  </div>
                  <div className="flex-1 min-w-0 text-right">
                    <p className="text-sm font-medium">{tab.label}</p>
                    <p className="text-xs text-gray-400 truncate">{tab.desc}</p>
                  </div>
                  {activeTab === tab.id && (
                    <i className="ri-arrow-left-s-line text-[#2E4E45] flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-100">
              {/* Tab header */}
              {activeTabData && (
                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                  <div className="w-9 h-9 rounded-xl bg-[#2E4E45]/10 flex items-center justify-center">
                    <i className={`${activeTabData.icon} text-[#2E4E45]`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{activeTabData.label}</p>
                    <p className="text-xs text-gray-400">{activeTabData.desc}</p>
                  </div>
                  <div className="mr-auto">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      نشط
                    </span>
                  </div>
                </div>
              )}

              {activeTab === "clinic"   && <ClinicInfoSection    data={info}      onChange={updateInfo} />}
              {activeTab === "hours"    && <WorkingHoursSection  data={hours}     onChange={updateHours} />}
              {activeTab === "contact"  && <ContactSection       data={info}      emergency={emergency} onChangeInfo={updateInfo} onChangeEmergency={updateEmergency} />}
              {activeTab === "social"   && <SocialMediaSection   data={social}    onChange={updateSocial} />}
              {activeTab === "location" && <LocationSection      data={info}      onChange={updateInfo} />}

              {/* Save footer */}
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                <p className="text-xs text-gray-400 flex items-center gap-1.5">
                  <i className="ri-information-line" />
                  التغييرات تُحفظ في المتصفح وتُطبق فوراً على الموقع
                </p>
                <button
                  onClick={handleSave}
                  disabled={!hasChanges || saveStatus === "saving"}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2E4E45] text-white text-sm hover:bg-[#243d36] transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
                >
                  <i className="ri-save-line" />
                  حفظ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
