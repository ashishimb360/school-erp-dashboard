import React from "react";
import { motion } from "framer-motion";
import MainCard from "../MainCard";
import { TrendingUp, TrendingDown } from "lucide-react";

/**
 * AdminStatCard
 * 
 * High-fidelity, animated operational metric counter.
 * Adheres to HSL tailored visual variables and responsive layouts.
 */
const AdminStatCard = ({ 
  title, 
  value, 
  changeText, 
  changeDirection = "up", // "up" | "down" | "neutral"
  badgeText, 
  badgeType = "info", // "success" | "info" | "warning" | "neutral"
  icon: Icon, 
  color = "#0077b6", 
  bg = "#caf0f8" 
}) => {
  const badgeClasses = {
    success: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    info: "bg-blue-50 text-[#0077b6] border border-blue-100",
    warning: "bg-amber-50 text-amber-600 border border-amber-100",
    neutral: "bg-gray-50 text-gray-500 border border-gray-150"
  };

  return (
    <MainCard className="p-6 relative overflow-hidden transition-all duration-200 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
          <h3 className="text-2xl font-black text-[#03045e] mt-2 tracking-tight">{value}</h3>
        </div>
        {Icon && (
          <div 
            className="w-12 h-12 rounded-[1.25rem] flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: bg, color: color }}
          >
            <Icon size={20} />
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
        {changeText && (
          <div className="flex items-center gap-1 text-[10px] font-extrabold text-[#0077b6]">
            {changeDirection === "up" && <TrendingUp size={11} />}
            {changeDirection === "down" && <TrendingDown size={11} className="text-rose-500" />}
            <span className={changeDirection === "down" ? "text-rose-500" : ""}>{changeText}</span>
          </div>
        )}
        {badgeText && (
          <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${badgeClasses[badgeType]}`}>
            {badgeText}
          </span>
        )}
      </div>
    </MainCard>
  );
};

export default React.memo(AdminStatCard);
