
export const getUserFormErrors = (err) => {
    if (!err.response) return null;

    const { status, data } = err.response;
    const message = data?.message?.toLowerCase() || "";

    if (status === 409 || message.includes("email")) {
        return [
            {
                name: 'email',
                errors: ['Cette adresse email est déjà utilisée.'],
            }
        ];
    }
    
    return null; 
};

export const getReservationFormErrors = (err) => {
    if (!err.response) return null;
    const { status, data } = err.response;
    const message = data?.message?.toLowerCase() || "";

    if (status === 409 || message.includes("reserved") || message.includes("déjà réservé")) {
        return [{ 
            name: 'post_id', 
            errors: ["Cette annonce n'est plus disponible, elle est déjà réservée."] 
        }];
    }

    if (status === 403 || message.includes("own post") || message.includes("propre annonce")) {
        return [{ 
            name: 'post_id', 
            errors: ["Action interdite : vous êtes l'auteur de cette annonce."] 
        }];
    }
    return null;
};