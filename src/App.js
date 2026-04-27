import React, { useState, useEffect } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [employees, setEmployees] = useState([]);

  const BASE_URL = "https://ems-backend-l4vn.onrender.com";

  // Fetch Employees
  useEffect(() => {
    if (isLoggedIn) {
      fetch(`${BASE_URL}/api/employees`)
        .then((response) => response.json())
        .then((result) => {
          console.log("EMPLOYEE RESPONSE:", result);

          // IMPORTANT FIX
          if (result.status === "SUCCESS") {
            setEmployees(result.data);
          } else {
            setEmployees([]);
          }
        })
        .catch((error) => {
          console.error(error);
          alert("Failed to fetch employees");
        });
    }
  }, [isLoggedIn]);

  // Login
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
        alert(result.message);
      }

    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  };

  // After Login
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