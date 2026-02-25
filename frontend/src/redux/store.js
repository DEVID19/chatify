import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import messageSlice from "./messageSlice";
import chatReducer from "./chatSlice";
import groupReducer from "./groupSlice";
import aiSlice from "./aiSlice";
export const store = configureStore({
  reducer: {
    user: userSlice,
    messages: messageSlice,
    chat: chatReducer,
    group: groupReducer,
    ai: aiSlice,
  },
});
