import React from "react";
import Sidebar from "../components/Sidebar";
import MessageArea from "../components/MessageArea";
import useOtherUsers from "../customHooks/useOtherUsers";
import useGetMessages from "../customHooks/useGetMessages";
import useGetGroups from "../customHooks/useGetGroups";

const Home = () => {
  useOtherUsers();
  useGetGroups(); 
  useGetMessages();

  return (
    <div className="w-full h-[100vh] flex overflow-hidden ">
      <Sidebar />
      <MessageArea />
    </div>
  );
};

export default Home;
