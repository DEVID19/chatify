import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    loading: true,
  },
  reducers: {
    setuserData: (state, action) => {
      state.userData = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setuserData, setLoading } = userSlice.actions;
export default userSlice.reducer;
