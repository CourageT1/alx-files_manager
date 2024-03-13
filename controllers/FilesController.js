import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import dbClient from '../utils/db';
import imageThumbnail from 'image-thumbnail';
import { fileQueue } from '../worker'; // Import Bull queue

const FilesController = {
  async postUpload(req, res) {
    const { 'x-token': token } = req.headers;
    const { name, type, data, parentId } = req.body;

    // Existing logic to store file
    // ...

    // Enqueue job for thumbnail generation
    if (type === 'image') {
      fileQueue.add({ userId: req.userId, fileId: newFileId });
    }

    // Return response
    res.status(201).json(newFile);
  },

  async getFile(req, res) {
    const { 'x-token': token } = req.headers;
    const { id } = req.params;
    const { size } = req.query;

    // Existing logic to authenticate user and retrieve file
    // ...

    // Check if the file is an image and the size is specified
    if (file.type === 'image' && size) {
      const thumbnailPath = path.join(process.env.FOLDER_PATH || '/tmp/files_manager', `${id}_${size}`);
      if (!fs.existsSync(thumbnailPath)) {
        return res.status(404).json({ error: 'Not found' });
      }
      const mimeType = mime.lookup(thumbnailPath) || 'application/octet-stream';
      res.setHeader('Content-Type', mimeType);
      res.sendFile(thumbnailPath);
    } else {
      // Return original file data
      // ...
    }
  }
};

export default FilesController;
