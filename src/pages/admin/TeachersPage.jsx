import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  UserPlus,
  Phone,
  Mail,
  BookOpen,
  ChevronRight,
  Briefcase,
  Users,
  GraduationCap,
} from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminStatCard from "../../components/admin/AdminStatCard";
import AdminFilterBar from "../../components/admin/AdminFilterBar";
import AdminDataTable from "../../components/admin/AdminDataTable";
import AdminSectionCard from "../../components/admin/AdminSectionCard";
import AdminProfilePreview from "../../components/admin/AdminProfilePreview";
import AdminEditForm from "../../components/admin/AdminEditForm";
import {
  getAllTeachers,
  updateTeacherProfile,
} from "../../services/teacherService";
import { getItem } from "../../persistence/storage";
import { STORAGE_KEYS } from "../../persistence/storageKeys";

// Class levels supported by the institution
const CLASS_LEVELS = [
  "Nursery",
  "LKG",
  "UKG",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
];
const SECTIONS = ["A", "B", "C", "D"];

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [loading, setLoading] = useState(true);

  // Preview & Edit states
  const [previewTeacher, setPreviewTeacher] = useState(null);
  const [editTeacher, setEditTeacher] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const allTeachers = await getAllTeachers();
      const allClasses = getItem(STORAGE_KEYS.CLASSES, []);
      const allAssignments = getItem(
        STORAGE_KEYS.TEACHER_SUBJECT_ASSIGNMENTS,
        [],
      );
      const allSubjects = getItem(STORAGE_KEYS.SUBJECTS, []);

      setTeachers(allTeachers || []);
      setClasses(allClasses || []);
      setAssignments(allAssignments || []);
      setSubjectsList(allSubjects || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTeacher = async (formData) => {
    if (!editTeacher) return;
    try {
      const updated = await updateTeacherProfile(editTeacher.id, formData);
      if (updated) {
        setTeachers((prev) =>
          prev.map((t) => (t.id === editTeacher.id ? { ...t, ...updated } : t)),
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Helper to resolve subjects taught by a teacher relationally
  const getTeacherSubjects = useCallback(
    (teacherId) => {
      const teacherAssignments = assignments.filter(
        (a) => a.teacherId === teacherId,
      );
      const resolved = teacherAssignments.map((a) => {
        const sub = subjectsList.find((s) => s.id === a.subjectId);
        return sub ? sub.name : null;
      });
      return [...new Set(resolved.filter(Boolean))];
    },
    [assignments, subjectsList],
  );

  // Helper to resolve class-section assignments for a teacher (academic operational view)
  const getTeacherClassSections = useCallback(
    (teacherId) => {
      const teacherAssignments = assignments.filter(
        (a) => a.teacherId === teacherId,
      );
      const classSectionMap = new Map();

      teacherAssignments.forEach((a) => {
        const cls = classes.find((c) => c.id === a.classId);
        if (cls) {
          const key = `${cls.name}`;
          if (!classSectionMap.has(key)) {
            classSectionMap.set(key, {
              className: cls.name,
              section: cls.section,
              classId: cls.id,
              subjects: [],
            });
          }
          const sub = subjectsList.find((s) => s.id === a.subjectId);
          if (sub) {
            classSectionMap.get(key).subjects.push(sub.name);
          }
        }
      });

      return Array.from(classSectionMap.values());
    },
    [assignments, classes, subjectsList],
  );

  // Helper to resolve Class Teacher authority (Indian Institutional Terminology)
  const getClassTeacherAssignment = useCallback(
    (teacherId) => {
      const ownedClass = classes.find((c) => c.classTeacherId === teacherId);
      return ownedClass
        ? {
            name: ownedClass.name,
            section: ownedClass.section,
            id: ownedClass.id,
          }
        : null;
    },
    [classes],
  );

  // Check if teacher is associated with selected class-section
  const isTeacherAssociatedWithClassSection = useCallback(
    (teacherId, classLevel, section) => {
      if (!classLevel || !section) return true;

      // Check if class teacher of this class-section
      const ownedClass = classes.find(
        (c) =>
          c.classTeacherId === teacherId &&
          c.name === `${classLevel}-${section}`,
      );
      if (ownedClass) return true;

      // Check if teaches any subject in this class-section
      const targetClassId = `class-${classLevel.toLowerCase()}${section.toLowerCase()}`;
      const teachesInClass = assignments.some(
        (a) => a.teacherId === teacherId && a.classId === targetClassId,
      );

      return teachesInClass;
    },
    [classes, assignments],
  );

  // Get contextual empty state message
  const getEmptyStateMessage = () => {
    if (selectedClass && selectedSection) {
      return `No teachers currently assigned to Class ${selectedClass} Section ${selectedSection}`;
    }
    if (selectedClass) {
      return `No teachers found for Class ${selectedClass}. Try selecting a specific section.`;
    }
    return "No faculty found matching search terms";
  };

  const filteredTeachers = useMemo(() => {
    return teachers.filter((tch) => {
      const subjects = getTeacherSubjects(tch.id).join(" ");
      const classSections = getTeacherClassSections(tch.id);
      const classSectionNames = classSections
        .map((cs) => cs.className)
        .join(" ");

      const matchesSearch =
        searchTerm === "" ||
        tch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tch.department || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        subjects.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classSectionNames.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesClassSection = (() => {
        if (selectedClass === "") return true;
        if (selectedSection !== "") {
          return isTeacherAssociatedWithClassSection(
            tch.id,
            selectedClass,
            selectedSection,
          );
        }
        // Class selected + All Sections → match any section of that class
        return SECTIONS.some((sec) =>
          isTeacherAssociatedWithClassSection(tch.id, selectedClass, sec),
        );
      })();

      return matchesSearch && matchesClassSection;
    });
  }, [
    teachers,
    searchTerm,
    selectedClass,
    selectedSection,
    getTeacherClassSections,
    getTeacherSubjects,
    isTeacherAssociatedWithClassSection,
  ]);

  const teacherFields = [
    { name: "name", label: "Faculty Full Name", type: "text", required: true },
    {
      name: "phoneNumber",
      label: "Primary Contact Number",
      type: "text",
      required: true,
    },
    {
      name: "email",
      label: "Institutional Email",
      type: "email",
      required: true,
    },
    {
      name: "department",
      label: "Department",
      type: "select",
      options: [
        "Science",
        "Mathematics",
        "Humanities",
        "Commerce",
        "Languages",
      ],
    },
    {
      name: "qualification",
      label: "Professional Qualification",
      type: "text",
    },
    { name: "experience", label: "Years of Experience", type: "text" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-12"
    >
      <AdminPageHeader
        title="Faculty & Staff Directory"
        description="Manage institutional teacher records, class teacher mappings, and academic assignments."
        breadcrumbs={["Admin Portal", "User Management", "Teachers"]}
        actionButton={
          <button className="flex items-center gap-2 bg-[#0077b6] hover:bg-[#0096c7] text-white px-5 py-2.5 rounded-2xl shadow-sm text-xs font-black transition-colors">
            <UserPlus size={16} />
            <span>ADD FACULTY MEMBER</span>
          </button>
        }
      />

      {/* Stats Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <AdminStatCard
          title="Active Faculty"
          value={teachers.length.toString()}
          badgeText="Fully Staffed"
          badgeType="success"
          icon={Briefcase}
        />
        <AdminStatCard
          title="Class Teachers Mapped"
          value={`${classes.filter((c) => c.classTeacherId).length} / ${classes.length}`}
          badgeText="Class Charge"
          badgeType="success"
          icon={Briefcase}
          color="#0096c7"
          bg="#ade8f4"
        />
        <AdminStatCard
          title="Total Subject Allocations"
          value={assignments.length.toString()}
          badgeText="Optimal Load"
          badgeType="info"
          icon={Briefcase}
          color="#03045e"
          bg="#e0f2fe"
        />
      </div>

      {/* Directory Table inside Section Card */}
      <AdminSectionCard>
        {/* Search and filter bar */}
        <AdminFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Search faculty by name, employee ID, subject, class..."
          filterButton={
            <div className="flex items-center gap-2">
              {/* Class Filter */}
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setSelectedSection(""); // Reset section when class changes
                }}
                className="flex items-center gap-2 border border-[#caf0f8] hover:border-[#00b4d8] px-4 py-2.5 rounded-2xl text-xs font-bold text-[#03045e] transition-colors bg-white outline-none cursor-pointer"
              >
                <option value="">All Classes</option>
                {CLASS_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    Class {level}
                  </option>
                ))}
              </select>

              {/* Section Filter */}
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                disabled={!selectedClass}
                className="flex items-center gap-2 border border-[#caf0f8] hover:border-[#00b4d8] px-4 py-2.5 rounded-2xl text-xs font-bold text-[#03045e] transition-colors bg-white outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">All Sections</option>
                {SECTIONS.map((sec) => (
                  <option key={sec} value={sec}>
                    Section {sec}
                  </option>
                ))}
              </select>
            </div>
          }
        />

        {/* Modular Table Shell */}
        <div className="mt-6">
          <AdminDataTable
            headers={[
              "Employee ID",
              "Faculty Name",
              "Teaching Assignments",
              "Class Teacher",
              "Subjects",
              "Status",
              "Actions",
            ]}
            items={filteredTeachers}
            isEmpty={filteredTeachers.length === 0}
            emptyTitle={getEmptyStateMessage()}
            renderRow={(tch) => {
              const subjects = getTeacherSubjects(tch.id);
              const classSections = getTeacherClassSections(tch.id);
              const classTeacherRole = getClassTeacherAssignment(tch.id);

              return (
                <tr
                  key={tch.id}
                  className="hover:bg-[#caf0f8]/10 transition-colors text-xs text-gray-700 font-bold"
                >
                  <td className="py-4 px-3 text-[#03045e] font-black first:pl-2">
                    {tch.id}
                  </td>
                  <td className="py-4 px-3">
                    <button
                      onClick={() =>
                        setPreviewTeacher({
                          ...tch,
                          subjects,
                          isClassTeacher: !!classTeacherRole,
                          classAssigned: classTeacherRole?.name,
                          dept: tch.department,
                          phone: tch.phoneNumber,
                        })
                      }
                      className="hover:text-[#0077b6] text-left transition-colors font-extrabold focus:outline-none"
                    >
                      {tch.name}
                    </button>
                  </td>
                  <td className="py-4 px-3">
                    <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                      {classSections.length > 0 ? (
                        classSections.slice(0, 3).map((cs, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#caf0f8]/60 text-[#03045e] text-[10px] font-black border border-[#caf0f8]"
                            title={cs.subjects.join(", ")}
                          >
                            <GraduationCap size={10} />
                            {cs.className}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-[10px]">—</span>
                      )}
                      {classSections.length > 3 && (
                        <span className="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-500 text-[10px] font-black">
                          +{classSections.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    {classTeacherRole ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 uppercase tracking-wider">
                        <Users size={10} />
                        {classTeacherRole.name}
                      </span>
                    ) : (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold text-gray-400 bg-gray-50 uppercase tracking-wider">
                        None Assigned
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-3">
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {subjects.slice(0, 4).map((sub, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-[#caf0f8] text-[#03045e] text-[10px] font-black"
                        >
                          {sub}
                        </span>
                      ))}
                      {subjects.length > 4 && (
                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-500 text-[10px] font-black">
                          +{subjects.length - 4}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 uppercase tracking-wider">
                      Active
                    </span>
                  </td>
                  <td className="py-4 px-3 text-right last:pr-2">
                    <button
                      onClick={() =>
                        setPreviewTeacher({
                          ...tch,
                          subjects,
                          isClassTeacher: !!classTeacherRole,
                          classAssigned: classTeacherRole?.name,
                          dept: tch.department,
                          phone: tch.phoneNumber,
                        })
                      }
                      className="text-[#0077b6] hover:text-[#03045e] transition-colors p-1.5 hover:bg-[#caf0f8]/40 rounded-lg"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              );
            }}
          />
        </div>
      </AdminSectionCard>

      {/* Sliding Profile Drawer */}
      <AdminProfilePreview
        isOpen={!!previewTeacher}
        onClose={() => setPreviewTeacher(null)}
        type="teacher"
        data={previewTeacher}
        onEdit={(teacherData) => setEditTeacher(teacherData)}
      />

      {/* Centred Edit Modal */}
      <AdminEditForm
        isOpen={!!editTeacher}
        onClose={() => setEditTeacher(null)}
        title="Edit Faculty Record"
        data={editTeacher}
        fields={teacherFields}
        onSubmit={handleUpdateTeacher}
      />
    </motion.div>
  );
};

export default TeachersPage;
