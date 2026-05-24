import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pencil,
  X,
  AlertTriangle,
  Trash2,
  ShieldCheck,
  RefreshCw,
  RotateCcw,
} from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import TimetableGrid from "../../components/admin/academic/TimetableGrid";
import MainCard from "../../components/MainCard";
import { getItem } from "../../persistence/storage";
import { STORAGE_KEYS } from "../../persistence/storageKeys";
import {
  resetTimetable,
  getClassTimetable,
  getTeacherTimetable,
  saveTimetableSlot,
  clearTimetableSlot,
  SUBJECT_DEFAULT_ROOMS,
} from "../../services/timetableService";

// ── Period labels for the edit modal ────────────────────────────────────────

const PERIOD_LABELS = {
  P1: "Period 1  (08:00–08:50)",
  P2: "Period 2  (08:50–09:40)",
  P3: "Period 3  (09:40–10:30)",
  P4: "Period 4  (10:30–11:20)",
  P5: "Period 5  (11:50–12:40)",
  P6: "Period 6  (12:40–13:30)",
  P7: "Period 7  (13:30–14:20)",
  P8: "Period 8  (14:20–15:10)",
};

// ── Edit Slot Modal ──────────────────────────────────────────────────────────

function EditSlotModal({
  cell,
  classId,
  className,
  classOptions,
  classNamesMap,
  onClose,
  onSaved,
}) {
  const [subjectId, setSubjectId] = useState(
    cell.existingSlot?.subjectId || "",
  );
  const [room, setRoom] = useState(cell.existingSlot?.room || "");
  const [conflict, setConflict] = useState(null);
  const [saving, setSaving] = useState(false);

  const resolvedOption =
    classOptions.find((o) => o.subjectId === subjectId) || null;

  // Auto-fill room when subject changes
  const handleSubjectChange = (id) => {
    setSubjectId(id);
    setConflict(null);
    if (!room || SUBJECT_DEFAULT_ROOMS[cell.existingSlot?.subjectId] === room) {
      setRoom(SUBJECT_DEFAULT_ROOMS[id] || "");
    }
  };

  const handleSave = async () => {
    if (!resolvedOption) return;
    setSaving(true);

    const result = await saveTimetableSlot(
      classId,
      cell.day,
      cell.period,
      {
        subjectId: resolvedOption.subjectId,
        teacherId: resolvedOption.teacherId,
        subject: resolvedOption.subjectName,
        teacher: resolvedOption.teacherName,
        room: room || "Room 101",
      },
      classNamesMap,
    );

    setSaving(false);

    if (result.conflict) {
      setConflict(
        `${resolvedOption.teacherName} is already assigned to ${result.conflict.className} at this period.`,
      );
    } else {
      onSaved();
    }
  };

  const handleForceSave = async () => {
    if (!resolvedOption) return;

    await saveTimetableSlot(
      classId,
      cell.day,
      cell.period,
      {
        subjectId: resolvedOption.subjectId,
        teacherId: resolvedOption.teacherId,
        subject: resolvedOption.subjectName,
        teacher: resolvedOption.teacherName,
        room: room || "Room 101",
      },
      classNamesMap,
      true,
    );
    onSaved();
  };

  const handleClear = async () => {
    await clearTimetableSlot(classId, cell.day, cell.period);
    onSaved();
  };

  const isValid = !!resolvedOption;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(3,4,94,0.35)",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#03045e] px-6 py-5 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-black text-[#caf0f8]/70 uppercase tracking-widest">
              {className} · {cell.day}
            </p>
            <h3 className="text-base font-black text-white mt-1">
              {PERIOD_LABELS[cell.period]}
            </h3>
            {cell.existingSlot && (
              <p className="text-[10px] text-[#caf0f8]/60 mt-1">
                Currently: {cell.existingSlot.subject} ·{" "}
                {cell.existingSlot.teacher}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors mt-0.5"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">
          {/* Subject */}
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1.5">
              Subject <span className="text-red-400">*</span>
            </label>
            <select
              value={subjectId}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-[#caf0f8] text-xs font-bold text-[#03045e] outline-none focus:border-[#0077b6] bg-white transition-colors"
            >
              <option value="">— Select Subject —</option>
              {classOptions.map((o) => (
                <option key={o.subjectId} value={o.subjectId}>
                  {o.subjectName}
                </option>
              ))}
            </select>
          </div>

          {/* Teacher — auto-resolved from Subject Allocation */}
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1.5">
              Teacher
              <span className="ml-2 text-[9px] font-bold text-emerald-500 normal-case tracking-normal">
                auto-resolved
              </span>
            </label>
            <div className="w-full px-4 py-2.5 rounded-2xl border border-[#caf0f8] bg-gray-50 text-xs font-bold text-[#03045e] min-h-[38px] flex items-center">
              {resolvedOption ? (
                resolvedOption.teacherName
              ) : (
                <span className="text-gray-300 font-normal">
                  Select a subject first
                </span>
              )}
            </div>
          </div>

          {/* Room */}
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1.5">
              Room / Venue
            </label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="e.g. Physics Lab 1"
              className="w-full px-4 py-2.5 rounded-2xl border border-[#caf0f8] text-xs font-bold text-[#03045e] outline-none focus:border-[#0077b6] bg-white transition-colors placeholder:font-normal placeholder:text-gray-300"
            />
          </div>

          {/* Conflict Warning */}
          <AnimatePresence>
            {conflict && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50 border border-amber-200"
              >
                <AlertTriangle
                  size={15}
                  className="text-amber-500 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-[10px] font-black text-amber-700">
                    Teacher Conflict Detected
                  </p>
                  <p className="text-[10px] font-semibold text-amber-600 mt-0.5 leading-relaxed">
                    {conflict}
                  </p>
                  <button
                    onClick={handleForceSave}
                    className="mt-2 text-[10px] font-black text-amber-700 underline underline-offset-2 hover:text-amber-900 transition-colors"
                  >
                    Override &amp; Save Anyway →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex items-center gap-2">
          {/* Save */}
          <button
            onClick={handleSave}
            disabled={!isValid || saving}
            className="flex-1 py-2.5 rounded-2xl text-xs font-black transition-all bg-[#03045e] text-white hover:bg-[#0077b6] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "SAVE PERIOD"}
          </button>

          {/* Clear (only if slot is filled) */}
          {cell.existingSlot && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-black border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={13} />
              CLEAR
            </button>
          )}

          {/* Cancel */}
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl text-xs font-black border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            CANCEL
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

const TimetablePage = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [dbTsAssignments, setDbTsAssignments] = useState([]);

  const [viewerType, setViewerType] = useState("class");
  const [selectedClassId, setSelectedClassId] = useState("class-11a");
  const [selectedTeacherId, setSelectedTeacherId] = useState("teach-001");
  const [currentSchedule, setCurrentSchedule] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [editingCell, setEditingCell] = useState(null); // { day, period, existingSlot }

  const [initialized, setInitialized] = useState(false);

  // ── Initial data load (one-time) ──────────────────────────────────────────

  useEffect(() => {
    const bootstrap = () => {
      const allClasses = getItem(STORAGE_KEYS.CLASSES, []);
      const allTeachers = getItem(STORAGE_KEYS.TEACHERS, []);
      const allSubjects = getItem(STORAGE_KEYS.SUBJECTS, []);

      const allTsAssignments = getItem(
        STORAGE_KEYS.TEACHER_SUBJECT_ASSIGNMENTS,
        [],
      );

      setClasses(allClasses || []);
      setTeachers(allTeachers || []);
      setSubjects(allSubjects || []);
      setDbTsAssignments(allTsAssignments || []);
      setInitialized(true);
    };
    bootstrap();
  }, []);

  // ── Load schedule from localStorage whenever selection changes ────────────

  const refreshSchedule = useCallback(async () => {
    if (!initialized) return;
    if (viewerType === "teacher") {
      const schedule = await getTeacherTimetable(selectedTeacherId);
      setCurrentSchedule(schedule);
    } else {
      const schedule = await getClassTimetable(selectedClassId);
      setCurrentSchedule(schedule);
    }
  }, [initialized, viewerType, selectedClassId, selectedTeacherId]);

  useEffect(() => {
    refreshSchedule();
  }, [refreshSchedule]);

  // ── Edit handlers ─────────────────────────────────────────────────────────

  const handleCellClick = (day, period, existingSlot) => {
    if (!editMode || viewerType !== "class") return;
    setEditingCell({ day, period, existingSlot });
  };

  const handleModalSaved = () => {
    setEditingCell(null);
    refreshSchedule();
  };

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const handleReset = async () => {
    if (!showResetConfirm) {
      setShowResetConfirm(true);
      return;
    }
    setShowResetConfirm(false);
    await resetTimetable([], [], []);
    refreshSchedule();
  };

  const classOptions = useMemo(() => {
    const seen = new Set();
    return dbTsAssignments
      .filter((a) => a.classId === selectedClassId)
      .filter((a) => {
        if (seen.has(a.subjectId)) return false;
        seen.add(a.subjectId);
        return true;
      })
      .map((a) => {
        const sub = subjects.find((s) => s.id === a.subjectId);
        const teach = teachers.find((t) => t.id === a.teacherId);
        return sub && teach
          ? {
              subjectId: a.subjectId,
              subjectName: sub.name,
              teacherId: a.teacherId,
              teacherName: teach.metadata?.name || teach.name,
            }
          : null;
      })
      .filter(Boolean);
  }, [selectedClassId, dbTsAssignments, subjects, teachers]);

  const classNamesMap = Object.fromEntries(classes.map((c) => [c.id, c.name]));
  const selectedClass = classes.find((c) => c.id === selectedClassId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-12"
    >
      <AdminPageHeader
        title="Institutional Timetable"
        description="Set, edit, and inspect the weekly class schedule. Teacher assignments are owned by Subject Allocation — timetable only schedules when."
        breadcrumbs={["Admin Portal", "Academic", "Timetable"]}
        actionButton={
          <div className="flex items-center gap-2">
            {viewerType === "class" && (
              <>
                {/* Edit Toggle */}
                <button
                  onClick={() => {
                    setEditMode((m) => !m);
                    setEditingCell(null);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
                    editMode
                      ? "bg-[#03045e] text-white shadow-lg shadow-[#03045e]/20"
                      : "border border-[#0077b6] text-[#0077b6] bg-white hover:bg-[#caf0f8]/20"
                  }`}
                >
                  <Pencil size={13} />
                  {editMode ? "EXIT EDIT" : "EDIT TIMETABLE"}
                </button>

                {/* Reset to default */}
                {editMode && (
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-2xl text-xs font-black border border-red-200 text-red-500 bg-white hover:bg-red-50 transition-colors"
                    title="Reset to seeded defaults"
                  >
                    <RotateCcw size={13} />
                    RESET
                  </button>
                )}
              </>
            )}

            {/* Refresh */}
            <button
              onClick={refreshSchedule}
              className="flex items-center gap-2 border border-gray-200 text-gray-500 px-4 py-2.5 rounded-2xl text-xs font-black bg-white hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={13} />
              REFRESH
            </button>
          </div>
        }
      />

      {/* Status Banner */}
      {editMode ? (
        <div className="flex items-start gap-4 p-4 rounded-3xl bg-blue-50 border border-blue-200 text-blue-700">
          <Pencil size={22} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider">
              Edit Mode Active
            </h4>
            <p className="text-[11px] font-bold mt-1 text-blue-600/90 leading-relaxed">
              Click any period cell to schedule a subject for this period.
              Teacher is auto-resolved from Subject Allocation. Only room can be
              overridden.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-4 p-4 rounded-3xl bg-emerald-50 border border-emerald-100 text-emerald-700">
          <ShieldCheck
            size={22}
            className="text-emerald-500 flex-shrink-0 mt-0.5"
          />
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider">
              Schedule Active — All Conflicts Clear
            </h4>
            <p className="text-[11px] font-bold mt-1 text-emerald-600/90 leading-relaxed">
              Viewing live timetable from institutional schedule. Switch to{" "}
              <strong>Edit Timetable</strong> to modify period assignments.
            </p>
          </div>
        </div>
      )}

      {/* View Selection + Target */}
      <MainCard className="p-4 border border-[#caf0f8]/60 bg-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-2xl">
            <button
              onClick={() => {
                setViewerType("class");
                setEditMode(false);
              }}
              className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${
                viewerType === "class"
                  ? "bg-[#03045e] text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              CLASS VIEW
            </button>
            <button
              onClick={() => {
                setViewerType("teacher");
                setEditMode(false);
              }}
              className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${
                viewerType === "teacher"
                  ? "bg-[#03045e] text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              TEACHER VIEW
            </button>
          </div>

          {/* Selector */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider flex-shrink-0">
              {viewerType === "class" ? "Select Class:" : "Select Teacher:"}
            </span>
            {viewerType === "class" ? (
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full md:w-52 px-4 py-2.5 rounded-2xl border border-[#caf0f8] text-xs font-bold text-[#03045e] outline-none bg-white hover:border-[#0077b6] transition-colors cursor-pointer"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="w-full md:w-52 px-4 py-2.5 rounded-2xl border border-[#caf0f8] text-xs font-bold text-[#03045e] outline-none bg-white hover:border-[#0077b6] transition-colors cursor-pointer"
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </MainCard>

      {/* Timetable Grid */}
      <TimetableGrid
        schedule={currentSchedule}
        type={viewerType}
        editMode={editMode && viewerType === "class"}
        onCellClick={handleCellClick}
      />

      {/* Edit Modal */}
      <AnimatePresence>
        {editingCell && (
          <EditSlotModal
            key="edit-modal"
            cell={editingCell}
            classId={selectedClassId}
            className={selectedClass?.name || selectedClassId}
            classOptions={classOptions}
            classNamesMap={classNamesMap}
            onClose={() => setEditingCell(null)}
            onSaved={handleModalSaved}
          />
        )}
      </AnimatePresence>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md shadow-2xl"
            >
              <h3 className="text-lg font-black text-[#03045e] mb-3">
                Reset Timetable
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Reset this timetable to default? All manual changes will be
                lost.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-6 py-3 rounded-xl text-sm font-black text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    setShowResetConfirm(false);
                    await resetTimetable([], [], []);
                    refreshSchedule();
                  }}
                  className="px-6 py-3 rounded-xl text-sm font-black bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Reset
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TimetablePage;
