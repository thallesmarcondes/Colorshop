// src/utils/printerUtils.js
// Integração com QZ Tray para impressão em impressora térmica (Printer POS-80 / FTXP-80W)
// Documentação: https://qz.io/docs

import qz from "qz-tray";

qz.security.setCertificatePromise(function (resolve) {
  resolve();
});

qz.security.setSignaturePromise(function () {
  return function (resolve) {
    resolve();
  };
});

async function connect() {
  if (!qz.websocket.isActive()) {
    await qz.websocket.connect();
  }
}

export async function listPrinters() {
  await connect();
  const printers = await qz.printers.find();
  return printers;
}

// Versão simplificada para teste: manda só texto puro, sem comandos ESC/POS.
export async function printReceipt(printerName, lines) {
  await connect();

  const config = qz.configs.create(printerName);

  const data = lines.join("\n") + "\n\n\n\n";

  const printData = [
    {
      type: "raw",
      format: "plain",
      data: data,
    },
  ];

  await qz.print(config, printData);
}

export async function isQzTrayRunning() {
  try {
    await connect();
    return true;
  } catch (e) {
    return false;
  }
}
