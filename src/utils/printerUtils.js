// src/utils/printerUtils.js
// Integração com QZ Tray para impressão em impressora térmica (Printer POS-80 / FTXP-80W)
// Documentação: https://qz.io/docs

import qz from "qz-tray";

// Certificado/assinatura: para uso simples (sem certificado próprio),
// QZ Tray vai mostrar um aviso de segurança na primeira impressão.
// O usuário só precisa clicar em "Allow" / "Permitir" uma vez.
qz.security.setCertificatePromise(function (resolve) {
  resolve(); // sem certificado customizado — modo simples
});

qz.security.setSignaturePromise(function () {
  return function (resolve) {
    resolve(); // sem assinatura customizada — modo simples
  };
});

// Conecta ao QZ Tray (precisa estar rodando em segundo plano no Mac)
async function connect() {
  if (!qz.websocket.isActive()) {
    await qz.websocket.connect();
  }
}

// Lista as impressoras disponíveis (útil para debug)
export async function listPrinters() {
  await connect();
  const printers = await qz.printers.find();
  return printers;
}

// Imprime um cupom de texto simples na impressora térmica
// `lines` é um array de strings, cada uma vira uma linha no cupom
export async function printReceipt(printerName, lines) {
  await connect();

  const config = qz.configs.create(printerName, {
    encoding: "UTF-8",
  });

  const ESC = "\x1B";
  const GS = "\x1D";

  let data = ESC + "@"; // reset/inicializa impressora
  lines.forEach((line) => {
    data += line + "\n";
  });
  data += "\n\n\n"; // espaço antes de cortar
  data += GS + "V" + "\x00"; // comando de corte total (se suportado)

  const printData = [
    {
      type: "raw",
      format: "plain",
      data: data,
    },
  ];

  await qz.print(config, printData);
}

// Verifica se o QZ Tray está rodando (retorna true/false)
export async function isQzTrayRunning() {
  try {
    await connect();
    return true;
  } catch (e) {
    return false;
  }
}
