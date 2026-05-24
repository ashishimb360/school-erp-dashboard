/**
 * src/initialization/validators/diagnosticEngine.js
 * 
 * Centralized diagnostic engine for the Relational Integrity Validation Layer.
 * Aggregates logs, categorizes by severity (INFO, WARNING, CRITICAL),
 * and surfaces reports without hard-blocking the ERP boot process.
 */

export const SEVERITY = {
  INFO: "INFO",
  WARNING: "WARNING",
  CRITICAL: "CRITICAL",
};

class DiagnosticEngine {
  constructor() {
    this.reports = [];
  }

  reset() {
    this.reports = [];
  }

  log(severity, module, message, metadata = {}) {
    this.reports.push({
      timestamp: new Date().toISOString(),
      severity,
      module,
      message,
      metadata,
    });
  }

  info(module, message, metadata) {
    this.log(SEVERITY.INFO, module, message, metadata);
  }

  warn(module, message, metadata) {
    this.log(SEVERITY.WARNING, module, message, metadata);
  }

  critical(module, message, metadata) {
    this.log(SEVERITY.CRITICAL, module, message, metadata);
  }

  getReports(severityFilter = null) {
    if (severityFilter) {
      return this.reports.filter((r) => r.severity === severityFilter);
    }
    return this.reports;
  }

  hasCritical() {
    return this.reports.some((r) => r.severity === SEVERITY.CRITICAL);
  }

  printSummary() {
    if (this.reports.length === 0) {
      console.log("[DiagnosticEngine] All integrity checks passed cleanly.");
      return;
    }

    const infos = this.getReports(SEVERITY.INFO);
    const warnings = this.getReports(SEVERITY.WARNING);
    const criticals = this.getReports(SEVERITY.CRITICAL);

    console.group(`[DiagnosticEngine] Validation Report: ${this.reports.length} findings`);
    
    if (criticals.length > 0) {
      console.error(`🚨 CRITICAL FAILURES (${criticals.length}):`);
      criticals.forEach(r => console.error(`  [${r.module}] ${r.message}`, r.metadata));
    }
    
    if (warnings.length > 0) {
      console.warn(`⚠️ WARNINGS (${warnings.length}):`);
      warnings.forEach(r => console.warn(`  [${r.module}] ${r.message}`, r.metadata));
    }

    if (infos.length > 0) {
      console.info(`ℹ️ INFO (${infos.length}):`);
      infos.forEach(r => console.info(`  [${r.module}] ${r.message}`, r.metadata));
    }

    console.groupEnd();
  }
}

export const diagnosticEngine = new DiagnosticEngine();
export default diagnosticEngine;
