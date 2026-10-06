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
exports.TestNotificationChannelDto = exports.UpdateNotificationChannelDto = exports.CreateNotificationChannelDto = exports.VoiceConfigDto = exports.TeamsConfigDto = exports.SlackConfigDto = exports.EmailConfigDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class EmailConfigDto {
}
exports.EmailConfigDto = EmailConfigDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmailConfigDto.prototype, "host", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmailConfigDto.prototype, "port", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmailConfigDto.prototype, "user", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmailConfigDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmailConfigDto.prototype, "from", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], EmailConfigDto.prototype, "tls", void 0);
class SlackConfigDto {
}
exports.SlackConfigDto = SlackConfigDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SlackConfigDto.prototype, "webhookUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SlackConfigDto.prototype, "channel", void 0);
class TeamsConfigDto {
}
exports.TeamsConfigDto = TeamsConfigDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TeamsConfigDto.prototype, "webhookUrl", void 0);
class VoiceConfigDto {
}
exports.VoiceConfigDto = VoiceConfigDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VoiceConfigDto.prototype, "accountSid", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VoiceConfigDto.prototype, "authToken", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VoiceConfigDto.prototype, "fromNumber", void 0);
class CreateNotificationChannelDto {
}
exports.CreateNotificationChannelDto = CreateNotificationChannelDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationChannelDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['EMAIL', 'SLACK', 'TEAMS', 'VOICE'] }),
    (0, class_validator_1.IsEnum)(['EMAIL', 'SLACK', 'TEAMS', 'VOICE']),
    __metadata("design:type", String)
], CreateNotificationChannelDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Channel-specific configuration' }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateNotificationChannelDto.prototype, "config", void 0);
class UpdateNotificationChannelDto extends (0, swagger_1.PartialType)(CreateNotificationChannelDto) {
}
exports.UpdateNotificationChannelDto = UpdateNotificationChannelDto;
class TestNotificationChannelDto {
}
exports.TestNotificationChannelDto = TestNotificationChannelDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Optional recipient to send test to' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TestNotificationChannelDto.prototype, "recipient", void 0);
//# sourceMappingURL=notification-channel.dto.js.map