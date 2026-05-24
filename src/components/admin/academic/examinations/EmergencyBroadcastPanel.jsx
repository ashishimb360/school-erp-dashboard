import React, { useState } from "react";
import { Megaphone, AlertCircle, Send, Calendar } from "lucide-react";

const EmergencyBroadcastPanel = ({ broadcasts, onSendBroadcast }) => {
  const [title, setTitle] = useState("Urgent Exam Session Update");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !message) {
      alert("Please complete Title and Circular Message fields.");
      return;
    }

    onSendBroadcast({
      title,
      content: message,
    });

    setMessage("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Broadcast Form */}
      <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
        <div>
          <h4 className="text-xs font-black text-[#03045e] uppercase tracking-wider flex items-center gap-1.5">
            <Megaphone size={14} className="text-rose-500" />
            <span>Compose Institutional Emergency Circular</span>
          </h4>
          <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">
            Instantly notify student, parent, and teacher portals
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[9px] uppercase font-black text-gray-400 tracking-wider">
              Emergency Alert Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Schedule Delay due to weather / Power Outage"
              className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-xs focus:ring-2 focus:ring-[#00b4d8]/20 transition-all text-[#03045e]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] uppercase font-black text-gray-400 tracking-wider">
              Emergency Circular Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Provide clear details and immediate operational instructions..."
              className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none font-semibold text-xs focus:ring-2 focus:ring-[#00b4d8]/20 transition-all text-[#03045e]"
            />
          </div>

          <div className="p-3.5 bg-rose-50/50 border border-rose-100 rounded-xl flex gap-2.5 text-rose-800">
            <AlertCircle size={14} className="shrink-0 mt-0.5 text-rose-500" />
            <p className="text-[10px] font-semibold leading-relaxed">
              <strong>Emergency Broadcast:</strong> This circular will be pinned in student, parent, and teacher notice boards with an urgent emergency tag. Ensure details are fully verified before broadcasting.
            </p>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black py-3 rounded-xl shadow-md shadow-rose-100 transition-colors uppercase tracking-wider"
          >
            <Send size={12} />
            <span>BROADCAST CIRCULAR NOW</span>
          </button>
        </form>
      </div>

      {/* Broadcast History */}
      <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
        <div>
          <h4 className="text-xs font-black text-[#03045e] uppercase tracking-wider flex items-center gap-1.5">
            <Megaphone size={14} className="text-gray-400" />
            <span>Emergency Broadcast Log ({broadcasts.length})</span>
          </h4>
          <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">
            Review recently dispatched emergency exam updates
          </p>
        </div>

        <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
          {broadcasts.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-2xl border border-rose-100 bg-rose-50/20 flex gap-3 text-[#03045e] animate-fade-in"
            >
              <div className="p-2 rounded-xl bg-rose-50 border border-rose-100 text-rose-500 shrink-0 self-start">
                <Megaphone size={14} />
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex justify-between items-center gap-2">
                  <h5 className="text-xs font-black text-[#03045e]">{b.title}</h5>
                  <span className="text-[9px] text-gray-400 font-bold">
                    {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-xs text-gray-600 font-medium leading-relaxed bg-white p-3 rounded-xl border border-gray-100/60 shadow-sm">
                  {b.message || b.content}
                </p>
              </div>
            </div>
          ))}

          {broadcasts.length === 0 && (
            <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-gray-400 font-bold uppercase tracking-wider text-xs">
              No emergency circulars broadcasted under this cycle
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyBroadcastPanel;
