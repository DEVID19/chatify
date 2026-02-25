import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { server } from "../main";
import {
  setGroups,
  addNewGroup,
  addGroupMessage,
  moveGroupToTop,
} from "../redux/groupSlice";

const useGetGroups = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((state) => state.user);

  // Fetch all groups on mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get(`${server}/api/group/my-groups`, {
          withCredentials: true,
        });
        dispatch(setGroups(res.data));
      } catch (err) {
        console.log("useGetGroups error:", err);
      }
    };
    fetchGroups();
  }, []);

  // Socket listeners — real time group events
  useEffect(() => {
    if (!socket) return;

    // Someone added you to a group → add it to your sidebar
    socket.on("addedToGroup", (group) => {
      dispatch(addNewGroup(group));
    });

    // New message in a group you belong to
    socket.on("newGroupMessage", ({ message, groupId }) => {
      dispatch(addGroupMessage(message));
      dispatch(moveGroupToTop(groupId));
    });

    return () => {
      socket.off("addedToGroup");
      socket.off("newGroupMessage");
    };
  }, [socket]);
};

export default useGetGroups;
