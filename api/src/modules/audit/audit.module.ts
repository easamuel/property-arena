import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_TABLE_NAMES } from '@shared/constants';
import { AuditLogSchema } from './schemas/audit-log.schema';
import { AuditLogDAL } from './dals/audit-log.dal';
import { AuditLogService } from './audit-log.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DB_TABLE_NAMES.AUDIT_LOG, schema: AuditLogSchema },
    ]),
  ],
  providers: [AuditLogDAL, AuditLogService],
  exports: [AuditLogService],
})
export class AuditModule {}
