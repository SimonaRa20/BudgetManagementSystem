import { createContext, useContext, useState } from "react";
import { RenderHeader } from "../components/structure/Header";
import { RenderMenu, RenderRoutes } from "../components/structure/RenderNavigation";

import axios from "axios";

const AuthContext = createContext();
export const AuthData = () => useContext(AuthContext);

export const AuthWrapper = () => {
  const [user, setUser] = useState({ email: "", isAuthenticated: false, role: "" });

  const login = (email, password) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post("https://localhost:7025/api/Auth/Login", {
          email: email,
          password: password,
        });

        const token = response.data.token;
        const role = response.data.role;

        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        setUser({ email: email, isAuthenticated: true, role: role });
        resolve("success");
      } catch (error) {
        reject("Incorrect password");
      }
    });
  };

  const logout = () => {
    setUser({ ...user, isAuthenticated: false, role: "" });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
    <>
    <RenderHeader />
    <RenderMenu />
    <RenderRoutes />
</>
    </AuthContext.Provider>
  );
};
