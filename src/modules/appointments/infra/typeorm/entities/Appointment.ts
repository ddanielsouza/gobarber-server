import {
   Entity,
   Column,
   PrimaryGeneratedColumn,
   CreateDateColumn,
   UpdateDateColumn,
   ManyToOne,
   JoinColumn,
} from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';

@Entity('appointments')
class Appointment {
   @PrimaryGeneratedColumn('uuid')
   public id: string;

   @Column()
   public provider_id: string;

   @ManyToOne(() => User)
   @JoinColumn({ name: 'provider_id' })
   public provider: User;

   @Column('timestamp with time zone')
   public date: Date;

   @CreateDateColumn()
   public created_at: Date;

   @UpdateDateColumn()
   public updated_at: Date;
}

export default Appointment;
