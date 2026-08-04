import multer from 'multer';
import path from 'path';
const storage = multer.memoryStorage();

export const upload = multer({
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    storage: storage
});
