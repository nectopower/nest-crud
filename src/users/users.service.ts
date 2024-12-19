import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, MemberRole, UserStatus } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(user: Partial<User>): Promise<User> {
    try {
      const newUser = this.userRepository.create(user);
      return await this.userRepository.save(newUser);
    } catch (error) {
      // MySQL: Código de erro para valores duplicados
      if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
        throw new BadRequestException(
          'E-mail ou nome de usuário já estão cadastrados.',
        );
      }
      // Relança outros erros não tratados
      throw error;
    }
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    await this.userRepository.update(id, user);
    return this.userRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  // Filtrar usuários por status (ativo/inativo)
  async findByStatus(status: UserStatus): Promise<User[]> {
    return this.userRepository.find({ where: { status } });
  }

  // Filtrar usuários por função (user/admin/supervisor)
  async findByRole(role: MemberRole): Promise<User[]> {
    return this.userRepository.find({ where: { member: role } });
  }
}
