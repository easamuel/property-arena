import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { LOGGER } from '@shared/constants';
import { AuditLogDAL } from './dals/audit-log.dal';
import {
  AUDIT_CATEGORY,
  AUDIT_STATUS,
  AuditLog,
} from './schemas/audit-log.schema';

export interface RecordAuditLogParams {
  category: AUDIT_CATEGORY;
  action: string;
  status: AUDIT_STATUS;
  message: string;
  actor?: string;
  reference?: string;
  meta?: Record<string, unknown>;
}

@Injectable()
export class AuditLogService {
  private readonly logger: Logger;

  constructor(
    private readonly auditLogDAL: AuditLogDAL,
    @Inject(LOGGER) logger: Logger,
  ) {
    this.logger = logger.child({ service: AuditLogService.name });
  }

  // Audit logging must never break the flow it is observing, so failures
  // here are logged and swallowed rather than propagated.
  async record(params: RecordAuditLogParams): Promise<void> {
    try {
      await this.auditLogDAL.create({
        category: params.category,
        action: params.action,
        status: params.status,
        actor: params.actor,
        reference: params.reference,
        message: params.message,
        meta: params.meta,
      } as AuditLog);
    } catch (error) {
      this.logger.error('Failed to persist audit log', {
        error: (error as Error).message,
        category: params.category,
        action: params.action,
        reference: params.reference,
      });
    }
  }
}
