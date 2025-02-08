import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/services/user.service';
import { OtpService } from 'src/modules/auth/services/otp.service';
import { LoginDto } from 'src/requests/auth/login.dto';
import { RegisterDto } from 'src/requests/auth/register.dto';
import { OTPDto } from 'src/requests/auth/otp.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import EmailExistsException from 'src/exceptions/auth/register/email-exists.exception';
import InvalidCredentialException from 'src/exceptions/auth/login/invalid-credential.exception';
import WrongOtpException from 'src/exceptions/auth/register/wrong-otp.exception';
import { GoogleOauthGuard } from '../../guards/google-guard';
import { CheckOtpDto } from '../../requests/auth/checkOtp.dto';
import { ChangePasswordDto } from '../../requests/auth/changePassword.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private otpService: OtpService,
  ) {
  }

  @Post('register')
  async register(@Body() data: RegisterDto) {
    const email = await this.userService.findUserByEmail(data.email);
    if (email) throw new EmailExistsException();
    else {
      const check_otp = await this.otpService.verifyOtp(data.email, data.otp);
      if (check_otp) {
        const salt = await bcrypt.genSalt();
        data.password = await bcrypt.hash(data.password, salt);
        const user = await this.userService.create(data);
        const payload = { id: user.id, email: user.email };
        const token = await this.jwtService.signAsync(payload);
        return { access_token: token };
      } else throw new WrongOtpException();
    }
  }

  @Post('login')
  async login(@Body() data: LoginDto) {
    const user = await this.userService.findUserByEmail(data.email);
    if (user) {
      const match = await bcrypt.compare(data.password, user.password_hash);
      if (match) {
        const payload = { id: user.id, email: user.email };
        const token = await this.jwtService.signAsync(payload);
        return { access_token: token };
      } else throw new InvalidCredentialException();
    } else throw new InvalidCredentialException();
  }

  @Post('check-otp')
  async checkOtp(@Body() data: CheckOtpDto) {
    return this.otpService.checkOtp(data.email, data.otp);
  }

  @Post('check-user-exists')
  async checkUserExists(@Body() data: OTPDto){
    return this.userService.userExists(data.email)
  }

  @Post('request-otp')
  async requestOtp(@Body() data: OTPDto) {
    return this.otpService.requsetOtp(data.email);
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {
  }

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@Req() req, @Res() res) {
    const existingUser = await this.userService.findUserByEmail(req.user.email);
    if (!existingUser) {
      const { email } = req.user;
      const newUser: RegisterDto = {
        email: email,
        password: 'null',
        otp: 'null',
      };
      this.userService.create(newUser);
    }

    const payload = {
      email: req.user.email,
    };

    const token = await this.jwtService.signAsync(payload);

    return res.redirect(`https://app-stg.hoperise.net/auth/google/oauth?token=${token}`);
  }

  @Post('change-password')
  async changePassword(@Body() data: ChangePasswordDto) {
    const check_otp = await this.otpService.verifyOtp(data.email, data.otp);
    if (check_otp) {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(data.password, salt);
      return this.userService.changePassword(data);
    } else throw new WrongOtpException();
  }
}
