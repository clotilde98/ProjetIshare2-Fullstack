import { NavLink } from "react-router-dom";

import homeIcon from "../assets/dashboard/home.png";
import categoryIcon from "../assets/dashboard/shoppingCar.png";
import reservationIcon from "../assets/dashboard/clipboard.png";
import listingIcon from "../assets/dashboard/commercial.png";
import usersIcon from "../assets/dashboard/users.png";
import commentIcon from "../assets/dashboard/comment.png";


const Sidebar = () => (
  <nav className="sidebar-nav">
    <div className="brand">GESTIONDON</div>

    <ul className="nav-list">
      <li>
        <NavLink to="/dashboard" end className="nav-link">
          <div className="nav-item">
            <img src={homeIcon} alt="Home" width="18" /> <span>Accueil</span>
          </div>
        </NavLink>
      </li>

        <li>
        <NavLink to="/dashboard/reservations" className="nav-link">
          <div className="nav-item">
            <img src={reservationIcon} alt="Reservations" width="18" /> <span>Réservations</span>
          </div>
        </NavLink>
      </li>

       <li>
        <NavLink to="/dashboard/Posts" className="nav-link">
          <div className="nav-item">
            <img src={listingIcon} alt="Listings" width="18" /> <span>Annonces</span>
          </div>
        </NavLink>
      </li>

        <li>
        <NavLink to="/dashboard/Users" className="nav-link">
          <div className="nav-item">
            <img src={usersIcon} alt="Users" width="18" /> <span>Utilisateurs</span>
          </div>
        </NavLink>
      </li>

      <li>
        <NavLink to="/dashboard/categories" className="nav-link">
          <div className="nav-item">
            <img src={categoryIcon} alt="Category" width="18" /> <span>Catégories</span>
          </div>
        </NavLink>
      </li>

      

      <li>
        <NavLink to="/dashboard/Comments" className="nav-link">
          <div className="nav-item">
           <img src={commentIcon} alt="comment" width="18" /> <span>Commentaires</span>
          </div>
        </NavLink>
      </li>
    </ul>
  </nav>
);

export default Sidebar;
