import { useState } from "react";
import type { ClinicInfo, EmergencyContact } from "@/hooks/useCMSSettings";

interface Props {
  data: ClinicInfo;
  emergency: EmergencyContact;
  onChangeInfo: (d: ClinicInfo) => void;
  onChangeEmergency: (d: EmergencyContact) => void;
}

const fields = [
  { id: "phone",    label: "رقم الهاتف الرئيسي",  icon: "ri-phone-line",             type: "tel",   placeholder: "+966 11 234 5678", color: "text-emerald-600 bg-emerald-50", testable: true },
  { id: "phone2",   label: "رقم الهاتف الثانوي",   icon: "ri-phone-line",             type: "tel",   placeholder: "+966 11 234 5679", color: "text-emerald-600 bg-emerald-50", testable: false },
  { id: "whatsapp", label: "رقم WhatsApp",          icon: "ri-whatsapp-line",          type: "tel",   placeholder: "+966 50 123 4567", color: "text-green-600 bg-green-50",     testable: true },
  { id: "email",    label: "البريد الإلكتروني",     icon: "ri-mail-line",              type: "email", placeholder: "info@clinic.com",  color: "text-sky-600 bg-sky-50",         testable: true },
  { id: "fax",      label: "رقم الفاكس",            icon: "ri-printer-line",           type: "tel",   placeholder: "+966 11 234 5680", color: "text-gray-500 bg-gray-50",       testable: false },
];

export default function ContactSection({ data, emergency, onChangeInfo, onChangeEmergency }: Props) {
  const [testStatus, setTestStatus] = useState<Record<string, "idle" | "testing" | "ok">>({});

  const handleChange = (field: keyof ClinicInfo, value: string) => {
    onChangeInfo({ ...data, [field]: value });
  };

  const testContact = (type: string) => {
    setTestStatus((prev) => ({ ...prev, [type]: "testing" }));
    setTimeout(() => {
      setTestStatus((prev) => ({ ...prev, [type]: "ok" }));
      setTimeout(() => setTestStatus((prev) => ({ ...prev, [type]: "idle" })), 2000);
    }, 1000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
          <i className="ri-customer-service-2-line text-sky-600 text-lg" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-800">معلومات التواصل</h3>
          <p className="text-xs text-gray-500">أرقام الهاتف والبريد الإلكتروني وقنوات التواصل</p>
        </div>
      </div>

      {/* Contact fields */}
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.id} className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className={`w-5 h-5 rounded flex items-center justify-center text-xs ${field.color}`}>
                    <i className={field.icon} />
                  </span>
                  {field.label}
                </span>
              </label>
              <input
                type={field.type}
                value={(data as Record<string, string>)[field.id] || ""}
                onChange={(e) => handleChange(field.id as keyof ClinicInfo, e.target.value)}
                placeholder={field.placeholder}
                dir="ltr"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
              />
            </div>
            {field.testable && (
              <button
                onClick={() => testContact(field.id)}
                disabled={testStatus[field.id] === "testing"}
                className={`px-3 py-2.5 rounded-lg text-sm border transition-all whitespace-nowrap cursor-pointer ${
                  testStatus[field.id] === "ok"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {testStatus[field.id] === "testing" ? (
                  <i className="ri-loader-4-line animate-spin" />
                ) : testStatus[field.id] === "ok" ? (
                  <><i className="ri-check-line" /> تم</>
                ) : "اختبار"}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100" />

      {/* Booking email */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          <i className="ri-mail-settings-line ml-1.5 text-[#C8A96E]" />
          إعدادات البريد الإلكتروني للحجوزات
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">بريد استقبال الحجوزات</label>
            <input
              type="email"
              defaultValue="bookings@precision-clinic.com"
              dir="ltr"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">بريد الدعم الفني</label>
            <input
              type="email"
              defaultValue="support@precision-clinic.com"
              dir="ltr"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Emergency contact */}
      <div className="p-4 rounded-xl border border-red-100 bg-red-50/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <i className="ri-alarm-warning-line text-red-500" />
            <p className="text-sm font-semibold text-red-700">رقم الطوارئ</p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={emergency.enabled}
              onChange={(e) => onChangeEmergency({ ...emergency, enabled: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-xs text-red-600">تفعيل</span>
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-red-600 mb-1 block">رقم الطوارئ</label>
            <input
              type="tel"
              value={emergency.phone}
              onChange={(e) => onChangeEmergency({ ...emergency, phone: e.target.value })}
              dir="ltr"
              className="w-full px-3 py-2 rounded-lg border border-red-200 text-sm focus:outline-none focus:border-red-400 bg-white"
            />
          </div>
          <div>
            <label className="text-xs text-red-600 mb-1 block">ملاحظة للزوار</label>
            <input
              type="text"
              value={emergency.note}
              onChange={(e) => onChangeEmergency({ ...emergency, note: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-red-200 text-sm focus:outline-none focus:border-red-400 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Notification preferences */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">إشعارات التواصل</label>
        <div className="space-y-2">
          {[
            { label: "إشعار بريد إلكتروني عند كل حجز جديد", checked: true },
            { label: "إشعار واتساب عند كل حجز جديد", checked: true },
            { label: "إشعار عند استلام رسالة تواصل جديدة", checked: true },
            { label: "تقرير يومي بملخص الحجوزات", checked: false },
            { label: "تقرير أسبوعي بإحصائيات الموقع", checked: false },
          ].map((pref) => (
            <label key={pref.label} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input type="checkbox" defaultChecked={pref.checked} className="w-4 h-4 rounded border-gray-300" />
              <span className="text-sm text-gray-700">{pref.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
