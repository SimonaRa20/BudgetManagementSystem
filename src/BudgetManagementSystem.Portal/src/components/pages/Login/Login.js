import { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthData } from "../../../auth/AuthWrapper";
import "./Login.css"; // Import your CSS file

export const Login = () => {
  const navigate = useNavigate();
  const { login } = AuthData();
  const [formData, setFormData] = useReducer(
    (formData, newItem) => {
      return { ...formData, ...newItem };
    },
    { email: "", password: "" }
  );
  const [errorMessage, setErrorMessage] = useState(null);

  const doLogin = async () => {
    try {
      const response = await axios.post(
        "https://localhost:7025/api/Auth/Login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      const token = response.data.token;
      const id = response.data.id;

      localStorage.setItem("token", token);
      localStorage.setItem("id", id);

      console.log(token);
      console.log(id);
      await login(formData.email, formData.password);
      navigate("/");
    } catch (error) {
      
      setErrorMessage(error.response.data);
    }
  };

  return (
    <div className="page">
      <h2>User Login</h2>
      <div className="inputs">
        <div className="input">
          <input
            className="text-input"
            value={formData.email}
            onChange={(e) => setFormData({ email: e.target.value })}
            type="text"
            placeholder="Email"
          />
        </div>
        <div className="input">
          <input
            className="text-input"
            value={formData.password}
            onChange={(e) => setFormData({ password: e.target.value })}
            type="password"
            placeholder="Password"
          />
        </div>
        <div className="button">
          <button className="login-button" onClick={doLogin}>
            Log in
          </button>
        </div>
        {errorMessage ? (
          <div className="error">{errorMessage}</div>
        ) : null}
      </div>
    </div>
  );
};
