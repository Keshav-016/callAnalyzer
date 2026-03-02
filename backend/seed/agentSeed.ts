import bcrypt from 'bcryptjs';
import { AgentType } from '../types/index.js';
import dbConnection from '../config/dbConnection.js';
import mongodbService from '../services/mongodbService.js';
const agents: AgentType[] = [
  {
    agent_id: 'agent_1',
    name: 'Agent One',
    email: 'agent1@gmail.com',
    department: 'Sales',
    joining_date: '2023-08-01',
    password: bcrypt.hashSync('password123', 8),
  },
  {
    agent_id: 'agent_2',
    name: 'Agent Two',
    email: 'agent2@gmail.com',
    department: 'Support',
    joining_date: '2023-01-01',
    password: bcrypt.hashSync('password123', 8),
  },
  {
    agent_id: 'agent_3',
    name: 'Agent Three',
    email: 'agent3@gmail.com',
    department: 'Sales',
    joining_date: '2022-10-01',
    password: bcrypt.hashSync('password123', 8),
  },
  {
    agent_id: 'agent_4',
    name: 'Agent Four',
    email: 'agent4@gmail.com',
    department: 'Support',
    joining_date: '2022-01-01',
    password: bcrypt.hashSync('password123', 8),
  },
  {
    agent_id: 'agent_5',
    name: 'Agent Five',
    email: 'agent5@gmail.com',
    department: 'Sales',
    joining_date: '2025-01-10',
    password: bcrypt.hashSync('password123', 8),
  },
  {
    agent_id: 'agent_6',
    name: 'Agent Six',
    email: 'agent6@gmail.com',
    department: 'Support',
    joining_date: '2022-01-01',
    password: bcrypt.hashSync('password123', 8),
  },
];

async function seedAgents() {
  try {
    dbConnection();
    for (const agent of agents) {
      try {
        console.log(`inserting agent: ${agent.agent_id}`);
        await mongodbService.insertAgent(agent);
      } catch (err) {
        console.log(`error couldn't insert agent: ${agent.agent_id}`);
        console.log(err);
      }
    }
  } catch (err) {
    console.error('Error seeding agents:', err);
  }
}
seedAgents();
