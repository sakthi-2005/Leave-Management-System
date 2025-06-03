const { DataSource } = require('typeorm') ;
const dotenv = require('dotenv') ;
const { User } = require('./entities/User') ;
const { LeaveType } = require('./entities/LeaveType') ;
const { LeaveBalance } = require('./entities/LeaveBalance') ;
const { LeaveRequest } = require('./entities/LeaveRequest') ;
const { Holidays } = require('./entities/Holidays') ;
const { Position } = require('./entities/Positions') ;

dotenv.config() ;


console.log('Database configuration:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
});

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false, 
  entities: [User, LeaveType, LeaveBalance, LeaveRequest , Holidays , Position,],
  migrations: ['src/migrations/**/*.ts'],
});

// Initialize the database connection
const initializeDatabase = async () => {
  try {
    if (AppDataSource.isInitialized) {
      console.log('Database connection already initialized');
      return;
    }
    await AppDataSource.initialize();
    console.log('Database connection successfully established');

    console.log(AppDataSource.entityMetadatas.map(e => e.name));

  } catch (error) {
    console.error('Error during database initialization:', error);
    process.exit(1);
  }
};

const UserRepo = AppDataSource.getRepository(User);
const LeaveTypeRepo = AppDataSource.getRepository(LeaveType);
const LeaveBalanceRepo = AppDataSource.getRepository(LeaveBalance);
const LeaveRequestRepo = AppDataSource.getRepository(LeaveRequest);
const HolidaysRepo = AppDataSource.getRepository(Holidays);
const PositionRepo = AppDataSource.getRepository(Position);

module.exports = { initializeDatabase , UserRepo, LeaveTypeRepo, LeaveBalanceRepo, LeaveRequestRepo, HolidaysRepo, PositionRepo };