import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Plus, CalendarDays, Filter } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import OperationsStatCard from "../../components/admin/operations/OperationsStatCard";
import CalendarEventCard from "../../components/admin/institutional/CalendarEventCard";
import InstitutionalFilterBar from "../../components/admin/institutional/InstitutionalFilterBar";
import AdminEditForm from "../../components/admin/AdminEditForm";
import AdminSectionCard from "../../components/admin/AdminSectionCard";
import { getDataProvider } from "../../data";

const SchoolCalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal
  const [createOpen, setCreateOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState("");

  // Simulated calendar calendar dates selection
  const [activeMonth, setActiveMonth] = useState("July 2026");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const allEvents = await getDataProvider().getEvents();
      setEvents(allEvents || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleEvent = async (formData) => {
    try {
      const newEvent = {
        name: formData.title,
        date: formData.date || "12 July 2026",
        category: formData.category,
        bgGradient: "linear-gradient(135deg, #03045e, #0077b6)",
        status: "happening",
      };

      const provider = getDataProvider();
      await provider.createEvent(newEvent);
      const allEvents = await provider.getEvents();
      setEvents(allEvents || []);

      setSuccessBanner(
        `Academic event "${formData.title}" scheduled successfully!`,
      );
      setTimeout(() => setSuccessBanner(""), 4000);
      setCreateOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredEvents = events.filter((eve) => {
    const matchesSearch = eve.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCat =
      selectedCategory === "" || eve.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  const eventFields = [
    {
      name: "title",
      label: "Academic Event Title",
      type: "text",
      required: true,
    },
    {
      name: "date",
      label: "Date Scheduled (e.g. 15 July 2026)",
      type: "text",
      required: true,
    },
    {
      name: "category",
      label: "Event Category",
      type: "select",
      options: ["Academic", "Cultural", "Holiday", "Competition"],
    },
  ];

  // Render simulated calendar days for a 35-day grid
  const daysArray = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-12"
    >
      <AdminPageHeader
        title="Institutional Academic Calendar"
        description="Schedule academic terms, register holidays, publish competitive events, and coordinate schedules."
        breadcrumbs={["Admin Portal", "Institutional", "Calendar"]}
        actionButton={
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 bg-[#0077b6] hover:bg-[#0096c7] text-white px-5 py-2.5 rounded-2xl shadow-sm text-xs font-black transition-colors"
          >
            <Plus size={16} />
            <span>SCHEDULE NEW EVENT</span>
          </button>
        }
      />

      {/* Success Notification Alert */}
      {successBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-3xl text-emerald-700 text-xs font-black shadow-sm transition-all animate-bounce">
          {successBanner}
        </div>
      )}

      {/* Roster Strengths stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <OperationsStatCard
          title="Scheduled Academic Terms"
          value={events.length.toString()}
          description="Schedules and holidays compiled"
          icon={CalendarDays}
        />
        <OperationsStatCard
          title="Upcoming Examinations"
          value={events
            .filter((e) => e.category === "Academic")
            .length.toString()}
          description="Assessments mapped in calendar"
          icon={CalendarDays}
          color="#0096c7"
          bg="#ade8f4"
        />
        <OperationsStatCard
          title="Institutional Holidays"
          value={events
            .filter((e) => e.category === "Holiday")
            .length.toString()}
          description="Schedules synchronized to roster"
          icon={CalendarDays}
          color="#03045e"
          bg="#e0f2fe"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Monthly Calendar View Block */}
        <AdminSectionCard className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#caf0f8] pb-4 mb-4">
            <h3 className="text-sm font-black text-[#03045e] uppercase tracking-wider">
              {activeMonth}
            </h3>
            <span className="text-[10px] font-bold text-gray-400">
              TERM-I STANDARD
            </span>
          </div>

          {/* Calendar Grid Header */}
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-black text-gray-400 uppercase py-2 bg-gray-50 rounded-xl mb-2">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {daysArray.map((day) => {
              const hasEvent = events.some((e) =>
                e.date?.includes(`${day} July`),
              );

              return (
                <div
                  key={day}
                  className={`aspect-square border rounded-2xl flex flex-col justify-between p-2 hover:bg-[#caf0f8]/20 transition-all cursor-pointer relative ${
                    hasEvent
                      ? "border-amber-200 bg-amber-50/15"
                      : "border-[#caf0f8]/30"
                  }`}
                >
                  <span className="text-[10px] font-black text-[#03045e]">
                    {day}
                  </span>
                  {hasEvent && (
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mx-auto" />
                  )}
                </div>
              );
            })}
          </div>
        </AdminSectionCard>

        {/* Dynamic Events Lists */}
        <div className="space-y-6">
          <InstitutionalFilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Search scheduled events..."
            filterSlots={
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex items-center gap-2 border border-[#caf0f8] hover:border-[#00b4d8] px-4 py-2 rounded-xl text-[10px] font-bold text-[#03045e] transition-colors bg-white outline-none"
              >
                <option value="">Filter Category...</option>
                <option value="Academic">Academic Terms</option>
                <option value="Cultural">Cultural Fests</option>
                <option value="Holiday">Holidays</option>
                <option value="Competition">Competitions</option>
              </select>
            }
          />

          <div className="space-y-4">
            {filteredEvents.map((eve) => (
              <CalendarEventCard
                key={eve.id}
                title={eve.name}
                dateStr={eve.date}
                category={eve.category}
                description="Springdale academic term coordinates mapped successfully."
                type={
                  eve.category === "Holiday"
                    ? "holiday"
                    : eve.category === "Academic"
                      ? "exam"
                      : "standard"
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* Schedule Event Modal */}
      <AdminEditForm
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Schedule Institutional Event"
        data={{ title: "", date: "15 July 2026", category: "Academic" }}
        fields={eventFields}
        onSubmit={handleScheduleEvent}
      />
    </motion.div>
  );
};

export default SchoolCalendarPage;
