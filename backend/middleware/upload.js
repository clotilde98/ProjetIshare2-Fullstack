import multer from 'multer';
import path from 'path';
const storage = multer.memoryStorage();

export const upload = multer({
    limits: {
        fileSize: 700000 
    },
    storage: storage
});
