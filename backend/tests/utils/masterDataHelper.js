// Master Data Helper for Integration Tests
import request from 'supertest';
import app from '../../src/app.js';

/**
 * Get random reference data for testing
 * This helper fetches master data and returns random IDs for use in other tests
 */
export class MasterDataHelper {
  constructor(jwtToken) {
    this.jwtToken = jwtToken;
  }

  /**
   * Get random petunjuk ID
   */
  async getRandomPetunjukId() {
    const response = await request(app)
      .get('/api/master/petunjuk')
      .set('Authorization', `Bearer ${this.jwtToken}`)
      .expect(200);

    const petunjukList = response.body.data;
    const randomIndex = Math.floor(Math.random() * petunjukList.length);
    return petunjukList[randomIndex].id;
  }

  /**
   * Get random sifat ID
   */
  async getRandomSifatId() {
    const response = await request(app)
      .get('/api/master/sifat')
      .set('Authorization', `Bearer ${this.jwtToken}`)
      .expect(200);

    const sifatList = response.body.data;
    const randomIndex = Math.floor(Math.random() * sifatList.length);
    return sifatList[randomIndex].id;
  }

  /**
   * Get random urgensi ID
   */
  async getRandomUrgensiId() {
    const response = await request(app)
      .get('/api/master/urgensi')
      .set('Authorization', `Bearer ${this.jwtToken}`)
      .expect(200);

    const urgensiList = response.body.data;
    const randomIndex = Math.floor(Math.random() * urgensiList.length);
    return urgensiList[randomIndex].id;
  }

  /**
   * Get all reference data at once
   */
  async getAllRandomReferenceData() {
    const [petunjukId, sifatId, urgensiId] = await Promise.all([
      this.getRandomPetunjukId(),
      this.getRandomSifatId(),
      this.getRandomUrgensiId()
    ]);

    return {
      petunjuk_id: petunjukId,
      sifat_id: sifatId,
      urgensi_id: urgensiId
    };
  }

  /**
   * Get specific reference data by name
   */
  async getPetunjukByName(petunjukName) {
    const response = await request(app)
      .get('/api/master/petunjuk')
      .set('Authorization', `Bearer ${this.jwtToken}`)
      .expect(200);

    const petunjuk = response.body.data.find(p => p.petunjuk === petunjukName);
    return petunjuk ? petunjuk.id : null;
  }

  async getSifatByName(sifatName) {
    const response = await request(app)
      .get('/api/master/sifat')
      .set('Authorization', `Bearer ${this.jwtToken}`)
      .expect(200);

    const sifat = response.body.data.find(s => s.sifat === sifatName);
    return sifat ? sifat.id : null;
  }

  async getUrgensiByName(urgensiName) {
    const response = await request(app)
      .get('/api/master/urgensi')
      .set('Authorization', `Bearer ${this.jwtToken}`)
      .expect(200);

    const urgensi = response.body.data.find(u => u.urgensi === urgensiName);
    return urgensi ? urgensi.id : null;
  }
}

/**
 * Create a helper instance with JWT token
 */
export const createMasterDataHelper = (jwtToken) => {
  return new MasterDataHelper(jwtToken);
};
