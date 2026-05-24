import { useState, useEffect } from "react";
import {
  Check,
  X,
  FileText,
  Upload,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import {
  acknowledgeNotice,
  rsvpNotice,
  submitNoticeForm,
  submitNoticePayment,
  uploadNoticeDocument,
  hasUserResponded,
  getActionStatus,
  ACTION_STATUS,
  RESPONSE_TYPES,
} from "../../services/noticeActionService";
import { ACTION_TYPES } from "../../mockDB/seed/notices";

const NoticeAction = ({ notice, userId, onResponse }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [userHasResponded, setUserHasResponded] = useState(false);
  const [actionStatus, setActionStatus] = useState(ACTION_STATUS.PENDING);

  useEffect(() => {
    const loadActionStatus = async () => {
      const responded = await hasUserResponded(notice.id, userId);
      const status = await getActionStatus(notice.id, userId);
      setUserHasResponded(responded);
      setActionStatus(status);
    };
    loadActionStatus();
  }, [notice.id, userId]);

  const handleAcknowledge = async () => {
    setLoading(true);
    setError(null);
    try {
      await acknowledgeNotice(notice.id, userId);
      if (onResponse) onResponse();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (response) => {
    setLoading(true);
    setError(null);
    try {
      await rsvpNotice(notice.id, userId, response, formData);
      if (onResponse) onResponse();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await submitNoticeForm(notice.id, userId, formData);
      if (onResponse) onResponse();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (paymentData) => {
    setLoading(true);
    setError(null);
    try {
      await submitNoticePayment(notice.id, userId, paymentData);
      if (onResponse) onResponse();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (documentData) => {
    setLoading(true);
    setError(null);
    try {
      await uploadNoticeDocument(notice.id, userId, documentData);
      if (onResponse) onResponse();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!notice.requiresAction) {
    return null;
  }

  if (userHasResponded) {
    return (
      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 text-green-700">
          <Check size={16} />
          <span className="text-sm font-medium">Action completed</span>
        </div>
      </div>
    );
  }

  const isOverdue = actionStatus === ACTION_STATUS.OVERDUE;

  return (
    <div
      className={`mt-4 p-4 border rounded-lg ${isOverdue ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-200"}`}
    >
      {isOverdue && (
        <div className="flex items-center gap-2 text-red-700 mb-3">
          <AlertCircle size={16} />
          <span className="text-sm font-medium">Action overdue</span>
        </div>
      )}

      {error && (
        <div className="mb-3 p-2 bg-red-100 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      {notice.actionType === ACTION_TYPES.ACKNOWLEDGE && (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">
              Acknowledgement required
            </p>
            {notice.actionDeadline && (
              <p className="text-xs text-gray-600">
                Deadline: {new Date(notice.actionDeadline).toLocaleDateString()}
              </p>
            )}
          </div>
          <button
            onClick={handleAcknowledge}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? "Processing..." : "Acknowledge"}
            <Check size={16} />
          </button>
        </div>
      )}

      {notice.actionType === ACTION_TYPES.RSVP && (
        <div>
          <p className="text-sm font-medium text-gray-900 mb-3">
            Please respond
          </p>
          {notice.actionDeadline && (
            <p className="text-xs text-gray-600 mb-3">
              Deadline: {new Date(notice.actionDeadline).toLocaleDateString()}
            </p>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => handleRSVP(RESPONSE_TYPES.ACCEPTED)}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Processing..." : "Accept"}
              <Check size={16} />
            </button>
            <button
              onClick={() => handleRSVP(RESPONSE_TYPES.DECLINED)}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Processing..." : "Decline"}
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {notice.actionType === ACTION_TYPES.FORM_SUBMISSION && (
        <div>
          <p className="text-sm font-medium text-gray-900 mb-3">
            Form submission required
          </p>
          {notice.actionDeadline && (
            <p className="text-xs text-gray-600 mb-3">
              Deadline: {new Date(notice.actionDeadline).toLocaleDateString()}
            </p>
          )}
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <FileText size={16} />
              Open Form
            </button>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Response
                </label>
                <textarea
                  value={formData.response || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, response: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {notice.actionType === ACTION_TYPES.PAYMENT && (
        <div>
          <p className="text-sm font-medium text-gray-900 mb-3">
            Payment required
          </p>
          {notice.actionDeadline && (
            <p className="text-xs text-gray-600 mb-3">
              Deadline: {new Date(notice.actionDeadline).toLocaleDateString()}
            </p>
          )}
          <button
            onClick={() =>
              handlePayment({ amount: notice.metadata?.amount || 0 })
            }
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? "Processing..." : "Pay Now"}
            <CreditCard size={16} />
          </button>
        </div>
      )}

      {notice.actionType === ACTION_TYPES.DOCUMENT_UPLOAD && (
        <div>
          <p className="text-sm font-medium text-gray-900 mb-3">
            Document upload required
          </p>
          {notice.actionDeadline && (
            <p className="text-xs text-gray-600 mb-3">
              Deadline: {new Date(notice.actionDeadline).toLocaleDateString()}
            </p>
          )}
          <button
            onClick={() => handleDocumentUpload({})}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? "Uploading..." : "Upload Document"}
            <Upload size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default NoticeAction;
