import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Axios from "../services/api"; 
import { loginSuccess, logout } from "../redux/authSlice"; 

import "../styles/login.css"; 
import group_icon from '../assets/login/Group.svg';
import lock_icon from '../assets/login/lock.svg';
import user_icon from '../assets/login/user.svg';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const response = await Axios.post("/login", { email, password });
      console.log(response.data.token);
      dispatch(loginSuccess(response.data.token));

      if (response.data.token) {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Erreur de connexion:", err.response ? err.response.data : err.message);
      setError("Email ou mot de passe incorrect.");
      dispatch(logout()); 
    }
  };

  
  return (
    <div className="formParent ">
      <div className="form ">
        <form onSubmit={handleSubmit} noValidate>
          <div className="group text-center mb-4 mt-2">
            <img className="vectorIcon" alt="Logo panier" src={group_icon} />
          </div>

         
          {error && <div className="alert alert-danger py-1 text-center">{error}</div>}

      
          <div className="email input-group mb-3 custom-input-group-wrapper">
            <span className="input-group-text userIcon-wrapper" id="email-addon">
              <img className="userIcon" alt="Icône utilisateur" src={user_icon} />
            </span>
            <input
              type="email"
              className="form-control rectangle formParentEmail"
              placeholder="EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              inputMode="email"
            />
          </div>

          <div className="password input-group mb-3 custom-input-group-wrapper">
            <span className="input-group-text lockIcon-wrapper" id="password-addon">
              <img className="lockIcon" alt="Icône cadenas" src={lock_icon} />
            </span>
            <input
              type="password" 
              className="form-control rectangle motDePasse"
              placeholder="MOT DE PASSE"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <div className="d-grid mt-3">
            <button type="submit" className="loginBtn w-100 btn mb-2">
              CONNECTER
            </button>
          </div>

          <div className="formParentMotDePasse text-center mt-2">
            <a href="#" className="forgot-link">Mot de passe oublié ?</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;