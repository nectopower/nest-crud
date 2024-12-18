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
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserStatus, MemberRole } from './user.entity';
import { ParseEnumPipe } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    const users = await this.usersService.findAll();

    // Verifica se há usuários na lista
    if (users.length === 0) {
      throw new NotFoundException('Nenhum usuário encontrado.');
    }

    return users;
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
  async create(@Body() user: Partial<User>): Promise<User> {
    // Validação básica: todos os campos obrigatórios devem estar presentes
    if (!user.user || !user.pass || !user.email) {
      throw new BadRequestException(
        'Os campos user, pass e email são obrigatórios.',
      );
    }

    return this.usersService.create(user);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: Partial<User>,
  ): Promise<User> {
    const existingUser = await this.usersService.findOne(id);

    // Verifica se o usuário existe antes de atualizar
    if (!existingUser) {
      throw new NotFoundException(`Usuário com ID ${id} não foi encontrado.`);
    }

    return this.usersService.update(id, user);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const user = await this.usersService.findOne(id);

    // Verifica se o usuário existe antes de tentar removê-lo
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não foi encontrado.`);
    }

    return this.usersService.remove(id);
  }

  @Get('status/:status')
  async findByStatus(
    @Param('status', new ParseEnumPipe(UserStatus)) status: UserStatus,
  ): Promise<User[]> {
    const users = await this.usersService.findByStatus(status);

    // Verifica se há usuários com o status fornecido
    if (users.length === 0) {
      throw new NotFoundException(
        `Nenhum usuário com status ${status} foi encontrado.`,
      );
    }

    return users;
  }

  @Get('role/:role')
  async findByRole(
    @Param('role', new ParseEnumPipe(MemberRole)) role: MemberRole,
  ): Promise<User[]> {
    const users = await this.usersService.findByRole(role);

    // Verifica se há usuários com a função fornecida
    if (users.length === 0) {
      throw new NotFoundException(
        `Nenhum usuário com função ${role} foi encontrado.`,
      );
    }

    return users;
  }
}
