import bcrypt from 'bcryptjs';
import { User, UserResponse } from '../types/index.js';

class UserService {
  private readonly users: User[];

  constructor() {
    // Simple in-memory user store for initial development
    this.users = [
      // password: password123
      { id: 'agent_1', name: 'Agent One', passwordHash: bcrypt.hashSync('password123', 8) },
    ];
    console.log('[UserService] Initialized with default user: agent_1');
  }

  findById = async (id: string): Promise<User | undefined> => {
    return this.users.find((u) => u.id === id);
  };

  findByCredentials = async (id: string, password: string): Promise<UserResponse | null> => {
    const user = this.users.find((u) => u.id === id);
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.passwordHash);
    return valid ? { id: user.id, name: user.name } : null;
  };

  create = async ({
    id,
    name,
    password,
  }: {
    id: string;
    name: string;
    password: string;
  }): Promise<UserResponse> => {
    const exists = this.users.find((u) => u.id === id);
    if (exists) throw new Error('User exists');
    const passwordHash = await bcrypt.hash(password, 8);
    const user: User = { id, name, passwordHash };
    this.users.push(user);
    console.log(`[UserService] User created: ${id}`);
    return { id: user.id, name: user.name };
  };
}

export default new UserService();
