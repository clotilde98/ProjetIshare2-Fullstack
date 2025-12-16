import { createSlice } from "@reduxjs/toolkit";
import { accountService } from "../services/accountService.jsx";


const tokenFromStorage = accountService.getToken();
const userInfoFromStorage = accountService.getUserInfo();
const isCurrentlyLogged = !!tokenFromStorage;
const isCurrentlyAdmin = userInfoFromStorage?.isAdmin === true;

const initialState = {
  token: tokenFromStorage, 
  isLogged: isCurrentlyLogged,
  isAdmin: isCurrentlyAdmin, 
  user: userInfoFromStorage, 
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const token = action.payload;
      accountService.saveToken(token);
      const userInfo = accountService.getUserInfo();

      state.token = token;
      state.isLogged = true;
      state.isAdmin = userInfo?.isAdmin === true;
      state.user = userInfo;
    },
    logout: (state) => {
      accountService.logout();
      state.token = null;
      state.isLogged = false;
      state.isAdmin = false;
      state.user = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
