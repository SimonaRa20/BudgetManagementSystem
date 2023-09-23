import { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useReducer(
    (formData, newItem) => {
      return { ...formData, ...newItem };
    },
    {
      name: "",
      surname: "",
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
  );
  const [errorMessage, setErrorMessage] = useState(null);

  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const doRegister = async () => {
    try {
      // Check if email is valid
      if (!emailRegex.test(formData.email)) {
        setErrorMessage("Please enter a valid email address");
        return;
      }

      // Check if password is at least 8 characters
      if (formData.password.length < 8) {
        setErrorMessage("Password must be at least 8 characters");
        return;
      }

      // Check if password and confirmPassword match
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage("Password and Confirm Password do not match");
        return;
      }

      const response = await axios.post(
        "https://localhost:7025/api/Auth/Register",
        {
          name: formData.name,
          surname: formData.surname,
          userName: formData.userName,
          email: formData.email,
          password: formData.password,
        }
      );

      if (response.status == '200') {
        navigate("/login");
      }
    } catch (error) {
      setErrorMessage(error.response.data);
    }
  };

  return (
    <div className="page">
      <h2>Register</h2>
      <div className="inputs">
        <div className="input">
          <input
            className="text-input"
            value={formData.name}
            onChange={(e) => setFormData({ name: e.target.value })}
            type="text"
            placeholder="Name"
            required
          />
        </div>
        <div className="input">
          <input
            className="text-input"
            value={formData.surname}
            onChange={(e) => setFormData({ surname: e.target.value })}
            type="text"
            placeholder="Surname"
            required
          />
        </div>
        <div className="input">
          <input
            className="text-input"
            value={formData.userName}
            onChange={(e) => setFormData({ userName: e.target.value })}
            type="text"
            placeholder="Username"
            required
          />
        </div>
        <div className="input">
          <input
            className="text-input"
            value={formData.email}
            onChange={(e) => setFormData({ email: e.target.value })}
            type="email"
            placeholder="Email"
            required
          />
        </div>
        <div className="input">
          <input
            className="text-input"
            value={formData.password}
            onChange={(e) => setFormData({ password: e.target.value })}
            type="password"
            placeholder="Password"
            required
          />
        </div>
        <div className="input">
          <input
            className="text-input"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ confirmPassword: e.target.value })}
            type="password"
            placeholder="Confirm Password"
            required
          />
        </div>
        <div className="button">
          <button className="register-button" onClick={doRegister}>
            Register
          </button>
        </div>
        {errorMessage ? <div className="error">{errorMessage}</div> : null}
      </div>
    </div>
  );
};
