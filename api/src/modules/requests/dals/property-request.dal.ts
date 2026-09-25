import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { BaseDAL } from 'src/database/dals';
import { DB_TABLE_NAMES } from 'src/shared';
import { Model } from 'src/database/schema/types';
import {
  PropertyRequest,
  PropertyRequestDocument,
} from '../schemas/property-request.schema';

@Injectable()
export class PropertyRequestDAL extends BaseDAL<PropertyRequest, PropertyRequestDocument> {
  constructor(
    @InjectModel(DB_TABLE_NAMES.REQUESTS)
    requests: Model<PropertyRequestDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(requests, connection);
  }
}
