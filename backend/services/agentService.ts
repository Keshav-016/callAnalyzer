import bcrypt from 'bcryptjs';
import { AgentType, UserType, UserResponseType } from '../types/index.js';
import mongodbService from './mongodbService.js';

class AgentService {
  findById = async (id: string): Promise<UserType | undefined> => {
    return mongodbService.getAgentById(id);
  };

  findByCredentials = async (id: string, password: string): Promise<UserResponseType | null> => {
    const user = await this.findById(id);
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
  }): Promise<UserResponseType> => {
    const exists = await this.findById(id);
    if (exists) throw new Error('User exists');
    const passwordHash = await bcrypt.hash(password, 8);
    const agent: AgentType = {
      agent_id: id,
      name,
      password: passwordHash,
      joining_date: new Date().toISOString().slice(0, 10),
    };
    const insertResult = await mongodbService.insertAgent(agent);
    if (!insertResult.ok) throw new Error('Failed to create user');
    console.log(`[UserService] User created: ${id}`);
    return { id, name };
  };
}

export default new AgentService();
