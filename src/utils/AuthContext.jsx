// src/utils/AuthContext.jsx

import { createContext, useState, useEffect, useContext } from "react";
import { account, IDtool as ID } from "../appwriteConfig"; // ← import from appwriteConfig.js
import { useNavigate } from "react-router";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading]          = useState(true);
  const [user, setUser]                = useState(null);
  const [isRegistering, setRegistering] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getUserOnLoad();
  }, []);

  const getUserOnLoad = async () => {
    try {
      const accountDetails = await account.get();
      console.log("User details:", accountDetails);
      setUser(accountDetails);
    } catch (error) {
      console.error("account.get() failed:", error);
      // error.code === 401 means “no active session”
    }
    setLoading(false);
  };
  

  const handleRegister = async (e, credentials) => {
    e.preventDefault();

    // 🔍 Basic client-side validation:
    if (!credentials.email.includes("@")) {
      alert("Please enter a valid email.");
      return;
    }
    if (credentials.password1.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }
    if (credentials.password1 !== credentials.password2) {
      alert("Passwords do not match!");
      return;
    }

    setRegistering(true);
    try {
      // 🎯 Generate a valid userId (≤36 chars, valid chars):
      const userId = ID.unique();
      console.log("Registering with ID:", userId, "Length:", userId.length);

      // 🔑 Create the new user account
      await account.create(
        userId,
        credentials.email,
        credentials.password1,
        credentials.name
      );

      // ✅ Immediately create a session (log in the new user)
      await account.createEmailPasswordSession(credentials.email, credentials.password1);;

      const accountDetails = await account.get();
      setUser(accountDetails);
      navigate("/");
    } catch (error) {
      console.error("Registration Error:", error);
      if (error.code === 409) {
        alert("A user with this email already exists. Please login.");
      } else if (
        error.message &&
        error.message.toLowerCase().includes("password")
      ) {
        alert(
          "Invalid password: must be 8–265 characters long and not too common."
        );
      } else {
        alert("Something went wrong during registration.");
      }
    } finally {
      setRegistering(false);
    }
  };

  const handleUserLogin = async (e, credentials) => {
    e.preventDefault();
    try {
      await account.createEmailPasswordSession(credentials.email, credentials.password);;
      const accountDetails = await account.get();
      setUser(accountDetails);
      navigate("/");
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login failed: " + (error.message || "Please try again."));
    }
  };

  const handleLogout = async () => {
    await account.deleteSession("current");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        handleRegister,
        handleUserLogin,
        handleLogout,
      }}
    >
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
