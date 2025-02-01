import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from '../../prisma/services/prisma.service';
import { CreateUserDto } from '../../../requests/user/createUser';
import { UpdateUserDto } from '../../../requests/user/updateUser';
import { PaginationDto } from '../../../requests/pagination/pagination.dto';

@Injectable()
export class UserAdminService {
  constructor(private prisma: PrismaService) {}

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;
    const [results, total] = await Promise.all([
      this.prisma.user.findMany({
        skip: skip,
        take: limit,
        include: {
          messageLimit: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      results,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }


  async setMessageLimit(userId: number, limit: number | null) {
    const userLimit = await this.prisma.userMessageLimit.upsert({
      where: { userId },
      update: { messageLimit: limit, usedMessages: 0, resetDate: new Date() },
      create: {
        userId,
        messageLimit: limit,
        usedMessages: 0,
        resetDate: new Date(),
      },
    });

    return userLimit;
  }




  async get_messages(userId: number, conversationId: number) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
      },
    });

    if (!conversation) {
      throw new BadRequestException(
        'there is no messages in this conversation.',
      );
    }
    const messages = await this.prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    return messages;
  }
  async createUser(data: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password_hash: data.password,
        fullName: data.fullName,
        profilePicAttachmentId: data.profilePicAttachmentId,
        profileBannerAttachmentId: data.profileBannerAttachmentId,
        role: data.role,
        birthdate: data.birthdate,
        bio: data.bio,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        created_at: true,
      },
    });
    return user;
  }

  async updateUser(data: UpdateUserDto, userId: number) {
    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        email: data.email,
        password_hash: data.password,
        fullName: data.fullName,
        profilePicAttachmentId: data.profilePicAttachmentId,
        profileBannerAttachmentId: data.profileBannerAttachmentId,
        role: data.role,
        birthdate: data.birthdate,
        bio: data.bio,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        created_at: true,
      },
    });
    return updatedUser;
  }

  async removeUser(id: number) {
    return this.prisma.user.delete({
      where: { id: id },
    });
  }
}
