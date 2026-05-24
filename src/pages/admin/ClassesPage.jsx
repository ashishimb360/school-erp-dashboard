import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Plus,
  Users,
  GraduationCap,
  MapPin,
  BookOpen,
  UserCheck,
  ClipboardList,
  Phone,
  UserCircle,
  X,
  AlertCircle,
  Check,
  ArrowRightLeft,
} from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminStatCard from "../../components/admin/AdminStatCard";
import AdminDataTable from "../../components/admin/AdminDataTable";
import AdminSectionCard from "../../components/admin/AdminSectionCard";
import AdminEditForm from "../../components/admin/AdminEditForm";
import TimetableGrid from "../../components/admin/academic/TimetableGrid";
import { getDataProvider } from "../../data";
import {
  changeClassTeacher,
  getEligibleClassTeachers,
} from "../../services/teacherMappingService";

// Institutional class levels
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

// Derive display level from class name (e.g., "XI-A" -> "11", "Nursery-A" -> "Nursery")
const getLevelFromName = (name) => {
  const prefix = name.split("-")[0];
  if (prefix === "XI") return "11";
  if (prefix === "XII") return "12";
  return prefix;
};

const ClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [streams, setStreams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [dailyAttendance, setDailyAttendance] = useState([]);
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);

  // Navigation selectors
  const [selectedClassLevel, setSelectedClassLevel] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  // Edit state
  const [editClass, setEditClass] = useState(null);

  // Change Class Teacher modal state
  const [ctModalOpen, setCtModalOpen] = useState(false);
  const [ctCandidates, setCtCandidates] = useState([]);
  const [selectedCtId, setSelectedCtId] = useState("");
  const [ctLoading, setCtLoading] = useState(false);
  const [ctError, setCtError] = useState("");
  const [ctSuccess, setCtSuccess] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const provider = getDataProvider();
    try {
      const [
        allClasses,
        allTeachers,
        allStudents,
        allStreams,
        allSubjects,
        allAssignments,
        allAttendance,
        allExams,
        allResults,
      ] = await Promise.all([
        provider.getClasses(),
        provider.getTeachers(),
        provider.getStudents(),
        provider.getStreams(),
        provider.getSubjects(),
        provider.getTeacherSubjectAssignments(),
        provider.getDailyAttendance(),
        provider.getExams(),
        provider.getResults(),
      ]);

      setClasses(allClasses || []);
      setTeachers(allTeachers || []);
      setStudents(allStudents || []);
      setStreams(allStreams || []);
      setSubjects(allSubjects || []);
      setAssignments(allAssignments || []);
      setDailyAttendance(allAttendance || []);
      setExams(allExams || []);
      setResults(allResults || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateClass = async (formData) => {
    if (!editClass) return;
    try {
      const classId = editClass.id;
      const provider = getDataProvider();
      await provider.updateClass(classId, formData);
      const updatedClasses = await provider.getClasses();
      setClasses(updatedClasses || []);
    } catch (e) {
      console.error(e);
    }
  };

  // ── Change Class Teacher handlers ──────────────────────────────────────────

  const openCtModal = async () => {
    if (!selectedClass) return;
    setCtModalOpen(true);
    setCtLoading(true);
    setCtError("");
    setCtSuccess("");
    setSelectedCtId("");
    try {
      const candidates = await getEligibleClassTeachers(selectedClass.id);
      // Exclude current CT from candidates
      const filtered = candidates.filter(
        (t) => t.id !== selectedClass.classTeacherId,
      );
      setCtCandidates(filtered);
    } catch (e) {
      setCtError("Failed to load eligible teachers.");
    } finally {
      setCtLoading(false);
    }
  };

  const closeCtModal = () => {
    setCtModalOpen(false);
    setCtCandidates([]);
    setSelectedCtId("");
    setCtError("");
    setCtSuccess("");
  };

  const handleChangeClassTeacher = async () => {
    if (!selectedClass || !selectedCtId) return;
    setCtLoading(true);
    setCtError("");
    setCtSuccess("");
    try {
      const result = await changeClassTeacher(selectedClass.id, selectedCtId);
      if (result.success) {
        setCtSuccess(
          result.timetableSwapped
            ? `Class teacher changed. Timetable updated (${result.swapCount} day swaps).`
            : "Class teacher changed successfully.",
        );
        // Refresh local class data
        const updatedClasses = await getDataProvider().getClasses();
        setClasses(updatedClasses || []);
        setSelectedCtId("");
        setTimeout(() => closeCtModal(), 1200);
      } else {
        setCtError(result.error || "Change failed.");
      }
    } catch (e) {
      setCtError(e.message || "An unexpected error occurred.");
    } finally {
      setCtLoading(false);
    }
  };

  // ── Derived class navigation ───────────────────────────────────────────────

  const classLevels = useMemo(() => {
    const levels = new Set(classes.map((c) => getLevelFromName(c.name)));
    return CLASS_LEVELS.filter((l) => levels.has(l));
  }, [classes]);

  const availableSections = useMemo(() => {
    if (!selectedClassLevel) return [];
    return classes
      .filter((c) => getLevelFromName(c.name) === selectedClassLevel)
      .map((c) => c.section)
      .filter(Boolean)
      .sort();
  }, [classes, selectedClassLevel]);

  const selectedClass = useMemo(() => {
    if (!selectedClassLevel || !selectedSection) return null;
    return (
      classes.find(
        (c) =>
          getLevelFromName(c.name) === selectedClassLevel &&
          c.section === selectedSection,
      ) || null
    );
  }, [classes, selectedClassLevel, selectedSection]);

  // ── Helper resolvers ───────────────────────────────────────────────────────

  const getTeacher = useCallback(
    (tId) => teachers.find((t) => t.id === tId) || null,
    [teachers],
  );

  const getStream = useCallback(
    (sId) => streams.find((s) => s.id === sId) || null,
    [streams],
  );

  const getSubject = useCallback(
    (subId) => subjects.find((s) => s.id === subId) || null,
    [subjects],
  );

  const getClassStudents = useCallback(
    (cId) => students.filter((s) => s.classId === cId),
    [students],
  );

  const getClassTeacher = useCallback(
    (cId) => {
      const cls = classes.find((c) => c.id === cId);
      return cls?.classTeacherId ? getTeacher(cls.classTeacherId) : null;
    },
    [classes, getTeacher],
  );

  const getSubjectTeachers = useCallback(
    (cId) => {
      const classAssignments = assignments.filter((a) => a.classId === cId);
      const mapping = new Map();
      classAssignments.forEach((a) => {
        const sub = getSubject(a.subjectId);
        const t = getTeacher(a.teacherId);
        if (sub && t) {
          if (!mapping.has(sub.id)) {
            mapping.set(sub.id, { subject: sub, teachers: [] });
          }
          mapping.get(sub.id).teachers.push(t);
        }
      });
      return Array.from(mapping.values());
    },
    [assignments, getSubject, getTeacher],
  );

  // Build timetable schedule for selected class
  const getClassSchedule = useCallback(
    (cId) => {
      const classAssignments = assignments.filter((a) => a.classId === cId);
      return classAssignments.map((a) => {
        const sub = getSubject(a.subjectId);
        const t = getTeacher(a.teacherId);
        return {
          day: a.day,
          period: a.period,
          subject: sub?.name || "",
          teacher: t?.name || "",
          room: a.room || "",
        };
      });
    },
    [assignments, getSubject, getTeacher],
  );

  // Attendance snapshot for selected class
  const getClassAttendanceStats = useCallback(
    (cId) => {
      const classStudents = getClassStudents(cId);
      if (classStudents.length === 0)
        return { present: 0, absent: 0, percentage: 0 };
      const studentIds = new Set(classStudents.map((s) => s.id));
      // Use most recent date
      const dates = [...new Set(dailyAttendance.map((a) => a.date))].sort();
      const latestDate = dates[dates.length - 1];
      if (!latestDate) return { present: 0, absent: 0, percentage: 0 };
      const todayRecords = dailyAttendance.filter(
        (a) => a.date === latestDate && studentIds.has(a.studentId),
      );
      const present = todayRecords.filter((r) => r.status === "present").length;
      const absent = todayRecords.filter((r) => r.status === "absent").length;
      const total = todayRecords.length;
      return {
        present,
        absent,
        percentage: total > 0 ? Math.round((present / total) * 100) : 0,
      };
    },
    [dailyAttendance, getClassStudents],
  );

  // Examination summary for selected class
  const getClassExamSummary = useCallback(
    (cId) => {
      const classStudentIds = new Set(getClassStudents(cId).map((s) => s.id));
      const classResults = results.filter((r) =>
        classStudentIds.has(r.studentId),
      );
      const activeExams = exams.filter((e) => {
        const examResults = classResults.filter((r) => r.examId === e.id);
        return examResults.length > 0;
      });
      return activeExams.slice(0, 3).map((e) => {
        const examResults = classResults.filter((r) => r.examId === e.id);
        const avg =
          examResults.length > 0
            ? Math.round(
                examResults.reduce((s, r) => s + (r.marksObtained || 0), 0) /
                  examResults.length,
              )
            : 0;
        return { ...e, avgMarks: avg, count: examResults.length };
      });
    },
    [exams, results, getClassStudents],
  );

  const classFields = [
    {
      name: "name",
      label: "Class / Section Name",
      type: "text",
      required: true,
    },
    {
      name: "room",
      label: "Location Room Number",
      type: "text",
      required: true,
    },
    {
      name: "classTeacherId",
      label: "Class Teacher Allocation",
      type: "select",
      options: teachers.map((t) => t.id),
    },
  ];

  const classStudents = selectedClass ? getClassStudents(selectedClass.id) : [];
  const classTeacher = selectedClass ? getClassTeacher(selectedClass.id) : null;
  const subjectTeachers = selectedClass
    ? getSubjectTeachers(selectedClass.id)
    : [];
  const schedule = selectedClass ? getClassSchedule(selectedClass.id) : [];
  const attendanceStats = selectedClass
    ? getClassAttendanceStats(selectedClass.id)
    : { present: 0, absent: 0, percentage: 0 };
  const examSummary = selectedClass
    ? getClassExamSummary(selectedClass.id)
    : [];
  const stream = selectedClass ? getStream(selectedClass.stream) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-12"
    >
      <AdminPageHeader
        title="Classes & Sections"
        description="Navigate academic hierarchy, view class dashboards, and manage institutional sections."
        breadcrumbs={["Admin Portal", "Academic", "Classes"]}
        actionButton={
          <button className="flex items-center gap-2 bg-[#0077b6] hover:bg-[#0096c7] text-white px-5 py-2.5 rounded-2xl shadow-sm text-xs font-black transition-colors">
            <Plus size={16} />
            <span>CREATE NEW SECTION</span>
          </button>
        }
      />

      {/* Institutional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <AdminStatCard
          title="Active Sections"
          value={classes.length.toString()}
          badgeText="Term Balanced"
          badgeType="success"
          icon={Building2}
        />
        <AdminStatCard
          title="Avg Section Strength"
          value={Math.round(students.length / (classes.length || 1)).toString()}
          badgeText="Capacity Safe"
          badgeType="info"
          icon={Users}
          color="#0096c7"
          bg="#ade8f4"
        />
        <AdminStatCard
          title="Unassigned Sections"
          value={classes.filter((c) => !c.classTeacherId).length.toString()}
          badgeText="Verification"
          badgeType="neutral"
          icon={Building2}
          color="#03045e"
          bg="#e0f2fe"
        />
      </div>

      {/* ── Academic Navigation Bar ── */}
      <AdminSectionCard>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap size={18} className="text-[#0077b6]" />
            <span className="text-xs font-black text-[#03045e] uppercase tracking-wider">
              Academic Selector
            </span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Class Selector */}
            <select
              value={selectedClassLevel}
              onChange={(e) => {
                setSelectedClassLevel(e.target.value);
                setSelectedSection("");
              }}
              className="border border-[#caf0f8] hover:border-[#00b4d8] px-4 py-2.5 rounded-2xl text-xs font-bold text-[#03045e] transition-colors bg-white outline-none cursor-pointer min-w-[140px]"
            >
              <option value="">Select Class</option>
              {classLevels.map((level) => (
                <option key={level} value={level}>
                  Class {level}
                </option>
              ))}
            </select>

            {/* Section Selector */}
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              disabled={!selectedClassLevel}
              className="border border-[#caf0f8] hover:border-[#00b4d8] px-4 py-2.5 rounded-2xl text-xs font-bold text-[#03045e] transition-colors bg-white outline-none cursor-pointer min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select Section</option>
              {availableSections.map((sec) => (
                <option key={sec} value={sec}>
                  Section {sec}
                </option>
              ))}
            </select>

            {selectedClass && (
              <button
                onClick={() => setEditClass(selectedClass)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#03045e] text-white text-xs font-black hover:bg-[#0077b6] transition-colors"
              >
                <Building2 size={14} />
                EDIT CLASS
              </button>
            )}
          </div>
        </div>
      </AdminSectionCard>

      {/* ── Dashboard or Empty State ── */}
      {!selectedClass ? (
        <AdminSectionCard>
          <div className="text-center py-12">
            <Building2 size={40} className="mx-auto text-[#caf0f8] mb-4" />
            <h3 className="text-sm font-black text-[#03045e] mb-1">
              Select a Class & Section
            </h3>
            <p className="text-xs text-gray-400 font-semibold max-w-sm mx-auto">
              Choose a class level and section to view the academic dashboard,
              enrolled students, teachers, timetable, and attendance.
            </p>
          </div>
        </AdminSectionCard>
      ) : (
        <div className="space-y-6">
          {/* ── Class Overview Card ── */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 bg-white rounded-3xl border border-[#caf0f8]/60 p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-[#03045e] text-white">
                    <GraduationCap size={20} />
                  </span>
                  <div>
                    <h2 className="text-sm font-black text-[#03045e]">
                      {selectedClass.displayName || selectedClass.name}
                    </h2>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                      {stream?.name || "General Stream"} · {selectedClass.room}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-wider">
                    <UserCheck size={12} />
                    {classStudents.length} Students
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#caf0f8]/40 border border-[#caf0f8] text-[#0077b6] text-[10px] font-black uppercase tracking-wider">
                    <MapPin size={12} />
                    {selectedClass.room}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Class Teacher */}
                <div className="p-4 rounded-2xl bg-[#caf0f8]/20 border border-[#caf0f8]/40">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                      Class Teacher
                    </p>
                    <button
                      onClick={openCtModal}
                      className="text-[9px] font-black text-[#0077b6] hover:text-[#03045e] bg-white px-2 py-0.5 rounded-lg border border-[#caf0f8] transition-colors"
                    >
                      Change
                    </button>
                  </div>
                  {classTeacher ? (
                    <div className="space-y-1">
                      <p className="text-xs font-extrabold text-[#03045e]">
                        {classTeacher.metadata?.name || classTeacher.name}
                      </p>
                      <p className="text-[10px] text-gray-500 font-semibold">
                        {classTeacher.metadata?.designation ||
                          classTeacher.designation}
                      </p>
                      <p className="text-[10px] text-[#0077b6] font-bold">
                        {(() => {
                          const ctAssign = assignments.find(
                            (a) =>
                              a.teacherId === classTeacher.id &&
                              a.classId === selectedClass.id,
                          );
                          const ctSub = ctAssign
                            ? subjects.find((s) => s.id === ctAssign.subjectId)
                            : null;
                          return ctSub ? ctSub.name : "Class Teacher";
                        })()}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400">
                        <Phone size={10} />
                        <span>
                          {classTeacher.metadata?.phoneNumber ||
                            classTeacher.phoneNumber}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs font-bold text-gray-400">
                      Unassigned
                    </p>
                  )}
                </div>

                {/* Attendance Snapshot */}
                <div className="p-4 rounded-2xl bg-[#caf0f8]/20 border border-[#caf0f8]/40">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                    Today&apos;s Attendance
                  </p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-black text-[#03045e]">
                      {attendanceStats.percentage}%
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 mb-1">
                      {attendanceStats.present} Present ·{" "}
                      {attendanceStats.absent} Absent
                    </span>
                  </div>
                </div>

                {/* Stream Info */}
                <div className="p-4 rounded-2xl bg-[#caf0f8]/20 border border-[#caf0f8]/40">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                    Academic Stream
                  </p>
                  <p className="text-xs font-extrabold text-[#03045e]">
                    {stream?.name || "General"}
                  </p>
                  <p className="text-[10px] text-gray-500 font-semibold mt-1">
                    {subjectTeachers.length} Subjects Allocated
                  </p>
                </div>
              </div>
            </div>

            {/* Subject Teachers Sidebar */}
            <div className="bg-white rounded-3xl border border-[#caf0f8]/60 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={14} className="text-[#0077b6]" />
                <h3 className="text-[10px] font-black text-[#03045e] uppercase tracking-wider">
                  Subject Teachers
                </h3>
              </div>
              <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                {subjectTeachers.length > 0 ? (
                  subjectTeachers.map(({ subject, teachers: tchs }) => (
                    <div
                      key={subject.id}
                      className="p-2.5 rounded-xl bg-[#caf0f8]/20 border border-[#caf0f8]/40"
                    >
                      <p className="text-[10px] font-black text-[#03045e]">
                        {subject.name}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {tchs.map((t) => (
                          <span
                            key={t.id}
                            className="text-[9px] font-bold text-gray-500 bg-white px-1.5 py-0.5 rounded-md border border-[#caf0f8]/60"
                          >
                            {t.metadata?.name || t.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-gray-400 font-semibold">
                    No subject allocations
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Enrolled Students ── */}
          <AdminSectionCard>
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} className="text-[#0077b6]" />
              <h3 className="text-xs font-black text-[#03045e] uppercase tracking-wider">
                Enrolled Students
              </h3>
              <span className="ml-auto text-[10px] font-black text-[#00b4d8] bg-[#caf0f8]/40 px-2 py-0.5 rounded-lg">
                {classStudents.length} Total
              </span>
            </div>
            <AdminDataTable
              headers={[
                "Adm No.",
                "Student Name",
                "Roll",
                "Parent Contact",
                "Status",
              ]}
              items={classStudents}
              isEmpty={classStudents.length === 0}
              emptyTitle={`No students enrolled in ${selectedClass.name}`}
              renderRow={(stu) => (
                <tr
                  key={stu.id}
                  className="hover:bg-[#caf0f8]/10 transition-colors text-xs text-gray-700 font-bold"
                >
                  <td className="py-3 px-3 text-[#03045e] font-black first:pl-2">
                    {stu.admissionNo}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-[#caf0f8] text-[#03045e]">
                        <UserCircle size={12} />
                      </span>
                      <span className="font-extrabold">{stu.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-gray-500">
                    {stu.rollNumber || "—"}
                  </td>
                  <td className="py-3 px-3 text-[10px] text-gray-400">
                    {stu.phoneNumber || stu.fatherPhone || "—"}
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 uppercase tracking-wider">
                      Active
                    </span>
                  </td>
                </tr>
              )}
            />
          </AdminSectionCard>

          {/* ── Timetable ── */}
          {schedule.length > 0 && (
            <TimetableGrid schedule={schedule} type="class" />
          )}

          {/* ── Examination Summary ── */}
          {examSummary.length > 0 && (
            <AdminSectionCard>
              <div className="flex items-center gap-2 mb-4">
                <ClipboardList size={16} className="text-[#0077b6]" />
                <h3 className="text-xs font-black text-[#03045e] uppercase tracking-wider">
                  Examination Summary
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {examSummary.map((e) => (
                  <div
                    key={e.id}
                    className="p-4 rounded-2xl bg-white border border-[#caf0f8]/60"
                  >
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {e.type}
                    </p>
                    <p className="text-xs font-extrabold text-[#03045e] mt-1">
                      {e.name}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[10px] font-black text-[#0077b6] bg-[#caf0f8]/30 px-2 py-0.5 rounded-lg">
                        Avg: {e.avgMarks}%
                      </span>
                      <span className="text-[10px] text-gray-400 font-semibold">
                        {e.count} Results
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </AdminSectionCard>
          )}
        </div>
      )}

      {/* Edit Form Modal */}
      <AdminEditForm
        isOpen={!!editClass}
        onClose={() => setEditClass(null)}
        title="Edit Section Details"
        data={editClass}
        fields={classFields}
        onSubmit={handleUpdateClass}
      />

      {/* Change Class Teacher Modal */}
      {ctModalOpen && selectedClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl shadow-xl w-full max-w-md mx-4 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#caf0f8]/60">
              <div>
                <h3 className="text-sm font-black text-[#03045e]">
                  Change Class Teacher
                </h3>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                  {selectedClass.name} — Select from teachers already assigned
                  to this section
                </p>
              </div>
              <button
                onClick={closeCtModal}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={16} className="text-gray-400" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-4 max-h-[360px] overflow-y-auto">
              {ctLoading && (
                <p className="text-xs text-gray-400 font-semibold text-center py-6">
                  Loading candidates...
                </p>
              )}

              {ctError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-100 mb-3">
                  <AlertCircle size={14} className="text-rose-500" />
                  <p className="text-[10px] font-bold text-rose-600">
                    {ctError}
                  </p>
                </div>
              )}

              {ctSuccess && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-100 mb-3">
                  <Check size={14} className="text-emerald-500" />
                  <p className="text-[10px] font-bold text-emerald-600">
                    {ctSuccess}
                  </p>
                </div>
              )}

              {!ctLoading && ctCandidates.length === 0 && (
                <p className="text-xs text-gray-400 font-semibold text-center py-6">
                  No eligible teachers found for this section.
                </p>
              )}

              {!ctLoading &&
                ctCandidates.map((t) => {
                  // Find what subject this teacher teaches in this class
                  const tAssign = assignments.find(
                    (a) =>
                      a.teacherId === t.id && a.classId === selectedClass.id,
                  );
                  const sub = tAssign
                    ? subjects.find((s) => s.id === tAssign.subjectId)
                    : null;
                  const isSelected = selectedCtId === t.id;

                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedCtId(t.id)}
                      className={`w-full text-left p-3 rounded-xl border mb-2 transition-all ${
                        isSelected
                          ? "bg-[#03045e] border-[#03045e] text-white"
                          : "bg-white border-[#caf0f8] hover:border-[#0077b6]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p
                            className={`text-xs font-extrabold ${
                              isSelected ? "text-white" : "text-[#03045e]"
                            }`}
                          >
                            {t.metadata?.name || t.name}
                          </p>
                          <p
                            className={`text-[10px] font-semibold mt-0.5 ${
                              isSelected ? "text-white/80" : "text-gray-500"
                            }`}
                          >
                            {t.metadata?.designation || t.designation}
                            {sub && ` · ${sub.name}`}
                          </p>
                        </div>
                        {isSelected && (
                          <Check size={16} className="text-white" />
                        )}
                      </div>
                    </button>
                  );
                })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[#caf0f8]/60 bg-gray-50/50">
              <button
                onClick={closeCtModal}
                className="px-4 py-2 rounded-xl text-[10px] font-black text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleChangeClassTeacher}
                disabled={!selectedCtId || ctLoading || ctSuccess}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#03045e] text-white text-[10px] font-black hover:bg-[#0077b6] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowRightLeft size={12} />
                Confirm Change
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ClassesPage;
