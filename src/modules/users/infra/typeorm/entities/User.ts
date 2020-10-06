import {
   Entity,
   Column,
   PrimaryGeneratedColumn,
   CreateDateColumn,
   UpdateDateColumn,
} from 'typeorm';

import { Exclude, Expose } from 'class-transformer';

@Entity('users')
class User {
   @PrimaryGeneratedColumn('uuid')
   public id: string;

   @Column()
   public name: string;

   @Column()
   public email: string;

   @Column()
   @Exclude()
   public password?: string;

   @CreateDateColumn()
   public created_at: Date;

   @UpdateDateColumn()
   public updated_at: Date;

   @Column()
   public avatar: string;

   @Expose({ name: 'avatar_url' })
   getAvatarUrl(): string | null {
      return this.avatar
         ? `${process.env.APP_API_URL}/files/uploads/${this.avatar}`
         : null;
   }
}

export default User;
