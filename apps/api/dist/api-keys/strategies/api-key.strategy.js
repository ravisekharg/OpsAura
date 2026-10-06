"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyStrategy = exports.API_KEY_STRATEGY = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_custom_1 = require("passport-custom");
const api_keys_service_1 = require("../api-keys.service");
exports.API_KEY_STRATEGY = 'api-key';
let ApiKeyStrategy = class ApiKeyStrategy extends (0, passport_1.PassportStrategy)(passport_custom_1.Strategy, exports.API_KEY_STRATEGY) {
    constructor(apiKeysService) {
        super();
        this.apiKeysService = apiKeysService;
    }
    async validate(req) {
        const rawKey = req.headers['x-api-key'];
        if (!rawKey)
            throw new common_1.UnauthorizedException('x-api-key header required');
        const tenantSlug = req.headers['x-tenant-slug'];
        if (!tenantSlug)
            throw new common_1.UnauthorizedException('x-tenant-slug header required');
        return this.apiKeysService.validateKey(rawKey, tenantSlug);
    }
};
exports.ApiKeyStrategy = ApiKeyStrategy;
exports.ApiKeyStrategy = ApiKeyStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [api_keys_service_1.ApiKeysService])
], ApiKeyStrategy);
//# sourceMappingURL=api-key.strategy.js.map