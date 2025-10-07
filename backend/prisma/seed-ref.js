// Reference Data Seeder
// Seed untuk tabel referensi (RefPetunjuk, RefSifat, RefUrgensi)

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding reference data...');

  // Seed RefPetunjuk
  const petunjukData = [
    'Untuk Diketahui',
    'Untuk Ditindaklanjuti',
    'Untuk Diselesaikan',
    'Untuk Diperhatikan',
    'Untuk Dikoordinasikan',
    'Untuk Dikonsultasikan',
    'Untuk Diarsipkan',
    'Untuk Diedarkan',
    'Untuk Ditelaah',
    'Untuk Ditanggapi'
  ];

  console.log('📝 Seeding RefPetunjuk...');
  for (const petunjuk of petunjukData) {
    try {
      await prisma.refPetunjuk.upsert({
        where: { petunjuk },
        update: { petunjuk },
        create: {
          petunjuk,
          created_by: null,
          updated_by: null
        }
      });
      console.log(`✅ Petunjuk: ${petunjuk}`);
    } catch (error) {
      console.error(`❌ Error seeding petunjuk ${petunjuk}:`, error);
    }
  }

  // Seed RefSifat
  const sifatData = [
    'Biasa',
    'Segera',
    'Sangat Segera',
    'Rahasia',
    'Sangat Rahasia',
    'Terbatas',
    'Penting',
    'Sangat Penting',
    'Mendesak',
    'Rutin'
  ];

  console.log('🔒 Seeding RefSifat...');
  for (const sifat of sifatData) {
    try {
      await prisma.refSifat.upsert({
        where: { sifat },
        update: { sifat },
        create: {
          sifat,
          created_by: null,
          updated_by: null
        }
      });
      console.log(`✅ Sifat: ${sifat}`);
    } catch (error) {
      console.error(`❌ Error seeding sifat ${sifat}:`, error);
    }
  }

  // Seed RefUrgensi
  const urgensiData = [
    'Rendah',
    'Sedang',
    'Tinggi',
    'Sangat Tinggi',
    'Kritis',
    'Normal',
    'Prioritas',
    'Biasa',
    'Mendesak',
    'Rutin'
  ];

  console.log('⚡ Seeding RefUrgensi...');
  for (const urgensi of urgensiData) {
    try {
      await prisma.refUrgensi.upsert({
        where: { urgensi },
        update: { urgensi },
        create: {
          urgensi,
          created_by: null,
          updated_by: null
        }
      });
      console.log(`✅ Urgensi: ${urgensi}`);
    } catch (error) {
      console.error(`❌ Error seeding urgensi ${urgensi}:`, error);
    }
  }

  console.log('🎉 Reference data seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
