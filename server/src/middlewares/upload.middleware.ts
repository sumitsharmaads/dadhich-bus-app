import multer from 'multer';

const storage = multer.memoryStorage();

// Create middleware that can handle both 'image' and 'file' fields
export const uploadSingle = multer({ storage }).single('image');

// For backward compatibility, also export a version that expects 'file'
export const uploadSingleFile = multer({ storage }).single('file');
