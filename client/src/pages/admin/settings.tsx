import { useState } from "react";
import AdminLayout from "./components/AdminLayout";

const tabs = [
  { id: "general", label: "عام", icon: "ri-settings-3-line" },
  { id: "seo", label: "SEO", icon: "ri-search-line" },
  { id: "pixel", label: "Pixel & Analytics", icon: "ri-bar-chart-box-line" },
  { id: "ai", label: "الذكاء الاصطناعي", icon: "ri-brain-line" },
  { id: "chatbot", label: "الشات بوت", icon: "ri-robot-2-line" },
  { id: "appearance", label: "المظهر", icon: "ri-palette-line" },
];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">الإعدادات</h2>
            <p className="text-sm text-gray-500 mt-1">إدارة إعدادات الموقع واللوحة</p>
          </div>
          {saved && (
            <span className="text-sm text-emerald-600 flex items-center gap-1">
              <i className="ri-check-line" />
              تم الحفظ بنجاح
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-right px-4 py-3 flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0 ${
                    activeTab === tab.id
                      ? "bg-[#2E4E45]/5 text-[#2E4E45] border-r-2 border-r-[#2E4E45]"
                      : "text-gray-500 hover:bg-gray-50/50"
                  }`}
                >
                  <i className={`${tab.icon} text-base`} />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              {activeTab === "general" && (
                <div className="space-y-6">
                  <h3 className="text-base font-bold text-gray-800 mb-4">إعدادات عامة</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">اسم العيادة</label>
                      <input
                        type="text"
                        defaultValue="عيادة الدقة الطبية"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">رقم الهاتف</label>
                      <input
                        type="text"
                        defaultValue="+966 11 234 5678"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">البريد الإلكتروني</label>
                      <input
                        type="email"
                        defaultValue="info@clinic.com"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">رقم WhatsApp</label>
                      <input
                        type="text"
                        defaultValue="+966 50 123 4567"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">العنوان</label>
                    <textarea
                      rows={2}
                      defaultValue="شارع الملك فهد، الرياض، المملكة العربية السعودية"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">ساعات العمل</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {["السبت - الخميس", "الجمعة"].map((day) => (
                        <div key={day} className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 w-24">{day}</span>
                          <input
                            type="text"
                            defaultValue={day === "الجمعة" ? "مغلق" : "09:00 ص - 09:00 م"}
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <input type="checkbox" id="maintenance" className="w-4 h-4 rounded border-gray-300" />
                    <label htmlFor="maintenance" className="text-sm text-gray-700">
                      تفعيل وضع الصيانة (إخفاء الموقع عن الزوار)
                    </label>
                  </div>
                </div>
              )}

              {activeTab === "seo" && (
                <div className="space-y-6">
                  <h3 className="text-base font-bold text-gray-800 mb-4">إعدادات SEO</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">عنوان الموقع (Title)</label>
                    <input
                      type="text"
                      defaultValue="عيادة الدقة الطبية | رعاية صحية متقدمة في الرياض"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10"
                    />
                    <p className="text-xs text-gray-400 mt-1">يظهر في نتائج البحث وعلى المتصفح</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">وصف الموقع (Meta Description)</label>
                    <textarea
                      rows={3}
                      defaultValue="عيادة الدقة الطبية تقدم خدمات طبية متقدمة في الرياض تشمل الجلدية، التجميل، والعلاج بالخلايا. احجز موعدك الآن."
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 resize-none"
                    />
                    <p className="text-xs text-gray-400 mt-1">150-160 حرف للحصول على أفضل نتيجة</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">الكلمات المفتاحية (Keywords)</label>
                    <input
                      type="text"
                      defaultValue="عيادة طبية، جلدية، تجميل، علاج بالخلايا، الرياض"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Canonical URL</label>
                      <input
                        type="text"
                        defaultValue="https://clinic.com"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">صورة المشاركة (OG Image)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <input type="checkbox" id="sitemap" defaultChecked className="w-4 h-4 rounded border-gray-300" />
                    <label htmlFor="sitemap" className="text-sm text-gray-700">
                      توليد Sitemap.xml تلقائياً
                    </label>
                  </div>
                </div>
              )}

              {activeTab === "pixel" && (
                <div className="space-y-6">
                  <h3 className="text-base font-bold text-gray-800 mb-4">Pixel & Analytics</h3>

                  {[
                    { name: "Facebook Pixel", id: "fb_pixel", placeholder: "123456789012345" },
                    { name: "Google Analytics (GA4)", id: "ga4", placeholder: "G-XXXXXXXXXX" },
                    { name: "Google Tag Manager", id: "gtm", placeholder: "GTM-XXXXXX" },
                    { name: "TikTok Pixel", id: "tiktok", placeholder: "XXXXXXXXXXXXXXXX" },
                    { name: "Snapchat Pixel", id: "snapchat", placeholder: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" },
                  ].map((pixel) => (
                    <div key={pixel.id} className="flex items-center gap-4 p-4 rounded-lg border border-gray-100">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">{pixel.name}</label>
                        <input
                          type="text"
                          placeholder={pixel.placeholder}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id={`enable_${pixel.id}`} className="w-4 h-4 rounded border-gray-300" />
                        <label htmlFor={`enable_${pixel.id}`} className="text-sm text-gray-600 whitespace-nowrap">تفعيل</label>
                      </div>
                    </div>
                  ))}

                  <div className="p-4 rounded-lg bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">الأحداث المخصصة للتتبع</h4>
                    <div className="space-y-2">
                      {[
                        { label: "تتبع إكمال الحجز", checked: true },
                        { label: "تتبع الضغط على زر الاتصال", checked: true },
                        { label: "تتبع مشاهدة صفحة الخدمة", checked: true },
                        { label: "تتبع إرسال نموذج التواصل", checked: false },
                      ].map((event) => (
                        <div key={event.label} className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked={event.checked} className="w-4 h-4 rounded border-gray-300" />
                          <span className="text-sm text-gray-600">{event.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "chatbot" && (
                <div className="space-y-6">
                  <h3 className="text-base font-bold text-gray-800 mb-4">إعدادات الشات بوت</h3>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <input type="checkbox" id="chatbot_enabled" defaultChecked className="w-4 h-4 rounded border-gray-300" />
                    <label htmlFor="chatbot_enabled" className="text-sm text-gray-700">
                      تفعيل الشات بوت على الموقع
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">الرسالة الترحيبية</label>
                    <textarea
                      rows={2}
                      defaultValue="مرحباً! أنا مساعد العيادة الذكي. كيف يمكنني مساعدتك اليوم؟"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">ربط بـ WhatsApp Business</label>
                    <input
                      type="text"
                      placeholder="رقم WhatsApp Business"
                      defaultValue="+966 50 123 4567"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">أسئلة وأجوبة شائعة (FAQ)</label>
                    <div className="space-y-3">
                      {[
                        { q: "ما هي ساعات العمل؟", a: "نعمل من السبت إلى الخميس من 9 صباحاً حتى 9 مساءً." },
                        { q: "كيف أحجز موعد؟", a: "يمكنك الحجز عبر الموقع مباشرة أو الاتصال بنا على الرقم الموضح." },
                        { q: "هل تقبلون التأمين؟", a: "نعم، نتعامل مع معظم شركات التأمين الرئيسية." },
                      ].map((faq, i) => (
                        <div key={i} className="p-3 rounded-lg border border-gray-100">
                          <p className="text-sm font-medium text-gray-700 mb-1">{faq.q}</p>
                          <p className="text-sm text-gray-500">{faq.a}</p>
                        </div>
                      ))}
                    </div>
                    <button className="mt-3 text-sm text-[#2E4E45] hover:text-[#C8A96E] transition-colors flex items-center gap-1">
                      <i className="ri-add-line" />
                      إضافة سؤال جديد
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "ai" && (
                <div className="space-y-6">
                  <h3 className="text-base font-bold text-gray-800 mb-4">إعدادات الذكاء الاصطناعي</h3>

                  <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 mb-4">
                    <div className="flex items-start gap-2">
                      <i className="ri-information-line text-violet-600 mt-0.5"></i>
                      <div>
                        <p className="text-sm font-semibold text-violet-800 mb-1">DNA Risk Score AI Report</p>
                        <p className="text-xs text-violet-700 leading-relaxed">
                          عند إدخال مفتاح OpenAI API، سيقوم النظام بإنشاء تقارير طبية شخصية بالذكاء الاصطناعي لمستخدمي DNA Simulator.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">OpenAI API Key (إعداد آمن بالباك اند)</label>
                    <input
                      type="text"
                      disabled
                      value="تتم إدارة المفتاح بأمان في ملف .env على خادم الباك اند"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-100 bg-gray-50 text-gray-500 text-sm focus:outline-none font-medium cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      <i className="ri-shield-check-line ml-1 text-emerald-600"></i>
                      تم نقل معالجة الذكاء الاصطناعي للباك اند بالكامل لحماية المفتاح وتأمين استهلاك الرصيد.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">نموذج الذكاء الاصطناعي</label>
                    <select
                      defaultValue="gpt-4o-mini"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10"
                    >
                      <option value="gpt-4o-mini">GPT-4o Mini (موصى به — سريع واقتصادي)</option>
                      <option value="gpt-4o">GPT-4o (أعلى جودة — أغلى)</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo (أسرع — أقل جودة)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <input type="checkbox" id="ai_enabled" defaultChecked className="w-4 h-4 rounded border-gray-300" />
                    <label htmlFor="ai_enabled" className="text-sm text-gray-700">
                      تفعيل التقارير الذكية في DNA Simulator
                    </label>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <input type="checkbox" id="ai_save_reports" className="w-4 h-4 rounded border-gray-300" />
                    <label htmlFor="ai_save_reports" className="text-sm text-gray-700">
                      حفظ التقارير في لوحة التحكم (يتطلب Supabase)
                    </label>
                  </div>
                </div>
              )}

              {activeTab === "appearance" && (
                <div className="space-y-6">
                  <h3 className="text-base font-bold text-gray-800 mb-4">إعدادات المظهر</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">الألوان الرئيسية</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 mb-1.5 block">اللون الأساسي</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            defaultValue="#2E4E45"
                            className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                          />
                          <input
                            type="text"
                            defaultValue="#2E4E45"
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1.5 block">لون التمييز</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            defaultValue="#C8A96E"
                            className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                          />
                          <input
                            type="text"
                            defaultValue="#C8A96E"
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">شعار الموقع</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-gray-300 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                        <i className="ri-upload-cloud-line text-xl text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500 mb-1">اسحب الصورة هنا أو انقر للاختيار</p>
                      <p className="text-xs text-gray-400">PNG, JPG حتى 2MB</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">صورة الخلفية الرئيسية (Hero)</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-gray-300 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                        <i className="ri-image-line text-xl text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500 mb-1">اختر صورة خلفية للصفحة الرئيسية</p>
                      <p className="text-xs text-gray-400">يفضل 1920x1080 بكسل</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 rounded-lg bg-[#2E4E45] text-white text-sm font-medium hover:bg-[#243d36] transition-colors flex items-center gap-2"
                >
                  <i className="ri-save-line" />
                  حفظ الإعدادات
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}