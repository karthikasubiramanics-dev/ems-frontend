import React, { useState, useEffect } from "react";

function App() {
  // Login states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // App states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  // Backend URL (Render backend)
  const BASE_URL = "https://ems-backend-l4vn.onrender.com";

  // Fetch employees after login
  useEffect(() => {
    if (isLoggedIn) {
      fetchEmployees();
    }
  }, [isLoggedIn]);

  // GET Employees
  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${BASE_URL}/api/employees`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const result = await response.json();

      console.log("EMPLOYEE RESPONSE:", result);

      if (result.status === "SUCCESS") {
        setEmployees(result.data);
      } else {
        setEmployees([]);
      }

    } catch (error) {
      console.error("Fetch Error:", error);
      alert("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  // LOGIN
  const handleLogin = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      const result = await response.json();

      console.log("LOGIN RESPONSE:", result);

      if (result.message === "Login successful") {
        alert("Login Success ✅");
        setIsLoggedIn(true);
      } else {
        alert(result.message || "Invalid login");
      }

    } catch (error) {
      console.error("Login Error:", error);
      alert("Server Error");
    }
  };

  // LOGOUT
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    setEmployees([]);
  };

  // Employee Table Page
  if (isLoggedIn) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Employee Management System</h1>
        <h2>Welcome Admin ✅</h2>

        <div style={{ marginBottom: "20px" }}>
          <button onClick={fetchEmployees}>
            Refresh Employees
          </button>

          <button
            onClick={handleLogout}
            style={{ marginLeft: "10px" }}
          >
            Logout
          </button>
        </div>

        <h3>Employee List</h3>

        {loading ? (
          <p>Loading employees...</p>
        ) : employees.length === 0 ? (
          <p>No employees found</p>
        ) : (
          <table border="1" cellPadding="10" cellSpacing="0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Salary</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.department}</td>
                  <td>{employee.salary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }

  // Login Page
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Employee Management Login</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}

export default App;