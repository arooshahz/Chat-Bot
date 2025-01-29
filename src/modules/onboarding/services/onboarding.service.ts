import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { Category, Interest } from '@prisma/client';

@Injectable()
export class OnboardingService {
  constructor(private prisma: PrismaService) {
  }

  async getCategories(): Promise<Category[]> {
    return this.prisma.category.findMany();
  }

  async getInterests(): Promise<Interest[]> {
    return this.prisma.interest.findMany();
  }

  async getCategoriesInterests(categories: number[]): Promise<Interest[]> {
    return this.prisma.interest.findMany({
      where: {
        categoryId: {
          in: categories,
        },
      },
    });
  }

  async getUserCategories(id: number): Promise<Category[]> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        categories: true,
      },
    });
    return user.categories;
  }

  async getUserInterests(id: number): Promise<Interest[]> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        interests: true,
      },
    });
    return user.interests;
  }

  // async setOnboardingInfo(userId: number, userInfoDto: UserInfoDto) {
  //   const updateUser = await this.prisma.user.update({
  //     where: {
  //       id: userId,
  //     },
  //     data: {
  //       fullName: userInfoDto.fullName,
  //       birthdate: userInfoDto.birthdate,
  //     },
  //     select: {
  //       id: true,
  //       email: true,
  //       fullName: true,
  //       birthdate: true,
  //       created_at: true,
  //     },
  //   });
  //   return updateUser;
  // }
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

  async setCategories(userId: number, categories: number[]) {
    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        categories: {
          set: categories.map((category) => ({
            id: category,
          })),
        },
      },
    });
    return updatedUser;
  }

  async setInterests(userId: number, interests: number[]) {
    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        interests: {
          set: interests.map((interest) => ({
            id: interest,
          })),
        },
      },
    });

    return updatedUser;
  }
}
