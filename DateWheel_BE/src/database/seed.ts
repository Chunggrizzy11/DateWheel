import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { ProfileModel } from '../modules/profile/profile.model';

const seedDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected!');

    console.log('Clearing existing profiles...');
    await ProfileModel.deleteMany({});
    
    console.log('Seeding profiles...');
    const profiles = [
      { name: 'Chung', avatar: '👨' },
      { name: 'Trang', avatar: '👩' }
    ];

    await ProfileModel.insertMany(profiles);
    console.log('Profiles seeded successfully!');

    console.log('Database seeding completed.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
