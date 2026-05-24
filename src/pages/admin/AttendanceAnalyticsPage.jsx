import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckSquare, Users, AlertCircle } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import OperationsStatCard from "../../components/admin/operations/OperationsStatCard";
import AttendanceTrendCard from "../../components/admin/analytics/AttendanceTrendCard";
import AnalyticsCard from "../../components/admin/analytics/AnalyticsCard";
import AnalyticsFilterBar from "../../components/admin/analytics/AnalyticsFilterBar";
import AdminDataTable from "../../components/admin/AdminDataTable";
import AdminSectionCard from "../../components/admin/AdminSectionCard";
import { getDataProvider } from "../../data";

const AttendanceAnalyticsPage = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const provider = getDataProvider();
      const [allStudents, allClasses] = await Promise.all([
        provider.getStudents(),
        provider.getClasses(),
      ]);

      setStudents(allStudents || []);
      setClasses(allClasses || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Resolve daily attendance metrics relationally
  const totalRoster = students.length;
  // Deterministic absent list for today
  const absentStudentsList = students.slice(0, 3).map((stu, index) => ({
    id: stu.id,
    name: stu.name,
    classId: stu.classId || "class-11a",
    reason:
      index === 0
        ? "Fever (Medical Leave submitted)"
        : index === 1
          ? "Family wedding out of town"
          : "Unexcused Absence",
  }));

  const presentCount = Math.max(totalRoster - absentStudentsList.length, 0);
  const dailyRate =
    totalRoster > 0 ? ((presentCount / totalRoster) * 100).toFixed(1) : "95";

  // Filter absent registry
  const filteredAbsents = absentStudentsList.filter((stu) => {
    return selectedClass === "" || stu.classId === selectedClass;
  });

  const getClassName = (cId) => {
    const c = classes.find((cl) => cl.id === cId);
    return c ? c.name : "Class XI-A";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-12"
    >
      <AdminPageHeader
        title="Roster Attendance Insights"
        description="Verify daily present percentages, trace school-wide weekly curves, and audit unexcused absences."
        breadcrumbs={["Admin Portal", "Analytics", "Attendance"]}
      />

      {/* KPI summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <OperationsStatCard
          title="Daily Presence Rate"
          value={`${dailyRate}%`}
          description="Roster active check compliance"
          icon={CheckSquare}
        />
        <OperationsStatCard
          title="Excused Medical Leaves"
          value="2 Leaves"
          description="Approved leave requests today"
          icon={CheckSquare}
          color="#0096c7"
          bg="#ade8f4"
        />
        <OperationsStatCard
          title="Unexcused Defaulters"
          value={absentStudentsList.length.toString()}
          description="Triggers SMS parent alert logs"
          icon={CheckSquare}
          color="#03045e"
          bg="#e0f2fe"
        />
      </div>

      {/* Segment filters */}
      <AnalyticsFilterBar
        selectedClass={selectedClass}
        onClassChange={setSelectedClass}
        classes={classes}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Attendance trend curves */}
        <div className="lg:col-span-2">
          <AttendanceTrendCard
            points={[94, 96, 92, 95, 96, 91, 94]}
            labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
            avgRate={`${dailyRate}% Average`}
          />
        </div>

        {/* Attendance benchmark metrics per section */}
        <AnalyticsCard title="Class-Wise Benchmarks">
          <div className="space-y-4">
            {classes.slice(0, 4).map((cl, idx) => {
              const presentRate =
                idx === 0 ? 96 : idx === 1 ? 92 : idx === 2 ? 98 : 94;
              return (
                <div key={cl.id} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold text-gray-700">
                    <span className="text-gray-500 font-semibold">
                      {cl.name}
                    </span>
                    <span
                      className={
                        presentRate >= 95
                          ? "text-emerald-600 font-black"
                          : "text-amber-600 font-black"
                      }
                    >
                      {presentRate}% Present
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        presentRate >= 95 ? "bg-emerald-400" : "bg-amber-400"
                      }`}
                      style={{ width: `${presentRate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </AnalyticsCard>
      </div>

      {/* Absent students registry */}
      <AdminSectionCard title="Absent Students Audit Log (Today)">
        <AdminDataTable
          headers={[
            "Student ID",
            "Student Name",
            "Class Section",
            "Reason Provided",
            "Status Indicator",
          ]}
          items={filteredAbsents}
          isEmpty={filteredAbsents.length === 0}
          renderRow={(student) => (
            <tr
              key={student.id}
              className="hover:bg-[#caf0f8]/10 transition-colors text-xs text-gray-700 font-bold border-b border-[#caf0f8]/40"
            >
              <td className="py-4 px-3 text-[#03045e] font-black first:pl-2">
                {student.id}
              </td>
              <td className="py-4 px-3 text-gray-800 font-extrabold">
                {student.name}
              </td>
              <td className="py-4 px-3 text-gray-500 font-semibold">
                {getClassName(student.classId)}
              </td>
              <td className="py-4 px-3 text-gray-500 italic font-semibold">
                {student.reason}
              </td>
              <td className="py-4 px-3 last:pr-2">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    student.reason.includes("Medical")
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      : "bg-rose-50 text-rose-600 border border-rose-100"
                  }`}
                >
                  {student.reason.includes("Medical")
                    ? "Excused Absence"
                    : "Unexcused"}
                </span>
              </td>
            </tr>
          )}
        />
      </AdminSectionCard>
    </motion.div>
  );
};

export default AttendanceAnalyticsPage;
