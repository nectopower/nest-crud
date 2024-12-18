import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsEmail, IsEnum, IsString } from 'class-validator';

export enum MemberRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPERVISOR = 'supervisor',
}

export enum UserStatus {
  ACTIVE = 'ativo',
  INACTIVE = 'inativo',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsString()
  user: string;

  @Column()
  @IsString()
  pass: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({
    type: 'enum',
    enum: MemberRole,
    default: MemberRole.USER,
  })
  @IsEnum(MemberRole)
  member: MemberRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  @IsEnum(UserStatus)
  status: UserStatus;
}
