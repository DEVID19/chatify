import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Signup from "./pages/signup";
import Login from "./pages/login";
import useCurrentUser from "./customHooks/useCurrentUser";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { io } from "socket.io-client";

function App() {
  useCurrentUser();

  useEffect(() => {
    const socket = io("http://localhost:8000");
  }, []);

  const { userData, loading } = useSelector((state) => state.user);

  if (loading) return <p>loading .... </p>; // or spinner
  return (
    <Routes>
      <Route
        path="/signup"
        element={!userData ? <Signup /> : <Navigate to="/profile" />}
      />
      <Route
        path="/login"
        element={!userData ? <Login /> : <Navigate to="/" />}
      />
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to="/login" />}
      />
      <Route
        path="/profile"
        element={userData ? <Profile /> : <Navigate to="/signup" />}
      />
    </Routes>
  );
}

export default App;
