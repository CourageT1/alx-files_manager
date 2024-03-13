import redisClient from '../utils/redis';
import dbClient from '../utils/db';
import { userQueue } from '../worker';

const UsersController = {
  async getMe(req, res) {
    const { 'x-token': token } = req.headers;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Retrieve user ID from Redis
    const userId = await redisClient.get(`auth_${token}`);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Retrieve user from DB based on user ID
    const user = await dbClient.collection('users').findOne({ _id: userId });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Return user object with only email and id
    res.status(200).json({ id: user._id, email: user.email });
  },

  async postNew(req, res) {
    try {
      const { email, password } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Missing email' });
      }

      if (!password) {
        return res.status(400).json({ error: 'Missing password' });
      }

      const existingUser = await dbClient.collection('users').findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const newUser = {
        email,
        password: password // SHA1 hash should be performed here
      };

      const result = await dbClient.collection('users').insertOne(newUser);

      // Add job to the userQueue for sending welcome email
      userQueue.add({ userId: result.insertedId });

      return res.status(201).json({ id: result.insertedId, email });
    } catch (error) {
      console.error('Error creating new user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export default UsersController;
