import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import type { JwtPayload, RequestUser } from '../../common/interfaces/request-user.interface';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly config;
    constructor(config: ConfigService);
    validate(payload: JwtPayload & {
        requiresPasswordChange?: boolean;
    }): Promise<RequestUser>;
}
export {};
