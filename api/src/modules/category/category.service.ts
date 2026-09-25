import { Injectable } from '@nestjs/common';
import { CreateCategoryDto, ListCategoryQueryDto } from './dto/category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthUser } from '@middlewares/auth.guard';
import { CategoryDAL } from './dals/category.dal';

@Injectable()
export class CategoryService {
  constructor(private readonly catergoryDAL: CategoryDAL) {}
  async create(user: AuthUser, payload: CreateCategoryDto) {
    const property = await this.catergoryDAL.create({
      ...payload,
      creator: user.id,
    });

    return {
      message: 'Property created successfully',
      data: property,
    };
  }

  async getAllCategories(query: ListCategoryQueryDto) {
    const queryObject: Parameters<typeof this.catergoryDAL.paginate>[0] = {
      isDeleted: false,
    };

    const { data, ...meta } = await this.catergoryDAL.paginate(
      queryObject,
      query,
      null,
    );

    return {
      message: 'Categories fetched succesfully',
      data,
      meta,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
