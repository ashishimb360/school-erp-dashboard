import React from "react";
import MainCard from "../../MainCard";
import StatusBadge from "./StatusBadge";
import { Truck, Users, Phone, MapPin } from "lucide-react";

/**
 * RouteOverviewCard
 * 
 * Reusable card panel displaying transport routes, driver schedules, and bus capacity metrics.
 */
const RouteOverviewCard = ({ 
  routeNo, 
  driverName, 
  driverPhone, 
  occupancy = 0, 
  capacity = 40, 
  stopsCount = 0,
  timing = "07:30 AM - 08:15 AM",
  status = "In-Route"
}) => {
  return (
    <MainCard className="p-5 hover:shadow-md transition-shadow bg-white border border-[#caf0f8]/50 shadow-sm relative flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-[#caf0f8] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#caf0f8] text-[#03045e] flex items-center justify-center">
            <Truck size={14} />
          </div>
          <div>
            <span className="block text-[9px] font-black uppercase text-gray-400">Transport Fleet</span>
            <h3 className="text-xs font-black text-[#03045e] tracking-tight">{routeNo}</h3>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="space-y-3 my-2 text-xs font-bold text-gray-700">
        <div className="flex items-center gap-2">
          <MapPin size={13} className="text-[#00b4d8]" />
          <span>Stops Count: <strong className="text-[#03045e]">{stopsCount} Stops</strong></span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Phone size={13} className="text-gray-400" />
          <span>Driver: {driverName} ({driverPhone})</span>
        </div>
      </div>

      <div className="mt-4 border-t border-[#caf0f8]/50 pt-3 flex items-center justify-between text-[10px] font-black text-[#03045e]">
        <div className="flex items-center gap-1">
          <Users size={12} className="text-[#0077b6]" />
          <span>Occupancy: {occupancy} <span className="text-gray-400">/ {capacity}</span></span>
        </div>
        <span className="text-gray-400 font-bold">{timing}</span>
      </div>
    </MainCard>
  );
};

export default React.memo(RouteOverviewCard);
