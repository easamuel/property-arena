import { HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ROLE_ENUM, User, UserDocument } from './schemas/user.schema';
import { PaginationRequestDTO } from '@shared/pagination';
import { UserDAL } from './dals/user.dal';
import { AuthUser } from '@middlewares/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomHttpException } from '@shared/exception.handler';

export interface UserCreationStrategy {
  create(payload: any): Promise<any>;
}

@Injectable()
export class UserService {
  constructor(public readonly userDAL: UserDAL) {}

  findOne(
    query: Partial<User>,
    select?: string[],
    populate?: Parameters<typeof this.userDAL.findOne>[2],
  ) {
    return this.userDAL.findOne(query, select, populate);
  }

  async listForAdmin(query: PaginationRequestDTO) {
    const { data, ...meta } = await this.userDAL.paginate(
      { isDeleted: false },
      query,
    );
    return { message: 'Users fetched successfully', data, meta };
  }

  async setUserActive(id: string, isActive: boolean) {
    const updated = await this.userDAL.updateOne({ _id: id }, { isActive });
    if (!updated) {
      throw new CustomHttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { message: isActive ? 'User restored' : 'User suspended', data: updated };
  }

  async setUserRole(id: string, role: ROLE_ENUM) {
    const updated = await this.userDAL.updateOne({ _id: id }, { role });
    if (!updated) {
      throw new CustomHttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'User role updated', data: updated };
  }

  async setAgentVerified(id: string, isAgentVerified: boolean) {
    const user = await this.findOne({ _id: id as any });
    if (!user) {
      throw new CustomHttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.role !== ROLE_ENUM.AGENT && user.role !== ROLE_ENUM.DEVELOPER) {
      throw new CustomHttpException(
        'Only agents and developers can receive a verification badge',
        HttpStatus.BAD_REQUEST,
      );
    }
    const updated = await this.userDAL.updateOne({ _id: id }, { isAgentVerified });
    return {
      message: isAgentVerified ? 'Agent verified' : 'Verification removed',
      data: updated,
    };
  }

  async getPublicAgent(id: string) {
    const user = await this.findOne({ _id: id as any });
    if (!user || user.isDeleted || user.isActive === false) {
      throw new CustomHttpException('Agent not found', HttpStatus.NOT_FOUND);
    }
    if (user.role !== ROLE_ENUM.AGENT && user.role !== ROLE_ENUM.DEVELOPER) {
      throw new CustomHttpException('Agent not found', HttpStatus.NOT_FOUND);
    }
    return {
      message: 'Agent fetched',
      data: {
        id: (user as any)._id || (user as any).id,
        name: user.displayName || user.name,
        email: user.email,
        phone: user.phone,
        website: user.website,
        avatarUrl: user.avatarUrl,
        address: user.address,
        role: user.role,
        isAgentVerified: Boolean(user.isAgentVerified),
      },
    };
  }

  async getMe(payload: AuthUser) {
    const user = await this.findOne({ _id: payload.id });

    if (!user) {
      throw new CustomHttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    return {
      message: 'User fetched successfully',
      data: user,
    };
  }

  async updateUser(user: AuthUser, payload: UpdateUserDto) {
    const existingUser = await this.findOne({ _id: user.id });

    if (!existingUser) {
      throw new CustomHttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const queryObject: Partial<User> = {
      _id: user.id,
      isDeleted: false,
    };

    const updatedUser = await this.updateOne(queryObject, payload);

    return {
      message: 'User updated successfully',
      data: updatedUser,
    };
  }

  updateOne(
    query: Partial<User>,
    update: Partial<User>,
    unset?: Partial<Record<keyof User, boolean>>,
  ) {
    return this.userDAL.updateOne(query, update, unset);
  }

  createOne(payload: User) {
    return this.userDAL.create(payload);
  }

  findUsersByIds(ids: string[], select?: string[]) {
    return this.userDAL.find({ _id: ids }, select);
  }

  findByEmail(email: string[], select?: string[]) {
    return this.userDAL.find({ email }, select);
  }
  async validatePassword(
    user: UserDocument,
    password: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}
