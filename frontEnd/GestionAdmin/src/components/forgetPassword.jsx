import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import Axios from "../services/api"; 



import "../styles/login.css"; 
import user_icon from '../assets/login/user.svg'; 

const ForgetPassword = () => { 
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null); 
    const [loading, setLoading] = useState(false); 
    const [successMessage, setSuccessMessage] = useState(null); 


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null); // Réinitialiser les messages
        
        if (!email) {
            setError("Veuillez entrer une adresse e-mail.");
            return;
        }

        setLoading(true);

        try {
            // 3. Changement de l'endpoint pour l'envoi de l'e-mail de réinitialisation
            const response = await Axios.post("/forgot-password", { email }); 
            
            // Logique de succès
            setSuccessMessage("Un lien de réinitialisation a été envoyé à votre adresse e-mail.");
            setEmail("");
            
        } catch (err) {
            // Gérer les erreurs de l'API (ex: email non trouvé)
            console.error("Erreur d'envoi du lien:", err.response ? err.response.data : err.message);
            setError("Impossible d'envoyer le lien. Veuillez vérifier l'e-mail.");
            // Pas besoin de dispatch(logout()) ici
        } finally {
            setLoading(false);
        }
    };

    
    return (
        <div className="formParent ">
            <div className="form ">
                <form onSubmit={handleSubmit} noValidate>
                    <div className="group text-center mb-4 mt-2">
                        {/* 4. Nouveau titre */}
                        <h3 className="mt-3">Réinitialisation du mot de passe</h3> 
                    </div>

                    
                    {/* Affichage des messages d'erreur ou de succès */}
                    {error && <div className="alert alert-danger py-1 text-center">{error}</div>}
                    {successMessage && <div className="alert alert-success py-1 text-center">{successMessage}</div>}

                    {/* Champ Email (similaire à l'original) */}
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
                            autoComplete="email" 
                            inputMode="email"
                            disabled={loading || successMessage} // Désactiver pendant l'envoi ou le succès
                        />
                    </div>

                    {/* Suppression du champ de mot de passe */}
                    {/* <div className="password input-group mb-3 custom-input-group-wrapper">...</div> */}

                    <div className="d-grid mt-3">
                        <button 
                            type="submit" 
                            className="loginBtn w-100 btn mb-2"
                            disabled={loading || successMessage}
                        >
                            {/* 4. Nouveau texte du bouton */}
                            {loading ? "ENVOI EN COURS..." : "ENVOYER LE LIEN"} 
                        </button>
                    </div>

                    <div className="formParentMotDePasse text-center mt-2">
                        {/* Changement : Lien de retour à la connexion */}
                        <Link to="/login" className="forgot-link"> 
                            Retour à la connexion 
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgetPassword; // 1. Changement de l'exportation