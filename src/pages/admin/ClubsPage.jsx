import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Users, ShieldAlert, Award } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import OperationsStatCard from "../../components/admin/operations/OperationsStatCard";
import ClubOverviewCard from "../../components/admin/institutional/ClubOverviewCard";
import InstitutionalFilterBar from "../../components/admin/institutional/InstitutionalFilterBar";
import AdminSectionCard from "../../components/admin/AdminSectionCard";
import AdminDataTable from "../../components/admin/AdminDataTable";
import AdminEditForm from "../../components/admin/AdminEditForm";
import { getDataProvider } from "../../data";

const ClubsPage = () => {
  const [clubs, setClubs] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  // Enrollment modal
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);

  // Feedback
  const [successBanner, setSuccessBanner] = useState("");
  const [errorBanner, setErrorBanner] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const provider = getDataProvider();
      const [allClubs, allTeachers, allStudents, allEnrollments] =
        await Promise.all([
          provider.getClubs(),
          provider.getTeachers(),
          provider.getStudents(),
          provider.getClubEnrollments(),
        ]);

      setClubs(allClubs || []);
      setTeachers(allTeachers || []);
      setStudents(allStudents || []);
      setEnrollments(allEnrollments || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollStudent = async (formData) => {
    const studentId = formData.studentId;
    if (!studentId || !selectedClub) return;

    try {
      // Rule Verification: Student should only belong to maximum 2 clubs
      const studentEnrollments = enrollments.filter(
        (e) => e.studentId === studentId,
      );

      if (studentEnrollments.length >= 2) {
        const studentObj = students.find((s) => s.id === studentId);
        setErrorBanner(
          `Validation Failed: Student "${studentObj ? studentObj.name : "Selected Student"}" has already joined 2 clubs (maximum limit reached)!`,
        );
        setTimeout(() => setErrorBanner(""), 4500);
        return;
      }

      // Check if already in this specific club
      const alreadyJoined = studentEnrollments.some(
        (e) => e.clubId === selectedClub.id,
      );
      if (alreadyJoined) {
        setErrorBanner(
          "Validation Failed: Student is already registered in this club.",
        );
        setTimeout(() => setErrorBanner(""), 4000);
        return;
      }

      const newRecord = {
        id: `enroll-${Date.now()}`,
        studentId,
        clubId: selectedClub.id,
        enrollmentDate: new Date().toISOString().split("T")[0],
      };

      // Call database insertion
      const provider = getDataProvider();
      await provider.createClubEnrollment(newRecord);
      const updatedEnrollments = await provider.getClubEnrollments();
      setEnrollments(updatedEnrollments);

      const studentObj = students.find((s) => s.id === studentId);
      setSuccessBanner(
        `Successfully registered student ${studentObj ? studentObj.name : "Student"} in the ${selectedClub.name}!`,
      );
      setTimeout(() => setSuccessBanner(""), 4000);
      setEnrollOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  // Helper: Get coordinator teacher name
  const getTeacherName = (tId) => {
    const t = teachers.find((teacher) => teacher.id === tId);
    return t ? t.name : "Unassigned Staff";
  };

  const filteredClubs = clubs.filter((cl) => {
    const matchesSearch =
      cl.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cl.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat =
      selectedCategory === "" || cl.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  const enrollFields = [
    {
      name: "studentId",
      label: "Select Student to Register",
      type: "select",
      options: students.map((s) => s.id),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-12"
    >
      <AdminPageHeader
        title="School Activity Clubs"
        description="Configure institutional activity clubs, assign faculty coordinators, and verify student enrollment quotas."
        breadcrumbs={["Admin Portal", "Institutional", "Clubs"]}
      />

      {/* Success Notification Alert */}
      {successBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-3xl text-emerald-700 text-xs font-black shadow-sm transition-all animate-bounce">
          {successBanner}
        </div>
      )}

      {/* Error Alert */}
      {errorBanner && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-3xl text-rose-700 text-xs font-black shadow-sm transition-all">
          <div className="flex items-center gap-2">
            <ShieldAlert size={14} className="text-rose-500" />
            <span>{errorBanner}</span>
          </div>
        </div>
      )}

      {/* Roster Strengths stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <OperationsStatCard
          title="Active Extracurricular Clubs"
          value={clubs.length.toString()}
          description="Ecosystem activity clubs"
          icon={Award}
        />
        <OperationsStatCard
          title="Total Club Enrolled Cohort"
          value={enrollments.length.toString()}
          description="Students active in club projects"
          icon={Award}
          color="#0096c7"
          bg="#ade8f4"
        />
        <OperationsStatCard
          title="Optimal Enrolment Index"
          value="100%"
          description="Compliance to max 2 clubs limit checked"
          icon={Award}
          color="#03045e"
          bg="#e0f2fe"
        />
      </div>

      {/* Roster Filter tools */}
      <InstitutionalFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search activity clubs by name..."
        filterSlots={
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex items-center gap-2 border border-[#caf0f8] hover:border-[#00b4d8] px-4 py-2.5 rounded-2xl text-xs font-bold text-[#03045e] transition-colors bg-white outline-none"
          >
            <option value="">Filter Categories...</option>
            <option value="Science & Tech">Science & Technology</option>
            <option value="Cultural & Arts">Cultural & Performing Arts</option>
            <option value="Literary & Debate">Literary & Debate Club</option>
            <option value="Environment & Nature">Environment & Eco Club</option>
          </select>
        }
      />

      {/* Clubs Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClubs.map((club) => {
          const clubMembers = enrollments.filter(
            (e) => e.clubId === club.id,
          ).length;

          return (
            <ClubOverviewCard
              key={club.id}
              name={club.name}
              category={club.category || "Co-Curricular"}
              coordinator={getTeacherName(club.coordinatorId)}
              membersCount={clubMembers}
              nextActivity={club.nextActivity}
              onDetails={() => {
                setSelectedClub(club);
                setEnrollOpen(true);
              }}
            />
          );
        })}
      </div>

      {/* Enroll Student Modal */}
      <AdminEditForm
        isOpen={enrollOpen}
        onClose={() => setEnrollOpen(null)}
        title={
          selectedClub
            ? `Enroll Student in "${selectedClub.name}"`
            : "Register Student in Club"
        }
        data={{ studentId: "" }}
        fields={enrollFields}
        onSubmit={handleEnrollStudent}
      />
    </motion.div>
  );
};

export default ClubsPage;
