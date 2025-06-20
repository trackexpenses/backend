"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const inversify_express_utils_1 = require("inversify-express-utils");
const config_1 = __importDefault(require("./config"));
require("./controllers");
const container_1 = require("./container");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const server = new inversify_express_utils_1.InversifyExpressServer(container_1.container, null, { rootPath: '' }, app);
server.build().listen(config_1.default.port, () => {
    console.log('Server listening on port ' + config_1.default.port);
});
