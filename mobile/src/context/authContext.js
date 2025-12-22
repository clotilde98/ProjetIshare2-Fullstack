
import React, { createContext, useState, useEffect } from 'react';
import * as tokenService from '../service/token.js';
import Axios from '../service/api.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  return (
    <AuthContext.Provider value={{user, setUser}}>
      {children}
    </AuthContext.Provider>
  );
};
