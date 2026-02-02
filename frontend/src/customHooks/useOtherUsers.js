import { useEffect } from "react";
import { server } from "../main";
import { useDispatch } from "react-redux";
import { setOtherUsers } from "../redux/userSlice";
import axios from "axios";

const useOtherUsers = () => {
  let dispatch = useDispatch();
  useEffect(() => {
    const fetchOtherUsers = async () => {
      try {
        const res = await axios.get(`${server}/api/user/others`, {
          withCredentials: true,
        });

        dispatch(setOtherUsers(res.data));
      } catch (err) {
        dispatch(setOtherUsers(null));
        console.log(err);
      }
    };

    fetchOtherUsers();
  }, []);
};

export default useOtherUsers;
