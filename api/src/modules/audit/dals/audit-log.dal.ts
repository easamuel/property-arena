import { DB_TABLE_NAMES } from '@shared/constants';
import { AuditLog, AuditLogDocument } from '../schemas/audit-log.schema';
import { BaseDAL } from '@database/dals';
import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Model } from '@database/schema/types';

@Injectable()
export class AuditLogDAL extends BaseDAL<AuditLog, AuditLogDocument> {
  constructor(
    @InjectModel(DB_TABLE_NAMES.AUDIT_LOG)
    auditLog: Model<AuditLogDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(auditLog, connection);
  }
}
