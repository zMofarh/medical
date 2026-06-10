import { useRef, useEffect, useCallback, useState } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
  dir?: "rtl" | "ltr";
}

interface ToolbarButton {
  command: string;
  value?: string;
  icon: string;
  title: string;
  group?: string;
}

const toolbarGroups: ToolbarButton[][] = [
  [
    { command: "bold", icon: "ri-bold", title: "عريض" },
    { command: "italic", icon: "ri-italic", title: "مائل" },
    { command: "underline", icon: "ri-underline", title: "تسطير" },
    { command: "strikeThrough", icon: "ri-strikethrough", title: "شطب" },
  ],
  [
    { command: "formatBlock", value: "h2", icon: "ri-h-2", title: "عنوان 2" },
    { command: "formatBlock", value: "h3", icon: "ri-h-3", title: "عنوان 3" },
    { command: "formatBlock", value: "p", icon: "ri-paragraph", title: "فقرة" },
    { command: "formatBlock", value: "blockquote", icon: "ri-double-quotes-r", title: "اقتباس" },
  ],
  [
    { command: "insertUnorderedList", icon: "ri-list-unordered", title: "قائمة نقطية" },
    { command: "insertOrderedList", icon: "ri-list-ordered", title: "قائمة مرقمة" },
    { command: "indent", icon: "ri-indent-increase", title: "زيادة المسافة" },
    { command: "outdent", icon: "ri-indent-decrease", title: "تقليل المسافة" },
  ],
  [
    { command: "justifyRight", icon: "ri-align-right", title: "محاذاة يمين" },
    { command: "justifyCenter", icon: "ri-align-center", title: "توسيط" },
    { command: "justifyLeft", icon: "ri-align-left", title: "محاذاة يسار" },
    { command: "justifyFull", icon: "ri-align-justify", title: "ضبط" },
  ],
  [
    { command: "removeFormat", icon: "ri-format-clear", title: "مسح التنسيق" },
    { command: "undo", icon: "ri-arrow-go-back-line", title: "تراجع" },
    { command: "redo", icon: "ri-arrow-go-forward-line", title: "إعادة" },
  ],
];

const fontSizes = ["14px", "16px", "18px", "20px", "24px", "28px", "32px"];

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "اكتب المحتوى هنا...",
  minHeight = 400,
  dir = "rtl",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalUpdate = useRef(false);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("https://");
  const [linkText, setLinkText] = useState("");
  const savedSelection = useRef<Range | null>(null);

  // Sync value → editor (only when external change)
  useEffect(() => {
    if (!editorRef.current) return;
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const updateCounts = useCallback((html: string) => {
    const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    setCharCount(text.length);
    setWordCount(text ? text.split(/\s+/).length : 0);
  }, []);

  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    isInternalUpdate.current = true;
    const html = editorRef.current.innerHTML;
    onChange(html);
    updateCounts(html);
  }, [onChange, updateCounts]);

  const updateActiveFormats = useCallback(() => {
    const formats = new Set<string>();
    if (document.queryCommandState("bold")) formats.add("bold");
    if (document.queryCommandState("italic")) formats.add("italic");
    if (document.queryCommandState("underline")) formats.add("underline");
    if (document.queryCommandState("strikeThrough")) formats.add("strikeThrough");
    if (document.queryCommandState("insertUnorderedList")) formats.add("insertUnorderedList");
    if (document.queryCommandState("insertOrderedList")) formats.add("insertOrderedList");
    if (document.queryCommandState("justifyRight")) formats.add("justifyRight");
    if (document.queryCommandState("justifyCenter")) formats.add("justifyCenter");
    if (document.queryCommandState("justifyLeft")) formats.add("justifyLeft");
    if (document.queryCommandState("justifyFull")) formats.add("justifyFull");
    setActiveFormats(formats);
  }, []);

  const execCommand = useCallback((command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    handleInput();
    updateActiveFormats();
  }, [handleInput, updateActiveFormats]);

  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelection.current = sel.getRangeAt(0).cloneRange();
      const selectedText = sel.toString();
      setLinkText(selectedText || "");
    }
  }, []);

  const restoreSelection = useCallback(() => {
    if (savedSelection.current) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(savedSelection.current);
    }
  }, []);

  const handleInsertLink = useCallback(() => {
    if (!linkUrl || linkUrl === "https://") return;
    restoreSelection();
    editorRef.current?.focus();
    if (linkText && !window.getSelection()?.toString()) {
      document.execCommand("insertHTML", false, `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`);
    } else {
      document.execCommand("createLink", false, linkUrl);
      const links = editorRef.current?.querySelectorAll(`a[href="${linkUrl}"]`);
      links?.forEach((link) => {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      });
    }
    handleInput();
    setShowLinkModal(false);
    setLinkUrl("https://");
    setLinkText("");
  }, [linkUrl, linkText, restoreSelection, handleInput]);

  const handleFontSize = useCallback((size: string) => {
    editorRef.current?.focus();
    document.execCommand("fontSize", false, "7");
    const fontElements = editorRef.current?.querySelectorAll('font[size="7"]');
    fontElements?.forEach((el) => {
      const span = document.createElement("span");
      span.style.fontSize = size;
      el.parentNode?.insertBefore(span, el);
      while (el.firstChild) span.appendChild(el.firstChild);
      el.parentNode?.removeChild(el);
    });
    handleInput();
  }, [handleInput]);

  const handleInsertHR = useCallback(() => {
    editorRef.current?.focus();
    document.execCommand("insertHTML", false, "<hr/><p><br/></p>");
    handleInput();
  }, [handleInput]);

  // Init counts
  useEffect(() => {
    if (value) updateCounts(value);
  }, []);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white" dir="rtl">
      {/* Toolbar */}
      <div className="border-b border-gray-100 bg-gray-50/80 px-3 py-2 flex flex-wrap items-center gap-1">
        {toolbarGroups.map((group, gi) => (
          <div key={gi} className="flex items-center gap-0.5">
            {group.map((btn) => (
              <button
                key={btn.command + (btn.value || "")}
                onMouseDown={(e) => {
                  e.preventDefault();
                  execCommand(btn.command, btn.value);
                }}
                title={btn.title}
                className={`w-7 h-7 flex items-center justify-center rounded-md text-sm transition-all cursor-pointer
                  ${activeFormats.has(btn.command)
                    ? "bg-[#2E4E45] text-white"
                    : "text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                  }`}
              >
                <i className={`${btn.icon} text-sm`} />
              </button>
            ))}
            {gi < toolbarGroups.length - 1 && (
              <div className="w-px h-5 bg-gray-200 mx-1" />
            )}
          </div>
        ))}

        {/* Separator */}
        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* Font Size */}
        <select
          onChange={(e) => handleFontSize(e.target.value)}
          defaultValue=""
          className="h-7 border border-gray-200 rounded-md px-1.5 text-xs text-gray-600 bg-white cursor-pointer focus:outline-none focus:border-[#2E4E45]"
          title="حجم الخط"
        >
          <option value="" disabled>حجم</option>
          {fontSizes.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Link */}
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            saveSelection();
            setShowLinkModal(true);
          }}
          title="إدراج رابط"
          className="w-7 h-7 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-all cursor-pointer"
        >
          <i className="ri-link text-sm" />
        </button>

        {/* Unlink */}
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            execCommand("unlink");
          }}
          title="إزالة الرابط"
          className="w-7 h-7 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-all cursor-pointer"
        >
          <i className="ri-link-unlink text-sm" />
        </button>

        {/* HR */}
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            handleInsertHR();
          }}
          title="خط فاصل"
          className="w-7 h-7 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-all cursor-pointer"
        >
          <i className="ri-separator text-sm" />
        </button>
      </div>

      {/* Editor Area */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          dir={dir}
          onInput={handleInput}
          onKeyUp={updateActiveFormats}
          onMouseUp={updateActiveFormats}
          onFocus={updateActiveFormats}
          className="outline-none px-5 py-4 text-sm text-gray-800 leading-relaxed overflow-y-auto"
          style={{
            minHeight,
            fontFamily: "inherit",
          }}
          data-placeholder={placeholder}
        />
        {/* Placeholder */}
        <style>{`
          [data-placeholder]:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af;
            pointer-events: none;
            position: absolute;
            top: 1rem;
            right: 1.25rem;
          }
          [contenteditable] h2 { font-size: 1.25rem; font-weight: 800; margin: 1rem 0 0.5rem; color: #1f2937; }
          [contenteditable] h3 { font-size: 1.1rem; font-weight: 700; margin: 0.75rem 0 0.4rem; color: #374151; }
          [contenteditable] p { margin: 0.4rem 0; }
          [contenteditable] blockquote { border-right: 4px solid #2E4E45; padding: 0.5rem 1rem; margin: 0.75rem 0; background: #f0faf7; border-radius: 0 0.5rem 0.5rem 0; color: #2E4E45; font-style: italic; }
          [contenteditable] ul { list-style: disc; padding-right: 1.5rem; margin: 0.5rem 0; }
          [contenteditable] ol { list-style: decimal; padding-right: 1.5rem; margin: 0.5rem 0; }
          [contenteditable] li { margin: 0.25rem 0; }
          [contenteditable] a { color: #2E4E45; text-decoration: underline; }
          [contenteditable] hr { border: none; border-top: 2px solid #e5e7eb; margin: 1rem 0; }
          [contenteditable] strong { font-weight: 700; }
          [contenteditable] em { font-style: italic; }
        `}</style>
      </div>

      {/* Footer: word/char count */}
      <div className="border-t border-gray-100 px-4 py-2 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>{wordCount} كلمة</span>
          <span>{charCount} حرف</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <div className="w-3 h-3 flex items-center justify-center">
            <i className="ri-information-line text-xs" />
          </div>
          <span>Ctrl+B عريض · Ctrl+I مائل · Ctrl+U تسطير</span>
        </div>
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm" dir="rtl">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-gray-800">إدراج رابط</h4>
              <button
                onClick={() => setShowLinkModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer"
              >
                <i className="ri-close-line text-base" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">نص الرابط (اختياري)</label>
                <input
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
                  placeholder="نص يظهر للقارئ..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">عنوان URL</label>
                <input
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E4E45]"
                  placeholder="https://..."
                  dir="ltr"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowLinkModal(false)}
                className="flex-1 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg cursor-pointer hover:bg-gray-50 whitespace-nowrap"
              >
                إلغاء
              </button>
              <button
                onClick={handleInsertLink}
                className="flex-1 py-2 bg-[#2E4E45] text-white text-sm font-bold rounded-lg cursor-pointer whitespace-nowrap"
              >
                إدراج
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
