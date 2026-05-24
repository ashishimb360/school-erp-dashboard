import { getDataProvider } from "../data";
import { updateExamSession, validateSessionForPublication, finalizeEvaluationRecords } from "./examService";
import { emitWorkflowEvent } from "./workflowEventBus";

/**
 * Centralized Exam Lifecycle State Transition Engine
 * Unified single source of truth for all lifecycle state shifts.
 */
export const transitionExamCycleStatus = async ({
  sessionId,
  fromStatus,
  toStatus,
  changedBy = "admin-001",
}) => {
  const provider = getDataProvider();
  const existingExam = await provider.getExamById(sessionId);
  if (!existingExam) {
    throw new Error("Exam session not found");
  }

  if (toStatus === "published") {
    // 1. Validate Preconditions for Publication
    const diagnostics = await validateSessionForPublication(sessionId);
    if (diagnostics.errors.length > 0) {
      throw new Error(
        `Cannot publish exam session due to critical diagnostic blocks: ${diagnostics.errors[0].message}`
      );
    }

    // 2. Lock evaluation records and sync to Results table
    await finalizeEvaluationRecords(sessionId, changedBy);

    // 3. Update lifecycle state to Published with audit signatures
    const updatedExam = await updateExamSession(sessionId, {
      status: "published",
      publishedAt: new Date().toISOString(),
      publishedBy: changedBy,
    });

    // 4. Emit Workflow Event RESULT_PUBLISHED
    emitWorkflowEvent({
      type: "RESULT_PUBLISHED",
      entityId: sessionId,
      payload: {
        examName: updatedExam.name,
        classIds: Object.keys(updatedExam.targetClasses || {}),
        createdBy: changedBy,
      },
    });

    return updatedExam;
  }

  // Default fallback for other transitions
  return await updateExamSession(sessionId, { status: toStatus });
};
