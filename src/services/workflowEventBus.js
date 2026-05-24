import { emitEvent } from "./workflowEvents";

/**
 * Centralized workflow event dispatcher
 */
export const emitWorkflowEvent = ({ type, entityId, payload = {} }) => {
  emitEvent(type, {
    ...payload,
    examId: entityId,
    sourceEntityId: entityId,
    sourceEntityType: "exam_cycle",
    sourceModule: "examinations",
  });
};
