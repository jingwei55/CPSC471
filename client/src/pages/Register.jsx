import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [selectedRole, setSelectedRole] = useState(""); // New state for selected role
  const [err, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Include the selected role in the registration data
      await axios.post("/auth/register", { ...inputs, role: selectedRole });
      navigate("/login");
    } catch (err) {
      setError(err.response.data);
    }
  };

  return (
    <div className="auth">
      <h1>Register</h1>
      <form>
        <input
          required
          type="text"
          placeholder="username"
          name="username"
          onChange={handleChange}
        />
        <input
          required
          type="email"
          placeholder="email"
          name="email"
          onChange={handleChange}
        />
        <input
          required
          type="password"
          placeholder="password"
          name="password"
          onChange={handleChange}
        />

        {/* Radio buttons for selecting role */}
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="role"
              value="employee"
              checked={selectedRole === "employee"}
              onChange={handleRoleChange}
            />
            Employee
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="role"
              value="member"
              checked={selectedRole === "member"}
              onChange={handleRoleChange}
            />
            Member
            </label>
        </div>

        <button onClick={handleSubmit}>Register</button>
        {err && <p>{err}</p>}
        <span>
          Do you have an account? <Link to="/login">Login</Link>
        </span>
      </form>
    </div>
  );
};

export default Register;
