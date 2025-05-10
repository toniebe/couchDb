const nano = require('nano')(`http://admin:password123@localhost:5984`);
const dbName = 'perangkat';

async function setup() {
  try {
    const dbList = await nano.db.list();
    if (!dbList.includes(dbName)) {
      await nano.db.create(dbName);
      console.log(`Database '${dbName}' berhasil dibuat.`);
    } else {
      console.log(`Database '${dbName}' sudah ada.`);
    }

    const db = nano.use(dbName);

    const lokasiList = [
      "Booster Dharma Putra", "Booster Pal V", "Booster Sepakat", "Booster Selat Panjang",
      "Booster Pramuka", "Booster Kesehatan", "Booster Rambutan", "Booster Suwignyo",
      "Booster Veteran", "Booster Simpang Tiga", "Booster Simpang Kawat", "Booster Sekip",
      "Booster Parameswara", "Booster Alang-Alang Lebar", "Booster Celentang",
      "Booster Tanjung Burung", "Booster Kalidoni", "Booster Sukabangun",
      "Booster Perindustrian", "Booster Bukit Lama"
    ];


    const docs = [];
    for (let i = 1; i <= 135; i++) {
      const perangkat = {
        _id: `perangkat:03052025:${i}`,
        idperangkat: i,
        lokasi: lokasiList[Math.floor(Math.random() * lokasiList.length)],
        status: Math.round(Math.random())
      };
      docs.push(perangkat);
    }

    // Insert secara bulk
    const result = await db.bulk({ docs });
    console.log('Data berhasil dimasukkan:', result.length, 'dokumen');

  } catch (err) {
    console.error('Terjadi kesalahan:', err);
  }
}

setup();