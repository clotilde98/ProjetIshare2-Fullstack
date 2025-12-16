import { jwtDecode } from "jwt-decode";

import React, { useState } from "react";


let saveToken = (token) =>{
    localStorage.setItem('token',token) 
}

let logout = () => {

    localStorage.removeItem('token') 
}


let isLogged = () => {
   let token = localStorage.getItem('token') ;
   return !! token

}

const isTokenExpired = (token) => {
    try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
            return true; 
        }
        return false;
    } catch (error) {
        return true;
    }
};

 const getToken = () => {
const token = localStorage.getItem('token');
    if (!token) {
        return null;
    }

    if (isTokenExpired(token)) {
        localStorage.removeItem('token'); 
        return null;
    }

    return token;};

const getUserInfo = () => {
  const token = getToken();
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Erreur de décodage du token :", error);
    return null;
  }
};

const isAdmin = () => {
  const userInfo = getUserInfo();
  return userInfo?.isAdmin === true;
};

export const accountService = {
  saveToken,
  logout,
  isLogged,
  getToken,
  getUserInfo,
  isAdmin,
};