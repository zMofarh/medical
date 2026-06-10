import { useRef, useState } from "react";

interface ImageUploaderProps {
  value: string;
  onChange: (base64: string) => void;
  label?: string;
  shape?: "circle" | "rect";
  aspectRatio?: string; // e.g. "16/9", "1/1"
  placeholder?: string;
}

export default function ImageUploader({
  value,
  onChange,
  label,
  shape = "rect",
  aspectRatio = "16/9",
  placeholder = "اسحب الصورة هنا أو انقر للاختيار",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const processFile = (file: File) => {
    setError("");
    if (!file.type.startsWith("image/")) {
      setError("الملف المختار ليس صورة");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setError("");
  };

  return (
    <div>
      {label && <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {value ? (
        /* ── Preview ── */
        <div className="relative group">
          {shape === "circle" ? (
            <div className="relative w-24 h-24 mx-auto">
              <img
                src={value}
                alt="preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-[#C8A96E]/30"
              />
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => inputRef.current?.click()}
                  className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-gray-700 hover:bg-white transition-colors cursor-pointer"
                  title="تغيير الصورة"
                >
                  <i className="ri-edit-line text-sm" />
                </button>
                <button
                  onClick={handleRemove}
                  className="w-8 h-8 rounded-full bg-red-500/90 flex items-center justify-center text-white hover:bg-red-500 transition-colors cursor-pointer"
                  title="حذف الصورة"
                >
                  <i className="ri-delete-bin-line text-sm" />
                </button>
              </div>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-gray-200" style={{ aspectRatio }}>
              <img
                src={value}
                alt="preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => inputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 bg-white/90 rounded-lg text-sm text-gray-700 hover:bg-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-edit-line" />
                  تغيير
                </button>
                <button
                  onClick={handleRemove}
                  className="flex items-center gap-2 px-3 py-2 bg-red-500/90 rounded-lg text-sm text-white hover:bg-red-500 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-delete-bin-line" />
                  حذف
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ── Upload Zone ── */
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            cursor-pointer transition-all duration-200 border-2 border-dashed rounded-xl
            flex flex-col items-center justify-center gap-2 text-center
            ${shape === "circle" ? "w-24 h-24 rounded-full mx-auto" : "w-full py-8"}
            ${dragging
              ? "border-[#2E4E45] bg-[#2E4E45]/5"
              : "border-gray-200 hover:border-[#2E4E45]/50 hover:bg-gray-50"
            }
          `}
        >
          <div className={`flex items-center justify-center rounded-full bg-gray-100 ${shape === "circle" ? "w-10 h-10" : "w-12 h-12"}`}>
            <i className={`ri-image-add-line text-gray-400 ${shape === "circle" ? "text-lg" : "text-2xl"}`} />
          </div>
          {shape !== "circle" && (
            <>
              <p className="text-sm font-medium text-gray-600">{placeholder}</p>
              <p className="text-xs text-gray-400">PNG, JPG, WEBP — حتى 5 ميجابايت</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-px w-12 bg-gray-200" />
                <span className="text-xs text-gray-400">أو</span>
                <div className="h-px w-12 bg-gray-200" />
              </div>
              <span className="text-xs font-medium text-[#2E4E45] bg-[#2E4E45]/10 px-3 py-1.5 rounded-full">
                اختر من جهازك
              </span>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
          <i className="ri-error-warning-line" />
          {error}
        </p>
      )}
    </div>
  );
}
