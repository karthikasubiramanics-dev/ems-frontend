import React, { useEffect, useState } from 'react';
import { getEmployee } from '../services/EmployeeService';
import { useParams } from 'react-router-dom';

const ViewEmployeeComponent = () => {
    const [employee, setEmployee] = useState({});
    const { id } = useParams();

    useEffect(() => {
        getEmployee(id)
            .then((response) => {
                setEmployee(response.data.data);
            })
            .catch(error => console.error(error));
    }, [id]);

    return (
        <div className="container">
            <h2 className="text-center">View Employee</h2>

            <div className="card col-md-6 offset-md-3">
                <div className="card-body">

                    <p>
                        <strong>Name:</strong> {employee.name}
                    </p>

                    <p>
                        <strong>Email:</strong> {employee.email}
                    </p>

                    <p>
                        <strong>Department:</strong> {employee.department}
                    </p>

                    <p>
                        <strong>Salary:</strong> {employee.salary}
                    </p>

                </div>
            </div>
        </div>
    );
};

export default ViewEmployeeComponent;