import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { RegisterDto } from 'src/requests/auth/register.dto';
import { ChangePasswordDto } from '../../../requests/auth/changePassword.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {
  }

  async create(data: RegisterDto) {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password_hash: data.password,
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

  async findUserById(id) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
      },
    });
    return user;
  }

  async getUsernameByID(id){
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
      },
      select:{
        id: true,
        profilePicAttachmentId: true,
        fullName: true
      }
    });
    return user;
  }

  async userExists(email){
    const user = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (user !== null){
      return { registered: true };
    }
    return {registered: false}
  }

  async findUserByEmail(email) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    return user;
  }

  async changePassword(data: ChangePasswordDto) {
    const updateUser = await this.prisma.user.update({
      where: {
        email: data.email,
      },
      data: {
        password_hash: data.password,
      },
    });
    return updateUser;
  }
}
