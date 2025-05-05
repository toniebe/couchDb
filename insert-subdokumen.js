const nano = require('nano')(`http://admin:password123@localhost:5984`);
const db = nano.db.use('pdam');

const jenisSensor = ["valve", "flowmeter", "pressure"];
const jumlahPerangkat = 10;
const jumlahPerData = 1000;

function getRandomDate(start, end) {
  const timestamp = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(timestamp).toISOString();
}

function getRandomStatus() {
  return Math.random() < 0.5 ? 'aktif' : 'nonaktif';
}

function getRandomKondisi() {
  return Math.random() < 0.5 ? 'baik' : 'rusak';
}

function generatePemeliharaanSchedule(startDate, endDate) {
  const pemeliharaan = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    for (let i = 0; i < 2; i++) {
      pemeliharaan.push({
        tanggalpemeliharaan: new Date(currentDate).toISOString(),
        status: getRandomStatus(),
      });
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  }

  return pemeliharaan;
}

function generateDataSensor(sensorId, count) {
  const startDate = new Date('2024-01-01T00:00:00Z');
  const endDate = new Date();

  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      idlogger: `${sensorId}:logger:${i + 1}`,
      datasensor: (Math.random() * 1000).toFixed(3),
      waktu: getRandomDate(startDate, endDate),
    });
  }
  
  // Urutkan berdasarkan waktu (waktu diurutkan dari yang paling awal hingga paling terakhir)
  data.sort((a, b) => new Date(a.waktu) - new Date(b.waktu));

  return data;
}

function getRandomTipeAkuator() {
  return Math.random() < 0.5 ? 'listrik' : 'pneumatik';
}

async function insertSubDocument() {
  try {
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

    const updatedDocs = perangkatData.rows.map((row, index) => {
      const doc = row.doc;
      const jenisSensorAcak = jenisSensor[Math.floor(Math.random() * jenisSensor.length)];
      const sensor = {
        idsensor: `sensor:03052025:${index + 1}`,
        jenissensor: jenisSensorAcak,
        datasensor: parseFloat((Math.random() * 1000).toFixed(3)),
        waktu: new Date().toISOString(),
        logsensor: []
      };

      const sensorLogs = generateDataSensor(sensor.idsensor, jumlahPerData);
      sensor.logsensor.push(...sensorLogs);

      sensor.logsensor.sort((a, b) => new Date(a.waktu) - new Date(b.waktu));

      if (sensor.logsensor.length > 0) {
        const firstLogDate = new Date(sensor.logsensor[0].waktu);
        const lastLogDate = new Date(sensor.logsensor[sensor.logsensor.length - 1].waktu);
        
        const aset = {
          idaset: `aset:03052025:${index + 1}`,
          namaaset: jenisSensorAcak,
          kondisi: getRandomKondisi(),
          jadwalpemeliharaan: generatePemeliharaanSchedule(firstLogDate, lastLogDate)
        };

        doc.sensor = sensor;
        doc.aset = aset;
      }
      doc.tipeakuator = getRandomTipeAkuator();

      return doc;
    });

    const result = await db.bulk({ docs: updatedDocs });
    console.log(`✅ Sensor dan aset berhasil ditambahkan ke ${result.length} perangkat.`);

  } catch (err) {
    console.error("❌ Terjadi kesalahan:", err);
  }
}

insertSubDocument();
