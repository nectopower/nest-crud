import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserStatus, MemberRole } from './user.entity';
import { ParseEnumPipe } from '@nestjs/common'; // Pipe para validar enums

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const user = await this.usersService.findOne(id);

    // Verifica se o usuário foi encontrado
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não foi encontrado.`);
    }

    return user;
  }

  @Post()
  create(@Body() user: Partial<User>): Promise<User> {
    return this.usersService.create(user);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() user: Partial<User>): Promise<User> {
    return this.usersService.update(id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.usersService.remove(id);
  }

  @Get('status/:status')
  findByStatus(
    @Param('status', new ParseEnumPipe(UserStatus)) status: UserStatus,
  ) {
    return this.usersService.findByStatus(status);
  }

  @Get('role/:role')
  findByRole(@Param('role', new ParseEnumPipe(MemberRole)) role: MemberRole) {
    return this.usersService.findByRole(role);
  }
}
