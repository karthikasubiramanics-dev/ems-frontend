import React, { useState, useEffect } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [employees, setEmployees] = useState([]);

  // Deployed backend URL
  const BASE_URL = "https://ems-backend-l4vn.onrender.com";

  // Fetch employees after login
  useEffect(() => {
    if (isLoggedIn) {
      fetch(`${BASE_URL}/api/employees`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setEmployees(data.data || []);
        })
        .catch((error) => {
          console.error("Error fetching employees:", error);
          alert("Failed to load employees");
        });
    }
  }, [isLoggedIn]);

  // Login function
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
      console.log(result);

      if (result.message === "Login successful") {
        alert("Login Success");
        setIsLoggedIn(true);
      } else {
        alert("Invalid Login");
      }

    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  };

  // After login → Show employee table
  if (isLoggedIn) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Employee Management System</h1>
        <h2>Employee List</h2>

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

  // Login page
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Employee Management Login</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Password"
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