import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { OnboardingService } from '../../modules/onboarding/services/onboarding.service';
import { JwtGuard } from '../../guards/jwt-guard';
import { GetUser } from '../../decorators/auth/get-user.decorator';
import { UserInfoDto } from '../../requests/onboarding/userInfo';

@ApiTags('onboarding')
@Controller('onboarding')
export class OnboardingController {
  constructor(private onboardingService: OnboardingService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Patch('user-info')
  async updateUserInfo(
    @GetUser() user: User,
    @Body() userInfoDto: UserInfoDto,
  ) {
    if (userInfoDto.birthdate != undefined) {
      await this.onboardingService.setBirthdate(user.id, userInfoDto.birthdate);
      user.birthdate = new Date(userInfoDto.birthdate);
    }
    if (userInfoDto.fullName != undefined) {
      await this.onboardingService.setFullName(user.id, userInfoDto.fullName);
      user.fullName = userInfoDto.fullName;
    }
    return user;
  }
}
