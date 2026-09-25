import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AgentModule } from '@modules/agent/agent.module';

@Module({
  imports: [
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     secret: configService.get<string>('JWT_SECRET'),
    //     signOptions: { expiresIn: '1h' },
    //   }),
    //   inject: [ConfigService],
    // }),
    UserModule,
    AgentModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
