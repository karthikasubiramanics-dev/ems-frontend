import React, { useState, useEffect } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [employees, setEmployees] = useState([]);

  // IMPORTANT:
  // Replace this with your actual Render backend URL
  const BASE_URL = "https://ems-backend-l4vn.onrender.com";

  // Fetch employees after login
  useEffect(() => {
    if (isLoggedIn) {
      fetch(`${BASE_URL}/api/employees`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Employees:", data);
          setEmployees(data);
        })
        .catch((error) => {
          console.error("Error fetching employees:", error);
          alert("Failed to fetch employees");
        });
    }
  }, [isLoggedIn]);

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
      console.log("Login Result:", result);

      if (result.message === "Login successful") {
        alert("Login Success");
        setIsLoggedIn(true);
      } else {
        alert("Invalid Login");
      }

    } catch (error) {
      console.error("Login Error:", error);
      alert("Server Error");
    }
  };

  // After login → Show employee table
  if (isLoggedIn) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Employee Management System</h1>
        <h2>Welcome Admin ✅</h2>
        <h3>Employee List</h3>

        {employees.length === 0 ? (
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
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.department}</td>
                  <td>{emp.salary}</td>
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
      <h1>Employee Management Login</h1>

      <input
        type="text"
        placeholder="Enter Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <br />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <br />

      <button onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}

export default App;