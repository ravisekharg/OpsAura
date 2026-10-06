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
exports.MfaDisableDto = exports.MfaEnrollConfirmDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class MfaEnrollConfirmDto {
}
exports.MfaEnrollConfirmDto = MfaEnrollConfirmDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '6-digit TOTP code to confirm enrollment' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 6),
    __metadata("design:type", String)
], MfaEnrollConfirmDto.prototype, "code", void 0);
class MfaDisableDto {
}
exports.MfaDisableDto = MfaDisableDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '6-digit TOTP code or current password to disable MFA' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 6),
    __metadata("design:type", String)
], MfaDisableDto.prototype, "code", void 0);
//# sourceMappingURL=mfa.dto.js.map