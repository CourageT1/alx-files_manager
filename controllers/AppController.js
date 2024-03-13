import redisClient from '../utils/redis';
import dbClient from '../utils/db';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

const AuthController = {
  async getConnect(req, res) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const encodedCredentials = authHeader.split(' ')[1];
    const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
    const [email, password] = decodedCredentials.split(':');

    // Hash the password to compare with stored hashed password
    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

    // Retrieve user from DB
    const user = await dbClient.collection('users').findOne({ email, password: hashedPassword });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Generate token
    const token = uuidv4();

    // Store token in Redis with user ID for 24 hours
    await redisClient.set(`auth_${token}`, user._id.toString(), 24 * 60 * 60);

    res.status(200).json({ token });
  },

  async getDisconnect(req, res) {
    const { 'x-token': token } = req.headers;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Delete token from Redis
    await redisClient.del(`auth_${token}`);

    res.status(204).end();
  }
};

export default AuthController;
