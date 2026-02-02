import { useEffect } from "react";
import { server } from "../main";
import { useDispatch } from "react-redux";
import { setLoading, setuserData } from "../redux/userSlice";
import axios from "axios";

const useCurrentUser = () => {
  let dispatch = useDispatch();
  // let { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${server}/api/user/current`, {
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

    fetchUser();
  }, []);
};

export default useCurrentUser;
