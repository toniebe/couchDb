const nano = require("nano")("http://admin:password123@localhost:5984");
const dbName = "logsensor";

function getRandomDate(start, end) {
  const timestamp =
    start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(timestamp).toISOString();
}

function generateDataSensor() {
  const startDate = new Date("2024-01-01T00:00:00Z");
  const endDate = new Date();

  let data;
  data = {
    idlogger: `logger:${Math.floor(Math.random() * 1000) + 1}`,
    datasensor: (Math.random() * 1000).toFixed(3),
    waktu: getRandomDate(startDate, endDate),
  };

  return data;
}

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
      "Booster Dharma Putra",
      "Booster Pal V",
      "Booster Sepakat",
      "Booster Selat Panjang",
      "Booster Pramuka",
      "Booster Kesehatan",
      "Booster Rambutan",
      "Booster Suwignyo",
      "Booster Veteran",
      "Booster Simpang Tiga",
      "Booster Simpang Kawat",
      "Booster Sekip",
      "Booster Parameswara",
      "Booster Alang-Alang Lebar",
      "Booster Celentang",
      "Booster Tanjung Burung",
      "Booster Kalidoni",
      "Booster Sukabangun",
      "Booster Perindustrian",
      "Booster Bukit Lama",
    ];

    const jenisSensorList = ["pressure", "valve", "flowmeter"];
    const jumlahPerData = 100;
    const startDate = new Date("2024-01-01T00:00:00Z");
    const endDate = new Date();

    const docs = [];

    for (let docIndex = 1; docIndex <= 100000; docIndex++) {

      const doc = {
        _id: `sensoriot:${docIndex.toString().padStart(3, "0")}`,
        jenissensor:
          jenisSensorList[Math.floor(Math.random() * jenisSensorList.length)],
        datasensor: parseFloat((Math.random() * 5).toFixed(2)),
        idperangkat: `perangkat:${Math.floor(Math.random() * 130) + 1}`,
        lokasi: lokasiList[Math.floor(Math.random() * lokasiList.length)],
        status: Math.round(Math.random()),
        idlogger: `logger:${Math.floor(Math.random() * 1000) + 1}`,
        datasensor: (Math.random() * 1000).toFixed(3),
        waktu: getRandomDate(startDate, endDate),
      };

      docs.push(doc);
    }

    await db.bulk({ docs });
  } catch (err) {
    console.error("Terjadi kesalahan:", err);
  }
}

setup();
