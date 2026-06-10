import localProvider from "../data/providers/localProvider";

export const getMySupportRequests = async (requesterId) => {
  const requests = await localProvider.getSupportRequests();
  return requests.filter(r => r.requesterId === requesterId);
};

export const getSupportRequestById = async (id) => {
  const requests = await localProvider.getSupportRequests();
  return requests.find(r => r.id === id) || null;
};

const resolveRequesterName = async (requesterType, requesterId) => {
  try {
    switch (requesterType) {
      case "Student": {
        const student = await localProvider.getStudentById(requesterId);
        return student ? student.name : "Unknown Student";
      }
      case "Teacher": {
        const teacher = await localProvider.getTeacherById(requesterId);
        return teacher ? (teacher.name || teacher.teacherName) : "Unknown Teacher";
      }
      case "Parent": {
        const parent = await localProvider.getParentById(requesterId);
        return parent ? parent.name : "Unknown Parent";
      }
      case "Employee": {
        const employees = await localProvider.getEmployees();
        const employee = employees.find(e => e.employeeId === requesterId || e.id === requesterId);
        return employee ? (employee.employeeName || employee.name) : "Unknown Employee";
      }
      default:
        return "Unknown Requester";
    }
  } catch (error) {
    console.error("Error resolving requester name", error);
    return "Unknown Requester";
  }
};

export const createSupportRequest = async (data) => {
  const { requesterType, requesterId } = data;
  const requesterName = await resolveRequesterName(requesterType, requesterId);

  const payload = {
    ...data,
    requesterName
  };

  return await localProvider.createSupportRequest(payload);
};

// === ADMIN METHODS ===
export const getAllSupportRequests = async () => {
  return await localProvider.getSupportRequests();
};

export const updateSupportRequestStatus = async (id, status) => {
  const allowedStatuses = ["Open", "In Review", "Resolved", "Closed"];
  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid status update");
  }
  return await localProvider.updateSupportRequest(id, { status });
};

export const addSupportRemark = async (id, message, createdBy) => {
  const remark = {
    message,
    createdBy
  };
  return await localProvider.addSupportRemark(id, remark);
};

export const getSupportHandler = async () => {
  const settings = await localProvider.getSupportSettings();
  if (!settings || !settings.handlerEmployeeId) return null;
  
  const employees = await localProvider.getEmployees();
  const employee = employees.find(e => e.employeeId === settings.handlerEmployeeId);
  return employee ? { name: employee.employeeName || employee.name, designation: employee.designation } : null;
};

// === ANALYTICS METHODS ===
export const getSupportStats = (requests = []) => {
  return {
    total: requests.length,
    open: requests.filter(r => r.status === "Open").length,
    inReview: requests.filter(r => r.status === "In Review").length,
    resolved: requests.filter(r => r.status === "Resolved").length,
    closed: requests.filter(r => r.status === "Closed").length
  };
};

export const getSupportCategoryStats = (requests = []) => {
  return {
    complaints: requests.filter(r => r.category === "Complaint").length,
    feedback: requests.filter(r => r.category === "Feedback").length,
    suggestions: requests.filter(r => r.category === "Suggestion").length,
    technicalSupport: requests.filter(r => r.category === "Technical Support").length
  };
};
