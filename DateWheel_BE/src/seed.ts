import mongoose from 'mongoose';
import { config } from './config/env';
import { ProfileModel } from './modules/profile/profile.model';
import { SettingModel } from './modules/setting/setting.model';

const seedDatabase = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB for seeding...');

    const profiles = [
      { name: 'Chung', avatar: '👨' },
      { name: 'Trang', avatar: '👩' }
    ];

    for (const p of profiles) {
      let profile = await ProfileModel.findOne({ name: p.name });
      if (!profile) {
        profile = await ProfileModel.create(p);
        console.log(`Created profile: ${p.name}`);
        
        // Also create default settings for new profile
        await SettingModel.create({
          owner: profile._id,
          darkMode: false,
          sound: true,
          animation: true,
          language: 'vi'
        });
        console.log(`Created default settings for: ${p.name}`);
      } else {
        console.log(`Profile ${p.name} already exists.`);
      }
    }

    console.log('Database seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
