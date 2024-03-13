import { MongoClient } from 'mongodb';

class DBClient {
    constructor() {
        const {
            DB_HOST = 'localhost',
            DB_PORT = 27017,
            DB_DATABASE = 'files_manager'
        } = process.env;

        this.dbUri = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
        this.client = new MongoClient(this.dbUri, { useNewUrlParser: true, useUnifiedTopology: true });

        this.client.connect((err) => {
            if (err) {
                console.error('MongoDB connection error:', err);
            } else {
                console.log('Connected to MongoDB');
            }
        });
    }

    isAlive() {
        return this.client.isConnected();
    }

    async nbUsers() {
        const usersCollection = this.client.db().collection('users');
        return usersCollection.countDocuments();
    }

    async nbFiles() {
        const filesCollection = this.client.db().collection('files');
        return filesCollection.countDocuments();
    }
}

const dbClient = new DBClient();

export default dbClient;
