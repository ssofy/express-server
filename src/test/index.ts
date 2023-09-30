import express, {Application} from 'express';
import ResourceServer, {ServerConfig, Event, Events, Notifications, Storage, Datasource} from ".."
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app: Application = express();

import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    port: 6636,
    user: 'root',
    password: '123456',
    database: 'db',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

const nodeChannel = new Events.NodeEventChannel;

const serverConfig: ServerConfig = {
    secret: <string>process.env.SECRET,
    connection: new Datasource.MySQLPoolConnection(pool),
    events: {
        channels: [
            nodeChannel
        ]
    },
    otp: {
        storage: new Storage.MemoryStorage(),
        vars: {
            brand: 'SSOfy',
        },
        notifiers: [
            new Notifications.ConsoleNotifier(Notifications.Channel.SMS, 'Test'),
        ],
    },
    user: {
        schema: 'users',
    },
    socialLink: {
        schema: 'user_social_links',
    },
    data: {
        clients: [
            {
                id: 'test',
                name: 'Test',
                secret: 'test',
                redirect_uris: ['*'],
            }
        ],
        scopes: [
            {
                id: '*',
                title: 'Everything',
            }
        ],
    }
};

nodeChannel.subscribe(Event.OTPSent, (event: string, message?: any) => {
    console.log(`{[Event] ${event}:`, message);
});

app.use(cors());
app.use(express.json());
app.use(ResourceServer(serverConfig));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
