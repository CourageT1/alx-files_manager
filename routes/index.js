import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController'; // Import FilesController

const router = express.Router();

// Define routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UsersController.getMe);
router.post('/files', FilesController.postUpload);
router.get('/files/:id', FilesController.getShow); // New endpoint for retrieving a file document
router.get('/files', FilesController.getIndex); // New endpoint for retrieving file documents with pagination
router.put('/files/:id/publish', FilesController.putPublish); // New endpoint for publishing a file
router.put('/files/:id/unpublish', FilesController.putUnpublish); // New endpoint for unpublishing a file
router.get('/files/:id/data', FilesController.getFile); // New endpoint for retrieving file data

export default router;
