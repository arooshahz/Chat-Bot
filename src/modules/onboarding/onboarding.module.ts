import { Module } from '@nestjs/common';
import { OnboardingService } from './services/onboarding.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [OnboardingService],
  exports: [OnboardingService],
})
export class OnboardingModule {}