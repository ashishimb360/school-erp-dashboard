import { getDataProvider } from "../data";
import { getFeeStructureForClass } from "../mockDB/seed/feeStructures";

/**
 * Fetches the overall financial details for a student (Relational & Invoice-Centric)
 */
export const getStudentFinanceSummary = async (studentId) => {
  const id = studentId || "stud-001";
  const provider = getDataProvider();
  const [students, classes, feeStructures] = await Promise.all([
    provider.getStudents(),
    provider.getClasses(),
    provider.getFeeStructures(),
  ]);
  const student = students.find((s) => s.id === id);
  if (!student) return null;

  // Resolve fee structure template for this student's class
  const cls = classes.find((c) => c.id === student.classId);
  const feeStructure = feeStructures.length
    ? getFeeStructureForClass(feeStructures, cls)
    : null;

  const studentInvoices = await provider.getInvoicesByStudent(id);
  const studentReceipts = await provider.getReceiptsByStudent(id);

  // 1. Total Fees Due is the sum of all invoices
  const totalFees = studentInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  // 2. Total Paid Till Date is the sum of paid amount on all invoices
  const totalPaid = studentInvoices.reduce(
    (sum, inv) => sum + (inv.paidAmount || 0),
    0,
  );

  // 3. Outstanding Balance is the sum of unpaid amounts for PENDING and OVERDUE invoices, excluding future UPCOMING invoices
  const outstandingBalance = studentInvoices
    .filter(
      (inv) =>
        inv.status === "Pending" ||
        inv.status === "Overdue" ||
        inv.status === "Partially Paid",
    )
    .reduce((sum, inv) => sum + (inv.amount - (inv.paidAmount || 0)), 0);

  // 4. Pending bills consists of unpaid or partially paid active invoices
  const pendingInvoices = studentInvoices
    .filter(
      (inv) =>
        inv.status === "Pending" ||
        inv.status === "Overdue" ||
        inv.status === "Partially Paid",
    )
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const releasedSettledCount = studentInvoices.filter(
    (inv) => inv.status === "Paid",
  ).length;
  const upcomingCount = studentInvoices.filter(
    (inv) => inv.status === "Upcoming",
  ).length;

  const totalInvoicesCount = studentInvoices.length;
  const activeDuesCount = pendingInvoices.length;

  const summary = {
    totalFees,
    totalPaid,
    outstandingBalance,
    currency: "₹",
    dueDate: pendingInvoices[0]?.dueDate || "N/A",
    status:
      outstandingBalance === 0
        ? "Paid"
        : totalPaid > 0
          ? "Partially Paid"
          : "Pending",
    releasedSettledCount,
    upcomingCount,
    totalInvoicesCount,
    activeDuesCount,
  };

  // Build a map of headId → monthly base amount from live fee structure
  const liveHeadMap = {};
  if (feeStructure && feeStructure.feeHeads) {
    feeStructure.feeHeads.forEach((h) => {
      liveHeadMap[h.label] = {
        monthlyBase: Math.round(h.annualAmount / 12),
        annualAmount: h.annualAmount,
        applicableMonths: h.applicableMonths || null,
      };
    });
  }

  // Convert raw invoices to UI fee structure presentation
  const structure = studentInvoices
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .map((inv) => {
      // Overlay live fee structure amounts if available, keeping vacation adjustments
      const isSummer = inv.vacationType === "SUMMER";
      const isWinter = inv.vacationType === "WINTER";
      const components = (inv.lineItems || []).map((item) => {
        let amount = item.amount;
        if (liveHeadMap[item.label]) {
          // Recalculate from live structure with vacation rules
          let base = liveHeadMap[item.label].monthlyBase;
          if (
            isSummer &&
            (item.label === "Transport Fee" || item.label === "Activity Fee")
          )
            base = 0;
          else if (
            isWinter &&
            (item.label === "Transport Fee" || item.label === "Activity Fee")
          )
            base = Math.round(base * 0.5);
          amount = base;
        }
        return { head: item.label, amount };
      });

      return {
        id: inv.id,
        label: inv.targetLabel || `${inv.billingMonth} Invoice`,
        total: inv.amount,
        paidAmount: inv.paidAmount || 0,
        remainingAmount: inv.amount - (inv.paidAmount || 0),
        status: inv.status,
        dueDate: inv.dueDate,
        invoiceNo: inv.invoiceNo,
        isVacationMonth: inv.isVacationMonth,
        vacationType: inv.vacationType,
        components,
      };
    });

  return {
    summary,
    structure,
    pendingBills: pendingInvoices.map((inv) => ({
      id: inv.id,
      invoiceNo: inv.invoiceNo,
      amount: inv.amount,
      paidAmount: inv.paidAmount || 0,
      remainingAmount: inv.amount - (inv.paidAmount || 0),
      dueDate: inv.dueDate,
      status: inv.status,
      targetLabel: inv.targetLabel || `${inv.billingMonth} Invoice`,
    })),
    receipts: studentReceipts
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map((rcp) => ({
        ...rcp,
        receiptNo: rcp.receiptNo || `REC-2025-${rcp.id.split("-").pop()}`,
      })),
    itCertificate: {
      studentName: student?.name || "Rohan Kumar",
      rollNo: student?.admissionNo || "2024001",
      year: "2024-2025",
      dateGenerated: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      totalPaid: totalPaid,
      taxExemptionLimit: 150000,
    },
  };
};

// Backward compatibility alias for studentDashboardService
export const getFeeDetails = getStudentFinanceSummary;
