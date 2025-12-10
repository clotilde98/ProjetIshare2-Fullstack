import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../components/login";
import Dashboard from "../components/dashboard";
import ProtectedRoute from "../components/ProtectedRoute";

import Stats from "../components/Stats";
import Comments from "../components/Comments";
import Posts from "../components/Posts";
import Reservation from "../components/reservations";
import Categories from "../components/Categories";
import Users from "../components/Users";
import ForgetPassword from "../components/forgetPassword"; 

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <Login /> },
  { path: "/forgetpassword", element: <ForgetPassword /> },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Stats /> },            
      { path: "comments", element: <Comments /> },    
      { path: "posts", element: <Posts /> },   
      { path: "reservations", element: <Reservation /> } ,
      { path: "categories", element: <Categories /> } ,  
      { path: "users", element: <Users /> } ,        
    ],
  },
]);

export default router;
