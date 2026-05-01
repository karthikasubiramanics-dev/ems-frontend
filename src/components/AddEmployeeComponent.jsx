import React, { useEffect, useState } from 'react';
import { listEmployees } from '../services/EmployeeService';

const EmployeeListComponent = () => {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        getAllEmployees();
    }, []);

    function getAllEmployees() {
        listEmployees()
            .then((response) => {
                // IMPORTANT:
                // Backend returns:
                // { status, message, data }
                // so we must use response.data.data
                setEmployees(response.data.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <div className="container">
            <h2 className="text-center">Employee Management System</h2>

            <table className="table table-bordered table-striped">
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
                    {
                        employees.map(employee =>
                            <tr key={employee.id}>
                                <td>{employee.id}</td>
                                <td>{employee.name}</td>
                                <td>{employee.email}</td>
                                <td>{employee.department}</td>
                                <td>{employee.salary}</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    );
};

export default EmployeeListComponent;