import React from 'react';
import { Link } from 'react-router-dom';

function RoleSelection() {
  return (
    <div>
      <h2>Select Your Role</h2>
      <ul>
        <li>
          <Link to="/login/student">Student</Link>
        </li>
        <li>
          <Link to="/login/admin">Admin</Link>
        </li>
      </ul>
    </div>
  );
}

export default RoleSelection;