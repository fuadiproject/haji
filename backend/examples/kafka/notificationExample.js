import { getKafkaProducer } from '../../src/utils/kafkaProducer.js';

/**
 * Simple Notification Example
 * Pakai utils yang udah ada aja
 */

// 1 LINE untuk publish notification! 🎯
async function publishNotification(notificationData) {
  const notificationId = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const message = {
    notification_id: notificationId,
    type: notificationData.type || 'info',
    title: notificationData.title,
    message: notificationData.message,
    user_id: notificationData.userId,
    data: notificationData.data || {}
  };

  const kafka = getKafkaProducer();
  return await kafka.sendMessage('notification-requests', message, notificationId);
}

// Contoh di controller
class SuratMasukController {
  async createSuratMasuk(req, res) {
    try {
      const { nomor_surat } = req.body;
      const userId = req.user.nik;

      // Create surat masuk
      const suratMasuk = await this.suratMasukModel.create({
        nomor_surat,
        created_by: userId
      });

      // 1 LINE untuk publish notification! 🎯
      publishNotification({
        type: 'info',
        title: 'Surat Masuk Baru',
        message: `Surat masuk ${nomor_surat} telah dibuat`,
        userId: 'admin-user-id',
        data: { surat_masuk_id: suratMasuk.id }
      }).catch(error => console.error('Notification failed:', error));

      res.json({ success: true, data: suratMasuk });

    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export { publishNotification, SuratMasukController };
