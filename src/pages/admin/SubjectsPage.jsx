import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Plus, Filter, ClipboardList } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminStatCard from "../../components/admin/AdminStatCard";
import AcademicFilterBar from "../../components/admin/academic/AcademicFilterBar";
import AcademicTable from "../../components/admin/academic/AcademicTable";
import AdminSectionCard from "../../components/admin/AdminSectionCard";
import SubjectBadge from "../../components/admin/academic/SubjectBadge";
import { getItem } from "../../persistence/storage";
import { STORAGE_KEYS } from "../../persistence/storageKeys";

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [streams, setStreams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const allSubjects = getItem(STORAGE_KEYS.SUBJECTS, []);
      const allStreams = getItem(STORAGE_KEYS.STREAMS, []);
      setSubjects(allSubjects || []);
      setStreams(allStreams || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Helper: Find which stream supports this subject
  const getSubjectStreamsStr = (subjectId) => {
    const matched = streams.filter(str => str.subjectIds.includes(subjectId));
    if (matched.length === 0) return "General Elective";
    return matched.map(m => m.name.split(" ")[0]).join(", ");
  };

  const filteredSubjects = subjects.filter(sub => {
    const streamStr = getSubjectStreamsStr(sub.id);
    const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      streamStr.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "" || sub.type.toLowerCase() === selectedType.toLowerCase();

    return matchesSearch && matchesType;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-12"
    >
      <AdminPageHeader 
        title="Subjects & Curriculum"
        description="Monitor school syllabus, configure global catalogs, and inspect course streams compatibility."
        breadcrumbs={["Admin Portal", "Academic", "Subjects"]}
        actionButton={
          <button className="flex items-center gap-2 bg-[#0077b6] hover:bg-[#0096c7] text-white px-5 py-2.5 rounded-2xl shadow-sm text-xs font-black transition-colors">
            <Plus size={16} />
            <span>ADD COURSE CONFIGURATION</span>
          </button>
        }
      />

      {/* Roster Strengths stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <AdminStatCard 
          title="Global Academic Courses"
          value={subjects.length.toString()}
          badgeText="Verified Catalog"
          badgeType="success"
          icon={BookOpen}
        />
        <AdminStatCard 
          title="Core Subject Comp"
          value={subjects.filter(s => s.type === "core").length.toString()}
          badgeText="Class Priority"
          badgeType="success"
          icon={BookOpen}
          color="#0096c7"
          bg="#ade8f4"
        />
        <AdminStatCard 
          title="Stream Electives"
          value={subjects.filter(s => s.type === "elective").length.toString()}
          badgeText="Specialized Course"
          badgeType="info"
          icon={BookOpen}
          color="#03045e"
          bg="#e0f2fe"
        />
      </div>

      {/* Roster List in Section */}
      <AdminSectionCard>
        <AcademicFilterBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Search subjects by name, code or stream..."
          filterElements={
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="flex items-center gap-2 border border-[#caf0f8] hover:border-[#00b4d8] px-4 py-2.5 rounded-2xl text-xs font-bold text-[#03045e] transition-colors bg-white outline-none"
            >
              <option value="">Filter Course Type...</option>
              <option value="core">Core Subjects</option>
              <option value="elective">Elective Subjects</option>
            </select>
          }
        />

        <div className="mt-6">
          <AcademicTable 
            headers={[
              "Subject Code",
              "Subject Title",
              "Academic Classification",
              "Weekly Periods",
              "Compatible Streams",
              "Room Lab Mapped",
              "Course Status"
            ]}
            items={filteredSubjects}
            isEmpty={filteredSubjects.length === 0}
            emptyTitle="No subjects matched search criteria"
            renderRow={(sub) => (
              <tr key={sub.id} className="hover:bg-[#caf0f8]/10 transition-colors text-xs text-gray-700 font-bold border-b border-[#caf0f8]/40">
                <td className="py-4 px-3 text-[#03045e] font-black first:pl-2">
                  {sub.code}
                </td>
                <td className="py-4 px-3 text-gray-900 font-extrabold">{sub.name}</td>
                <td className="py-4 px-3">
                  <SubjectBadge type={sub.type} name={sub.type} />
                </td>
                <td className="py-4 px-3 text-center">{sub.schedule ? "5 Periods" : "4 Periods"}</td>
                <td className="py-4 px-3 text-gray-500 font-semibold">
                  {getSubjectStreamsStr(sub.id)}
                </td>
                <td className="py-4 px-3 text-[#0077b6]">
                  {sub.room || "Room 101"}
                </td>
                <td className="py-4 px-3 last:pr-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 uppercase tracking-wider">
                    ACTIVE
                  </span>
                </td>
              </tr>
            )}
          />
        </div>
      </AdminSectionCard>
    </motion.div>
  );
};

export default SubjectsPage;
