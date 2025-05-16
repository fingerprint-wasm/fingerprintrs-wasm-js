const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs').promises;
const { getOrCreateDeviceId } = require('./cookieManager');

const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(bodyParser.json());

// Servir o frontend
app.use(express.static(path.join(__dirname, '../public')));

// Rota para coleta de dados de fingerprint da biblioteca fingerprint-rs
app.post('/fingerprint-rs', async (req, res) => {
  await handleClassRequest(req, res, 'fingerprint-rs');
});

// Rota para coleta de dados de fingerprint da bibliotec fingerprintjs
app.post('/fingerprint-js', async (req, res) => {
  await handleClassRequest(req, res, 'fingerprint-js');
});

async function handleClassRequest(req, res, className) {
  const deviceId = getOrCreateDeviceId(req, res);
  const { lab, attributes } = req.body;

  const finalData = {
    'deviceId': deviceId,
    'lab': lab,
    ...attributes
  };

  await saveToJsonByClass(finalData, className);

  res.status(200).json({ message: `Dados de ${className} recebidos.` });
}

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

async function saveToJsonByClass(obj, className) {
  const dir = path.resolve(__dirname, 'data');
  const filePath = path.join(dir, `${className}.json`);
  console.log(filePath);

  // garante diretório existe
  await fs.mkdir(dir, { recursive: true });

  let allData = [];
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    allData = JSON.parse(raw);
    if (!Array.isArray(allData)) {
      // se por acaso não for array, reinicia
      allData = [];
    }
  } catch (err) {
    if (err.code !== 'ENOENT') {
      // erro diferente de “não existe”: relança
      throw err;
    }
    // ENOENT: arquivo não existe — iniciaremos com array vazio
    console.log("Arquivo não existe. Será criado um novo.");
  }

  // adiciona novo objeto ao array
  allData.push(obj);

  // escreve (ou recria) o arquivo com o JSON formatado
  await fs.writeFile(filePath, JSON.stringify(allData, null, 2), 'utf-8');
}
