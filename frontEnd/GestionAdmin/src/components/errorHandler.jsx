
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

