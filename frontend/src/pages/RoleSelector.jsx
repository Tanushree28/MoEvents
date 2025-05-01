import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RoleSelector() {
  const { setRole, userId, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  console.log("isAuthenticated:", isAuthenticated);
  console.log("userId:", userId);

  const handleRoleSelection = async (selectedRole) => {
    try {
      const response = await fetch("/api/update-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userId, role: selectedRole }),
      });

      if (response.ok) {
        setRole(selectedRole);
        if (selectedRole === "admin") {
          navigate("/admin/dashboard");
        } else if (selectedRole === "student") {
          navigate("/student/dashboard");
        }
      } else {
        console.error("Failed to update role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Select Your Role</h1>
      <button
        onClick={() => handleRoleSelection("student")}
        style={{ margin: "10px", padding: "10px 20px" }}
      >
        Student
      </button>
      <button
        onClick={() => handleRoleSelection("admin")}
        style={{ margin: "10px", padding: "10px 20px" }}
      >
        Admin
      </button>
    </div>
  );
}