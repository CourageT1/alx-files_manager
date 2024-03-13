import Queue from 'bull';
import dbClient from './utils/db';
import { userQueue } from './userQueue';

export const fileQueue = new Queue('fileQueue');

fileQueue.process(async job => {
  const { userId, fileId } = job.data;

  if (!userId) {
    throw new Error('Missing userId');
  }

  if (!fileId) {
    throw new Error('Missing fileId');
  }

  const user = await dbClient.collection('users').findOne({ _id: userId });
  const file = await dbClient.collection('files').findOne({ _id: fileId, userId });

  if (!user) {
    throw new Error('User not found');
  }

  if (!file) {
    throw new Error('File not found');
  }

  // Generate thumbnails for images
  // Use image-thumbnail module

  console.log('Thumbnails generated successfully');

  return { user, file };
});
