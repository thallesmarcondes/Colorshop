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

// Imprime como HTML renderizado (modo "pixel"), em vez de texto bruto.
export async function printReceipt(printerName, lines) {
  await connect();

  const config = qz.configs.create(printerName, {
    size: { width: 80, height: null },
    units: "mm",
    margins: 0,
  });

  const html = `
    <html>
      <body style="margin:0; padding:4mm; font-family: 'Courier New', monospace; font-size: 12px; width: 72mm;">
        ${lines.map((l) => `<div>${l === "" ? "&nbsp;" : l}</div>`).join("")}
      </body>
    </html>
  `;

  const printData = [
    {
      type: "pixel",
      format: "html",
      flavor: "plain",
      data: html,
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

