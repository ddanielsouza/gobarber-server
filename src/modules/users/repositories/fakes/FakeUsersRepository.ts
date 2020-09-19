import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import { uuid } from 'uuidv4';

class FakeUsersRepository implements IUserRepository {
   private users: User[] = [];

   public async findById(id: string): Promise<User | undefined> {
      return this.users.find(user => user.id === id);
   }

   public async findByEmail(email: string): Promise<User | undefined> {
      return this.users.find(user => user.email === email);
   }

   public async save(userData: User): Promise<User> {
      const indexUser = this.users.findIndex(user => user.id === userData.id);

      this.users[indexUser] = userData;

      return userData;
   }

   public async create(userData: ICreateUserDTO): Promise<User> {
      const user = new User();
      Object.assign(user, { id: uuid() }, userData);

      this.users.push(user);
      return user;
   }
}

export default FakeUsersRepository;
