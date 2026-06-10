import { useState, useCallback } from "react";
import AdminLayout from "@/pages/admin/components/AdminLayout";
import { useCMSAbout } from "@/hooks/useCMSAbout";
import AboutHeroEditor from "./components/AboutHeroEditor";
import AboutStoryEditor from "./components/AboutStoryEditor";
import AboutMissionEditor from "./components/AboutMissionEditor";
import AboutValuesEditor from "./components/AboutValuesEditor";
import AboutTeamEditor from "./components/AboutTeamEditor";
import AboutTimelineEditor from "./components/AboutTimelineEditor";
import AboutAwardsEditor from "./components/AboutAwardsEditor";

const tabs = [
  { id: "hero",     label: "Hero",           icon: "ri-layout-top-line",  desc: "الصورة والعنوان الرئيسي" },
  { id: "story",    label: "القصة",          icon: "ri-book-open-line",   desc: "قصة التأسيس" },
  { id: "mission",  label: "الرسالة والرؤية", icon: "ri-flag-2-line",      desc: "الرسالة، الرؤية، الفلسفة" },
  { id: "values",   label: "القيم",          icon: "ri-heart-line",       desc: "المبادئ والقيم" },
  { id: "team",     label: "الفريق",         icon: "ri-team-line",        desc: "الكادر الطبي" },
  { id: "timeline", label: "المسيرة",        icon: "ri-history-line",     desc: "Timeline التاريخي" },
  { id: "awards",   label: "الإنجازات",      icon: "ri-trophy-line",      desc: "الاعتمادات والشراكات" },
];

export default function AdminCMSAbout() {
  const [activeTab, setActiveTab] = useState("hero");

  const {
    hero, story, mission, values, timeline, team, awards,
    saveStatus, hasChanges,
    updateHero, updateStory, updateMission, updateValues, updateTimeline, updateTeam, updateAwards,
    save, reset,
  } = useCMSAbout();

  const handleSave = useCallback(async () => {
    await save({ hero, story, mission, values, timeline, team, awards });
  }, [save, hero, story, mission, values, timeline, team, awards]);

  const activeTabData = tabs.find((t) => t.id === activeTab);

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">إدارة صفحة "من نحن"</h2>
            <p className="text-sm text-gray-500 mt-1">تحرير محتوى صفحة About — الفريق، الرؤية، القيم، المسيرة</p>
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
            <a
              href="/about"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              <i className="ri-external-link-line" />
              معاينة الصفحة
            </a>
            <button
              onClick={handleSave}
              disabled={saveStatus === "saving" || !hasChanges}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                hasChanges
                  ? "bg-[#2E4E45] text-white hover:bg-[#243d36] disabled:opacity-60"
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

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "أقسام الصفحة",  value: "7 أقسام",   icon: "ri-layout-masonry-line", color: "text-[#2E4E45] bg-[#2E4E45]/10" },
            { label: "أعضاء الفريق",  value: `${team.length} أطباء`,   icon: "ri-team-line",          color: "text-sky-600 bg-sky-50" },
            { label: "محطات المسيرة", value: `${timeline.length} محطات`, icon: "ri-history-line",       color: "text-[#C8A96E] bg-amber-50" },
            { label: "الإنجازات",     value: `${awards.length} إنجازات`, icon: "ri-trophy-line",        color: "text-emerald-600 bg-emerald-50" },
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
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden sticky top-24">
              <div className="px-4 py-3 border-b border-gray-50">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">أقسام الصفحة</p>
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

              {/* Section editors — pass data + onChange */}
              {activeTab === "hero"     && <AboutHeroEditor     data={hero}     onChange={updateHero} />}
              {activeTab === "story"    && <AboutStoryEditor    data={story}    onChange={updateStory} />}
              {activeTab === "mission"  && <AboutMissionEditor  data={mission}  onChange={updateMission} />}
              {activeTab === "values"   && <AboutValuesEditor   data={values}   onChange={updateValues} />}
              {activeTab === "team"     && <AboutTeamEditor     data={team}     onChange={updateTeam} />}
              {activeTab === "timeline" && <AboutTimelineEditor data={timeline} onChange={updateTimeline} />}
              {activeTab === "awards"   && <AboutAwardsEditor   data={awards}   onChange={updateAwards} />}

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
