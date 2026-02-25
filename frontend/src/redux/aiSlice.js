import { createSlice } from "@reduxjs/toolkit";

const aiSlice = createSlice({
  name: "ai",
  initialState: {
    aiMessages: [],
    isTyping: false,
  },
  reducers: {
    setAIMessages: (state, action) => {
      state.aiMessages = action.payload;
    },
    addAIMessage: (state, action) => {
      state.aiMessages.push(action.payload);
    },
    setAITyping: (state, action) => {
      state.isTyping = action.payload;
    },
  },
});

export const { setAIMessages, addAIMessage, setAITyping } = aiSlice.actions;

export default aiSlice.reducer;
