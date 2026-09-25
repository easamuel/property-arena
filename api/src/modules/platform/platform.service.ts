import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DB_TABLE_NAMES } from '@shared/constants';
import { CustomHttpException } from '@shared/exception.handler';
import { UserService } from '@modules/user/user.service';
import { PropertyDAL } from '@modules/property/dals/property.dal';
import { PlatformRecord, PlatformRecordDocument } from './schemas/platform-record.schema';

const PUBLIC_KINDS = new Set(['lead', 'booking']);
const ADMIN_KINDS = new Set(['lead', 'booking', 'page', 'promotion', 'media', 'article']);
const PUBLIC_READ_KINDS = new Set(['article', 'promotion', 'page']);
const PUBLISHED_STATUS = /^(published|active)$/i;

@Injectable()
export class PlatformService {
  constructor(
    @InjectModel(DB_TABLE_NAMES.PLATFORM)
    private readonly records: Model<PlatformRecordDocument>,
    private readonly userService: UserService,
    private readonly propertyDAL: PropertyDAL,
  ) {}

  async list(kind: string) {
    this.assertKind(kind, ADMIN_KINDS);
    const data = await this.records.find({ kind, isDeleted: { $ne: true } }).sort({ createdAt: -1 }).exec();
    return { message: 'Records fetched', data };
  }

  async listPublic(kind: string, opts?: { limit?: number }) {
    this.assertKind(kind, PUBLIC_READ_KINDS);
    let query = this.records
      .find({
        kind,
        isDeleted: { $ne: true },
        'data.status': { $regex: PUBLISHED_STATUS },
      })
      .sort({ createdAt: -1 });
    if (opts?.limit && opts.limit > 0) {
      query = query.limit(opts.limit);
    }
    const data = await query.exec();
    return { message: 'Content fetched', data };
  }

  async getPublicBySlug(kind: string, slug: string) {
    this.assertKind(kind, PUBLIC_READ_KINDS);
    const row = await this.records.findOne({
      kind,
      isDeleted: { $ne: true },
      'data.slug': slug,
      'data.status': { $regex: PUBLISHED_STATUS },
    });
    if (!row) {
      throw new CustomHttpException('Content not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Content fetched', data: row };
  }

  async create(kind: string, data: Record<string, unknown>, publicCreate = false) {
    this.assertKind(kind, publicCreate ? PUBLIC_KINDS : ADMIN_KINDS);
    const row = await this.records.create({ kind, data });
    return { message: 'Record created', data: row };
  }

  async update(kind: string, id: string, data: Record<string, unknown>) {
    this.assertKind(kind, ADMIN_KINDS);
    const row = await this.records.findOneAndUpdate(
      { _id: id, kind },
      { $set: { data } },
      { new: true },
    );
    if (!row) throw new CustomHttpException('Record not found', HttpStatus.NOT_FOUND);
    return { message: 'Record updated', data: row };
  }

  async remove(kind: string, id: string) {
    this.assertKind(kind, ADMIN_KINDS);
    const row = await this.records.findOneAndUpdate(
      { _id: id, kind },
      { $set: { isDeleted: true } },
      { new: true },
    );
    if (!row) throw new CustomHttpException('Record not found', HttpStatus.NOT_FOUND);
    return { message: 'Record deleted' };
  }

  async getSettings() {
    const row = await this.records.findOne({ kind: 'settings', isDeleted: { $ne: true } });
    return { message: 'Settings fetched', data: row?.data ?? null };
  }

  async saveSettings(data: Record<string, unknown>) {
    const row = await this.records.findOneAndUpdate(
      { kind: 'settings' },
      { $set: { data, isDeleted: false } },
      { new: true, upsert: true },
    );
    return { message: 'Settings saved', data: row.data };
  }

  async reports() {
    const [users, properties, leads, bookings, pages, promotions, articles] = await Promise.all([
      this.userService.userDAL.count({ isDeleted: false }),
      this.propertyDAL.count({ isDeleted: false }),
      this.records.countDocuments({ kind: 'lead', isDeleted: { $ne: true } }),
      this.records.countDocuments({ kind: 'booking', isDeleted: { $ne: true } }),
      this.records.countDocuments({ kind: 'page', isDeleted: { $ne: true } }),
      this.records.countDocuments({ kind: 'promotion', isDeleted: { $ne: true } }),
      this.records.countDocuments({ kind: 'article', isDeleted: { $ne: true } }),
    ]);
    return {
      message: 'Report fetched',
      data: { users, properties, leads, bookings, pages, promotions, articles },
    };
  }

  private assertKind(kind: string, allowed: Set<string>) {
    if (!allowed.has(kind)) {
      throw new CustomHttpException('Unknown record type', HttpStatus.BAD_REQUEST);
    }
  }
}
