import bcrypt from 'bcryptjs';
import { User, UserResponse } from '../types/index.js';

// Simple in-memory user store for initial development.
const users: User[] = [
  // password: password123
  { id: 'agent_1', name: 'Agent One', passwordHash: bcrypt.hashSync('password123', 8) },
];

class UserService {
  findById = async (id: string): Promise<User | undefined> => {
    return users.find((u) => u.id === id);
  };

  findByCredentials = async (id: string, password: string): Promise<UserResponse | null> => {
    const user = users.find((u) => u.id === id);
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
    const exists = users.find((u) => u.id === id);
    if (exists) throw new Error('User exists');
    const passwordHash = await bcrypt.hash(password, 8);
    const user: User = { id, name, passwordHash };
    users.push(user);
    return { id: user.id, name: user.name };
  };
}

export default new UserService();
