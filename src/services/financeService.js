import { MockDB } from "../mockDB";
import { simulateNetwork } from "./sharedService";

/**
 * Fetches the overall financial details for a student (Relational & Invoice-Centric)
 */
export const getFeeDetails = async (studentId = 'stud-001') => {
  const student = await MockDB.students.findById(studentId);
  const studentInvoices = await MockDB.invoices.find({ studentId });
  const studentReceipts = await MockDB.receipts.find({ studentId });

  // 1. Total Fees Due is the sum of all invoices
  const totalFees = studentInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  // 2. Total Paid Till Date is the sum of paid amount on all invoices
  const totalPaid = studentInvoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);

  // 3. Outstanding Balance is the sum of unpaid amounts for PENDING and OVERDUE invoices, excluding future UPCOMING invoices
  const outstandingBalance = studentInvoices
    .filter(inv => inv.status === "Pending" || inv.status === "Overdue" || inv.status === "Partially Paid")
    .reduce((sum, inv) => sum + (inv.amount - (inv.paidAmount || 0)), 0);

  // 4. Pending bills consists of unpaid or partially paid active invoices
  const pendingInvoices = studentInvoices
    .filter(inv => inv.status === "Pending" || inv.status === "Overdue" || inv.status === "Partially Paid")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const releasedSettledCount = studentInvoices.filter(inv => inv.status === "Paid").length;
  const upcomingCount = studentInvoices.filter(inv => inv.status === "Upcoming").length;

  const totalInvoicesCount = studentInvoices.length;
  const activeDuesCount = pendingInvoices.length;

  const summary = {
    totalFees,
    totalPaid,
    outstandingBalance,
    currency: "₹",
    dueDate: pendingInvoices[0]?.dueDate || "N/A",
    status: outstandingBalance === 0 ? "Paid" : totalPaid > 0 ? "Partially Paid" : "Pending",
    releasedSettledCount,
    upcomingCount,
    totalInvoicesCount,
    activeDuesCount
  };

  // Convert raw invoices to UI fee structure presentation
  const structure = studentInvoices
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .map(inv => {
      const components = (inv.lineItems || []).map(item => ({
        head: item.label,
        amount: item.amount
      }));

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
        components
      };
    });

  return simulateNetwork({
    summary,
    structure,
    pendingBills: pendingInvoices.map(inv => ({
      id: inv.id,
      invoiceNo: inv.invoiceNo,
      amount: inv.amount,
      paidAmount: inv.paidAmount || 0,
      remainingAmount: inv.amount - (inv.paidAmount || 0),
      dueDate: inv.dueDate,
      status: inv.status,
      targetLabel: inv.targetLabel || `${inv.billingMonth} Invoice`
    })),
    receipts: studentReceipts
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(rcp => ({
        ...rcp,
        receiptNo: rcp.receiptNo || `REC-2025-${rcp.id.split('-').pop()}`
      })),
    itCertificate: {
      studentName: student?.name || "Rohan Kumar",
      rollNo: student?.admissionNo || "2024001",
      year: "2024-2025",
      dateGenerated: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      totalPaid: totalPaid,
      taxExemptionLimit: 150000
    }
  });
};
