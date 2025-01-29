import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Category, Interest, User } from '@prisma/client';
import { OnboardingService } from '../../modules/onboarding/services/onboarding.service';
import { OnboardingDto } from '../../requests/onboarding/onboarding';
import { UserIdDto } from '../../requests/auth/userId.dto';
import { JwtGuard } from '../../guards/jwt-guard';
import { GetUser } from '../../decorators/auth/get-user.decorator';
import { UserInfoDto } from '../../requests/onboarding/userInfo';
import { CategoriesDto } from '../../requests/onboarding/categories';
import { InterestsDto } from '../../requests/onboarding/interests';

@ApiTags('onboarding')
@Controller('onboarding')
export class OnboardingController {
  constructor(private onboardingService: OnboardingService) {
  }

  @Get('categories')
  async Categories(): Promise<Category[]> {
    return this.onboardingService.getCategories();
  }

  @Get('interests')
  async Interests(): Promise<Interest[]> {
    return this.onboardingService.getInterests();
  }

  @Post('category-interests')
  async categoryInterests(
    @Body() categoriesDto: CategoriesDto,
  ): Promise<Interest[]> {
    return this.onboardingService.getCategoriesInterests(
      categoriesDto.categories,
    );
  }

  // @ApiBearerAuth('access-token')
  // @UseGuards(JwtGuard)
  // @Post('onboard-user')
  // async onboardingUser(
  //   @GetUser() user: User,
  //   @Body() onboardingDto: OnboardingDto,
  // ) {
  //   await this.onboardingService.setOnboardingInfo(user.id, onboardingDto);
  //   await this.onboardingService.setCategories(
  //     user.id,
  //     onboardingDto.categories,
  //   );
  //   await this.onboardingService.setInterests(user.id, onboardingDto.interests);
  //   return user;
  // }
  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Patch('user-info')
  async updateUserInfo(
    @GetUser() user: User,
    @Body() userInfoDto: UserInfoDto,
  ) {
    if (userInfoDto.birthdate != undefined) {
      await this.onboardingService.setBirthdate(user.id, userInfoDto.birthdate);
      user.birthdate = new Date(userInfoDto.birthdate)
    }
    if (userInfoDto.fullName != undefined) {
      await this.onboardingService.setFullName(user.id, userInfoDto.fullName);
      user.fullName = userInfoDto.fullName;
    }
    return user;
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Patch('user-categories')
  async updateUserCategories(
    @GetUser() user: User,
    @Body() categoriesDto: CategoriesDto,
  ) {
    await this.onboardingService.setCategories(
      user.id,
      categoriesDto.categories,
    );
    return this.onboardingService.getUserCategories(user.id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Patch('user-interests')
  async updateUserInterests(
    @GetUser() user: User,
    @Body() interestsDto: InterestsDto,
  ) {
    await this.onboardingService.setInterests(user.id, interestsDto.interests);
    return this.onboardingService.getUserInterests(user.id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Get('user-categories')
  async userCategories(@GetUser() user: User): Promise<Category[]> {
    return this.onboardingService.getUserCategories(user.id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Get('user-interests')
  async userInterests(@GetUser() user: User): Promise<Category[]> {
    return this.onboardingService.getUserInterests(user.id);
  }
}
