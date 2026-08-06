import { User } from '@/types/models';
import { BaseRepository } from './BaseRepository';
import { v4 as uuidv4 } from 'crypto';

export class UserRepository extends BaseRepository<User> {
  protected tableName = 'users';
  private static store: Map<string, User> = new Map();

  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const user: User = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    UserRepository.store.set(user.id, user);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return UserRepository.store.get(id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    for (const user of UserRepository.store.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async findAll(): Promise<User[]> {
    return Array.from(UserRepository.store.values());
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = UserRepository.store.get(id);
    if (!user) throw new Error(`User ${id} not found`);

    const updated: User = {
      ...user,
      ...data,
      updatedAt: new Date(),
    };
    UserRepository.store.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    UserRepository.store.delete(id);
  }

  // Seedear usuario admin
  static async seedAdmin(): Promise<void> {
    const repo = new UserRepository();
    const existing = await repo.findByEmail('admin@hotelflow.local');
    if (!existing) {
      await repo.create({
        email: 'admin@hotelflow.local',
        password: 'hashedPassword123', // En producción hashar con bcrypt
        name: 'Administrador',
        role: 'admin',
      });
    }
  }
}
