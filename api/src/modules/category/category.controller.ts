import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto, ListCategoryQueryDto } from "./dto/category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CurrentUser } from "@decorators/currentUser.decorator";
import { AuthUser } from "@middlewares/auth.guard";

@Controller("categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(
    @CurrentUser() user: AuthUser,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.create(user, createCategoryDto);
  }

  @Get()
  getAllCategories(@Query() query: ListCategoryQueryDto) {
    return this.categoryService.getAllCategories(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.categoryService.remove(+id);
  }
}
