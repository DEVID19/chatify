import React from "react";
import Sidebar from "../components/Sidebar";
import MessageArea from "../components/MessageArea";
import useOtherUsers from "../customHooks/useOtherUsers";
import useGetMessages from "../customHooks/useGetMessages";

const Home = () => {
  useOtherUsers();
  useGetMessages();
  return (
    <div className="w-full h-[100vh] flex overflow-hidden ">
      <Sidebar />
      <MessageArea />
    </div>
  );
};

export default Home;
