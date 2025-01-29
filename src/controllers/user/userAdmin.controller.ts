import { UseGuards, Controller, Get, Post, Body, Patch, Param, Query, Delete } from '@nestjs/common';
import { UserService } from 'src/modules/user/services/user.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from 'src/guards/jwt-guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/role/roles.decorator';
import { UserAdminService } from '../../modules/user/services/userAdmin.service';
import { CreateUserDto } from '../../requests/user/createUser';
import { UpdateUserDto } from '../../requests/user/updateUser';
import { UserRoleEnum } from 'src/modules/user/enum/user-role.enum';
import { PaginationDto } from '../../requests/pagination/pagination.dto';

@ApiBearerAuth('access-token')
@ApiTags('Admin')
@Controller('admin/user')
export class UserAdminController {
  constructor(
    private userService: UserService,
    private adminService: UserAdminService,
  ) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Get('')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN)
  findAllAdmin(@Query() paginationDto: PaginationDto) {
    return this.adminService.findAll(paginationDto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Post('')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN)
  createUserAdmin(@Body() data: CreateUserDto) {
    return this.adminService.createUser(data);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Patch(':id')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN)
  updateUserAdmin(@Body() data: UpdateUserDto, @Param('id') id: string) {
    return this.adminService.updateUser(data, +id);
  }
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':id')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN)
  removeAdmin(@Param('id') id: string) {
    return this.adminService.removeUser(+id);
  }
}
