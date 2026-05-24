import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserPlus, Shield, Phone, Mail, ChevronRight, Users } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminStatCard from "../../components/admin/AdminStatCard";
import AdminFilterBar from "../../components/admin/AdminFilterBar";
import AdminDataTable from "../../components/admin/AdminDataTable";
import AdminSectionCard from "../../components/admin/AdminSectionCard";
import AdminProfilePreview from "../../components/admin/AdminProfilePreview";
import AdminEditForm from "../../components/admin/AdminEditForm";
import { getAllAdmins, updateAdminProfile } from "../../services/adminService";

const AdminsPage = () => {
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Preview & Edit states
  const [previewAdmin, setPreviewAdmin] = useState(null);
  const [editAdmin, setEditAdmin] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getAllAdmins();
      setAdmins(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAdmin = async (formData) => {
    if (!editAdmin) return;
    try {
      const updated = await updateAdminProfile(editAdmin.id, formData);
      if (updated) {
        setAdmins(prev => prev.map(a => a.id === editAdmin.id ? { ...a, ...updated } : a));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredAdmins = admins.filter(adm => {
    const name = adm.name || "Administrator";
    const username = adm.username || "";
    const roleLabel = adm.roleLabel || "System Admin";
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roleLabel.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const adminFields = [
    { name: "name", label: "Admin Name / Title", type: "text", required: true },
    { name: "roleLabel", label: "Operational Role Accent", type: "text", required: true },
    { name: "email", label: "Email Address", type: "email", required: true },
    { name: "phone", label: "Phone Number", type: "text" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-12"
    >
      <AdminPageHeader 
        title="Admin Staff Registry"
        description="Audit administrative user accounts, security roles, and operational clearance details."
        breadcrumbs={["Admin Portal", "User Management", "Admins"]}
        actionButton={
          <button className="flex items-center gap-2 bg-[#0077b6] hover:bg-[#0096c7] text-white px-5 py-2.5 rounded-2xl shadow-sm text-xs font-black transition-colors">
            <UserPlus size={16} />
            <span>CREATE ADMIN ACCOUNT</span>
          </button>
        }
      />

      {/* Stats Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <AdminStatCard 
          title="Active Administrators"
          value={admins.length.toString()}
          badgeText="Operational"
          badgeType="success"
          icon={Shield}
        />
        <AdminStatCard 
          title="Access Logs Cleared"
          value="100%"
          badgeText="All Safe"
          badgeType="success"
          icon={Shield}
          color="#0096c7"
          bg="#ade8f4"
        />
        <AdminStatCard 
          title="System Load Accent"
          value="Optimal"
          badgeText="Online"
          badgeType="success"
          icon={Shield}
          color="#03045e"
          bg="#e0f2fe"
        />
      </div>

      {/* Directory Table inside Section Card */}
      <AdminSectionCard>
        {/* Search bar */}
        <AdminFilterBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Search administrators by name or role label..."
        />

        {/* Modular Table Shell */}
        <div className="mt-6">
          <AdminDataTable 
            headers={[
              "Account ID",
              "Admin Name",
              "System Username",
              "Operational Role Accent",
              "Clearance",
              "Actions"
            ]}
            items={filteredAdmins}
            isEmpty={filteredAdmins.length === 0}
            emptyTitle="No administrator records found matching search query"
            renderRow={(adm) => {
              const displayName = adm.name || "Principal Administrator";
              const roleLabel = adm.roleLabel || "System Admin";
              
              return (
                <tr key={adm.id} className="hover:bg-[#caf0f8]/10 transition-colors text-xs text-gray-700 font-bold">
                  <td className="py-4 px-3 text-[#03045e] font-black first:pl-2">{adm.id}</td>
                  <td className="py-4 px-3">
                    <button 
                      onClick={() => setPreviewAdmin({ ...adm, name: displayName, roleLabel })}
                      className="hover:text-[#0077b6] text-left transition-colors font-extrabold focus:outline-none"
                    >
                      {displayName}
                    </button>
                  </td>
                  <td className="py-4 px-3 text-gray-500 font-semibold">{adm.username}</td>
                  <td className="py-4 px-3 text-[#0077b6] font-extrabold">{roleLabel}</td>
                  <td className="py-4 px-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 uppercase tracking-wider">
                      SUPER_ADMIN
                    </span>
                  </td>
                  <td className="py-4 px-3 text-right last:pr-2">
                    <button 
                      onClick={() => setPreviewAdmin({ ...adm, name: displayName, roleLabel })}
                      className="text-[#0077b6] hover:text-[#03045e] transition-colors p-1.5 hover:bg-[#caf0f8]/40 rounded-lg"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              );
            }}
          />
        </div>
      </AdminSectionCard>

      {/* Sliding Profile Drawer */}
      <AdminProfilePreview 
        isOpen={!!previewAdmin}
        onClose={() => setPreviewAdmin(null)}
        type="admin"
        data={previewAdmin}
        onEdit={(adminData) => setEditAdmin(adminData)}
      />

      {/* Centred Edit Modal */}
      <AdminEditForm 
        isOpen={!!editAdmin}
        onClose={() => setEditAdmin(null)}
        title="Edit Administrator Profile"
        data={editAdmin}
        fields={adminFields}
        onSubmit={handleUpdateAdmin}
      />
    </motion.div>
  );
};

export default AdminsPage;
