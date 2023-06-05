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
var cors_1 = __importDefault(require("cors"));
var dotenv_1 = __importDefault(require("dotenv"));
var express_1 = __importDefault(require("express"));
var jsonServer = __importStar(require("json-server"));
var path = __importStar(require("path"));
var generator_1 = require("./generator");
/**
 * Local, on development environment
 * API: http://localhost:3001/api/users
 * React App: http://localhost:3000
 *
 * Cloud, on production environment
 * API: http://localhost:3000/api/users | https://dashboard.heroku.com/apps/nome-do-meu-app/api/users
 * React App: http://localhost:3000 | https://dashboard.heroku.com/apps/nome-do-meu-app
 */
dotenv_1.default.config({ path: path.resolve(__dirname, '../../.env') });
var server = (0, express_1.default)();
var isDev = process.env.NODE_ENV !== 'production';
var port = '3001';
if (isDev) {
    server.use((0, cors_1.default)());
    port = '3001';
}
if (!isDev) {
    // Priority serve any static files.
    server.use(express_1.default.static(path.resolve(__dirname, '../../build')));
}
// Answer API requests.
server.use('/api', jsonServer.defaults(), jsonServer.router(generator_1.db));
if (!isDev) {
    // All remaining requests return the React app, so it can handle routing.
    server.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, '../../build', 'index.html'));
    });
}
server.listen(port, function () {
    console.log("API running on port ".concat(port, ", access it with http://localhost:").concat(port, "/api/users \n\n    React App running on port ").concat(port, ", access it with http://localhost:").concat(port, "/"));
});
