const nano = require("nano")("http://admin:password123@localhost:5984");
const dbName = "sensoriot";

function getRandomDate(start, end) {
    const timestamp = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    return new Date(timestamp).toISOString();
  }

  function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function generateDataSensor(count) {
    const startDate = new Date('2024-01-01T00:00:00Z');
    const endDate = new Date();
  
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        idlogger: `logger:${Math.floor(Math.random() * 1000) + 1}`,
        datasensor: (Math.random() * 1000).toFixed(3),
        waktu: getRandomDate(startDate, endDate),
      });
    }
  
    data.sort((a, b) => new Date(a.waktu) - new Date(b.waktu));
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
    const jumlahPerData = 100
    const operatorNames = [
      "kpunandeng", "tettyyunidar", "reza", "ridho", "spkpu", "administrator",
      "ennyhajiwani", "wiwiethenry", "khairulrazikin", "fahri", "kpunoname",
      "pameran", "adibudiwan", "eko", "spkpw1", "urayomar", "kpw2noname",
      "spkpw2", "henu", "edo"
    ];
  const startDate = new Date('2024-01-01T00:00:00Z');
  const endDate = new Date();

    const docs = [];
   
    for (let docIndex = 1; docIndex <= 130; docIndex++) {
      const logsensor = generateDataSensor( jumlahPerData);

      const doc = {
        _id: `sensoriot:${docIndex.toString().padStart(3, "0")}`,
        jenissensor:
          jenisSensorList[Math.floor(Math.random() * jenisSensorList.length)],
        datasensor: parseFloat((Math.random() * 5).toFixed(2)),
        idperangkat: `perangkat:${Math.floor(Math.random() * 130) + 1}`,
        lokasi: lokasiList[Math.floor(Math.random() * lokasiList.length)],
        status: Math.round(Math.random()),
        logsensor: logsensor,
        controlroom:{
          idcontrolroom: `controlroom:${docIndex + 1}`,
          namaoperator:getRandomElement(operatorNames),
          waktumonitoring: getRandomDate(startDate, endDate)
      }
      };

      docs.push(doc);
    }

    await db.bulk({ docs });
  } catch (err) {
    console.error("Terjadi kesalahan:", err);
  }
}

setup();
