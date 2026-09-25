import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from '@decorators/currentUser.decorator';
import { AuthUser } from '@middlewares/auth.guard';
import { AdminGuard } from '@middlewares/admin.guard';
import { PaginationRequestDTO } from '@shared/pagination';
import { ROLE_ENUM } from './schemas/user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AdminGuard)
  @Get()
  listUsers(@Query() query: PaginationRequestDTO) {
    return this.userService.listForAdmin(query);
  }

  @UseGuards(AdminGuard)
  @Patch(':id/active')
  setActive(@Param('id') id: string, @Body() body: { isActive: boolean }) {
    return this.userService.setUserActive(id, body.isActive);
  }

  @UseGuards(AdminGuard)
  @Patch(':id/role')
  setRole(@Param('id') id: string, @Body() body: { role: ROLE_ENUM }) {
    return this.userService.setUserRole(id, body.role);
  }

  @UseGuards(AdminGuard)
  @Patch(':id/verify-agent')
  setAgentVerified(
    @Param('id') id: string,
    @Body() body: { isAgentVerified: boolean },
  ) {
    return this.userService.setAgentVerified(id, Boolean(body.isAgentVerified));
  }

  @Get('agents/:id')
  getPublicAgent(@Param('id') id: string) {
    return this.userService.getPublicAgent(id);
  }

  @Get('/me')
  getUser(@CurrentUser() user: AuthUser) {
    return this.userService.getMe(user);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(id);
  // }

  @Patch()
  updateUser(
    @CurrentUser() user: AuthUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    console.log('User: ', user);
    return this.userService.updateUser(user, updateUserDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
