import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Plus, Users, ShieldAlert } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import OperationsStatCard from "../../components/admin/operations/OperationsStatCard";
import CommitteeCard from "../../components/admin/institutional/CommitteeCard";
import InstitutionalFilterBar from "../../components/admin/institutional/InstitutionalFilterBar";
import AdminSectionCard from "../../components/admin/AdminSectionCard";
import AdminDataTable from "../../components/admin/AdminDataTable";
import { getDataProvider } from "../../data";

const CommitteesPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  // Focus modal state
  const [focusedCommittee, setFocusedCommittee] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const allTeachers = await getDataProvider().getTeachers();
      setTeachers(allTeachers || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Build the list of active institutional committees relationally
  const committeesList = [
    {
      id: "com-discipline",
      name: "Disciplinary & Student Welfare Committee",
      category: "Administrative",
      chairpersonId: "teach-002", // Mrs. Elena Gilbert
      responsibility:
        "Maintains code of conduct, monitors daily attendance audits, and oversees grievance redressal.",
      membersCount: 3,
    },
    {
      id: "com-sports",
      name: "Sports Committee & Athletics Council",
      category: "Extracurricular",
      chairpersonId: "teach-005", // Mr. Satish Kumar
      responsibility:
        "Coordinates intra-school meets, schedules external matches, and manages gymnasium inventory.",
      membersCount: 2,
    },
    {
      id: "com-academic",
      name: "Academic Advisory & Curriculum Board",
      category: "Academic",
      chairpersonId: "teach-001", // Mrs. Sarah Wilson
      responsibility:
        "Conducts subject syllabus checks, reviews term marks, and audits textbook alignment.",
      membersCount: 4,
    },
    {
      id: "com-literary",
      name: "Literary & Cultural Activities Council",
      category: "Cultural",
      chairpersonId: "teach-003", // Mrs. Jenna Sommers
      responsibility:
        "Manages annual school debates, coordinates magazine editing, and hosts cultural programs.",
      membersCount: 3,
    },
  ];

  const getChairpersonName = (tId) => {
    const t = teachers.find((teacher) => teacher.id === tId);
    return t ? t.name : "Senior Coordinator";
  };

  const filteredCommittees = committeesList.filter((com) => {
    const matchesSearch =
      com.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      com.responsibility.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat =
      selectedCategory === "" || com.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-12"
    >
      <AdminPageHeader
        title="Institutional Committees"
        description="Monitor school administrative committees, assign teacher chairpersons, and coordinate disciplinary responsibilities."
        breadcrumbs={["Admin Portal", "Institutional", "Committees"]}
      />

      {/* Roster Strengths stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <OperationsStatCard
          title="Active Committees"
          value={committeesList.length.toString()}
          description="Administrative and cultural boards"
          icon={ShieldCheck}
        />
        <OperationsStatCard
          title="Teachers Mapped"
          value="12 Mapped Faculty"
          description="Active teacher assignments compiled"
          icon={ShieldCheck}
          color="#0096c7"
          bg="#ade8f4"
        />
        <OperationsStatCard
          title="Regulatory Term"
          value="2024-25"
          description="Annual executive board period"
          icon={ShieldCheck}
          color="#03045e"
          bg="#e0f2fe"
        />
      </div>

      {/* Roster Filter tools */}
      <InstitutionalFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search executive committees by title or responsibilities..."
        filterSlots={
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex items-center gap-2 border border-[#caf0f8] hover:border-[#00b4d8] px-4 py-2.5 rounded-2xl text-xs font-bold text-[#03045e] transition-colors bg-white outline-none"
          >
            <option value="">Filter Categories...</option>
            <option value="Administrative">Administrative Board</option>
            <option value="Extracurricular">Extracurricular Committee</option>
            <option value="Academic">Academic Council</option>
            <option value="Cultural">Cultural Committee</option>
          </select>
        }
      />

      {/* Committees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCommittees.map((com) => (
          <CommitteeCard
            key={com.id}
            name={com.name}
            category={com.category}
            coordinator={getChairpersonName(com.chairpersonId)}
            membersCount={com.membersCount}
            responsibility={com.responsibility}
            onManage={() => setFocusedCommittee(com)}
          />
        ))}
      </div>

      {/* Focused Committee Details Section (when clicked) */}
      {focusedCommittee && (
        <AdminSectionCard>
          <div className="flex items-center justify-between border-b border-[#caf0f8] pb-4 mb-4">
            <div>
              <h3 className="text-sm font-black text-[#03045e] uppercase tracking-wider">
                {focusedCommittee.name}
              </h3>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                Assigned teachers and executive members registry
              </p>
            </div>
            <button
              onClick={() => setFocusedCommittee(null)}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors"
            >
              CLOSE PREVIEW
            </button>
          </div>

          <AdminDataTable
            headers={[
              "Staff ID",
              "Teacher Name",
              "Institutional Portfolio",
              "Workload Capacity",
              "Assigned Role",
            ]}
            items={teachers.filter(
              (t) =>
                t.committeeMembership?.includes(
                  focusedCommittee.name.split(" ")[0],
                ) || t.id === focusedCommittee.chairpersonId,
            )}
            isEmpty={false}
            renderRow={(teacher) => (
              <tr
                key={teacher.id}
                className="hover:bg-[#caf0f8]/10 transition-colors text-xs text-gray-700 font-bold border-b border-[#caf0f8]/40"
              >
                <td className="py-4 px-3 text-[#03045e] font-black first:pl-2">
                  {teacher.id}
                </td>
                <td className="py-4 px-3 text-gray-800 font-extrabold">
                  {teacher.name}
                </td>
                <td className="py-4 px-3 text-gray-500 font-semibold">
                  {teacher.qualification || "M.Sc. B.Ed"}
                </td>
                <td className="py-4 px-3 text-center">
                  {teacher.workload || "18 Hours/Week"}
                </td>
                <td className="py-4 px-3 last:pr-2">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      teacher.id === focusedCommittee.chairpersonId
                        ? "bg-amber-50 text-amber-600 border border-amber-100"
                        : "bg-gray-50 text-gray-400 border border-gray-150"
                    }`}
                  >
                    {teacher.id === focusedCommittee.chairpersonId
                      ? "Chairperson"
                      : "Committee Member"}
                  </span>
                </td>
              </tr>
            )}
          />
        </AdminSectionCard>
      )}
    </motion.div>
  );
};

export default CommitteesPage;
