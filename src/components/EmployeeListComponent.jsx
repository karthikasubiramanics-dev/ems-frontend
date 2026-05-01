import React, { useEffect, useState } from 'react';
import {
    createEmployee,
    getEmployee,
    updateEmployee
} from '../services/EmployeeService';
import { useNavigate, useParams } from 'react-router-dom';

const AddEmployeeComponent = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [department, setDepartment] = useState('');
    const [salary, setSalary] = useState('');

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            getEmployee(id)
                .then((response) => {
                    const employee = response.data.data;

                    setName(employee.name);
                    setEmail(employee.email);
                    setDepartment(employee.department);
                    setSalary(employee.salary);
                })
                .catch(error => console.error(error));
        }
    }, [id]);

    function saveOrUpdateEmployee(e) {
        e.preventDefault();

        const employee = {
            name,
            email,
            department,
            salary
        };

        if (id) {
            updateEmployee(id, employee)
                .then(() => {
                    navigate('/');
                })
                .catch(error => console.error(error));
        } else {
            createEmployee(employee)
                .then(() => {
                    navigate('/');
                })
                .catch(error => console.error(error));
        }
    }

    return (
        <div className="container">
            <br />

            <div className="card col-md-6 offset-md-3">
                <h2 className="text-center">
                    {id ? 'Update Employee' : 'Add Employee'}
                </h2>

                <div className="card-body">
                    <form>

                        <input
                            type="text"
                            placeholder="Employee Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-control mb-2"
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control mb-2"
                        />

                        <input
                            type="text"
                            placeholder="Department"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="form-control mb-2"
                        />

                        <input
                            type="number"
                            placeholder="Salary"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                            className="form-control mb-2"
                        />

                        <button
                            className="btn btn-success"
                            onClick={saveOrUpdateEmployee}
                        >
                            Submit
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddEmployeeComponent;