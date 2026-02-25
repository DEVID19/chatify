import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    recentChats: [],
    unreadCounts: {},
  },
  reducers: {
    moveChatToTop: (state, action) => {
      // Now accepts { userId, incrementUnread }
      const { userId, incrementUnread } = action.payload;

      state.recentChats = [
        userId,
        ...state.recentChats.filter((id) => id !== userId),
      ];

      // Only increment if explicitly told to (i.e., you are the RECEIVER)
      if (incrementUnread) {
        state.unreadCounts[userId] = (state.unreadCounts[userId] || 0) + 1;
      }
    },

    clearUnreadCount: (state, action) => {
      const userId = action.payload;
      state.unreadCounts[userId] = 0;
    },
  },
});

export const { moveChatToTop, clearUnreadCount } = chatSlice.actions;
export default chatSlice.reducer;