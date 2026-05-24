import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Truck, Plus, Filter, AlertTriangle, ToggleLeft } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import OperationsStatCard from "../../components/admin/operations/OperationsStatCard";
import RouteOverviewCard from "../../components/admin/operations/RouteOverviewCard";
import OperationsFilterBar from "../../components/admin/operations/OperationsFilterBar";
import AdminSectionCard from "../../components/admin/AdminSectionCard";
import AdminDataTable from "../../components/admin/AdminDataTable";
import StatusBadge from "../../components/admin/operations/StatusBadge";
import { getDataProvider } from "../../data";

const TransportManagementPage = () => {
  const [routes, setRoutes] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [loading, setLoading] = useState(true);

  // Directions toggle state
  const [directionFilter, setDirectionFilter] = useState("PICKUP_ROUTE"); // "PICKUP_ROUTE" | "DROP_ROUTE"

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const provider = getDataProvider();
      const [allRoutes, allAlerts] = await Promise.all([
        provider.getTransportRoutes(),
        provider.getTransportAlerts(),
      ]);

      setRoutes(allRoutes || []);
      setAlerts(allAlerts || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleDirections = () => {
    const nextDir =
      directionFilter === "PICKUP_ROUTE" ? "DROP_ROUTE" : "PICKUP_ROUTE";
    setDirectionFilter(nextDir);

    // Sync activeDirection of all routes relationally in-memory (UI-first responsiveness!)
    setRoutes((prev) => prev.map((r) => ({ ...r, activeDirection: nextDir })));
  };

  const filteredRoutes = routes.filter((r) => {
    const matchesSearch =
      r.routeNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.zone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesZone = selectedZone === "" || r.zone === selectedZone;

    return matchesSearch && matchesZone;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-12"
    >
      <AdminPageHeader
        title="School Transport Management"
        description="Monitor school bus route fleets, verify driver credentials, track occupancy rates, and dispatch operational notifications."
        breadcrumbs={["Admin Portal", "Operations", "Transport"]}
        actionButton={
          <button
            onClick={toggleDirections}
            className="flex items-center gap-2 bg-[#03045e] hover:bg-[#0077b6] text-white px-5 py-2.5 rounded-2xl shadow-sm text-xs font-black transition-colors"
          >
            <ToggleLeft size={16} />
            <span>
              SWITCH TO{" "}
              {directionFilter === "PICKUP_ROUTE"
                ? "DROP ROUTE (AFTERNOON)"
                : "PICKUP ROUTE (MORNING)"}
            </span>
          </button>
        }
      />

      {/* Roster Strengths stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <OperationsStatCard
          title="Active Bus Fleet"
          value={routes.length.toString()}
          description="CNG & Green-Electric Vehicles mapped"
          icon={Truck}
        />
        <OperationsStatCard
          title="Total Bus Commuters"
          value="182 Students"
          description="Roster occupancy verified today"
          icon={Truck}
          color="#0096c7"
          bg="#ade8f4"
        />
        <OperationsStatCard
          title="Fleet Operations Direction"
          value={
            directionFilter === "PICKUP_ROUTE"
              ? "Pickup (Morning)"
              : "Drop-off (Afternoon)"
          }
          description="Synchronized active transit"
          icon={Truck}
          color="#03045e"
          bg="#e0f2fe"
        />
      </div>

      {/* Active Alerts Panel */}
      {alerts.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-3xl text-amber-700 space-y-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase">
            <AlertTriangle size={16} className="text-amber-500" />
            <span>Active Transport Delay Dispatches</span>
          </div>
          <div className="divide-y divide-amber-100">
            {alerts.map((al, idx) => (
              <p
                key={idx}
                className="text-[10px] font-semibold py-1.5 leading-relaxed text-amber-600"
              >
                ⚠️ Route <strong>{al.routeId}</strong>:{" "}
                {al.message || "Running 10 minutes late due to slow traffic."}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoutes.map((route) => (
          <RouteOverviewCard
            key={route.id}
            routeNo={`Route ${route.routeNo}`}
            driverName={route.driverName}
            driverPhone={route.driverPhone}
            occupancy={
              route.id === "RT-101" ? 38 : route.id === "RT-102" ? 29 : 32
            }
            capacity={route.id === "RT-101" ? 52 : 42}
            stopsCount={route.stops.length}
            timing={
              directionFilter === "PICKUP_ROUTE"
                ? route.pickupTime
                : route.dropTime
            }
            status={route.id === "RT-102" ? "Completed" : "In-Route"}
          />
        ))}
      </div>

      {/* Detailed Stops Table in Section */}
      <AdminSectionCard>
        <OperationsFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Search fleet by driver name, route no, or zone..."
          filterSlots={
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="flex items-center gap-2 border border-[#caf0f8] hover:border-[#00b4d8] px-4 py-2.5 rounded-2xl text-xs font-bold text-[#03045e] transition-colors bg-white outline-none"
            >
              <option value="">Select Transport Zone...</option>
              <option value="West Zone">West Zone</option>
              <option value="North Zone">North Zone</option>
              <option value="South Zone">South Zone</option>
            </select>
          }
        />

        <div className="mt-6">
          <AdminDataTable
            headers={[
              "Route ID",
              "Primary Driver",
              "Attendant Mapped",
              "Active Transit Vehicle",
              "Active Zone Mapped",
              "Estimated Duration",
              "Operational Status",
            ]}
            items={filteredRoutes}
            isEmpty={filteredRoutes.length === 0}
            emptyTitle="No fleet routes found matching criteria"
            renderRow={(r) => (
              <tr
                key={r.id}
                className="hover:bg-[#caf0f8]/10 transition-colors text-xs text-gray-700 font-bold border-b border-[#caf0f8]/40"
              >
                <td className="py-4 px-3 text-[#03045e] font-black first:pl-2">
                  {r.routeNo}
                </td>
                <td className="py-4 px-3 text-gray-800 font-extrabold">
                  {r.driverName}
                </td>
                <td className="py-4 px-3 text-gray-400 font-semibold">
                  {r.id === "RT-101" ? "Mr. Satish Mehra" : "Mrs. Sunita Devi"}
                </td>
                <td className="py-4 px-3 text-[#0077b6]">{r.vehicleNo}</td>
                <td className="py-4 px-3 text-gray-500 font-semibold">
                  {r.zone}
                </td>
                <td className="py-4 px-3">
                  {r.estimatedDuration || "45 mins"}
                </td>
                <td className="py-4 px-3 last:pr-2">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      r.id === "RT-102"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : "bg-blue-50 text-[#0077b6] border border-blue-100"
                    }`}
                  >
                    {r.id === "RT-102" ? "Completed" : "In-Route"}
                  </span>
                </td>
              </tr>
            )}
          />
        </div>
      </AdminSectionCard>
    </motion.div>
  );
};

export default TransportManagementPage;
