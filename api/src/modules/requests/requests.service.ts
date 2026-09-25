import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Request } from 'express';
import { DB_TABLE_NAMES } from '@shared/constants';
import { CustomHttpException } from '@shared/exception.handler';
import { TokenService } from '@helpers/jwt.token.service';
import { UserService } from '@modules/user/user.service';
import { ROLE_ENUM } from '@modules/user/schemas/user.schema';
import { AuthUser } from '@middlewares/auth.guard';
import { PlatformRecordDocument } from '@modules/platform/schemas/platform-record.schema';
import { PropertyRequestDAL } from './dals/property-request.dal';
import {
  PropertyRequest,
  PropertyRequestDocument,
  REQUEST_STATUS,
  REQUEST_VISIBILITY,
} from './schemas/property-request.schema';
import {
  CreatePropertyRequestDto,
  ListPropertyRequestsQueryDto,
  RespondToRequestDto,
  UpdatePropertyRequestDto,
} from './dto/request.dto';

type ViewerContext = {
  userId?: string;
  isAgent: boolean;
  isAdmin: boolean;
};

@Injectable()
export class RequestsService {
  constructor(
    private readonly requestDAL: PropertyRequestDAL,
    @InjectModel(DB_TABLE_NAMES.PLATFORM)
    private readonly platformRecords: Model<PlatformRecordDocument>,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  async create(dto: CreatePropertyRequestDto, user?: AuthUser) {
    const row = await this.requestDAL.create({
      ...dto,
      features: dto.features ?? [],
      ownerId: user?.id,
      status: REQUEST_STATUS.OPEN,
      visibility: dto.visibility ?? REQUEST_VISIBILITY.PUBLIC,
      responseCount: 0,
      responses: [],
    });
    return { message: 'Property request created', data: row };
  }

  async listPublic(query: ListPropertyRequestsQueryDto, req: Request) {
    const viewer = await this.resolveViewer(req);
    const filter = {
      isDeleted: false,
      status: REQUEST_STATUS.OPEN,
    } as FilterQuery<PropertyRequestDocument>;

    if (viewer.isAgent || viewer.isAdmin) {
      filter.visibility = { $in: [REQUEST_VISIBILITY.PUBLIC, REQUEST_VISIBILITY.AGENTS_ONLY] };
    } else {
      filter.visibility = REQUEST_VISIBILITY.PUBLIC;
    }

    this.applyListFilters(filter, query);

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const { data: rows, total } = await this.requestDAL.paginate(filter, {
      ...query,
      page,
      limit,
    });

    const data = rows.map((row) => this.maskRequest(row, viewer, false));

    return {
      message: 'Property requests fetched',
      data: { items: data, total: total ?? rows.length, page, limit },
    };
  }

  async getById(id: string, req: Request) {
    const viewer = await this.resolveViewer(req);
    const row = await this.findActive(id);
    if (
      row.visibility === REQUEST_VISIBILITY.AGENTS_ONLY &&
      !viewer.isAgent &&
      !viewer.isAdmin &&
      row.ownerId?.toString() !== viewer.userId
    ) {
      throw new CustomHttpException('Request not found', HttpStatus.NOT_FOUND);
    }
    const isOwner = row.ownerId?.toString() === viewer.userId;
    return {
      message: 'Property request fetched',
      data: this.maskRequest(row, viewer, isOwner),
    };
  }

  async listMine(user: AuthUser) {
    const rows = await this.requestDAL.find(
      { ownerId: user.id, isDeleted: false },
      undefined,
      undefined,
      { createdAt: -1 },
    );
    return {
      message: 'Your property requests fetched',
      data: rows.map((row) => this.maskRequest(row, { userId: user.id, isAgent: false, isAdmin: false }, true)),
    };
  }

  async update(id: string, dto: UpdatePropertyRequestDto, user: AuthUser) {
    const existing = await this.findActive(id);
    await this.assertOwnerOrAdmin(existing, user);
    const row = await this.requestDAL.updateOne({ _id: id }, dto);
    return { message: 'Property request updated', data: row };
  }

  async respond(id: string, dto: RespondToRequestDto, user: AuthUser) {
    const existing = await this.findActive(id);
    if (existing.status === REQUEST_STATUS.CLOSED) {
      throw new CustomHttpException('Request is closed', HttpStatus.BAD_REQUEST);
    }

    const responseEntry = {
      responderId: user.id,
      message: dto.message,
      createdAt: new Date(),
    };

    const row = await this.requestDAL.updateOne(
      { _id: id },
      {
        status: REQUEST_STATUS.MATCHED,
        responses: [...(existing.responses ?? []), responseEntry],
      },
      undefined,
      undefined,
      { responseCount: 1 },
    );

    await this.platformRecords.create({
      kind: 'lead',
      data: {
        name: existing.contactName,
        email: existing.contactEmail,
        phone: existing.contactPhone,
        property: `${existing.purpose} ${existing.propertyType} — request ${id}`,
        source: 'Property request response',
        status: 'New',
        notes: dto.message,
        requestId: id,
        responderId: user.id,
      },
    });

    return { message: 'Response submitted', data: row };
  }

  private applyListFilters(
    filter: FilterQuery<PropertyRequestDocument>,
    query: ListPropertyRequestsQueryDto,
  ) {
    if (query.purpose) filter.purpose = query.purpose;
    if (query.propertyType) filter.propertyType = query.propertyType;
    if (query.location) {
      filter.locations = { $regex: query.location, $options: 'i' };
    }
    if (query.budgetMin != null) {
      filter.budgetMax = { $gte: query.budgetMin };
    }
    if (query.budgetMax != null) {
      filter.budgetMin = { $lte: query.budgetMax };
    }
  }

  private async findActive(id: string) {
    const row = await this.requestDAL.findOne({ _id: id, isDeleted: false });
    if (!row) {
      throw new CustomHttpException('Request not found', HttpStatus.NOT_FOUND);
    }
    return row;
  }

  private async assertOwnerOrAdmin(row: PropertyRequest, user: AuthUser) {
    if (row.ownerId?.toString() === user.id) return;
    const record = await this.userService.findOne({ _id: user.id });
    if (record?.role === ROLE_ENUM.ADMIN) return;
    throw new CustomHttpException('Unauthorized action', HttpStatus.FORBIDDEN);
  }

  private async resolveViewer(req: Request): Promise<ViewerContext> {
    const token = this.tokenService.extractTokenFromHeader(req);
    if (!token) {
      return { isAgent: false, isAdmin: false };
    }
    try {
      const payload = this.tokenService.verify(token) as { id?: string; sub?: string };
      const userId = payload.id ?? payload.sub;
      if (!userId) {
        return { isAgent: false, isAdmin: false };
      }
      const record = await this.userService.findOne({ _id: userId });
      if (!record) {
        return { userId, isAgent: false, isAdmin: false };
      }
      return {
        userId,
        isAgent: record.role === ROLE_ENUM.AGENT,
        isAdmin: record.role === ROLE_ENUM.ADMIN,
      };
    } catch {
      return { isAgent: false, isAdmin: false };
    }
  }

  private maskRequest(row: unknown, viewer: ViewerContext, isOwner: boolean) {
    const doc = row as PropertyRequestDocument & { toObject?: () => Record<string, unknown> };
    const plain: Record<string, unknown> =
      typeof doc.toObject === 'function'
        ? doc.toObject()
        : { ...(row as Record<string, unknown>) };

    const showContact =
      isOwner ||
      viewer.isAdmin ||
      viewer.isAgent;

    if (!showContact) {
      plain.contactEmail = this.maskEmail(String(plain.contactEmail ?? ''));
      plain.contactPhone = this.maskPhone(String(plain.contactPhone ?? ''));
    }

    return plain;
  }

  private maskEmail(email: string) {
    if (!email.includes('@')) return '***';
    const [local, domain] = email.split('@');
    const visible = local.slice(0, 2);
    return `${visible}***@${domain}`;
  }

  private maskPhone(phone: string) {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 4) return '***';
    return `***${digits.slice(-4)}`;
  }
}
