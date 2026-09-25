import { HttpStatus, Injectable } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import {
  CreatePropertyDto,
  DeletePropertiesDto,
  GetFeaturedPropertiesDTO,
  ListPropertyQueryDto,
  UpdatePropertyDto,
} from './dto/property.dto';
import { PropertyDAL } from './dals/property.dal';
import { AuthUser } from '@middlewares/auth.guard';
import { CustomHttpException } from '@shared/exception.handler';
import * as moment from 'moment';
import { FEATURE_KEY } from '@modules/subscription/schemas/subscription-feature.schema';
import { FEATURED_STATUS, PROPERTY_STATUS } from './schemas/property.schema';
import { SubscriptionService } from '@modules/subscription/subscription.service';
import { EntitlementEngine } from '@modules/subscription/entitlement.engine';

@Injectable()
export class PropertyService {
  constructor(
    private readonly propertyDAL: PropertyDAL,
    private readonly subscriptionService: SubscriptionService,
    private readonly entitlementEngine: EntitlementEngine,
  ) {}
  async createProperty(user: AuthUser, payload: CreatePropertyDto) {
    await this.entitlementEngine.consumeQuota(user.id, 'active_listings', 1);

    try {
      const propertyId = await this.generatePropertyId();
      const property = await this.propertyDAL.create({
        ...this.normalizeAgent(payload),
        owner: user.id,
        propertyId,
      });

      return {
        message: 'Property created successfully',
        data: property,
      };
    } catch (error) {
      await this.entitlementEngine
        .releaseQuota(user.id, 'active_listings', 1)
        .catch(() => undefined);
      throw error;
    }
  }

  async getAllProperties(query: ListPropertyQueryDto) {
    const queryObject: Parameters<typeof this.propertyDAL.paginate>[0] = {
      isDeleted: false,
    };

    if (query.propertyType) {
      queryObject.propertyType = query.propertyType;
    }

    if (query.status) {
      queryObject.status = query.status;
    }

    this.applyListFilters(queryObject, query);

    const { data, ...meta } = await this.propertyDAL.paginate(
      queryObject,
      query,
      null,
      ['title', 'location', 'address', 'description'],
    );
    return {
      message: 'Properties fetched succesfully',
      data,
      meta,
    };
  }

  async getUserProperties(user: AuthUser, query: ListPropertyQueryDto) {
    const queryObject: Parameters<typeof this.propertyDAL.paginate>[0] = {
      owner: user.id,
      isDeleted: false,
    };

    if (query.propertyType) {
      queryObject.propertyType = query.propertyType;
    }

    if (query.status) {
      queryObject.status = query.status;
    }

    this.applyListFilters(queryObject, query);

    const { data, ...meta } = await this.propertyDAL.paginate(
      queryObject,
      query,
      null,
      ['title', 'location', 'address', 'description'],
    );
    return {
      message: 'Properties fetched succesfully',
      data,
      meta,
    };
  }

  async findOnePropertry(id: string) {
    const property = await this.findOne(id);

    return {
      message: 'Property fetched succesfully',
      data: property,
    };
  }

  async moderateProperty(
    id: string,
    payload: { status?: PROPERTY_STATUS; reviewNotes?: string },
  ) {
    await this.findOne(id);
    const updatedProperty = await this.propertyDAL.updateOne(
      { _id: id },
      payload,
    );
    return {
      message: 'Property moderation updated',
      data: updatedProperty,
    };
  }

  async updateProperty(id: string, payload: UpdatePropertyDto, user: AuthUser) {
    const existing = await this.findOne(id);
    this.assertOwner(existing, user.id);

    const updatedProperty = await this.propertyDAL.updateOne(
      { _id: id },
      { ...this.normalizeAgent(payload) },
    );
    return {
      message: 'Property updated successfully',
      data: updatedProperty,
    };
  }

  async deleteProperties(payload: DeletePropertiesDto, user: AuthUser) {
    const properties = await Promise.all(
      payload.propertyIds.map((id) => this.findOne(id)),
    );
    properties.forEach((property) => this.assertOwner(property, user.id));

    const { deletedCount } = await this.propertyDAL.deleteMany({
      _id: { in: payload.propertyIds },
    });
    if (deletedCount === 0) {
      throw new CustomHttpException(
        'No properties were deleted',
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      message: 'Properties deleted successfully',
    };
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new CustomHttpException(
        'Invalid property id',
        HttpStatus.BAD_REQUEST,
      );
    }

    const property = await this.propertyDAL.findOne({ _id: id });

    if (!property) {
      throw new CustomHttpException(
        'Property not found',
        HttpStatus.BAD_REQUEST,
      );
    }
    return property;
  }

  async generatePropertyId() {
    const dateString = moment().format('DDMMYY');
    const prefix = `PPAR-${dateString}-`;

    const query = {
      propertyId: { contains: prefix },
    };

    // Find the latest property ID starting with today's prefix
    const lastEntry = await this.propertyDAL.findOne(
      query,
      ['propertyId'],
      undefined,
      { propertyId: -1 },
    );

    let nextNumber = 1;

    if (lastEntry && lastEntry.propertyId) {
      const parts = lastEntry.propertyId.split('-');
      const lastNumber = parseInt(parts[2], 10);
      nextNumber = lastNumber + 1;
    }

    const paddedNumber = String(nextNumber).padStart(6, '0');

    return `${prefix}${paddedNumber}`;
  }

  /**
   * Get featured properties with rotation and priority logic
   */
  async getFeaturedProperties(params: GetFeaturedPropertiesDTO) {
    const results = await this.propertyDAL.getFeaturedPropertiesAggregate(
      params.page,
      params.limit,
      params.excludeRecentlyShown,
    );

    return {
      message: 'Featured properties fetched successfully',
      data: results,
    };
  }

  /**
   * Make a property featured based on user's subscription
   */
  async featureProperty(propertyId: string, userId: string) {
    await this.entitlementEngine.canPerformAction(
      userId,
      'featured_listings',
      1,
    );

    // Get user's active subscription
    const subscription =
      await this.subscriptionService.getActiveSubscription(userId);

    if (!subscription) {
      throw new CustomHttpException(
        'No active subscription found',
        HttpStatus.FORBIDDEN,
      );
    }

    // Check if user has reached featured property limit
    const currentFeaturedCount = await this.propertyDAL.count({
      owner: userId,
      isFeatured: true,
      featuredStatus: FEATURED_STATUS.FEATURED,
    });

    const featuredLimit = Number(
      await this.subscriptionService.getFeatureValue(
        userId,
        FEATURE_KEY.MAX_FEATURED_LISTINGS,
      ),
    );

    const property = await this.findOne(propertyId);
    this.assertOwner(property, userId);

    if (featuredLimit !== -1 && currentFeaturedCount >= featuredLimit) {
      throw new CustomHttpException(
        'Featured property limit reached for your current plan',
        HttpStatus.FORBIDDEN,
      );
    }

    // Calculate feature duration based on the plan's configured feature values
    const featureDuration = Number(
      await this.subscriptionService.getFeatureValue(
        userId,
        FEATURE_KEY.FEATURED_DURATION_DAYS,
      ),
    );
    const featuredEndDate = new Date();
    featuredEndDate.setDate(featuredEndDate.getDate() + featureDuration);

    const featuredPriority = Number(
      await this.subscriptionService.getFeatureValue(
        userId,
        FEATURE_KEY.PRIORITY_RANK,
      ),
    );

    // Update property
    await this.propertyDAL.updateOne(
      { _id: propertyId },
      {
        isFeatured: true,
        featuredStatus: FEATURED_STATUS.FEATURED,
        featuredStartDate: new Date(),
        featuredEndDate,
        featuredPriority,
        subscription: subscription._id,
        featuredViewCount: 0,
        lastFeaturedDisplay: new Date(0),
      },
    );

    // Update subscription featured count
    await this.subscriptionService.incrementSubscriptionFeatureCount(
      subscription._id,
    );

    const updatedProperty = await this.propertyDAL.findOne({
      _id: propertyId,
    });

    return {
      message: 'Property featured successfully',
      data: updatedProperty,
    };
  }

  /**
   * Remove featured status from expired properties
   */
  async cleanupExpiredFeatured() {
    const expiredProperties = await this.propertyDAL.find(
      {
        isFeatured: true,
        featuredEndDate: { lt: new Date() },
      },
      undefined,
      [
        {
          path: 'subscription',
          select:
            'plan status currentPeriodEnd currentFeaturedCount autoRenewal',
        },
      ],
    );

    for (const property of expiredProperties) {
      await this.propertyDAL.updateOne(
        { _id: property._id },
        {
          isFeatured: false,
          featuredStatus: FEATURED_STATUS.EXPIRED,
        },
      );

      // Decrease subscription count
      if (property.subscription) {
        await this.subscriptionService.decreasSubscriptionFeatureCount(
          property.subscription,
        );
      }
    }

    return expiredProperties.length;
  }

  /**
   * Track when a featured property is viewed
   */
  async trackFeaturedView(propertyId: string) {
    await this.propertyDAL.updateOne(
      { _id: propertyId },
      { lastFeaturedDisplay: new Date() },
      undefined,
      undefined,
      { featuredViewCount: 1 },
    );
  }

  /**
   * Get available featured slots for a user
   */
  async getAvailableFeaturedSlots(userId: string) {
    const subscription =
      await this.subscriptionService.getActiveSubscription(userId);

    if (!subscription) {
      return 0;
    }

    const currentCount = await this.propertyDAL.count({
      owner: userId,
      isFeatured: true,
      featuredStatus: FEATURED_STATUS.FEATURED,
    });

    const maxAllowed = Number(
      await this.subscriptionService.getFeatureValue(
        userId,
        FEATURE_KEY.MAX_FEATURED_LISTINGS,
      ),
    );

    if (maxAllowed === -1) {
      return -1; // unlimited
    }

    return Math.max(0, maxAllowed - currentCount);
  }

  private assertOwner(property: { owner?: unknown }, userId: string) {
    const ownerId =
      property.owner && typeof property.owner === 'object' && '_id' in (property.owner as object)
        ? String((property.owner as { _id: unknown })._id)
        : String(property.owner ?? '');
    if (ownerId !== String(userId)) {
      throw new CustomHttpException(
        'You can only manage your own properties',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  private normalizeAgent<T extends { agentId?: string; selectedAgentId?: string }>(
    payload: T,
  ) {
    const { agentId, selectedAgentId, ...rest } = payload;
    const selectedAgent = selectedAgentId || agentId;
    return selectedAgent ? { ...rest, selectedAgent } : rest;
  }

  private applyListFilters(
    queryObject: Record<string, unknown>,
    query: ListPropertyQueryDto,
  ) {
    if (query.listingPurpose) {
      queryObject.listingPurpose = query.listingPurpose;
    }
    if (query.location) {
      queryObject.location = { contains: query.location };
    }
    if (query.bedroom) {
      const count = query.bedroom.replace(/\D/g, '');
      queryObject.bedroom = { contains: count || query.bedroom };
    }
    if (query.minPrice != null || query.maxPrice != null) {
      queryObject.price = {
        ...(query.minPrice != null ? { gte: query.minPrice } : {}),
        ...(query.maxPrice != null ? { lte: query.maxPrice } : {}),
      };
    }
  }
}
