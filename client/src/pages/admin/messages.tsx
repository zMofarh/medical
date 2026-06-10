import { useState, useEffect } from "react";
import AdminLayout from "./components/AdminLayout";
import { pushNotification } from "@/hooks/useNotifications";
import { getContactMessages, updateContactStatus, deleteContactMessage as deleteContactMessageApi, ContactMessageResponse } from "@/api/contact";

export default function AdminMessages() {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageResponse | null>(null);
  const [messages, setMessages] = useState<ContactMessageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await getContactMessages();
      setMessages(data);
    } catch (error) {
      console.error(error);
      showToast("حدث خطأ أثناء جلب الرسائل");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = messages.filter((m) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.full_name.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q) ||
      (m.email && m.email.toLowerCase().includes(q))
    );
  });

  const handleSelectMessage = async (msg: ContactMessageResponse) => {
    setSelectedMessage(msg);
    setReplyText("");
    
    // Mark as read if it's new
    if (msg.status === "new") {
      try {
        await updateContactStatus(msg.id, "read");
        setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, status: "read" } : m));
      } catch (error) {
        console.error("Failed to mark as read", error);
      }
    }
  };

  const handleReply = async () => {
    if (!replyText.trim() || !selectedMessage) return;
    
    try {
      await updateContactStatus(selectedMessage.id, "replied");
      setMessages((prev) => prev.map((m) => m.id === selectedMessage.id ? { ...m, status: "replied" } : m));
      showToast(`تم إرسال الرد وتحديث الحالة إلى مُجاب`);
      pushNotification({
        type: "message",
        title: "رد على رسالة",
        message: `تم الرد على رسالة ${selectedMessage.full_name}: ${selectedMessage.subject}`,
        link: "/admin/messages",
      });
      setReplyText("");
    } catch (error) {
      console.error(error);
      showToast("حدث خطأ أثناء تحديث حالة الرسالة");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteContactMessageApi(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
      showToast("تم حذف الرسالة بنجاح");
    } catch (error) {
      console.error(error);
      showToast("حدث خطأ أثناء حذف الرسالة");
    }
  };

  const unreadCount = messages.filter((m) => m.status === "new").length;

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return {
      date: d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' }),
      time: d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Toast */}
        {toast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium bg-[#2E4E45] text-white">
            <i className="ri-check-double-line" />{toast}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">الرسائل الواردة</h2>
            <p className="text-sm text-gray-500 mt-1">إدارة رسائل التواصل من الموقع</p>
          </div>
          <span className="text-sm text-gray-400">
            {unreadCount} رسائل غير مقروءة
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400">
                  <i className="ri-search-line" />
                </div>
                <input
                  type="text"
                  placeholder="ابحث في الرسائل..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] focus:ring-2 focus:ring-[#2E4E45]/10"
                />
              </div>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-400">جاري التحميل...</p>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-400">لا توجد رسائل مطابقة</p>
                </div>
              ) : (
                filteredMessages.map((msg) => {
                  const { date, time } = formatDate(msg.created_at);
                  return (
                    <button
                      key={msg.id}
                      onClick={() => handleSelectMessage(msg)}
                      className={`w-full text-right p-3 border-b border-gray-50 last:border-0 transition-colors ${
                        selectedMessage?.id === msg.id
                          ? "bg-[#2E4E45]/5 border-r-2 border-r-[#2E4E45]"
                          : "hover:bg-gray-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-800">{msg.full_name}</span>
                        {msg.status === "new" && (
                          <span className="w-2 h-2 rounded-full bg-[#C8A96E] flex-shrink-0" />
                        )}
                        {msg.status === "replied" && (
                          <i className="ri-reply-all-line text-xs text-[#2E4E45]"></i>
                        )}
                      </div>
                      <p className="text-xs font-medium text-gray-600 mb-0.5">{msg.subject}</p>
                      <p className="text-xs text-gray-400 truncate">{msg.message}</p>
                      <span className="text-[10px] text-gray-300 mt-1 block">{date} — {time}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#2E4E45]/10 flex items-center justify-center">
                      <i className="ri-user-line text-[#2E4E45]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-800">{selectedMessage.full_name}</h3>
                      <p className="text-xs text-gray-400" dir="ltr">{selectedMessage.phone}</p>
                      {selectedMessage.email && (
                        <p className="text-xs text-gray-400">{selectedMessage.email}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatDate(selectedMessage.created_at).date} — {formatDate(selectedMessage.created_at).time}
                  </span>
                </div>

                <div className="mb-4">
                  <span className="text-xs text-gray-400">الموضوع:</span>
                  <p className="text-sm font-medium text-gray-700 mt-1">{selectedMessage.subject}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                {/* Reply box */}
                <div className="mb-4">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={3}
                    placeholder="اكتب ردك هنا (سيتم اعتباره كملاحظة وتحديث حالة الرسالة)..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2E4E45] resize-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReply}
                    disabled={!replyText.trim()}
                    className="px-4 py-2.5 rounded-lg bg-[#2E4E45] text-white text-sm font-medium hover:bg-[#243d36] transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    <i className="ri-reply-line" />
                    تحديث إلى مُجاب
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="px-4 py-2.5 rounded-lg border border-red-200 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-delete-bin-line" />
                    حذف
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
                  <i className="ri-mail-open-line text-2xl text-gray-300" />
                </div>
                <p className="text-gray-400 text-sm">اختر رسالة لعرض التفاصيل</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}