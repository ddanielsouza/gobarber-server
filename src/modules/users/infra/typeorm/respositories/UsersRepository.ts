import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import { FindManyOptions, getRepository, Not, Repository } from 'typeorm';
import User from '../entities/User';

class UsersRepository implements IUserRepository {
   private ormRepository: Repository<User>;

   constructor() {
      this.ormRepository = getRepository(User);
   }

   public async findById(id: string): Promise<User | undefined> {
      const user = await this.ormRepository.findOne(id);

      return user;
   }

   public async findByEmail(email: string): Promise<User | undefined> {
      const user = await this.ormRepository.findOne({ where: { email } });

      return user;
   }

   public async save(user: User): Promise<User> {
      return this.ormRepository.save(user);
   }

   public async create(user: ICreateUserDTO): Promise<User> {
      const appointment = this.ormRepository.create(user);

      await this.ormRepository.save(appointment);

      return appointment;
   }

   public async findAllProviders({
      except_user_id,
   }: IFindAllProvidersDTO): Promise<User[]> {
      const conditionsFind: FindManyOptions<User> | undefined = except_user_id
         ? { where: { id: Not(except_user_id) } }
         : undefined;

      return this.ormRepository.find(conditionsFind);
   }
}

export default UsersRepository;
