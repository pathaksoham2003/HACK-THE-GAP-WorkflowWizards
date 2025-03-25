import React, { useState } from "react";
import API_ENDPOINTS from "../../api/endpoint"; // Import API endpoints

const Register = () => {
  const [formData, setFormData] = useState({
    user_type: "student",
    firstName: "",
    lastName: "",
    emailAddress: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(API_ENDPOINTS.REGISTER_USER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log(response);
        setMessage("User registered successfully. Check your email for verification.");
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setMessage("Error: Unable to register.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-blue-900">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-blue-600 text-xl font-semibold mb-4">REGISTER</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <select
            name="user_type"
            value={formData.user_type}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />

          <input
            type="email"
            name="emailAddress"
            placeholder="Email"
            value={formData.emailAddress}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {message && <p className="mt-2 text-center text-sm">{message}</p>}
      </div>
    </div>
  );
};

export default Register
