"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const __1 = __importStar(require(".."));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const promise_1 = __importDefault(require("mysql2/promise"));
const pool = promise_1.default.createPool({
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
const nodeChannel = new __1.Events.NodeEventChannel;
const serverConfig = {
    secret: process.env.SECRET,
    connection: new __1.Datasource.MySQLPoolConnection(pool),
    events: {
        channels: [
            nodeChannel
        ]
    },
    otp: {
        storage: new __1.Storage.MemoryStorage(),
        vars: {
            brand: 'SSOfy',
        },
        notifiers: [
            new __1.Notifications.ConsoleNotifier(__1.Notifications.Channel.SMS, 'Test'),
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
nodeChannel.subscribe(__1.Event.OTPSent, (event, message) => {
    console.log(`{[Event] ${event}:`, message);
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, __1.default)(serverConfig));
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
