import React, { useState, useEffect } from "react";
import TeacherModuleHeader from "../../components/teacher/TeacherModuleHeader";
import ClubSummaryCards from "../../components/clubs/ClubSummaryCards";
import ClubTable from "../../components/clubs/ClubTable";
import ClubDetailPanel from "../../components/clubs/ClubDetailPanel";
import { clubsService } from "../../services/clubsService";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const ClubsActivitiesPage = () => {
  const { user } = useAuth();
  const teacherId = user?.linkedEntityId || "teach-001";

  const [clubs, setClubs] = useState([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [upcomingEventsCount, setUpcomingEventsCount] = useState(0);
  const [selectedClub, setSelectedClub] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadTeacherWorkspace = async () => {
    setLoading(true);
    try {
      // 1. Get clubs managed by this teacher
      const managedClubs = await clubsService.getTeacherClubs(teacherId);
      setClubs(managedClubs);

      // 2. Aggregate active members & upcoming activities count
      let memberCountAcc = 0;
      let eventCountAcc = 0;

      for (const club of managedClubs) {
        const membersList = await clubsService.getClubMembers(club.id);
        memberCountAcc += membersList.length;

        const eventsList = await clubsService.getClubEvents(club.id);
        eventCountAcc += eventsList.filter(e => e.status === "Upcoming").length;
      }

      setTotalMembers(memberCountAcc);
      setUpcomingEventsCount(eventCountAcc);

      // Refresh currently selected club reference if it exists
      if (selectedClub) {
        const refreshed = managedClubs.find(c => c.id === selectedClub.id);
        if (refreshed) {
          setSelectedClub(refreshed);
        }
      }
    } catch (e) {
      console.error("Failed to load teacher clubs workspace:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeacherWorkspace();
  }, [teacherId]);

  return (
    <div className="space-y-6 pb-12">
      <TeacherModuleHeader 
        titleKey="nav.clubs_activities"
        descriptionKey="Coordinate and manage school clubs, committees, and extracurricular activities."
        helperContentEn="Manage co-curricular memberships, schedule club events, and post advisory updates for students."
        helperContentHi="सह-पाठ्यचर्या सदस्यता प्रबंधित करें, क्लब कार्यक्रम निर्धारित करें और छात्रों के लिए सलाह अपडेट पोस्ट करें।"
      />

      {loading && clubs.length === 0 ? (
        <div className="flex items-center justify-center h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00b4d8]"></div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Top Summary Metrics */}
          <ClubSummaryCards 
            clubs={clubs} 
            totalMembers={totalMembers} 
            upcomingEventsCount={upcomingEventsCount} 
          />

          <AnimatePresence mode="wait">
            {!selectedClub ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <ClubTable 
                  clubs={clubs} 
                  selectedClubId={selectedClub?.id} 
                  onSelectClub={(club) => setSelectedClub(club)} 
                />
              </motion.div>
            ) : (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm"
              >
                <ClubDetailPanel 
                  club={selectedClub} 
                  onBack={() => {
                    setSelectedClub(null);
                    loadTeacherWorkspace(); // Refresh metrics when going back
                  }} 
                  teacherId={teacherId}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default ClubsActivitiesPage;
