import { useEffect } from "react";
import { server } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setuserData } from "../redux/userSlice";
import axios from "axios";

const useGetMessages = () => {
  let dispatch = useDispatch();
  let { selectedUser } = useSelector();
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(`${server}/api/message/${selectedUser._id}`, {
          withCredentials: true,
        });

        dispatch(setuserData(res.data));
      } catch (err) {
        dispatch(setuserData(null));
        console.log(err);
      } finally {
        dispatch(setLoading(false));
      }
    };

    getMessages();
  }, []);
};

export default useGetMessages;
