import {
   Entity,
   PrimaryGeneratedColumn,
   CreateDateColumn,
   UpdateDateColumn,
   Column,
   Generated,
} from 'typeorm';

@Entity('user_tokens')
class UserToken {
   @PrimaryGeneratedColumn('uuid')
   public id: string;

   @PrimaryGeneratedColumn('uuid')
   public user_id: string;

   @Column()
   @Generated('uuid')
   public token: string;

   @CreateDateColumn()
   public created_at: Date;

   @UpdateDateColumn()
   public updated_at: Date;
}

export default UserToken;
