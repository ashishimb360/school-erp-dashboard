import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  X,
  FileText,
  Send,
  Printer,
  AlertCircle,
  TrendingUp,
  Users,
  IndianRupee,
  Download,
  Edit2,
  Check,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import OperationsFilterBar from "../../components/admin/operations/OperationsFilterBar";
import AdminSectionCard from "../../components/admin/AdminSectionCard";
import AdminDataTable from "../../components/admin/AdminDataTable";
import AdminEditForm from "../../components/admin/AdminEditForm";
import StatusBadge from "../../components/admin/operations/StatusBadge";
import { getDataProvider } from "../../data";

const LEVEL_DISPLAY = (level) => {
  if (!level) return "";
  if (["Nursery", "LKG", "UKG"].includes(level)) return level;
  return `Class ${level}`;
};

// Fee months - monthly billing cycle (April-March academic year)
const FEE_MONTHS = [
  {
    id: "apr",
    name: "April 2026",
    label: "April 2026 Invoice",
    vacation: false,
  },
  { id: "may", name: "May 2026", label: "May 2026 Invoice", vacation: false },
  {
    id: "jun",
    name: "June 2026",
    label: "June 2026 Invoice",
    vacation: true,
    vacationType: "SUMMER",
  },
  { id: "jul", name: "July 2026", label: "July 2026 Invoice", vacation: false },
  {
    id: "aug",
    name: "August 2026",
    label: "August 2026 Invoice",
    vacation: false,
  },
  {
    id: "sep",
    name: "September 2026",
    label: "September 2026 Invoice",
    vacation: false,
  },
  {
    id: "oct",
    name: "October 2026",
    label: "October 2026 Invoice",
    vacation: false,
  },
  {
    id: "nov",
    name: "November 2026",
    label: "November 2026 Invoice",
    vacation: false,
  },
  {
    id: "dec",
    name: "December 2026",
    label: "December 2026 Invoice",
    vacation: true,
    vacationType: "WINTER",
  },
  {
    id: "jan",
    name: "January 2027",
    label: "January 2027 Invoice",
    vacation: false,
  },
  {
    id: "feb",
    name: "February 2027",
    label: "February 2027 Invoice",
    vacation: false,
  },
  {
    id: "mar",
    name: "March 2027",
    label: "March 2027 Invoice",
    vacation: false,
  },
];

const TABS = [
  { id: "dashboard", label: "Collection Dashboard" },
  { id: "structure", label: "Fee Structure" },
  { id: "demand", label: "Demand Generation" },
  { id: "receipts", label: "Receipts" },
  { id: "reports", label: "Reports" },
];

const STAGE_ORDER = [
  "foundation",
  "primary",
  "middle",
  "secondary",
  "senior_secondary",
];
const STAGE_LABEL = {
  foundation: "Foundation (Nursery–UKG)",
  primary: "Primary (Class 1–5)",
  middle: "Middle (Class 6–8)",
  secondary: "Secondary (Class 9–10)",
  senior_secondary: "Senior Secondary (Class XI–XII)",
};

// ─── FeeStructureTab component ────────────────────────────────────────────────
function FeeStructureTab({ feeStructures, onSave }) {
  const [expandedStage, setExpandedStage] = useState("foundation");
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState(null);

  const grouped = useMemo(() => {
    const map = {};
    STAGE_ORDER.forEach((s) => {
      map[s] = [];
    });
    feeStructures.forEach((fs) => {
      if (map[fs.stage]) map[fs.stage].push(fs);
    });
    return map;
  }, [feeStructures]);

  const startEdit = (fs) => {
    setEditingId(fs.id);
    const vals = {};
    fs.feeHeads.forEach((h) => {
      vals[h.id] = String(h.annualAmount);
    });
    setEditValues(vals);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleSave = async (fs) => {
    setSaving(true);
    const updatedHeads = fs.feeHeads.map((h) => ({
      ...h,
      annualAmount: parseInt(editValues[h.id] || "0", 10) || 0,
    }));
    await onSave(fs.id, { feeHeads: updatedHeads });
    setSaving(false);
    setEditingId(null);
    setEditValues({});
    setSavedId(fs.id);
    setTimeout(() => setSavedId(null), 2500);
  };

  const computeAnnual = (fs, vals) =>
    fs.feeHeads.reduce(
      (sum, h) =>
        sum + (parseInt((vals || {})[h.id] ?? h.annualAmount, 10) || 0),
      0,
    );

  return (
    <div className="space-y-4">
      {/* Info banner */}
      <div className="flex items-start gap-3 bg-sky-50 border border-sky-100 rounded-2xl p-4">
        <Info size={15} className="text-[#0077b6] flex-shrink-0 mt-0.5" />
        <p className="text-xs font-bold text-[#0077b6]">
          Fee amounts set here are reflected immediately in the Student & Parent
          portals. All values are annual amounts (₹). Monthly invoices are
          auto-calculated as 1/12th of each head (with vacation adjustments
          applied automatically).
        </p>
      </div>

      {STAGE_ORDER.map((stage) => {
        const rows = grouped[stage] || [];
        if (!rows.length) return null;
        const isOpen = expandedStage === stage;
        return (
          <div
            key={stage}
            className="border-2 border-slate-100 rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => setExpandedStage(isOpen ? null : stage)}
              className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <span className="text-xs font-black text-[#03045e] uppercase tracking-wider">
                {STAGE_LABEL[stage]}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-slate-400">
                  {rows.length} template{rows.length > 1 ? "s" : ""}
                </span>
                {isOpen ? (
                  <ChevronUp size={16} className="text-slate-400" />
                ) : (
                  <ChevronDown size={16} className="text-slate-400" />
                )}
              </div>
            </button>

            {isOpen && (
              <div className="divide-y divide-slate-100">
                {rows.map((fs) => {
                  const isEditing = editingId === fs.id;
                  const justSaved = savedId === fs.id;
                  const annual = isEditing
                    ? computeAnnual(fs, editValues)
                    : fs.feeHeads.reduce((s, h) => s + h.annualAmount, 0);
                  const monthly = Math.round(annual / 12);

                  return (
                    <div key={fs.id} className="px-5 py-4">
                      {/* Header row */}
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-sm font-black text-[#03045e]">
                            {fs.label}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                            Annual:{" "}
                            <span className="text-[#0077b6]">
                              ₹{annual.toLocaleString()}
                            </span>
                            &nbsp;·&nbsp;Monthly avg:{" "}
                            <span className="text-[#0077b6]">
                              ₹{monthly.toLocaleString()}
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {justSaved && (
                            <span className="flex items-center gap-1 text-emerald-600 text-[10px] font-black">
                              <Check size={12} /> Saved
                            </span>
                          )}
                          {isEditing ? (
                            <>
                              <button
                                onClick={cancelEdit}
                                className="border-2 border-slate-200 text-slate-500 px-3 py-1.5 rounded-xl text-[10px] font-black hover:bg-slate-50 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSave(fs)}
                                disabled={saving}
                                className="bg-[#0077b6] hover:bg-[#0096c7] text-white px-4 py-1.5 rounded-xl text-[10px] font-black transition-colors disabled:opacity-60"
                              >
                                {saving ? "Saving…" : "Save Changes"}
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => startEdit(fs)}
                              className="flex items-center gap-1.5 border-2 border-[#0077b6]/20 text-[#0077b6] hover:bg-[#caf0f8]/40 px-3 py-1.5 rounded-xl text-[10px] font-black transition-colors"
                            >
                              <Edit2 size={11} /> Edit Amounts
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Fee heads grid */}
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {fs.feeHeads.map((head) => {
                          const val = isEditing
                            ? (editValues[head.id] ?? String(head.annualAmount))
                            : String(head.annualAmount);
                          const isOneTime = !!head.applicableMonths;
                          return (
                            <div
                              key={head.id}
                              className={`rounded-xl border-2 p-3 ${
                                isEditing
                                  ? "border-[#0077b6]/30 bg-[#caf0f8]/20"
                                  : "border-slate-100 bg-white"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider leading-tight">
                                  {head.label}
                                </span>
                                {isOneTime && (
                                  <span className="text-[8px] font-black text-amber-600 bg-amber-50 border border-amber-100 px-1 py-0.5 rounded uppercase">
                                    1×
                                  </span>
                                )}
                              </div>
                              {isEditing ? (
                                <div className="flex items-center gap-1">
                                  <span className="text-xs font-black text-slate-400">
                                    ₹
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    value={val}
                                    onChange={(e) =>
                                      setEditValues((prev) => ({
                                        ...prev,
                                        [head.id]: e.target.value,
                                      }))
                                    }
                                    className="w-full border-2 border-[#0077b6]/40 rounded-lg px-2 py-1 text-xs font-black text-[#03045e] outline-none focus:border-[#0077b6] bg-white"
                                  />
                                </div>
                              ) : (
                                <p className="text-sm font-black text-[#03045e]">
                                  ₹{head.annualAmount.toLocaleString()}
                                </p>
                              )}
                              {!isOneTime && (
                                <p className="text-[9px] text-slate-400 font-bold mt-0.5">
                                  ≈ ₹
                                  {Math.round(
                                    (isEditing
                                      ? parseInt(val || "0", 10) || 0
                                      : head.annualAmount) / 12,
                                  ).toLocaleString()}
                                  /mo
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const FeeManagementPage = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [feeStructures, setFeeStructures] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  // Edit states
  const [editFee, setEditFee] = useState(null);
  const [successBanner, setSuccessBanner] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const provider = getDataProvider();
      const [allFees, allStudents, allClasses, allStructures] =
        await Promise.all([
          provider.getFees(),
          provider.getStudents(),
          provider.getClasses(),
          provider.getFeeStructures(),
        ]);
      setFees(allFees || []);
      setStudents(allStudents || []);
      setClasses(allClasses || []);
      setFeeStructures(allStructures || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveFeeStructure = useCallback(async (id, updates) => {
    try {
      const provider = getDataProvider();
      const updated = await provider.updateFeeStructure(id, updates);
      setFeeStructures((prev) =>
        prev.map((fs) => (fs.id === id ? { ...fs, ...updated } : fs)),
      );
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleUpdateFee = async (formData) => {
    if (!editFee) return;
    try {
      const feeId = editFee.id;
      const total = parseFloat(editFee.totalAmount);
      const paid = parseFloat(formData.paidAmount) || 0;
      let status = "Unpaid";
      if (paid >= total) status = "Paid";
      else if (paid > 0) status = "Partially Paid";

      const provider = getDataProvider();
      await provider.updateFee(feeId, { paidAmount: paid, status });
      const updatedFees = await provider.getFees();
      setFees(updatedFees || []);
      setEditFee(null);
      setSuccessBanner("Payment recorded successfully!");
      setTimeout(() => setSuccessBanner(""), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  // Derive fee records with student/class info — show consolidated monthly invoices
  const resolvedFees = useMemo(() => {
    return fees.map((fee, idx) => {
      const stu = students.find((s) => s.id === fee.studentId);
      const cls = classes.find((c) => c.id === stu?.classId);
      // Mock month based on index for variety
      const month = FEE_MONTHS[idx % FEE_MONTHS.length];
      // Mock due date based on month (last day of each month)
      const dueDate = new Date();
      const monthMap = {
        apr: 3,
        may: 4,
        jun: 5,
        jul: 6,
        aug: 7,
        sep: 8,
        oct: 9,
        nov: 10,
        dec: 11,
        jan: 0,
        feb: 1,
        mar: 2,
      };
      dueDate.setMonth(
        monthMap[month.id],
        new Date(dueDate.getFullYear(), monthMap[month.id] + 1, 0).getDate(),
      );
      return {
        ...fee,
        admissionNo:
          stu?.admissionNo || `ADM${String(idx + 1).padStart(4, "0")}`,
        studentName: stu?.name || "Unknown Student",
        classLevel: cls?.level || "",
        classSection: cls?.section || "",
        classId: stu?.classId || "",
        feeHead: "Monthly Fee", // ← Consolidated
        feeHeadId: "monthly",
        month: month.name,
        monthId: month.id,
        monthLabel: month.label,
        isVacationMonth: month.vacation,
        vacationType: month.vacationType,
        dueDate: dueDate.toISOString().split("T")[0],
        balance: fee.totalAmount - fee.paidAmount,
      };
    });
  }, [fees, students, classes]);

  // Available filter options
  const availableLevels = useMemo(() => {
    const ORDER = [
      "Nursery",
      "LKG",
      "UKG",
      ...Array.from({ length: 12 }, (_, i) => String(i + 1)),
      "XI",
      "XII",
    ];
    const seen = new Set(classes.map((c) => c.level).filter(Boolean));
    return ORDER.filter((l) => seen.has(l));
  }, [classes]);

  const availableSections = useMemo(() => {
    if (!selectedLevel) return [];
    const seen = new Set();
    classes
      .filter((c) => c.level === selectedLevel)
      .forEach((c) => {
        if (c.section) seen.add(c.section);
      });
    return [...seen].sort();
  }, [classes, selectedLevel]);

  const activeFiltersCount = [
    selectedLevel,
    selectedSection,
    selectedStatus,
    selectedMonth,
  ].filter(Boolean).length;

  const filteredFees = useMemo(() => {
    return resolvedFees.filter((fee) => {
      const searchStr =
        `${fee.admissionNo} ${fee.studentName} ${LEVEL_DISPLAY(fee.classLevel)} ${fee.classSection}`.toLowerCase();
      const matchesSearch = searchStr.includes(searchTerm.toLowerCase());
      const matchesLevel =
        selectedLevel === "" || fee.classLevel === selectedLevel;
      const matchesSection =
        selectedSection === "" || fee.classSection === selectedSection;
      const matchesStatus =
        selectedStatus === "" || fee.status === selectedStatus;
      const matchesMonth =
        selectedMonth === "" || fee.monthId === selectedMonth;
      return (
        matchesSearch &&
        matchesLevel &&
        matchesSection &&
        matchesStatus &&
        matchesMonth
      );
    });
  }, [
    resolvedFees,
    searchTerm,
    selectedLevel,
    selectedSection,
    selectedStatus,
    selectedMonth,
  ]);

  // Dashboard metrics
  const totalStudents = students.length;
  const totalExpected = fees.reduce((sum, f) => sum + f.totalAmount, 0);
  const totalCollected = fees.reduce((sum, f) => sum + f.paidAmount, 0);
  const totalPending = fees.reduce(
    (sum, f) => sum + (f.totalAmount - f.paidAmount),
    0,
  );
  const defaultersCount = fees.filter((f) => f.status !== "Paid").length;
  const collectionPercent =
    totalExpected > 0
      ? ((totalCollected / totalExpected) * 100).toFixed(1)
      : "0.0";

  const feeFields = [
    {
      name: "paidAmount",
      label: "Amount Paid (₹)",
      type: "text",
      required: true,
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
        title="Fee Management"
        description="Manage fee structure, generate demand, track collections, and issue receipts."
        breadcrumbs={["Admin Portal", "Finance", "Fee Management"]}
      />

      {successBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-3xl text-emerald-700 text-xs font-black shadow-sm animate-bounce">
          {successBanner}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t-xl text-xs font-black transition-all ${
              activeTab === tab.id
                ? "bg-[#0077b6] text-white"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "dashboard" && (
        <>
          {/* Collection Dashboard Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white border-2 border-slate-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Users size={16} className="text-[#0077b6]" />
                <span className="text-[10px] font-black text-slate-500 uppercase">
                  Total Students
                </span>
              </div>
              <p className="text-2xl font-black text-[#03045e]">
                {totalStudents}
              </p>
            </div>
            <div className="bg-white border-2 border-slate-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <IndianRupee size={16} className="text-emerald-600" />
                <span className="text-[10px] font-black text-slate-500 uppercase">
                  Collected
                </span>
              </div>
              <p className="text-2xl font-black text-emerald-600">
                ₹{totalCollected.toLocaleString()}
              </p>
            </div>
            <div className="bg-white border-2 border-slate-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={16} className="text-rose-600" />
                <span className="text-[10px] font-black text-slate-500 uppercase">
                  Pending
                </span>
              </div>
              <p className="text-2xl font-black text-rose-600">
                ₹{totalPending.toLocaleString()}
              </p>
            </div>
            <div className="bg-white border-2 border-slate-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={16} className="text-[#0077b6]" />
                <span className="text-[10px] font-black text-slate-500 uppercase">
                  Collection %
                </span>
              </div>
              <p className="text-2xl font-black text-[#0077b6]">
                {collectionPercent}%
              </p>
            </div>
            <div className="bg-white border-2 border-slate-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={16} className="text-amber-600" />
                <span className="text-[10px] font-black text-slate-500 uppercase">
                  Defaulters
                </span>
              </div>
              <p className="text-2xl font-black text-amber-600">
                {defaultersCount}
              </p>
            </div>
          </div>

          {/* Fee Collection Table */}
          <AdminSectionCard>
            <OperationsFilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Search by admission no or student name..."
              filterSlots={
                <div className="flex flex-wrap gap-2">
                  <select
                    value={selectedLevel}
                    onChange={(e) => {
                      setSelectedLevel(e.target.value);
                      setSelectedSection("");
                    }}
                    className="border-2 border-[#03045e]/10 hover:border-[#0077b6] px-3 py-2 rounded-2xl text-xs font-black text-[#03045e] transition-colors bg-white outline-none min-w-[100px]"
                  >
                    <option value="">All Classes</option>
                    {availableLevels.map((l) => (
                      <option key={l} value={l}>
                        {LEVEL_DISPLAY(l)}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="border-2 border-[#03045e]/10 hover:border-[#0077b6] px-3 py-2 rounded-2xl text-xs font-black text-[#03045e] transition-colors bg-white outline-none min-w-[100px]"
                  >
                    <option value="">All Sections</option>
                    {(selectedLevel
                      ? availableSections
                      : ["A", "B", "C", "D"]
                    ).map((s) => (
                      <option key={s} value={s}>
                        Section {s}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="border-2 border-[#03045e]/10 hover:border-[#0077b6] px-3 py-2 rounded-2xl text-xs font-black text-[#03045e] transition-colors bg-white outline-none min-w-[120px]"
                  >
                    <option value="">All Months</option>
                    {FEE_MONTHS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="border-2 border-[#03045e]/10 hover:border-[#0077b6] px-3 py-2 rounded-2xl text-xs font-black text-[#03045e] transition-colors bg-white outline-none min-w-[110px]"
                  >
                    <option value="">All Status</option>
                    <option value="Paid">Paid</option>
                    <option value="Partially Paid">Partial</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={() => {
                        setSelectedLevel("");
                        setSelectedSection("");
                        setSelectedStatus("");
                        setSelectedMonth("");
                        setSearchTerm("");
                      }}
                      className="flex items-center gap-1 border-2 border-rose-200 text-rose-500 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-2xl text-xs font-black transition-colors"
                    >
                      <X size={11} /> Clear ({activeFiltersCount})
                    </button>
                  )}
                </div>
              }
            />

            <div className="mt-6">
              <AdminDataTable
                headers={[
                  "Adm No",
                  "Student Name",
                  "Class",
                  "Section",
                  "Fee Head",
                  "Month",
                  "Due Date",
                  "Total (₹)",
                  "Paid (₹)",
                  "Balance (₹)",
                  "Status",
                  "Actions",
                ]}
                items={filteredFees}
                isEmpty={filteredFees.length === 0}
                emptyTitle="No fee records found matching filters"
                renderRow={(fee) => (
                  <tr
                    key={fee.id}
                    className="hover:bg-slate-50 transition-colors text-xs text-gray-700 font-bold border-b border-slate-100"
                  >
                    <td className="py-3 px-2 text-[#03045e] font-black first:pl-2">
                      {fee.admissionNo}
                    </td>
                    <td className="py-3 px-2 text-gray-800 font-extrabold">
                      {fee.studentName}
                    </td>
                    <td className="py-3 px-2 text-[#03045e] font-black">
                      {LEVEL_DISPLAY(fee.classLevel)}
                    </td>
                    <td className="py-3 px-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-sky-50 border border-sky-100 text-[#0077b6] text-[9px] font-black">
                        Section {fee.classSection}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-slate-600">{fee.feeHead}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-600">{fee.month}</span>
                        {fee.isVacationMonth && (
                          <span
                            className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                              fee.vacationType === "SUMMER"
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                : "bg-amber-50 text-amber-600 border border-amber-100"
                            }`}
                          >
                            {fee.vacationType === "SUMMER"
                              ? "Summer"
                              : "Winter"}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-slate-500">{fee.dueDate}</td>
                    <td className="py-3 px-2 text-right font-black">
                      {fee.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-right text-emerald-600 font-black">
                      {fee.paidAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-right text-rose-600 font-black">
                      {fee.balance.toLocaleString()}
                    </td>
                    <td className="py-3 px-2">
                      <StatusBadge status={fee.status} />
                    </td>
                    <td className="py-3 px-2 text-right last:pr-2">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditFee(fee)}
                          className="text-[#0077b6] hover:text-[#03045e] bg-[#caf0f8]/40 px-2 py-1 rounded-lg text-[9px] font-black"
                          title="Record Payment"
                        >
                          PAY
                        </button>
                        <button
                          className="text-amber-600 hover:text-amber-700 bg-amber-50 px-2 py-1 rounded-lg text-[9px] font-black"
                          title="Send SMS"
                        >
                          <Send size={11} />
                        </button>
                        <button
                          className="text-slate-600 hover:text-slate-700 bg-slate-100 px-2 py-1 rounded-lg text-[9px] font-black"
                          title="Print Receipt"
                        >
                          <Printer size={11} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              />
            </div>
          </AdminSectionCard>
        </>
      )}

      {activeTab === "structure" && (
        <AdminSectionCard>
          <FeeStructureTab
            feeStructures={feeStructures}
            onSave={handleSaveFeeStructure}
          />
        </AdminSectionCard>
      )}

      {activeTab === "demand" && (
        <AdminSectionCard>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-[#03045e] uppercase tracking-wider">
              Generate Fee Demand
            </h3>
            <button className="bg-[#0077b6] hover:bg-[#0096c7] text-white px-4 py-2 rounded-xl text-xs font-black transition-colors flex items-center gap-2">
              <FileText size={14} /> Generate Demand
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">
                Select Month
              </label>
              <select className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 outline-none focus:border-[#0077b6]">
                {FEE_MONTHS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">
                Select Class
              </label>
              <select className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 outline-none focus:border-[#0077b6]">
                <option value="">All Classes</option>
                {availableLevels.map((l) => (
                  <option key={l} value={l}>
                    {LEVEL_DISPLAY(l)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </AdminSectionCard>
      )}

      {activeTab === "receipts" && (
        <AdminSectionCard>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-[#03045e] uppercase tracking-wider">
              Recent Receipts
            </h3>
            <button className="border-2 border-slate-200 hover:border-[#0077b6] text-slate-700 px-4 py-2 rounded-xl text-xs font-black transition-colors flex items-center gap-2">
              <Download size={14} /> Export All
            </button>
          </div>
          <div className="text-center py-12 text-slate-400 text-xs font-semibold">
            No receipts generated yet. Use the Collection Dashboard to record
            payments.
          </div>
        </AdminSectionCard>
      )}

      {activeTab === "reports" && (
        <AdminSectionCard>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-[#03045e] uppercase tracking-wider">
              Fee Reports
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Collection Report",
                desc: "Daily/Weekly/Monthly collection summary",
                icon: TrendingUp,
              },
              {
                title: "Defaulters Report",
                desc: "List of students with pending dues",
                icon: AlertCircle,
              },
              {
                title: "Class-wise Report",
                desc: "Fee collection by class and section",
                icon: Users,
              },
            ].map((report, idx) => (
              <button
                key={idx}
                className="border-2 border-slate-100 hover:border-[#0077b6] rounded-xl p-4 text-left transition-colors group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-[#0077b6]/10 transition-colors">
                    <report.icon
                      size={18}
                      className="text-slate-600 group-hover:text-[#0077b6]"
                    />
                  </div>
                  <span className="text-xs font-black text-[#03045e]">
                    {report.title}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">{report.desc}</p>
              </button>
            ))}
          </div>
        </AdminSectionCard>
      )}

      {/* Payment Modal */}
      <AdminEditForm
        isOpen={!!editFee}
        onClose={() => setEditFee(null)}
        title="Record Fee Payment"
        data={editFee}
        fields={feeFields}
        onSubmit={handleUpdateFee}
      />
    </motion.div>
  );
};

export default FeeManagementPage;
