import axios from "axios";
import { useDispatch } from "react-redux";
import { server } from "../main";
import {addAIMessage, setAIMessages, setAITyping } from "../redux/aiSlice";

const mapHistory = (history) =>
  history.map((h, i) => ({
    _id: `ai-${i}`,
    sender: h.role === "user" ? "USER" : "AI",
    message: h.parts?.[0]?.text || "",
  }));

export const useAIChat = () => {
  const dispatch = useDispatch();

  const loadAIHistory = async () => {
    const res = await axios.get(`${server}/api/ai/history`, {
      withCredentials: true,
    });
    dispatch(setAIMessages(mapHistory(res.data)));
  };

  const sendAIMessage = async ({ text, image }) => {
    dispatch(
      addAIMessage({
        _id: Date.now(),
        sender: "USER",
        message: text,
        image: image ? URL.createObjectURL(image) : null,
      }),
    );

    dispatch(setAITyping(true));

    const formData = new FormData();
    if (text) formData.append("message", text);
    if (image) formData.append("image", image);

    const res = await axios.post(`${server}/api/ai/chat`, formData, {
      withCredentials: true,
    });

    dispatch(setAITyping(false));

    dispatch(
      addAIMessage({
        _id: Date.now() + 1,
        sender: "AI",
        message: res.data.reply,
        image: res.data.imageUrl,
      }),
    );
  };

  return { loadAIHistory, sendAIMessage };
};
