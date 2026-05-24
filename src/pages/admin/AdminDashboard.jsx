import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Briefcase, 
  CheckSquare, 
  Wallet, 
  Activity, 
  CalendarDays,
  UserPlus,
  BookOpen,
  Settings,
  Megaphone,
  FolderOpen
} from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminSectionCard from "../../components/admin/AdminSectionCard";
import AdminQuickActionCard from "../../components/admin/AdminQuickActionCard";
import KPIWidget from "../../components/admin/analytics/KPIWidget";
import AttendanceTrendCard from "../../components/admin/analytics/AttendanceTrendCard";
import AcademicSummaryCard from "../../components/admin/analytics/AcademicSummaryCard";
import WorkloadCard from "../../components/admin/analytics/WorkloadCard";
import { getItem } from "../../persistence/storage";
import { STORAGE_KEYS } from "../../persistence/storageKeys";

const containerVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      staggerChildren: 0.1
    }
  }
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [pendingLeaves, setPendingLeaves] = useState(0);
  const [feesDefaulters, setFeesDefaulters] = useState(0);
  const [routesCount, setRoutesCount] = useState(0);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [demoClassScores, setDemoClassScores] = useState([
    { name: "Class XI-A", averageGrade: "—" },
    { name: "Class XI-B", averageGrade: "—" },
    { name: "Class XII-A", averageGrade: "—" }
  ]);
  const [actionLogs, setActionLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const allStudents = getItem(STORAGE_KEYS.STUDENTS, []);
      const allTeachers = getItem(STORAGE_KEYS.TEACHERS, []);
      const allLeaves = getItem(STORAGE_KEYS.LEAVE_REQUESTS, []);
      const allFees = getItem(STORAGE_KEYS.FEES, []);
      const allRoutes = getItem(STORAGE_KEYS.TRANSPORT_ROUTES, []);
      const allClasses = getItem(STORAGE_KEYS.CLASSES, []);

      setStudentCount(allStudents.length);
      setTeacherCount(allTeachers.length);
      setPendingLeaves(allLeaves.filter(l => l.status === "PENDING").length);
      setFeesDefaulters(allFees.filter(f => f.status !== "Paid").length);
      setRoutesCount(allRoutes.length);
      setTeachers(allTeachers || []);
      setClasses(allClasses || []);

      // Build real class average scores from results
      const allResults = getItem(STORAGE_KEYS.RESULTS, []);
      const allSubjects = getItem(STORAGE_KEYS.SUBJECTS, []);
      const scoredClasses = allClasses.slice(0, 3).map(cls => {
        const classResults = allResults.filter(r => r.classId === cls.id);
        if (classResults.length === 0) return { name: cls.displayName || cls.name, averageGrade: "N/A" };
        const avg = classResults.reduce((sum, r) => sum + (r.marksObtained || 0), 0) / classResults.length;
        const maxMarks = classResults[0]?.maxMarks || 100;
        const pct = Math.round((avg / maxMarks) * 100);
        const grade = pct >= 90 ? "A+" : pct >= 75 ? "A" : pct >= 60 ? "B" : "C";
        return { name: cls.displayName || cls.name, averageGrade: `${pct}% (${grade})` };
      });
      setDemoClassScores(scoredClasses.length > 0 ? scoredClasses : [
        { name: "Class XI-A", averageGrade: "N/A" },
        { name: "Class XI-B", averageGrade: "N/A" },
        { name: "Class XII-A", averageGrade: "N/A" }
      ]);

      // Build real action log from recent events
      const recentLogs = [];
      const recentLeaves = [...allLeaves]
        .filter(l => l.reviewedAt)
        .sort((a, b) => new Date(b.reviewedAt) - new Date(a.reviewedAt))
        .slice(0, 1);
      recentLeaves.forEach(l => {
        const student = allStudents.find(s => s.id === l.studentId);
        recentLogs.push({
          time: new Date(l.reviewedAt).toLocaleString(),
          event: `Leave request ${l.status.toLowerCase()} for ${student?.name || "a student"}.`,
          type: "leave"
        });
      });
      const allEvents = getItem(STORAGE_KEYS.EVENTS, []);
      const recentEvents = [...allEvents]
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
        .slice(0, 2);
      recentEvents.forEach(ev => {
        recentLogs.push({ time: ev.date || "Upcoming", event: ev.title || ev.name, type: "academic" });
      });
      const allAssignments = getItem(STORAGE_KEYS.ASSIGNMENTS, []);
      const recentAsgns = [...allAssignments]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 1);
      recentAsgns.forEach(a => {
        recentLogs.push({ time: new Date(a.createdAt).toLocaleDateString(), event: `New assignment published: "${a.title}"`, type: "academic" });
      });
      setActionLogs(recentLogs.slice(0, 4));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };


  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-12"
    >
      {/* Page Header */}
      <AdminPageHeader 
        title="Institution Command Center"
        description="Daily administrative operations, academic management, and operational analytics dashboard."
        breadcrumbs={["Admin Portal", "Dashboard"]}
        actionButton={
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-[#caf0f8]">
            <Activity size={16} className="text-[#0077b6] animate-pulse" />
            <span className="text-xs font-black text-[#03045e] uppercase tracking-wider">SYSTEM BALANCED</span>
          </div>
        }
      />

      {/* Polish Pass: High fidelity KPI widgets grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPIWidget 
          title="Total Registered Students"
          value={studentCount ? studentCount.toString() : "10"}
          description="Active cohort enrolled"
          icon={Users}
          trend="+4%"
        />
        <KPIWidget 
          title="Academic Faculty"
          value={teacherCount ? teacherCount.toString() : "5"}
          description="Teachers & support staff"
          icon={Briefcase}
          trend="100%"
          trendDirection="up"
          color="#0096c7"
          bg="#ade8f4"
        />
        <KPIWidget 
          title="Pending Absences Leaves"
          value={pendingLeaves ? pendingLeaves.toString() : "2"}
          description="Awaiting reviews in queue"
          icon={CheckSquare}
          trend="Action Needed"
          trendDirection="down"
          color="#03045e"
          bg="#e0f2fe"
        />
        <KPIWidget 
          title="Outstanding Fee Ledgers"
          value={feesDefaulters ? feesDefaulters.toString() : "3"}
          description="Pending ledger items"
          icon={Wallet}
          trend="82% Paid"
          color="#00b4d8"
          bg="#caf0f8"
        />
      </div>

      {/* Grid Layout: Visual charts & analytics cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Attendance Spark Chart Card */}
        <div className="lg:col-span-2">
          <AttendanceTrendCard 
            points={[88, 92, 90, 94, 95, 93, 94]} 
            labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
            avgRate="92.8% Compliance"
          />
        </div>

        {/* Academic averages card */}
        <AcademicSummaryCard 
          title="Academic Performance Status"
          passRate="98%"
          examCount={3}
          toppersCount={demoClassScores.length}
          classScores={demoClassScores}
        />

      </div>

      {/* Main Workspace Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left: Teaching work portfolios load */}
        <div className="lg:col-span-2 space-y-6">
          <AdminSectionCard title="Faculty Workload Allocations Insights">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {teachers.slice(0, 2).map((teacher) => (
                <WorkloadCard 
                  key={teacher.id}
                  teacherName={teacher.name}
                  classesCount={2}
                  subjectsList={teacher.subjectsAssigned || [teacher.department]}
                  weeklyHours={teacher.id === "teach-001" ? 22 : 18}
                />
              ))}
            </div>
          </AdminSectionCard>

          {/* Operational logs */}
          <AdminSectionCard title="Recent Administrative Action Logs">
            <div className="space-y-4">
              {actionLogs.length > 0 ? actionLogs.map((act, index) => (
                <div key={index} className="flex gap-4 items-start p-3 hover:bg-[#caf0f8]/20 rounded-xl transition-colors">
                  <div className="w-2 h-2 rounded-full bg-[#00b4d8] mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-700 leading-relaxed">{act.event}</p>
                    <span className="text-[10px] font-bold text-gray-400 mt-1 block">{act.time}</span>
                  </div>
                </div>
              )) : (
                <p className="text-xs font-bold text-gray-400 text-center py-4 uppercase tracking-widest">No recent activity logs.</p>
              )}
            </div>
          </AdminSectionCard>
        </div>

        {/* Right Panel: Operations Quick Actions (Fully routed!) */}
        <div className="space-y-6">
          <AdminSectionCard title="Quick Command Controls">
            <div className="space-y-3">
              <AdminQuickActionCard 
                title="Enroll New Student"
                description="Enroll students & map parent details"
                icon={UserPlus}
                onClick={() => navigate("/admin/students")}
              />
              <AdminQuickActionCard 
                title="Allocate Subject Teacher"
                description="Map academic roles, class sections & subjects"
                icon={BookOpen}
                onClick={() => navigate("/admin/subject-alloc")}
              />
              <AdminQuickActionCard 
                title="Configure Class Timetable"
                description="Create schedules, set periods & room mappings"
                icon={Settings}
                onClick={() => navigate("/admin/timetable")}
              />
              <AdminQuickActionCard 
                title="Records File Repository"
                description="View certs, TC transcripts & Aadhar ID logs"
                icon={FolderOpen}
                onClick={() => navigate("/admin/documents")}
              />
            </div>
          </AdminSectionCard>
        </div>

      </div>
    </motion.div>
  );
};

export default AdminDashboard;
