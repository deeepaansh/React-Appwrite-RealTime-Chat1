import { createContext, useState, useEffect, useContext } from "react";
import { account } from "../appwriteConfig";
import { useNavigate } from "react-router";
import { ID } from "appwrite";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getUserOnLoad();
    }, []);

    const getUserOnLoad = async () => {
        try {
            let accountDetails = await account.get();
            setUser(accountDetails);
        } catch (error) {}
        setLoading(false);
    };

    const handleUserLogin = async (e, credentials) => {
        e.preventDefault();
        console.log("CREDS:", credentials);

        try {
            let response = await account.createSession(
                credentials.email,
                credentials.password
            );
            let accountDetails = await account.get();
            setUser(accountDetails);
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = async () => {
        const response = await account.deleteSession("current");
        setUser(null);
    };

    const handleRegister = async (e, credentials) => {
        e.preventDefault();
      
        if (credentials.password1 !== credentials.password2) {
          alert("Passwords did not match!");
          return;
        }
      
        try {
          const userId = 'unique()'; 
          console.log("Registering with ID:", userId, "Length:", userId.length);
          
          const response = await account.create(
            userId,
            credentials.email,
            credentials.password1,
            credentials.name
          );
      
          await account.createSession(credentials.email, credentials.password1);
          const accountDetails = await account.get();
          setUser(accountDetails);
          navigate("/");
        } catch (error) {
          console.error("Registration Error:", error);
          if (error.code === 409) {
            alert("User with this email already exists. Please login.");
          } else {
            alert("Something went wrong during registration.");
          }
        }
      };
      
      

    const contextData = {
        user,
        handleUserLogin,
        handleLogout,
        handleRegister,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? <p>Loading...</p> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;
