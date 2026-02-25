import { createSlice } from "@reduxjs/toolkit";

const groupSlice = createSlice({
  name: "group",
  initialState: {
    groups: [],           // all groups current user belongs to
    selectedGroup: null,  // currently open group
    groupMessages: [],    // messages of currently open group
    groupUnreadCounts: {}, // unread message count per group { groupId: count }
  },
  reducers: {
    // Set full groups list (on page load)
    setGroups: (state, action) => {
      state.groups = action.payload;
    },

    // Add a single new group (when created or when added by someone)
    addNewGroup: (state, action) => {
      const exists = state.groups.find((g) => g._id === action.payload._id);
      if (!exists) state.groups.unshift(action.payload);
    },

    // Open a group conversation
    setSelectedGroup: (state, action) => {
      state.selectedGroup = action.payload;
    },

    // Set messages when group is opened
    setGroupMessages: (state, action) => {
      state.groupMessages = action.payload;
    },

    // Append a new message in real time
    addGroupMessage: (state, action) => {
      state.groupMessages.push(action.payload);
    },

    // Move group to top of list when new message arrives
    // now accepts { groupId, incrementUnread } instead of just groupId
    // incrementUnread: true  → you RECEIVED the message → show badge
    // incrementUnread: false → you SENT the message    → no badge
    moveGroupToTop: (state, action) => {
      const { groupId, incrementUnread } = action.payload;

      const index = state.groups.findIndex((g) => g._id === groupId);
      if (index > -1) {
        const [group] = state.groups.splice(index, 1);
        state.groups.unshift(group);
      }

      // only increment badge count if you are the receiver
      if (incrementUnread) {
        state.groupUnreadCounts[groupId] =
          (state.groupUnreadCounts[groupId] || 0) + 1;
      }
    },

    // Clear unread badge when user opens the group chat
    clearGroupUnreadCount: (state, action) => {
      const groupId = action.payload;
      state.groupUnreadCounts[groupId] = 0;
    },

    // ── Delete a group message by its _id from groupMessages array ──
    deleteGroupMessage: (state, action) => {
      const messageId = action.payload;
      state.groupMessages = state.groupMessages.filter(
        (m) => m._id !== messageId
      );
    },
  },
});

export const {
  setGroups,
  addNewGroup,
  setSelectedGroup,
  setGroupMessages,
  addGroupMessage,
  moveGroupToTop,
  clearGroupUnreadCount,
  deleteGroupMessage, 
} = groupSlice.actions;

export default groupSlice.reducer;