import React from "react";
import { motion } from "framer-motion";
import MainCard from "../../components/MainCard";
import { ShieldCheck, User, Mail, Phone, Calendar, Key, AlertTriangle } from "lucide-react";

const AdminProfilePage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-12"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#03045e] tracking-tight">Administrator Profile</h1>
          <p className="text-gray-500 font-semibold mt-1">Manage institutional administrative credentials, security settings, and access tokens.</p>
        </div>
      </header>

      {/* Roster Strengths */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Profile Card & Info */}
        <div className="lg:col-span-2 space-y-6">
          <MainCard className="p-6">
            <h2 className="text-lg font-black text-[#03045e] border-b border-[#caf0f8] pb-4 mb-6">
              Administrative Credentials
            </h2>
            
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8 bg-[#caf0f8]/20 p-6 rounded-3xl border border-[#caf0f8]/50">
              <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[#03045e] to-[#0077b6] flex items-center justify-center text-white text-3xl font-black shadow-md border-4 border-white">
                AD
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xl font-black text-[#03045e]">Super Administrator</h3>
                <p className="text-xs font-bold text-[#0077b6] mt-1">Campus Operations Director</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 uppercase tracking-wider">
                    Full Access Token
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black text-blue-600 bg-blue-50 border border-blue-100 uppercase tracking-wider">
                    Security Mapped
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Primary Administrator Name", value: "School Principal Office", icon: User },
                { label: "Administrative Email Address", value: "admin@springdale.edu.in", icon: Mail },
                { label: "Primary Direct Line", value: "+91 11 2645 8790", icon: Phone },
                { label: "Term Mapped Since", value: "June 2018", icon: Calendar },
              ].map((info, idx) => {
                const Icon = info.icon;
                return (
                  <div key={idx} className="flex gap-4 items-start p-3 bg-gray-50/60 rounded-2xl border border-gray-100/80">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#0077b6] shadow-sm border border-[#caf0f8]">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{info.label}</p>
                      <p className="text-xs font-black text-gray-700 mt-1">{info.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </MainCard>
        </div>

        {/* Security Controls */}
        <div className="space-y-6">
          <MainCard className="p-6">
            <h2 className="text-lg font-black text-[#03045e] border-b border-[#caf0f8] pb-4 mb-4">
              Security Mappings
            </h2>
            <div className="space-y-3">
              {[
                { title: "Authentication Registry", desc: "Dual factor MFA keys mapped", status: "Nominal" },
                { title: "IP Access Limits", desc: "Allowed from campus subnet only", status: "Nominal" },
                { title: "System Audit Logs", desc: "Daily logs verification mapped", status: "Enabled" },
              ].map((sec, idx) => (
                <div key={idx} className="p-3 bg-[#caf0f8]/20 border border-[#caf0f8]/40 rounded-xl">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black text-[#03045e]">{sec.title}</p>
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider">{sec.status}</span>
                  </div>
                  <p className="text-[10px] font-semibold text-gray-400 mt-1">{sec.desc}</p>
                </div>
              ))}
            </div>
          </MainCard>
        </div>

      </div>
    </motion.div>
  );
};

export default AdminProfilePage;
