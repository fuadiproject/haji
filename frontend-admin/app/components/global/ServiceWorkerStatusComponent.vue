<template>
  <!-- <div v-if="updateAvailable" class="update-banner">
    <div class="update-content">
      <div class="update-icon">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div class="update-text">
        <h4>Update Tersedia</h4>
        <p>Aplikasi memiliki versi terbaru yang dapat diunduh</p>
      </div>
      <div class="update-actions">
        <button class="update-button" @click="updateApp">Update</button>
        <button class="dismiss-button" @click="dismissUpdate">Nanti</button>
      </div>
    </div>
  </div> -->

  <!-- Offline indicator -->
  <div v-if="!isOnline" class="offline-indicator">
    <div class="offline-content">
      <div class="offline-icon">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            fill="currentColor"
          />
        </svg>
      </div>
      <span>Mode Offline</span>
    </div>
  </div>
</template>

<script setup>
const { /*updateAvailable, updateServiceWorker,*/ isOnline } =
  useServiceWorker();

// const updateApp = () => {
//   updateServiceWorker();
// };

// const dismissUpdate = () => {
//   // Hide update banner for this session
//   updateAvailable.value = false;
// };
</script>

<style scoped>
.update-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  z-index: 9999;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.update-content {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 1200px;
  margin: 0 auto;
}

.update-icon {
  flex-shrink: 0;
  color: #ffd700;
}

.update-text {
  flex: 1;
  min-width: 0;
}

.update-text h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
}

.update-text p {
  margin: 0;
  font-size: 12px;
  opacity: 0.9;
}

.update-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.update-button,
.dismiss-button {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.update-button {
  background: white;
  color: #667eea;
}

.update-button:hover {
  background: #f7fafc;
  transform: translateY(-1px);
}

.dismiss-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.dismiss-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.offline-indicator {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #f56565;
  color: white;
  z-index: 9998;
  padding: 8px 16px;
  text-align: center;
}

.offline-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
}

.offline-icon {
  color: white;
}

/* Adjust for update banner */
.update-banner + .offline-indicator {
  top: 60px;
}

/* Mobile responsive */
@media (max-width: 640px) {
  .update-content {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }

  .update-actions {
    width: 100%;
    justify-content: center;
  }

  .update-button,
  .dismiss-button {
    flex: 1;
    max-width: 120px;
  }
}
</style>
