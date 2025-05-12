const nano = require("nano")("http://admin:password123@localhost:5984");
const dbName = "scada";

function getRandomDate(start, end) {
    const timestamp = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    return new Date(timestamp).toISOString();
}

function generateAutomatedRules(count) {
    const rules = [];
    for (let i = 1; i <= count; i++) {
      rules.push(`Automated Rule ${i}`);
    }
    return rules;
  }

  function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function getRandomStatus() {
    return Math.random() < 0.5 ? 'aktif' : 'nonaktif';
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

        const jenisSensor = ["pressure", "valve", "flowmeter"];
        const jenisSensorAcak = jenisSensor[Math.floor(Math.random() * jenisSensor.length)];

        const docs = [];
        const aiMethods = [
            "Naive Bayes",
            "Convolutional Neural Network (CNN)",
            "Recurrent Neural Network (RNN)",
            "Decision Tree",
            "Random Forest",
            "Support Vector Machine (SVM)",
            "K-Nearest Neighbors (KNN)",
            "Gradient Boosting",
            "Long Short-Term Memory (LSTM)",
            "Transformer",
            "BERT",
            "Cuckoo Search Algorithm",
            "Deep Belief Network (DBN)",
            "Autoencoder"
          ];
          const operatorNames = [
            "kpunandeng", "tettyyunidar", "reza", "ridho", "spkpu", "administrator",
            "ennyhajiwani", "wiwiethenry", "khairulrazikin", "fahri", "kpunoname",
            "pameran", "adibudiwan", "eko", "spkpw1", "urayomar", "kpw2noname",
            "spkpw2", "henu", "edo"
          ];
        const startDate = new Date('2024-01-01T00:00:00Z');
        const endDate = new Date();
        let currentDate = new Date(startDate);

        for (let docIndex = 1; docIndex <= 130; docIndex++) {
            const doc = {
                idscada: `scada:${Math.floor(Math.random() * 50) + 1}`,
                scadawaktu: getRandomDate(startDate, endDate),
                dataproses: `proses ${Math.floor(Math.random() * 200) + 1}`,
                idgateway: `gateway:${Math.floor(Math.random() * 110) + 1}`,
                datagateway: `232${Math.floor(Math.random() * 200) + 1}`,
                sensor: {
                    idsensor: `sensor:${docIndex + 1}`,
                    jenissensor: jenisSensorAcak,
                    datasensor: parseFloat((Math.random() * 1000).toFixed(3)),
                    waktu: new Date().toISOString(),
                },
                pemeliharaan: {
                    tanggalpemeliharaan: new Date(currentDate).toISOString(),
                    status: getRandomStatus(),
                },
                automatedRules:{
                    rules:generateAutomatedRules(docIndex),
                    metode:getRandomElement(aiMethods)
                },
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
