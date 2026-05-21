import sequelize from './config/database.js';
import { Voucher, User } from './models/index.js';
import { generateVouchers } from './utils/voucherGenerator.js';
import bcrypt from 'bcryptjs';

const seedDatabase = async () => {
  try {
    console.log('Starting database seed...');
    
    // Sync database
    await sequelize.sync({ force: true });
    console.log('Database synced');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      username: 'admin',
      password: adminPassword,
      role: 'admin'
    });
    console.log('Admin user created');

    // Generate demo vouchers
    // 10 vouchers = 1 hour (60 minutes)
    const oneHourVouchers = generateVouchers(10, 60, 'WIFI');
    await Voucher.bulkCreate(oneHourVouchers);
    console.log('Created 10 vouchers for 1 hour');

    // 5 vouchers = 3 hours (180 minutes)
    const threeHourVouchers = generateVouchers(5, 180, 'PISO');
    await Voucher.bulkCreate(threeHourVouchers);
    console.log('Created 5 vouchers for 3 hours');

    // 5 vouchers = whole day (1440 minutes)
    const dayVouchers = generateVouchers(5, 1440, 'GILNET');
    await Voucher.bulkCreate(dayVouchers);
    console.log('Created 5 vouchers for whole day');

    // Mark some vouchers as used
    const usedVouchers = await Voucher.findAll({ limit: 3 });
    for (const voucher of usedVouchers) {
      await voucher.update({ status: 'used', devicesUsed: 1 });
    }
    console.log('Marked 3 vouchers as used');

    // Mark some vouchers as expired
    const expiredVouchers = await Voucher.findAll({ 
      where: { status: 'active' },
      limit: 2,
      offset: 5
    });
    for (const voucher of expiredVouchers) {
      await voucher.update({ 
        status: 'expired',
        expirationDate: new Date(Date.now() - 86400000) // Yesterday
      });
    }
    console.log('Marked 2 vouchers as expired');

    console.log('Database seeded successfully!');
    console.log('\nDemo Vouchers:');
    const allVouchers = await Voucher.findAll();
    allVouchers.forEach(v => {
      console.log(`${v.code} - ${v.duration}min - ${v.status}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
