import { ObjectType, Field, ID, Int, registerEnumType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  DeleteDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import { EntityHelper } from './entity-helper';
import { AuthProvidersEnum } from '../users';
import { Role } from './role.entity';
import { Status } from './status.entity';

// Register the StoreEnum as a GraphQL enum type
registerEnumType(AuthProvidersEnum, { name: 'AuthProvidersEnum' });

@ObjectType() // Decorate with @ObjectType() for GraphQL
@Entity()
export class User extends EntityHelper {
  @Field(() => ID) // Decorate with @Field(() => ID) for GraphQL
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', unique: true, nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  email: string | null;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, type: 'varchar' })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Exclude({ toPlainOnly: true })
  public previousPassword: string;

  @Field(() => AuthProvidersEnum)
  @Column({ type: 'varchar', default: AuthProvidersEnum.email })
  @Expose({ groups: ['me', 'admin'] })
  provider: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  socialId: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true })
  firstName: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true })
  lastName: string | null;

  @Field(() => String)
  @Index()
  @Column({ type: 'varchar', nullable: false, unique: true })
  @Expose({ groups: ['me', 'admin'] })
  phone: string;

  @Field(() => Role, { nullable: true })
  @ManyToOne(() => Role, { eager: true, nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  role?: Role | null;

  @Field(() => Status, { nullable: true })
  @ManyToOne(() => Status, { eager: true, nullable: true })
  status?: Status;

  @Field(() => Date, { nullable: true })
  @DeleteDateColumn()
  deletedAt: Date;

  @AfterLoad()
  public loadPreviousPassword(): void {
    this.previousPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.previousPassword !== this.password && this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
