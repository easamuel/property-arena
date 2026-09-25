import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { BaseDAL } from 'src/database/dals';
import { DB_TABLE_NAMES } from 'src/shared';

import { Model } from 'src/database/schema/types';
import {
  FEATURED_STATUS,
  Property,
  PropertyDocument,
} from '../schemas/property.schema';

@Injectable()
export class PropertyDAL extends BaseDAL<Property, PropertyDocument> {
  constructor(
    @InjectModel(DB_TABLE_NAMES.PROPERTY) properties: Model<PropertyDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(properties, connection);
  }

  async getFeaturedPropertiesAggregate(
    page: number = 1,
    limit: number = 20,
    excludeRecentlyShown: boolean = true,
  ) {
    const skip = (page - 1) * limit;

    // Base query for featured properties
    const baseQuery = {
      isFeatured: true,
      featuredStatus: FEATURED_STATUS.FEATURED,
      featuredEndDate: { $gt: new Date() }, // Not expired
    };

    // If rotation is enabled, exclude recently shown properties
    if (excludeRecentlyShown) {
      const rotationThreshold = new Date();
      rotationThreshold.setHours(rotationThreshold.getHours() - 2); // 2 hours rotation

      baseQuery['lastFeaturedDisplay'] = {
        $lt: rotationThreshold,
      };
    }

    return await this.model.aggregate([
      { $match: baseQuery },

      // Join with user and subscription data
      {
        $lookup: {
          from: 'users',
          localField: 'owner',
          foreignField: '_id',
          as: 'ownerData',
        },
      },
      {
        $lookup: {
          from: 'subscriptions',
          localField: 'subscription',
          foreignField: '_id',
          as: 'subscriptionData',
        },
      },

      // Add computed priority and rotation score
      {
        $addFields: {
          subscriptionTier: { $arrayElemAt: ['$subscriptionData.tier', 0] },
          daysSinceFeatured: {
            $divide: [
              { $subtract: [new Date(), '$lastFeaturedDisplay'] },
              86400000, // milliseconds in a day
            ],
          },
          viewScore: {
            $divide: [1, { $add: ['$featuredViewCount', 1] }], // Less viewed = higher score
          },
        },
      },

      // Calculate final priority score
      {
        $addFields: {
          finalPriority: {
            $add: [
              '$featuredPriority',
              { $multiply: ['$daysSinceFeatured', 0.1] }, // Boost older properties
              { $multiply: ['$viewScore', 0.5] }, // Boost less viewed properties
              { $rand: {} }, // Add randomization factor
            ],
          },
        },
      },

      // Sort by priority (highest first)
      { $sort: { finalPriority: -1 } },

      // Pagination
      { $skip: skip },
      { $limit: limit },

      // Update last displayed time
      {
        $addFields: {
          lastFeaturedDisplay: new Date(),
        },
      },
    ]);
  }
}
