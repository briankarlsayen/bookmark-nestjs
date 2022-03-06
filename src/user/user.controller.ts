import { UserService } from './user.service';
import { Body, Controller, Get, UseGuards, Patch } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(
    @GetUser() user: User,
    @GetUser('email') email: string
  ){
    console.log({email})
    return user
  }

  @Patch('edit')
  editUser(
    @GetUser('id')  userId: number,
    @Body() dto: EditUserDto
  ) {
    return this.userService.editUser(userId, dto)
  }
}
