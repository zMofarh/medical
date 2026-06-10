import { useState } from "react";
import { aboutTeam } from "@/mocks/aboutData";

type TeamData = typeof aboutTeam;
type TeamMember = TeamData[number];

interface Props {
  data: TeamData;
  onChange: (d: TeamData) => void;
}

export default function AboutTeamEditor({ data, onChange }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const updateMember = (id: string, field: keyof TeamMember, val: string) => {
    onChange(data.map((m) => (m.id === id ? { ...m, [field]: val } : m)));
  };

  const addMember = () => {
    const newId = `tm-${Date.now()}`;
    const newMember: TeamMember = {
      id: newId,
      name: "د. اسم الطبيب",
      role: "التخصص",
      experience: "10 سنوات",
      image: "https://readdy.ai/api/search-image?query=professional%20arab%20doctor%20white%20coat%20clean%20background%20confident%20portrait%20medical%20specialist&width=400&height=500&seq=team-new1&orientation=portrait",
    };
    onChange([...data, newMember]);
    setEditingId(newId);
  };

  const removeMember = (id: string) => {
    onChange(data.filter((m) => m.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const moveMember = (id: string, dir: "up" | "down") => {
    const idx = data.findIndex((m) => m.id === id);
    if (dir === "up" && idx === 0) return;
    if (dir === "down" && idx === data.length - 1) return;
    const newData = [...data];
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    [newData[idx], newData[swapIdx]] = [newData[swapIdx], newData[idx]];
    onChange(newData);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
          <i className="ri-team-line text-sky-600 text-lg" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-gray-800">الكادر الطبي</h3>
          <p className="text-xs text-gray-500">{data.length} أعضاء في الفريق</p>
        </div>
        <button
          onClick={addMember}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#2E4E45] text-white text-xs hover:bg-[#243d36] transition-colors whitespace-nowrap cursor-pointer"
        >
          <i className="ri-user-add-line" />
          إضافة طبيب
        </button>
      </div>

      {/* Team grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {data.map((member, idx) => (
          <div
            key={member.id}
            className={`rounded-xl border overflow-hidden transition-all cursor-pointer ${
              editingId === member.id ? "border-[#2E4E45] ring-2 ring-[#2E4E45]/20" : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setEditingId(editingId === member.id ? null : member.id)}
          >
            <div className="relative" style={{ height: "140px" }}>
              <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 right-2 left-2">
                <p className="text-white text-xs font-bold truncate">{member.name}</p>
                <p className="text-white/70 text-xs truncate">{member.role}</p>
              </div>
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); moveMember(member.id, "up"); }}
                  disabled={idx === 0}
                  className="w-5 h-5 flex items-center justify-center rounded bg-black/40 text-white hover:bg-black/60 transition-colors disabled:opacity-30 cursor-pointer"
                >
                  <i className="ri-arrow-up-s-line text-xs" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); moveMember(member.id, "down"); }}
                  disabled={idx === data.length - 1}
                  className="w-5 h-5 flex items-center justify-center rounded bg-black/40 text-white hover:bg-black/60 transition-colors disabled:opacity-30 cursor-pointer"
                >
                  <i className="ri-arrow-down-s-line text-xs" />
                </button>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeMember(member.id); }}
                className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded bg-red-500/80 text-white hover:bg-red-600 transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-xs" />
              </button>
            </div>
            <div className="p-2 text-center bg-gray-50">
              <p className="text-xs text-gray-500">{member.experience} خبرة</p>
            </div>
          </div>
        ))}
      </div>

      {/* Edit panel */}
      {editingId && (() => {
        const member = data.find((m) => m.id === editingId);
        if (!member) return null;
        return (
          <div className="rounded-xl border border-[#2E4E45]/20 bg-[#2E4E45]/5 p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <i className="ri-edit-line text-[#2E4E45]" />
              <p className="text-sm font-semibold text-[#2E4E45]">تعديل: {member.name}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">الاسم</label>
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) => updateMember(member.id, "name", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">التخصص / الدور</label>
                <input
                  type="text"
                  value={member.role}
                  onChange={(e) => updateMember(member.id, "role", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">سنوات الخبرة</label>
                <input
                  type="text"
                  value={member.experience}
                  onChange={(e) => updateMember(member.id, "experience", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">رابط الصورة</label>
                <input
                  type="url"
                  value={member.image}
                  onChange={(e) => updateMember(member.id, "image", e.target.value)}
                  dir="ltr"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#2E4E45] bg-white transition-all font-mono text-xs"
                />
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
