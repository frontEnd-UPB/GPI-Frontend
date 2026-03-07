import React from "react";
import HomePage from "./HomePage";
import { AdminLayout } from "../../../core/components/layout/AdminLayout";

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <HomePage />
    </AdminLayout>
  );
};

export default AdminDashboard;
