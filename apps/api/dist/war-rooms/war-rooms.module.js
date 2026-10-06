"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarRoomsModule = void 0;
const common_1 = require("@nestjs/common");
const war_rooms_controller_1 = require("./war-rooms.controller");
const war_rooms_service_1 = require("./war-rooms.service");
const war_rooms_repository_1 = require("./war-rooms.repository");
let WarRoomsModule = class WarRoomsModule {
};
exports.WarRoomsModule = WarRoomsModule;
exports.WarRoomsModule = WarRoomsModule = __decorate([
    (0, common_1.Module)({
        controllers: [war_rooms_controller_1.WarRoomsController, war_rooms_controller_1.WarRoomTemplatesController],
        providers: [war_rooms_service_1.WarRoomsService, war_rooms_repository_1.WarRoomsRepository],
        exports: [war_rooms_service_1.WarRoomsService],
    })
], WarRoomsModule);
//# sourceMappingURL=war-rooms.module.js.map