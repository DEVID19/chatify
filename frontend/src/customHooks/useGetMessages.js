import { useEffect } from "react";
import { server } from "../main";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setMessages } from "../redux/messageSlice";

const useGetMessages = () => {
  let dispatch = useDispatch();
  let { selectedUser, userData } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${server}/api/message/get/${selectedUser._id}`,
          {
            withCredentials: true,
          },
        );

        dispatch(setMessages(res.data));
      } catch (err) {
        dispatch(setMessages([]));
        console.log(err);
      }
    }; 

    fetchMessages();
  }, [selectedUser, userData]);
};

export default useGetMessages;
