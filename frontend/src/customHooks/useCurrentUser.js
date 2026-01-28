import { useEffect } from "react";
import { server } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setuserData } from "../redux/userSlice";
import axios from "axios";

const useCurrentUser = () => {
  let dispatch = useDispatch();
  let { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        let CurrentUserData = await axios.get(`${server}/api/user/current`, {
          withCredentials: true,
        });
        dispatch(setuserData(CurrentUserData.data));
      } catch (error) {
        console.log(`no active session found ${error}`);
      }
    };

    fetchUser();
  }, [userData]);
};

export default useCurrentUser;
