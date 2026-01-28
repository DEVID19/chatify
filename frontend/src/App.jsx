import { Route, Routes } from "react-router-dom";
import "./App.css";
import Signup from "./pages/signup";
import Login from "./pages/login";
import useCurrentUser from "./customHooks/useCurrentUser";

function App() {
  useCurrentUser();
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
