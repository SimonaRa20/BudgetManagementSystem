import { createContext, useContext, useState } from "react";
import { RenderHeader } from "../components/structure/Header";
import { RenderMenu, RenderRoutes } from "../components/structure/RenderNavigation";

import axios from "axios";

const AuthContext = createContext();
export const AuthData = () => useContext(AuthContext);

export const AuthWrapper = () => {
  const [user, setUser] = useState({ email: "", isAuthenticated: false });

  const login = (email, password) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post("https://localhost:7025/api/Auth/Login", {
          email: email,
          password: password,
        });

        const token = response.data.token;

        localStorage.setItem("token", token);
        setUser({ email: email, isAuthenticated: true });
        resolve("success");
      } catch (error) {
        reject("Incorrect password");
      }
    });
  };

  const logout = () => {
    setUser({ ...user, isAuthenticated: false });
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
