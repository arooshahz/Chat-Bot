import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';

@Injectable()
export class OnboardingService {
  constructor(private prisma: PrismaService) {
  }
  async setFullName(userId: number, fullName: string) {
    const updateUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        fullName: fullName,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        birthdate: true,
        created_at: true,
      },
    });
    return updateUser;
  }

  async setBirthdate(userId: number, birthdate: string) {
    const updateUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        birthdate: birthdate,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        birthdate: true,
        created_at: true,
      },
    });
    return updateUser;
  }
}
