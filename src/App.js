import React, { useEffect, useState } from "react";

function App() {
  const BASE_URL = "https://ems-backend-l4vn.onrender.com";

  // Login states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // App states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [salary, setSalary] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // ✅ NEW
  const [editingId, setEditingId] = useState(null);

  // Validation errors
  const [errors, setErrors] = useState({}); // ✅ NEW

  // Search state
  const [search, setSearch] = useState("");

  // =========================
  // Fetch Employees After Login
  // =========================
  useEffect(() => {
    if (isLoggedIn) {
      fetchEmployees();
    }
  }, [isLoggedIn]);

  // =========================
  // Search Filter
  // =========================
  useEffect(() => {
    const filtered = employees.filter((emp) =>
      emp.name?.toLowerCase().includes(search.toLowerCase()) ||
      emp.department?.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredEmployees(filtered);
  }, [employees, search]);

  // =========================
  // LOGIN
  // =========================
  const handleLogin = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const result = await response.json();

      if (result.message === "Login successful") {
        alert("Login Success ✅");
        setIsLoggedIn(true);
      } else {
        alert(result.message || "Login Failed");
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  };

  // =========================
  // FETCH EMPLOYEES
  // =========================
  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${BASE_URL}/api/employees`);
      const result = await response.json();

      if (result.status === "SUCCESS") {
        setEmployees(result.data);
      } else {
        setEmployees([]);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ADD + UPDATE EMPLOYEE
  // =========================
  const handleSubmit = async () => {
    setErrors({}); // clear old errors

    const employeeData = {
      name,
      email,
      department,
      salary: Number(salary),
      phoneNumber
    };

    try {
      let response;

      if (editingId) {
        response = await fetch(
          `${BASE_URL}/api/employees/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(employeeData)
          }
        );
      } else {
        response = await fetch(`${BASE_URL}/api/employees`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(employeeData)
        });
      }

      const result = await response.json();

      // ✅ HANDLE VALIDATION ERRORS
      if (response.status === 400) {
        setErrors(result.data || {});
        return;
      }

      alert(
        editingId
          ? "Employee Updated Successfully ✅"
          : "Employee Added Successfully ✅"
      );

      resetForm();
      fetchEmployees();

    } catch (error) {
      console.error(error);
      alert("Save Failed");
    }
  };

  // =========================
  // DELETE EMPLOYEE
  // =========================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;

    try {
      await fetch(`${BASE_URL}/api/employees/${id}`, {
        method: "DELETE"
      });

      alert("Employee Deleted ✅");
      fetchEmployees();
    } catch (error) {
      console.error(error);
      alert("Delete Failed");
    }
  };

  // =========================
  // EDIT EMPLOYEE
  // =========================
  const handleEdit = (employee) => {
    setEditingId(employee.id);
    setName(employee.name);
    setEmail(employee.email);
    setDepartment(employee.department);
    setSalary(employee.salary);
    setPhoneNumber(employee.phoneNumber || "");
  };

  // =========================
  // VIEW EMPLOYEE
  // =========================
  const handleView = (employee) => {
    alert(`
Employee Details

Name: ${employee.name}
Email: ${employee.email}
Department: ${employee.department}
Salary: ${employee.salary}
Phone: ${employee.phoneNumber}
    `);
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    setEmployees([]);
    setFilteredEmployees([]);
    resetForm();
  };

  // =========================
  // RESET FORM
  // =========================
  const resetForm = () => {
    setName("");
    setEmail("");
    setDepartment("");
    setSalary("");
    setPhoneNumber("");
    setEditingId(null);
    setErrors({});
  };

  // =========================
  // LOGIN PAGE
  // =========================
  if (!isLoggedIn) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1>Employee Management Login</h1>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        /><br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br /><br />

        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  // =========================
  // MAIN PAGE
  // =========================
  return (
    <div style={{ padding: "20px" }}>
      <h1>Employee Management System</h1>
      <h2>Welcome Admin ✅</h2>

      <button onClick={handleLogout}>Logout</button>

      <hr />

      {/* FORM */}
      <h3>{editingId ? "Update Employee" : "Add Employee"}</h3>

      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <p style={{ color: "red" }}>{errors.name}</p>

      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <p style={{ color: "red" }}>{errors.email}</p>

      <input placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} />
      <p style={{ color: "red" }}>{errors.department}</p>

      <input placeholder="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} />
      <p style={{ color: "red" }}>{errors.salary}</p>

      <input placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
      <p style={{ color: "red" }}>{errors.phoneNumber}</p>

      <button onClick={handleSubmit}>
        {editingId ? "Update" : "Add"}
      </button>

      <button onClick={resetForm} style={{ marginLeft: "10px" }}>
        Clear
      </button>

      <hr />

      {/* SEARCH */}
      <input
        placeholder="Search by name or department"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <hr />

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.department}</td>
                <td>{emp.salary}</td>
                <td>{emp.phoneNumber}</td>

                <td>
                  <button onClick={() => handleEdit(emp)}>Edit</button>
                  <button onClick={() => handleDelete(emp.id)}>Delete</button>
                  <button onClick={() => handleView(emp)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;