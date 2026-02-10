import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import useCurrentUser from "./customHooks/useCurrentUser";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { server } from "./main";
import { setOnlineUsers, setSocket } from "./redux/userSlice";

function App() {
  useCurrentUser();
  const { userData, loading, socket } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (userData) {
      const socketio = io(`${server}`, {
        query: {
          userId: userData?._id,
        },
      });

      dispatch(setSocket(socketio));

      socketio.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
      });

      return () => socketio.close();
    } else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, [userData]);

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
