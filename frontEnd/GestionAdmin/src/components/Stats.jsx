import React, { useState, useEffect } from "react";
import Axios from "../services/api"; 

import annoncesIcon from "../assets/dashboard/megaphone.png"; 
import reservationsIcon from "../assets/dashboard/today.png";
import usersIcon from "../assets/dashboard/usersActif.png"; 
import retraitsIcon from "../assets/dashboard/truck.png"; 



const Stats = () => {
  const [stats, setStats] = useState({
    totalAnnonces: 0,
    totalReservations: 0,
    utilisateursActifs: 0,
    totalRetraits: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await Axios.get("/stats");
        setStats(response.data); 
        
      } catch (err) {
        console.error("Erreur lors de la récupération des statistiques:", err);
        setError("Impossible de charger les données. Vérifiez le serveur.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <p>Chargement des statistiques...</p>;
  }
  if (error) {
    return <p style={{ color: 'red', padding: '1.5rem' }}>{error}</p>;
  }

  return (
    <section className="stats-section">
      <div className="stats-grid">
        
    
        <div className="stat-card">
          <img src={annoncesIcon} alt="Icône Annonces" className="stat-icon" />
          <h5>Nombre d’annonces</h5>
          <p className="stat-value">{stats.totalAnnonces}</p>
        </div>

    
        <div className="stat-card">
          <img src={reservationsIcon} alt="Icône Réservations" className="stat-icon" />
          <h5>Réservations effectuées</h5>
          <p className="stat-value">{stats.totalReservations}</p>
        </div>

     
        <div className="stat-card">
          <img src={usersIcon} alt="Icône Utilisateurs" className="stat-icon" />
          <h5>Utilisateurs</h5>
          <p className="stat-value">{stats.utilisateursActifs}</p>
        </div>

      
        <div className="stat-card">
          <img src={retraitsIcon} alt="Icône Retraits" className="stat-icon" />
          <h5>Nombre de retraits</h5>
          <p className="stat-value">{stats.totalRetraits}</p>
        </div>
        
      </div>
    </section>
  );
};

export default Stats;