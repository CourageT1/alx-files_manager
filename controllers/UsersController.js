import redisClient from '../utils/redis';
import dbClient from '../utils/db';

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
  }
};

export default UsersController;
