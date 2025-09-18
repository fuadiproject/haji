// Database Cleanup Script
// Hapus semua data test sebelum mengubah schema

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Starting database cleanup...');

  try {
    // Delete in correct order to respect foreign key constraints
    
    // 1. Delete disposisi catatan targets first (most dependent)
    console.log('🗑️ Deleting disposisi catatan targets...');
    const deletedTargets = await prisma.disposisiCatatanTarget.deleteMany({});
    console.log(`✅ Deleted ${deletedTargets.count} disposisi catatan targets`);

    // 2. Delete disposisi catatan
    console.log('🗑️ Deleting disposisi catatan...');
    const deletedCatatan = await prisma.disposisiCatatan.deleteMany({});
    console.log(`✅ Deleted ${deletedCatatan.count} disposisi catatan`);

    // 3. Delete disposisi
    console.log('🗑️ Deleting disposisi...');
    const deletedDisposisi = await prisma.disposisi.deleteMany({});
    console.log(`✅ Deleted ${deletedDisposisi.count} disposisi`);

    // 4. Delete TTE logs
    console.log('🗑️ Deleting TTE logs...');
    const deletedTTE = await prisma.logPengajuanTTE.deleteMany({});
    console.log(`✅ Deleted ${deletedTTE.count} TTE logs`);

    // 5. Delete surat keluar
    console.log('🗑️ Deleting surat keluar...');
    const deletedSuratKeluar = await prisma.suratKeluar.deleteMany({});
    console.log(`✅ Deleted ${deletedSuratKeluar.count} surat keluar`);

    // 6. Delete surat masuk
    console.log('🗑️ Deleting surat masuk...');
    const deletedSuratMasuk = await prisma.suratMasuk.deleteMany({});
    console.log(`✅ Deleted ${deletedSuratMasuk.count} surat masuk`);

    // 7. Delete files
    console.log('🗑️ Deleting files...');
    const deletedFiles = await prisma.file.deleteMany({});
    console.log(`✅ Deleted ${deletedFiles.count} files`);

    // 8. Delete reference data
    console.log('🗑️ Deleting reference data...');
    const deletedPetunjuk = await prisma.refPetunjuk.deleteMany({});
    const deletedSifat = await prisma.refSifat.deleteMany({});
    const deletedUrgensi = await prisma.refUrgensi.deleteMany({});
    console.log(`✅ Deleted ${deletedPetunjuk.count} petunjuk, ${deletedSifat.count} sifat, ${deletedUrgensi.count} urgensi`);

    // 9. Delete users (except test users)
    console.log('🗑️ Deleting non-test users...');
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        nik: {
          notIn: [
            '1234567890123456',
            '9876543210987654', 
            '5555555555555555',
            '1111111111111111',
            '2222222222222222'
          ]
        }
      }
    });
    console.log(`✅ Deleted ${deletedUsers.count} non-test users`);

    console.log('🎉 Database cleanup completed successfully!');
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Cleanup failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
