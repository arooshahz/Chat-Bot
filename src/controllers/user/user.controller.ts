import { UseGuards, Controller, Get } from '@nestjs/common';
import { UserService } from 'src/modules/user/services/user.service';
// import { ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorators/auth/get-user.decorator';
import { User } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/guards/jwt-guard';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Get('/')
  async show(@GetUser() user: User) {
    return user;
  }
}
