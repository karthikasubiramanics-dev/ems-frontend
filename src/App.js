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
  const [editingId, setEditingId] = useState(null);

  // Search
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
        body: JSON.stringify({
          username,
          password
        })
      });

      const result = await response.json();

      if (result.message === "Login successful") {
        alert("Login Success ✅");
        setIsLoggedIn(true);
      } else {
        alert(result.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  };

  // =========================
  // GET ALL EMPLOYEES
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
    if (!name || !email || !department || !salary) {
      alert("Please fill all fields");
      return;
    }

    const employeeData = {
      name,
      email,
      department,
      salary
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

      await response.json();

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
  // DELETE
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure to delete this employee?"
    );

    if (!confirmDelete) return;

    try {
      await fetch(`${BASE_URL}/api/employees/${id}`, {
        method: "DELETE"
      });

      alert("Employee Deleted Successfully ✅");
      fetchEmployees();

    } catch (error) {
      console.error(error);
      alert("Delete Failed");
    }
  };

  // =========================
  // UPDATE (Load Form)
  // =========================
  const handleEdit = (employee) => {
    setEditingId(employee.id);
    setName(employee.name);
    setEmail(employee.email);
    setDepartment(employee.department);
    setSalary(employee.salary);
  };

  // =========================
  // VIEW
  // =========================
  const handleView = (employee) => {
    alert(`
Employee Details

Name: ${employee.name}
Email: ${employee.email}
Department: ${employee.department}
Salary: ${employee.salary}
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
    setEditingId(null);
  };

  // =========================
  // LOGIN PAGE
  // =========================
  if (!isLoggedIn) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1>Employee Management Login</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />
        <br /><br />

        <button onClick={handleLogin}>
          Login
        </button>
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

      <button onClick={handleLogout}>
        Logout
      </button>

      <hr />

      {/* ADD / UPDATE FORM */}
      <h3>
        {editingId
          ? "Update Employee"
          : "Add Employee"}
      </h3>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />
      <br /><br />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />
      <br /><br />

      <input
        type="text"
        placeholder="Department"
        value={department}
        onChange={(e) =>
          setDepartment(e.target.value)
        }
      />
      <br /><br />

      <input
        type="number"
        placeholder="Salary"
        value={salary}
        onChange={(e) =>
          setSalary(e.target.value)
        }
      />
      <br /><br />

      <button onClick={handleSubmit}>
        {editingId
          ? "Update Employee"
          : "Add Employee"}
      </button>

      <button
        onClick={resetForm}
        style={{ marginLeft: "10px" }}
      >
        Clear
      </button>

      <hr />

      {/* SEARCH */}
      <h3>Search Employee</h3>

      <input
        type="text"
        placeholder="Search by Name or Department"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        style={{
          padding: "10px",
          width: "300px"
        }}
      />

      <hr />

      {/* EMPLOYEE TABLE */}
      <h3>Employee List</h3>

      {loading ? (
        <p>Loading employees...</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          cellSpacing="0"
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.department}</td>
                <td>{employee.salary}</td>

                <td>
                  <button
                    onClick={() =>
                      handleEdit(employee)
                    }
                  >
                    Update
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(employee.id)
                    }
                    style={{
                      marginLeft: "5px"
                    }}
                  >
                    Delete
                  </button>

                  <button
                    onClick={() =>
                      handleView(employee)
                    }
                    style={{
                      marginLeft: "5px"
                    }}
                  >
                    View
                  </button>
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