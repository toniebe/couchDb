const nano = require('nano')(`http://admin:password123@localhost:5984`);
const db = nano.db.use('pdam');

const jenisSensor = ["valve", "flowmeter", "pressure"];

async function insertSensorToPerangkat() {
  try {
    // Ambil semua data perangkat
    const perangkatData = await db.list({
      include_docs: true,
      startkey: 'perangkat:03052025:',
      endkey: 'perangkat:03052025:\ufff0'
    });

    if (!perangkatData.rows || perangkatData.rows.length === 0) {
      console.error("❌ Tidak ada data perangkat ditemukan.");
      return;
    }

    console.log(`✅ Ditemukan ${perangkatData.rows.length} data perangkat.`);

    const updatedDocs = perangkatData.rows.map((row,index) => {
      const doc = row.doc;

      // Buat data sensor acak
      const sensor = {
        idsensor: `sensor:03052025:${index+1}`,
        jenissensor: jenisSensor[Math.floor(Math.random() * jenisSensor.length)],
        datasensor: parseFloat(Math.random().toFixed(3)), // Nilai sensor acak
        waktu: new Date().toISOString() // Timestamp
      };

      // Menambahkan sensor ke perangkat
      doc.sensor = sensor;

      return doc;
    });

    // Memasukkan perubahan ke dalam database
    const result = await db.bulk({ docs: updatedDocs });
    console.log(`✅ Sensor berhasil ditambahkan ke ${result.length} perangkat.`);
  } catch (err) {
    console.error("❌ Terjadi kesalahan:", err);
  }
}

insertSensorToPerangkat();
