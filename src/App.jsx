import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  LayoutGrid, ArrowUpRight, ArrowDownLeft, Wallet, Users, Truck,
  RefreshCw, Plus, X, Trash2, Search, Download, Home, Loader2, Pencil, Receipt, Check, Copy,
  Lock, UserCog, LogOut, FileText, Printer, MessageCircle, Eye, EyeOff,
  Menu, Image as ImageIcon, Camera, TrendingUp, Award
} from "lucide-react";
import { supabase } from "./supabaseConfig";

const fmtUSD = (v) =>
  "US$ " + Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtBRL = (v) =>
  "R$ " + Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const todayISO = () => new Date().toISOString().slice(0, 10);
const fmtDate = (iso) => {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};
const fmtDateLong = () =>
  new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).toUpperCase();

const LOGO_ICON = "data:image/png;base64,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";
const LOGO_FULL = "data:image/jpeg;base64,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";

const uid = () => Math.random().toString(36).slice(2, 9);

// Reads an image file, shrinks it and returns a compressed base64 (JPEG) string
function readAndCompressImage(file, maxSize = 900, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Falha ao ler arquivo"));
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error("Falha ao carregar imagem"));
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
function todayISODefault(day) {
  const d = new Date();
  d.setDate(day);
  return d.toISOString().slice(0, 10);
}

const NAV = [
  { key: "visao", label: "Visão geral", icon: Home, roles: ["admin", "vendedor"] },
  { key: "estoque", label: "Estoque", icon: LayoutGrid, roles: ["admin", "vendedor"] },
  { key: "vendas", label: "Vendas", icon: ArrowUpRight, roles: ["admin", "vendedor"] },
  { key: "comissoes", label: "Desempenho e comissões", icon: TrendingUp, roles: ["admin"] },
  { key: "orcamentos", label: "Orçamentos", icon: FileText, roles: ["admin", "vendedor"] },
  { key: "compras", label: "Compras", icon: ArrowDownLeft, roles: ["admin"] },
  { key: "caixa", label: "Caixa", icon: Wallet, roles: ["admin"] },
  { key: "contas", label: "Contas a pagar", icon: Receipt, roles: ["admin"] },
  { key: "clientes", label: "Clientes", icon: Users, roles: ["admin", "vendedor"] },
  { key: "fornecedores", label: "Fornecedores", icon: Truck, roles: ["admin"] },
  { key: "cambio", label: "Câmbio", icon: RefreshCw, roles: ["admin"] },
  { key: "vendedores", label: "Vendedores", icon: UserCog, roles: ["admin"] },
];

// ---- storage helpers ----
const STORAGE_KEYS = {
  estoque: "nexo-estoque",
  vendas: "nexo-vendas",
  compras: "nexo-compras",
  pessoas: "nexo-pessoas", // { clientes, fornecedores }
  caixa: "nexo-caixa", // { caixas, movimentos }
  cambio: "nexo-cambio",
  contas: "nexo-contas",
  usuarios: "nexo-usuarios",
  orcamentos: "nexo-orcamentos",
};

async function loadKey(key, fallback) {
  try {
    const { data, error } = await supabase
      .from("app_data")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    if (error) throw error;
    if (data && data.value != null) return data.value;
    return fallback;
  } catch (e) {
    console.error("Falha ao carregar", key, e);
    return fallback;
  }
}
async function saveKey(key, value) {
  try {
    const { error } = await supabase
      .from("app_data")
      .upsert({ key, value, updated_at: new Date().toISOString() });
    if (error) throw error;
  } catch (e) {
    console.error("Falha ao salvar", key, e);
  }
}

const DEFAULTS = {
  estoque: [
    { id: uid(), nome: "Smartphone Galaxy A54", qtd: 5, custo: 100, custoVendedor: 100, varejo: 150, atacado: 130, min: 3 },
    { id: uid(), nome: "Fone Bluetooth JBL", qtd: 5, custo: 80, custoVendedor: 80, varejo: 120, atacado: 100, min: 4 },
    { id: uid(), nome: "Carregador Turbo 20W", qtd: 8, custo: 72, custoVendedor: 72, varejo: 95, atacado: 80, min: 5 },
  ],
  vendas: [],
  compras: [],
  pessoas: { clientes: [{ id: uid(), nome: "João Silva", contato: "+595 981 234 567" }], fornecedores: [{ id: uid(), nome: "Distribuidora Central", contato: "+595 991 555 222" }] },
  caixa: { caixas: { usdt: 0, dolar: 0, pix: 0, real: 0 }, movimentos: [] },
  cambio: { tcr: 5.26, chacoCompra: 5.26, chacoVenda: 5.35, modo: "Manual" },
  contas: [
    { id: uid(), nome: "Água", categoria: "Água", valor: 45, vencimento: todayISODefault(10), status: "Pendente", dataPagamento: null },
    { id: uid(), nome: "Energia", categoria: "Energia", valor: 120, vencimento: todayISODefault(15), status: "Pendente", dataPagamento: null },
    { id: uid(), nome: "Internet", categoria: "Internet", valor: 60, vencimento: todayISODefault(20), status: "Pendente", dataPagamento: null },
    { id: uid(), nome: "Aluguel", categoria: "Aluguel", valor: 500, vencimento: todayISODefault(5), status: "Pendente", dataPagamento: null },
  ],
  usuarios: [
    { id: uid(), nome: "Administrador", usuario: "admin", senha: "admin123", papel: "admin" },
  ],
  orcamentos: [],
};

function Badge({ status }) {
  const map = {
    Pago: "bg-emerald-50 text-emerald-700",
    Pendente: "bg-amber-50 text-amber-700",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${map[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-xl shadow-xl w-full ${wide ? "max-w-2xl" : "max-w-md"} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function PhotoLightbox({ src, nome, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-900/70 flex items-center justify-center z-[60] p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 truncate">{nome}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 shrink-0 ml-2">
            <X size={18} />
          </button>
        </div>
        <img src={src} alt={nome} className="w-full max-h-[70vh] object-contain bg-gray-50" />
        <div className="p-4">
          <a
            href={src}
            download={`${(nome || "foto").replace(/[^a-z0-9]+/gi, "-")}.jpg`}
            className="w-full flex items-center justify-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-md py-2 text-sm font-medium"
          >
            <Download size={14} /> Baixar foto
          </a>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent";

export default function ColorShopDashboard() {
  const [page, setPage] = useState("visao");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const [estoque, setEstoque] = useState(DEFAULTS.estoque);
  const [vendas, setVendas] = useState(DEFAULTS.vendas);
  const [compras, setCompras] = useState(DEFAULTS.compras);
  const [clientes, setClientes] = useState(DEFAULTS.pessoas.clientes);
  const [fornecedores, setFornecedores] = useState(DEFAULTS.pessoas.fornecedores);
  const [caixas, setCaixas] = useState(DEFAULTS.caixa.caixas);
  const [movimentos, setMovimentos] = useState(DEFAULTS.caixa.movimentos);
  const [cambio, setCambio] = useState(DEFAULTS.cambio);
  const [contas, setContas] = useState(DEFAULTS.contas);
  const [usuarios, setUsuarios] = useState(DEFAULTS.usuarios);
  const [orcamentos, setOrcamentos] = useState(DEFAULTS.orcamentos);

  const [authUser, setAuthUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [modal, setModal] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [editingConta, setEditingConta] = useState(null);
  const [payingConta, setPayingConta] = useState(null);
  const [receivingVenda, setReceivingVenda] = useState(null);

  // ---- load from persistent storage on mount ----
  useEffect(() => {
    (async () => {
      const { data: estoqueCheck } = await supabase
        .from("app_data")
        .select("key")
        .eq("key", STORAGE_KEYS.estoque)
        .maybeSingle();
      const isFirstRun = estoqueCheck == null;

      const [est, ven, comp, pes, cx, cam, cts, usr, orc] = await Promise.all([
        loadKey(STORAGE_KEYS.estoque, DEFAULTS.estoque),
        loadKey(STORAGE_KEYS.vendas, DEFAULTS.vendas),
        loadKey(STORAGE_KEYS.compras, DEFAULTS.compras),
        loadKey(STORAGE_KEYS.pessoas, DEFAULTS.pessoas),
        loadKey(STORAGE_KEYS.caixa, DEFAULTS.caixa),
        loadKey(STORAGE_KEYS.cambio, DEFAULTS.cambio),
        loadKey(STORAGE_KEYS.contas, DEFAULTS.contas),
        loadKey(STORAGE_KEYS.usuarios, DEFAULTS.usuarios),
        loadKey(STORAGE_KEYS.orcamentos, DEFAULTS.orcamentos),
      ]);
      const estMigrado = (est || []).map((i) => {
        let x = i;
        if (x.varejo === undefined || x.atacado === undefined) {
          x = { ...x, varejo: x.varejo ?? x.venda ?? x.custo * 1.3, atacado: x.atacado ?? x.venda ?? x.custo * 1.15 };
        }
        if (x.custoVendedor === undefined) {
          x = { ...x, custoVendedor: x.custo };
        }
        return x;
      });
      setEstoque(estMigrado);
      const venMigrado = (ven || []).map((v) =>
        v.itens ? v : { ...v, itens: [{ itemId: v.itemId || uid(), itemNome: v.itemNome, qtd: v.qtd, tipoVenda: v.tipoVenda, precoUnit: v.qtd ? v.valor / v.qtd : v.valor, subtotal: v.valor }] }
      );
      setVendas(venMigrado);
      const compMigrado = (comp || []).map((c) =>
        c.itens ? c : { ...c, itens: [{ nome: c.itemNome, qtd: c.qtd, custo: c.qtd ? c.total / c.qtd : c.total, subtotal: c.total }] }
      );
      setCompras(compMigrado);
      setClientes(pes.clientes || []);
      setFornecedores(pes.fornecedores || []);
      setCaixas(cx.caixas || DEFAULTS.caixa.caixas);
      setMovimentos(cx.movimentos || []);
      setCambio(cam);
      setContas(cts || []);
      setUsuarios(usr && usr.length ? usr : DEFAULTS.usuarios);
      setOrcamentos(orc || []);

      // persist defaults on very first run so the keys exist going forward
      if (isFirstRun) {
        saveKey(STORAGE_KEYS.estoque, est);
        saveKey(STORAGE_KEYS.vendas, ven);
        saveKey(STORAGE_KEYS.compras, comp);
        saveKey(STORAGE_KEYS.pessoas, { clientes: pes.clientes, fornecedores: pes.fornecedores });
        saveKey(STORAGE_KEYS.caixa, { caixas: cx.caixas, movimentos: cx.movimentos });
        saveKey(STORAGE_KEYS.cambio, cam);
        saveKey(STORAGE_KEYS.contas, cts);
        saveKey(STORAGE_KEYS.usuarios, usr);
        saveKey(STORAGE_KEYS.orcamentos, orc);
      }

      // restore session (per-tab, so a refresh doesn't force re-login, but closing the tab does)
      try {
        const savedSession = window.sessionStorage.getItem("nexo-session");
        if (savedSession) {
          const sessUserId = JSON.parse(savedSession).id;
          const found = (usr && usr.length ? usr : DEFAULTS.usuarios).find((u) => u.id === sessUserId);
          if (found) setAuthUser(found);
        }
      } catch (e) {}

      setLoaded(true);
      setAuthChecked(true);
    })();
  }, []);

  // ---- persist on change (skip until initial load finishes) ----
  useEffect(() => { if (loaded) saveKey(STORAGE_KEYS.estoque, estoque); }, [estoque, loaded]);
  useEffect(() => { if (loaded) saveKey(STORAGE_KEYS.vendas, vendas); }, [vendas, loaded]);
  useEffect(() => { if (loaded) saveKey(STORAGE_KEYS.compras, compras); }, [compras, loaded]);
  useEffect(() => { if (loaded) saveKey(STORAGE_KEYS.pessoas, { clientes, fornecedores }); }, [clientes, fornecedores, loaded]);
  useEffect(() => { if (loaded) saveKey(STORAGE_KEYS.caixa, { caixas, movimentos }); }, [caixas, movimentos, loaded]);
  useEffect(() => { if (loaded) saveKey(STORAGE_KEYS.cambio, cambio); }, [cambio, loaded]);
  useEffect(() => { if (loaded) saveKey(STORAGE_KEYS.contas, contas); }, [contas, loaded]);
  useEffect(() => { if (loaded) saveKey(STORAGE_KEYS.usuarios, usuarios); }, [usuarios, loaded]);
  useEffect(() => { if (loaded) saveKey(STORAGE_KEYS.orcamentos, orcamentos); }, [orcamentos, loaded]);

  function login(usuario, senha) {
    const found = usuarios.find((u) => u.usuario.toLowerCase() === usuario.trim().toLowerCase() && u.senha === senha);
    if (found) {
      setAuthUser(found);
      try { window.sessionStorage.setItem("nexo-session", JSON.stringify({ id: found.id })); } catch (e) {}
      setPage("visao");
      return true;
    }
    return false;
  }
  function logout() {
    setAuthUser(null);
    try { window.sessionStorage.removeItem("nexo-session"); } catch (e) {}
  }
  const isAdmin = authUser?.papel === "admin";
  const visibleNav = NAV.filter((n) => !authUser || n.roles.includes(authUser.papel));

  // ---- derived values ----
  const vendasHoje = useMemo(
    () => vendas.filter((v) => v.data === todayISO()).reduce((s, v) => s + v.valor, 0),
    [vendas]
  );
  const aReceber = useMemo(
    () => vendas.filter((v) => v.status === "Pendente").reduce((s, v) => s + v.valor, 0),
    [vendas]
  );
  const valorEstoque = useMemo(() => estoque.reduce((s, i) => s + i.qtd * i.custo, 0), [estoque]);
  const unidadesEstoque = useMemo(() => estoque.reduce((s, i) => s + i.qtd, 0), [estoque]);
  const estoqueBaixo = useMemo(() => estoque.filter((i) => i.qtd < i.min), [estoque]);
  const nextVendaId = useMemo(() => (vendas.length ? Math.max(...vendas.map((v) => v.id)) + 1 : 1), [vendas]);

  const caixaMeta = {
    usdt: { label: "USDT", sub: "crypto", color: "bg-emerald-50 text-emerald-700", symbol: "₮", format: (v) => v.toFixed(2) + " USDT" },
    dolar: { label: "Dólar efetivo", sub: "cash", color: "bg-blue-50 text-blue-700", symbol: "$", format: (v) => v.toFixed(2) + " USD" },
    pix: { label: "PIX", sub: "pix", color: "bg-cyan-50 text-cyan-700", symbol: "R$", format: fmtBRL },
    real: { label: "Real efetivo", sub: "cash", color: "bg-orange-50 text-orange-700", symbol: "R$", format: fmtBRL },
  };

  function addMovimento(caixaKey, tipo, valor, descricao) {
    setCaixas((c) => ({ ...c, [caixaKey]: c[caixaKey] + (tipo === "Entrada" ? valor : -valor) }));
    setMovimentos((m) => [{ id: uid(), caixa: caixaKey, tipo, valor, descricao, data: todayISO() }, ...m]);
  }

  function registrarVenda({ clienteId, itens, pagamento, condicao, vencimento }) {
    if (!itens || itens.length === 0) return;
    // validate stock per item (aggregate qty per itemId in case of duplicates)
    const qtdPorItem = {};
    itens.forEach((l) => { qtdPorItem[l.itemId] = (qtdPorItem[l.itemId] || 0) + l.qtd; });
    for (const itemId in qtdPorItem) {
      const stockItem = estoque.find((i) => i.id === itemId);
      if (!stockItem || qtdPorItem[itemId] > stockItem.qtd) return;
    }
    // vendedores não podem vender abaixo do custo
    if (!isAdmin) {
      for (const l of itens) {
        const stockItem = estoque.find((i) => i.id === l.itemId);
        if (!stockItem) continue;
        const custoRef = stockItem.custoVendedor ?? stockItem.custo;
        const preco = l.precoUnit != null ? l.precoUnit : (l.tipoVenda === "Atacado" ? stockItem.atacado : stockItem.varejo);
        if (preco < custoRef) return;
      }
    }
    const cliente = clientes.find((c) => c.id === clienteId);
    const linhas = itens.map((l) => {
      const item = estoque.find((i) => i.id === l.itemId);
      const precoUnit = l.precoUnit != null ? l.precoUnit : (l.tipoVenda === "Atacado" ? item.atacado : item.varejo);
      return { itemId: l.itemId, itemNome: item.nome, qtd: l.qtd, tipoVenda: l.tipoVenda, precoUnit, subtotal: precoUnit * l.qtd };
    });
    const valor = linhas.reduce((s, l) => s + l.subtotal, 0);
    const id = nextVendaId;
    setEstoque((e) => e.map((i) => (qtdPorItem[i.id] ? { ...i, qtd: i.qtd - qtdPorItem[i.id] } : i)));
    setVendas((v) => [
      { id, clienteId, clienteNome: cliente ? cliente.nome : "Sem nome", itens: linhas, valor, pagamento, condicao, vencimento: condicao === "A prazo" ? vencimento : null, status: condicao === "À vista" ? "Pago" : "Pendente", data: todayISO(), vendedor: authUser?.nome || null },
      ...v,
    ]);
    if (condicao === "À vista") {
      const key = pagamento === "USDT" ? "usdt" : pagamento === "Dólar" ? "dolar" : pagamento === "PIX" ? "pix" : "real";
      addMovimento(key, "Entrada", valor, `Venda #${id}`);
    }
    setModal(null);
  }

  function registrarCompra({ fornecedorId, itens, pagamento, condicao, vencimento }) {
    if (!itens || itens.length === 0) return;
    const fornecedor = fornecedores.find((f) => f.id === fornecedorId);
    let estoqueAtualizado = estoque;
    itens.forEach((l) => {
      const existing = estoqueAtualizado.find((i) => i.nome.toLowerCase() === l.nome.toLowerCase());
      if (existing) {
        estoqueAtualizado = estoqueAtualizado.map((i) => (i.id === existing.id ? { ...i, qtd: i.qtd + l.qtd, custo: l.custo } : i));
      } else {
        estoqueAtualizado = [...estoqueAtualizado, { id: uid(), nome: l.nome, qtd: l.qtd, custo: l.custo, custoVendedor: l.custo, varejo: l.varejo || l.custo * 1.3, atacado: l.atacado || l.custo * 1.15, min: 3 }];
      }
    });
    setEstoque(estoqueAtualizado);
    const total = itens.reduce((s, l) => s + l.custo * l.qtd, 0);
    const fornecedorNome = fornecedor ? fornecedor.nome : "Sem nome";
    setCompras((c) => [
      { id: uid(), fornecedorNome, itens: itens.map((l) => ({ nome: l.nome, qtd: l.qtd, custo: l.custo, subtotal: l.custo * l.qtd })), total, condicao, vencimento: condicao === "A prazo" ? vencimento : null, data: todayISO() },
      ...c,
    ]);
    if (condicao === "A prazo") {
      setContas((cs) => [
        { id: uid(), nome: `Fornecedor: ${fornecedorNome}`, categoria: "Fornecedor", valor: total, vencimento, status: "Pendente", dataPagamento: null },
        ...cs,
      ]);
    } else {
      const key = pagamento === "USDT" ? "usdt" : pagamento === "Dólar" ? "dolar" : pagamento === "PIX" ? "pix" : "real";
      addMovimento(key, "Saída", total, `Compra de ${fornecedorNome} (${itens.length} ${itens.length === 1 ? "item" : "itens"})`);
    }
    setModal(null);
  }

  const contasPendentes = useMemo(() => contas.filter((c) => c.status === "Pendente"), [contas]);
  const totalContasPendentes = useMemo(() => contasPendentes.reduce((s, c) => s + c.valor, 0), [contasPendentes]);
  const contasVencendo = useMemo(
    () => contasPendentes.filter((c) => c.vencimento <= todayISO()).sort((a, b) => a.vencimento.localeCompare(b.vencimento)),
    [contasPendentes]
  );
  const vendasACobrar = useMemo(() => vendas.filter((v) => v.status === "Pendente").sort((a, b) => a.data.localeCompare(b.data)), [vendas]);

  function pagarConta(id, caixaKey) {
    const conta = contas.find((c) => c.id === id);
    if (!conta || conta.status === "Pago") return;
    setContas((cs) => cs.map((c) => (c.id === id ? { ...c, status: "Pago", dataPagamento: todayISO() } : c)));
    addMovimento(caixaKey, "Saída", conta.valor, `Conta: ${conta.nome}`);
  }

  function marcarVendaPaga(id, caixaKey) {
    const venda = vendas.find((v) => v.id === id);
    if (!venda || venda.status === "Pago") return;
    setVendas((vs) => vs.map((v) => (v.id === id ? { ...v, status: "Pago" } : v)));
    addMovimento(caixaKey, "Entrada", venda.valor, `Recebimento venda #${id}`);
  }

  function imprimirVenda(venda) {
    const linhas = (venda.itens || [])
      .map(
        (l) => `
        <tr>
          <td style="padding:4px 0;">${l.itemNome}</td>
          <td style="padding:4px 0;text-align:center;">${l.qtd}</td>
          <td style="padding:4px 0;text-align:right;">${fmtUSD(l.precoUnit)}</td>
          <td style="padding:4px 0;text-align:right;">${fmtUSD(l.subtotal)}</td>
        </tr>`
      )
      .join("");
    const html = `
      <html>
      <head>
        <title>Nota de venda #${venda.id}</title>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, Arial, sans-serif; color: #111827; padding: 24px; max-width: 420px; margin: 0 auto; }
          h1 { font-size: 18px; margin: 0 0 2px; }
          .muted { color: #6b7280; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
          thead th { text-align: left; border-bottom: 1px solid #111827; padding-bottom: 4px; font-size: 11px; text-transform: uppercase; color: #6b7280; }
          tbody tr { border-bottom: 1px solid #e5e7eb; }
          .total { display: flex; justify-content: space-between; font-weight: bold; font-size: 15px; margin-top: 16px; border-top: 1px solid #111827; padding-top: 8px; }
          .row { display: flex; justify-content: space-between; font-size: 13px; margin-top: 4px; }
          .footer { margin-top: 24px; text-align: center; font-size: 11px; color: #9ca3af; }
        </style>
      </head>
      <body>
        <h1>Indufarma</h1>
        <div class="muted">Nota de venda #${venda.id} · ${fmtDate(venda.data)}</div>
        <div class="row"><span>Cliente</span><strong>${venda.clienteNome}</strong></div>
        <div class="row"><span>Pagamento</span><span>${venda.pagamento} (${venda.condicao})</span></div>
        <table>
          <thead><tr><th>Item</th><th style="text-align:center;">Qtd</th><th style="text-align:right;">Unit.</th><th style="text-align:right;">Subtotal</th></tr></thead>
          <tbody>${linhas}</tbody>
        </table>
        <div class="total"><span>Total</span><span>${fmtUSD(venda.valor)}</span></div>
        <div class="footer">Obrigado pela preferência!</div>
      </body>
      </html>`;
    const win = window.open("", "_blank", "width=420,height=600");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 300);
  }

  function duplicarConta(id) {
    const conta = contas.find((c) => c.id === id);
    if (!conta) return;
    const d = new Date(conta.vencimento);
    d.setMonth(d.getMonth() + 1);
    setContas((cs) => [...cs, { id: uid(), nome: conta.nome, categoria: conta.categoria, valor: conta.valor, vencimento: d.toISOString().slice(0, 10), status: "Pendente", dataPagamento: null }]);
  }

  // ---------- PAGES ----------

  function StatCard({ label, value, sub }) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="text-[11px] tracking-wide text-gray-400 font-medium mb-2">{label}</div>
        <div className="text-2xl font-semibold text-gray-900">{value}</div>
        <div className="text-xs text-gray-400 mt-1">{sub}</div>
      </div>
    );
  }

  function VisaoGeral() {
    return (
      <>
        <div className="bg-emerald-900 text-white rounded-xl px-6 py-4 mb-6 flex flex-wrap items-center gap-8">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            <div>
              <div className="text-sm font-semibold">Câmbio manual</div>
              <div className="text-xs text-emerald-200">Valores definidos por você</div>
            </div>
          </div>
          <div className="h-8 w-px bg-emerald-700 hidden sm:block" />
          <div>
            <div className="text-[10px] tracking-wide text-emerald-300">TCR · BRL/USDT</div>
            <div className="text-lg font-semibold">R$ {cambio.tcr.toFixed(2).replace(".", ",")}</div>
          </div>
          <div>
            <div className="text-[10px] tracking-wide text-emerald-300">CHACO · COMPRA USD</div>
            <div className="text-lg font-semibold">R$ {cambio.chacoCompra.toFixed(2).replace(".", ",")}</div>
          </div>
          <div>
            <div className="text-[10px] tracking-wide text-emerald-300">CHACO · VENDA USD</div>
            <div className="text-lg font-semibold">R$ {cambio.chacoVenda.toFixed(2).replace(".", ",")}</div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div>
              <div className="text-[10px] tracking-wide text-emerald-300">MODO</div>
              <div className="text-sm font-semibold">{cambio.modo}</div>
            </div>
            <button onClick={() => setModal("cambio")} className="bg-emerald-800 hover:bg-emerald-700 text-xs font-medium px-3 py-1.5 rounded-md">
              Ajustar
            </button>
          </div>
        </div>

        {(vendasACobrar.length > 0 || contasVencendo.length > 0) && (
          <div className="border border-amber-200 bg-amber-50 rounded-xl p-5 mb-6">
            <div className="text-sm font-semibold text-amber-900 mb-1">Lembretes de hoje</div>
            <div className="text-xs text-amber-700 mb-4">{fmtDateLong()}</div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div>
                <div className="text-xs font-medium text-amber-800 mb-2">A cobrar ({vendasACobrar.length})</div>
                {vendasACobrar.length === 0 ? (
                  <div className="text-sm text-amber-700/60">Ninguém a cobrar no momento.</div>
                ) : (
                  <ul className="space-y-2">
                    {vendasACobrar.map((v) => {
                      const atrasada = v.vencimento && v.vencimento < todayISO();
                      return (
                      <li key={v.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-900">{v.clienteNome}</span>
                          <span className="text-gray-400"> · venda #{v.id}</span>
                          {v.vencimento && (
                            <span className={atrasada ? "text-red-600" : "text-gray-400"}> · {atrasada ? "atrasada" : "vence"} {fmtDate(v.vencimento)}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-900">{fmtUSD(v.valor)}</span>
                          <button
                            onClick={() => { setReceivingVenda(v); setModal("receberVenda"); }}
                            className="text-xs font-medium text-emerald-800 hover:text-emerald-900 border border-emerald-800 rounded-md px-2 py-1"
                          >
                            Marcar recebido
                          </button>
                        </div>
                      </li>
                    );})}
                  </ul>
                )}
              </div>
              <div>
                <div className="text-xs font-medium text-amber-800 mb-2">A pagar ({contasVencendo.length})</div>
                {contasVencendo.length === 0 ? (
                  <div className="text-sm text-amber-700/60">Nenhuma conta vencendo hoje.</div>
                ) : (
                  <ul className="space-y-2">
                    {contasVencendo.map((c) => {
                      const atrasada = c.vencimento < todayISO();
                      return (
                        <li key={c.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 text-sm">
                          <div>
                            <span className="font-medium text-gray-900">{c.nome}</span>
                            <span className={atrasada ? "text-red-600" : "text-gray-400"}> · {atrasada ? "atrasada" : "vence hoje"}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-gray-900">{fmtUSD(c.valor)}</span>
                            <button
                              onClick={() => { setPayingConta(c); setModal("pagarConta"); }}
                              className="text-xs font-medium text-emerald-800 hover:text-emerald-900 border border-emerald-800 rounded-md px-2 py-1"
                            >
                              Marcar pago
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <StatCard label="VENDAS HOJE" value={fmtUSD(vendasHoje)} sub="Dados salvos" />
          <StatCard label="A RECEBER" value={fmtUSD(aReceber)} sub="Vendas pendentes" />
          {isAdmin && <StatCard label="CONTAS A PAGAR" value={fmtUSD(totalContasPendentes)} sub={`${contasPendentes.length} pendentes`} />}
          {isAdmin && <StatCard label="VALOR EM ESTOQUE" value={fmtUSD(valorEstoque)} sub={`${unidadesEstoque} unidades`} />}
          <StatCard label="CLIENTES" value={clientes.length} sub={`${fornecedores.length} fornecedores`} />
        </div>

        {isAdmin && (
          <>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-semibold text-gray-900">Caixas e saldos</div>
                <div className="text-xs text-gray-400">Valores reais registrados</div>
              </div>
              <button onClick={() => setModal("movimento")} className="flex items-center gap-1.5 text-sm font-medium bg-white border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50">
                <Plus size={14} /> Movimento
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {Object.keys(caixaMeta).map((k) => (
                <div key={k} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center text-sm font-semibold ${caixaMeta[k].color}`}>
                      {caixaMeta[k].symbol}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{caixaMeta[k].label}</div>
                      <div className="text-xs text-gray-400">{caixaMeta[k].sub}</div>
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">{caixaMeta[k].format(caixas[k])}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    Equivale a {fmtUSD(k === "pix" || k === "real" ? caixas[k] / cambio.chacoVenda : caixas[k])}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
            <div className="text-sm font-semibold text-gray-900">Vendas recentes</div>
            <div className="text-xs text-gray-400 mb-3">Últimos lançamentos</div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] tracking-wide text-gray-400 border-b border-gray-100">
                  <th className="pb-2 font-medium">VENDA</th>
                  <th className="pb-2 font-medium">CLIENTE</th>
                  <th className="pb-2 font-medium">ITENS</th>
                  <th className="pb-2 font-medium">VALOR</th>
                  <th className="pb-2 font-medium">PAGAMENTO</th>
                  <th className="pb-2 font-medium">CONDIÇÃO</th>
                  <th className="pb-2 font-medium">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {vendas.slice(0, 5).map((v) => (
                  <tr key={v.id} className="border-b border-gray-50">
                    <td className="py-3">
                      <div className="font-medium text-gray-900">#{v.id}</div>
                      <div className="text-xs text-gray-400">{fmtDate(v.data)}</div>
                    </td>
                    <td className="py-3 text-gray-600">{v.clienteNome}</td>
                    <td className="py-3 text-gray-600">
                      {v.itens?.length > 1 ? `${v.itens.length} produtos` : v.itens?.[0]?.itemNome || "—"}
                    </td>
                    <td className="py-3 font-medium text-gray-900">{fmtUSD(v.valor)}</td>
                    <td className="py-3 text-gray-600">{v.pagamento}</td>
                    <td className="py-3 text-gray-600">{v.condicao}</td>
                    <td className="py-3"><Badge status={v.status} /></td>
                  </tr>
                ))}
                {vendas.length === 0 && (
                  <tr><td colSpan={7} className="py-6 text-center text-gray-400 text-sm">Nenhuma venda registrada.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="text-sm font-semibold text-gray-900">Estoque baixo</div>
            <div className="text-xs text-gray-400 mb-4">Mercadorias que precisam de atenção</div>
            {estoqueBaixo.length === 0 ? (
              <div className="text-sm text-gray-400 text-center py-6">Nenhuma mercadoria abaixo do mínimo.</div>
            ) : (
              <ul className="space-y-3">
                {estoqueBaixo.map((i) => (
                  <li key={i.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{i.nome}</span>
                    <span className="text-amber-600 font-medium">{i.qtd} un.</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="text-sm font-semibold text-gray-900 mt-6">Contas a pagar</div>
            <div className="text-xs text-gray-400 mb-4">Próximos vencimentos</div>
            {contasPendentes.length === 0 ? (
              <div className="text-sm text-gray-400 text-center py-6">Nenhuma conta pendente.</div>
            ) : (
              <ul className="space-y-3">
                {[...contasPendentes]
                  .sort((a, b) => a.vencimento.localeCompare(b.vencimento))
                  .slice(0, 4)
                  .map((c) => (
                    <li key={c.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{c.nome}</span>
                      <span className={`font-medium ${c.vencimento < todayISO() ? "text-red-600" : "text-gray-500"}`}>
                        {fmtUSD(c.valor)} · {fmtDate(c.vencimento)}
                      </span>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      </>
    );
  }

  function TableShell({ title, sub, action, children }) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <div className="text-sm font-semibold text-gray-900">{title}</div>
            {sub && <div className="text-xs text-gray-400">{sub}</div>}
          </div>
          {action}
        </div>
        <div className="overflow-x-auto">{children}</div>
      </div>
    );
  }

  function EstoquePage() {
    const [busca, setBusca] = useState("");
    const [filtroMarca, setFiltroMarca] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");

    const marcas = useMemo(
      () => Array.from(new Set(estoque.map((i) => i.marca).filter(Boolean))).sort(),
      [estoque]
    );
    const tipos = useMemo(
      () => Array.from(new Set(estoque.map((i) => i.tipo).filter(Boolean))).sort(),
      [estoque]
    );

    const listaFiltrada = estoque.filter((i) => {
      const buscaOk = busca.trim() === "" || i.nome.toLowerCase().includes(busca.trim().toLowerCase());
      const marcaOk = filtroMarca === "" || i.marca === filtroMarca;
      const tipoOk = filtroTipo === "" || i.tipo === filtroTipo;
      return buscaOk && marcaOk && tipoOk;
    });

    return (
      <TableShell
        title="Estoque"
        sub={`${listaFiltrada.length} de ${estoque.length} mercadorias · ${unidadesEstoque} unidades`}
        action={
          isAdmin && (
            <button onClick={() => { setEditingItem(null); setModal("item"); }} className="flex items-center gap-1.5 text-sm font-medium bg-emerald-800 hover:bg-emerald-900 text-white rounded-md px-3 py-1.5">
              <Plus size={14} /> Novo item
            </button>
          )
        }
      >
        <div className="flex flex-wrap items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50/50">
          <div className="relative flex-1 min-w-[160px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Buscar por nome..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>
          <select value={filtroMarca} onChange={(e) => setFiltroMarca(e.target.value)} className="text-sm border border-gray-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-gray-700">
            <option value="">Todas as marcas</option>
            {marcas.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} className="text-sm border border-gray-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-gray-700">
            <option value="">Todos os tipos</option>
            {tipos.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          {(busca || filtroMarca || filtroTipo) && (
            <button onClick={() => { setBusca(""); setFiltroMarca(""); setFiltroTipo(""); }} className="text-xs text-gray-400 hover:text-gray-600 underline">
              Limpar filtros
            </button>
          )}
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] tracking-wide text-gray-400 border-b border-gray-100">
              <th className="px-5 py-2 font-medium">FOTO</th>
              <th className="px-5 py-2 font-medium">MERCADORIA</th>
              <th className="px-5 py-2 font-medium">MARCA</th>
              <th className="px-5 py-2 font-medium">TIPO</th>
              <th className="px-5 py-2 font-medium">QTD</th>
              <th className="px-5 py-2 font-medium">CUSTO {isAdmin ? "(REAL)" : ""}</th>
              <th className="px-5 py-2 font-medium">VAREJO</th>
              <th className="px-5 py-2 font-medium">ATACADO</th>
              {isAdmin && <th className="px-5 py-2 font-medium">VALOR TOTAL</th>}
              {isAdmin && <th className="px-5 py-2 font-medium">AÇÕES</th>}
            </tr>
          </thead>
          <tbody>
            {listaFiltrada.map((i) => (
              <tr key={i.id} className="border-b border-gray-50">
                <td className="px-5 py-3">
                  {i.foto ? (
                    <button onClick={() => setLightbox({ src: i.foto, nome: i.nome })} className="block w-10 h-10 rounded-md overflow-hidden border border-gray-200">
                      <img src={i.foto} alt={i.nome} className="w-full h-full object-cover" />
                    </button>
                  ) : (
                    <div className="w-10 h-10 rounded-md border border-gray-100 bg-gray-50 flex items-center justify-center">
                      <ImageIcon size={14} className="text-gray-300" />
                    </div>
                  )}
                </td>
                <td className="px-5 py-3 font-medium text-gray-900">{i.nome}</td>
                <td className="px-5 py-3 text-gray-600">{i.marca || "—"}</td>
                <td className="px-5 py-3 text-gray-600">{i.tipo || "—"}</td>
                <td className={`px-5 py-3 ${i.qtd < i.min ? "text-amber-600 font-medium" : "text-gray-600"}`}>{i.qtd}</td>
                <td className="px-5 py-3 text-gray-600">{fmtUSD(isAdmin ? i.custo : i.custoVendedor)}</td>
                <td className="px-5 py-3 text-gray-600">{fmtUSD(i.varejo)}</td>
                <td className="px-5 py-3 text-gray-600">{fmtUSD(i.atacado)}</td>
                {isAdmin && <td className="px-5 py-3 text-gray-900 font-medium">{fmtUSD(i.qtd * i.custo)}</td>}
                {isAdmin && (
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <button onClick={() => { setEditingItem(i); setModal("item"); }} className="text-gray-400 hover:text-emerald-700">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => setEstoque((e) => e.filter((x) => x.id !== i.id))} className="text-gray-400 hover:text-red-600">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {listaFiltrada.length === 0 && (
              <tr><td colSpan={isAdmin ? 10 : 8} className="py-8 text-center text-gray-400 text-sm">
                {estoque.length === 0 ? "Nenhum item cadastrado." : "Nenhum item encontrado com esses filtros."}
              </td></tr>
            )}
          </tbody>
        </table>
      </TableShell>
    );
  }

  function VendasPage() {
    return (
      <TableShell
        title="Vendas"
        sub={`${vendas.length} registros`}
        action={
          <button onClick={() => setModal("venda")} className="flex items-center gap-1.5 text-sm font-medium bg-emerald-800 hover:bg-emerald-900 text-white rounded-md px-3 py-1.5">
            <Plus size={14} /> Nova venda
          </button>
        }
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] tracking-wide text-gray-400 border-b border-gray-100">
              <th className="px-5 py-2 font-medium">VENDA</th>
              <th className="px-5 py-2 font-medium">CLIENTE</th>
              <th className="px-5 py-2 font-medium">ITENS</th>
              <th className="px-5 py-2 font-medium">VALOR</th>
              <th className="px-5 py-2 font-medium">PAGAMENTO</th>
              <th className="px-5 py-2 font-medium">CONDIÇÃO</th>
              <th className="px-5 py-2 font-medium">STATUS</th>
              <th className="px-5 py-2 font-medium">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {vendas.map((v) => (
              <tr key={v.id} className="border-b border-gray-50">
                <td className="px-5 py-3 font-medium text-gray-900 align-top">#{v.id}</td>
                <td className="px-5 py-3 text-gray-600 align-top">{v.clienteNome}</td>
                <td className="px-5 py-3 text-gray-600">
                  {(v.itens || []).map((l, idx) => (
                    <div key={idx} className={idx > 0 ? "mt-1" : ""}>
                      {l.itemNome} × {l.qtd} <span className="text-xs text-gray-400">({l.tipoVenda})</span>
                    </div>
                  ))}
                </td>
                <td className="px-5 py-3 font-medium text-gray-900 align-top">{fmtUSD(v.valor)}</td>
                <td className="px-5 py-3 text-gray-600 align-top">{v.pagamento}</td>
                <td className="px-5 py-3 text-gray-600 align-top">
                  {v.condicao}
                  {v.vencimento && <div className="text-xs text-gray-400">vence {fmtDate(v.vencimento)}</div>}
                </td>
                <td className="px-5 py-3 align-top"><Badge status={v.status} /></td>
                <td className="px-5 py-3 align-top">
                  <button onClick={() => imprimirVenda(v)} className="text-gray-400 hover:text-emerald-700" title="Imprimir nota">
                    <Printer size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {vendas.length === 0 && (
              <tr><td colSpan={8} className="py-8 text-center text-gray-400 text-sm">Nenhuma venda registrada.</td></tr>
            )}
          </tbody>
        </table>
      </TableShell>
    );
  }

  function ComissoesPage() {
    const COMISSAO_PCT = 0.20;

    const porVendedor = {};
    vendas.forEach((v) => {
      const nomeVendedor = v.vendedor || "Sem vendedor / Admin";
      if (!porVendedor[nomeVendedor]) {
        porVendedor[nomeVendedor] = { nome: nomeVendedor, numVendas: 0, unidades: 0, valorTotal: 0, lucro: 0, produtos: {} };
      }
      porVendedor[nomeVendedor].numVendas += 1;
      (v.itens || []).forEach((l) => {
        const itemEstoque = estoque.find((i) => i.id === l.itemId);
        const custoRef = itemEstoque ? (itemEstoque.custoVendedor ?? itemEstoque.custo) : l.precoUnit;
        const lucroItem = (l.precoUnit - custoRef) * l.qtd;
        porVendedor[nomeVendedor].unidades += l.qtd;
        porVendedor[nomeVendedor].valorTotal += l.precoUnit * l.qtd;
        porVendedor[nomeVendedor].lucro += lucroItem;
        porVendedor[nomeVendedor].produtos[l.itemNome] = (porVendedor[nomeVendedor].produtos[l.itemNome] || 0) + l.qtd;
      });
    });
    const listaVendedores = Object.values(porVendedor)
      .map((v) => ({
        ...v,
        comissao: v.lucro * COMISSAO_PCT,
        top3: Object.entries(v.produtos).sort((a, b) => b[1] - a[1]).slice(0, 3),
      }))
      .sort((a, b) => b.valorTotal - a.valorTotal);

    function topProduto(filterFn) {
      const contagem = {};
      vendas.filter(filterFn).forEach((v) => {
        (v.itens || []).forEach((l) => {
          contagem[l.itemNome] = (contagem[l.itemNome] || 0) + l.qtd;
        });
      });
      const entradas = Object.entries(contagem).sort((a, b) => b[1] - a[1]);
      return entradas[0] || null;
    }

    const hoje = todayISO();
    const seteDiasAtras = (() => {
      const d = new Date();
      d.setDate(d.getDate() - 6);
      return d.toISOString().slice(0, 10);
    })();
    const inicioMes = hoje.slice(0, 7) + "-01";

    const topDia = topProduto((v) => v.data === hoje);
    const topSemana = topProduto((v) => v.data >= seteDiasAtras);
    const topMes = topProduto((v) => v.data >= inicioMes);
    const comissaoTotalGeral = listaVendedores.reduce((s, v) => s + v.comissao, 0);

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard label="MAIS VENDIDO HOJE" value={topDia ? topDia[0] : "—"} sub={topDia ? `${topDia[1]} unidades` : "Sem vendas hoje"} />
          <StatCard label="MAIS VENDIDO NA SEMANA" value={topSemana ? topSemana[0] : "—"} sub={topSemana ? `${topSemana[1]} unidades` : "Sem vendas"} />
          <StatCard label="MAIS VENDIDO NO MÊS" value={topMes ? topMes[0] : "—"} sub={topMes ? `${topMes[1]} unidades` : "Sem vendas"} />
        </div>

        <TableShell
          title="Desempenho e comissão por vendedor"
          sub={`Comissão de 20% sobre o lucro, calculado com o custo do vendedor (não o custo real) · Total a pagar: ${fmtUSD(comissaoTotalGeral)}`}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] tracking-wide text-gray-400 border-b border-gray-100">
                <th className="px-5 py-2 font-medium">VENDEDOR</th>
                <th className="px-5 py-2 font-medium">VENDAS</th>
                <th className="px-5 py-2 font-medium">UNIDADES</th>
                <th className="px-5 py-2 font-medium">VALOR VENDIDO</th>
                <th className="px-5 py-2 font-medium">LUCRO</th>
                <th className="px-5 py-2 font-medium">COMISSÃO (20%)</th>
              </tr>
            </thead>
            <tbody>
              {listaVendedores.map((v) => (
                <tr key={v.nome} className="border-b border-gray-50 align-top">
                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-900">{v.nome}</div>
                    {v.top3.length > 0 && (
                      <div className="text-xs text-gray-400 mt-0.5">
                        {v.top3.map(([nome, qtd]) => `${nome} (${qtd})`).join(" · ")}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3 text-gray-600">{v.numVendas}</td>
                  <td className="px-5 py-3 text-gray-600">{v.unidades}</td>
                  <td className="px-5 py-3 text-gray-600">{fmtUSD(v.valorTotal)}</td>
                  <td className="px-5 py-3 text-gray-600">{fmtUSD(v.lucro)}</td>
                  <td className="px-5 py-3 font-medium text-emerald-700">{fmtUSD(v.comissao)}</td>
                </tr>
              ))}
              {listaVendedores.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-gray-400 text-sm">Nenhuma venda registrada ainda.</td></tr>
              )}
            </tbody>
          </table>
        </TableShell>
      </>
    );
  }

  function ComprasPage() {
    return (
      <TableShell
        title="Compras"
        sub={`${compras.length} registros`}
        action={
          <button onClick={() => setModal("compra")} className="flex items-center gap-1.5 text-sm font-medium bg-emerald-800 hover:bg-emerald-900 text-white rounded-md px-3 py-1.5">
            <Plus size={14} /> Nova compra
          </button>
        }
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] tracking-wide text-gray-400 border-b border-gray-100">
              <th className="px-5 py-2 font-medium">FORNECEDOR</th>
              <th className="px-5 py-2 font-medium">ITENS</th>
              <th className="px-5 py-2 font-medium">TOTAL</th>
              <th className="px-5 py-2 font-medium">DATA</th>
            </tr>
          </thead>
          <tbody>
            {compras.map((c) => (
              <tr key={c.id} className="border-b border-gray-50">
                <td className="px-5 py-3 font-medium text-gray-900 align-top">{c.fornecedorNome}</td>
                <td className="px-5 py-3 text-gray-600">
                  {(c.itens || []).map((l, idx) => (
                    <div key={idx} className={idx > 0 ? "mt-1" : ""}>{l.nome} × {l.qtd}</div>
                  ))}
                </td>
                <td className="px-5 py-3 font-medium text-gray-900 align-top">{fmtUSD(c.total)}</td>
                <td className="px-5 py-3 text-gray-600 align-top">{fmtDate(c.data)}</td>
              </tr>
            ))}
            {compras.length === 0 && (
              <tr><td colSpan={4} className="py-8 text-center text-gray-400 text-sm">Nenhuma compra registrada.</td></tr>
            )}
          </tbody>
        </table>
      </TableShell>
    );
  }

  function CaixaPage() {
    return (
      <>
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold text-gray-900">Caixas e saldos</div>
          <button onClick={() => setModal("movimento")} className="flex items-center gap-1.5 text-sm font-medium bg-emerald-800 hover:bg-emerald-900 text-white rounded-md px-3 py-1.5">
            <Plus size={14} /> Movimento
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Object.keys(caixaMeta).map((k) => (
            <div key={k} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-md flex items-center justify-center text-sm font-semibold ${caixaMeta[k].color}`}>
                  {caixaMeta[k].symbol}
                </div>
                <div className="text-sm font-medium text-gray-900">{caixaMeta[k].label}</div>
              </div>
              <div className="text-lg font-semibold text-gray-900">{caixaMeta[k].format(caixas[k])}</div>
            </div>
          ))}
        </div>
        <TableShell title="Movimentações" sub={`${movimentos.length} lançamentos`}>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] tracking-wide text-gray-400 border-b border-gray-100">
                <th className="px-5 py-2 font-medium">CAIXA</th>
                <th className="px-5 py-2 font-medium">TIPO</th>
                <th className="px-5 py-2 font-medium">VALOR</th>
                <th className="px-5 py-2 font-medium">DESCRIÇÃO</th>
                <th className="px-5 py-2 font-medium">DATA</th>
              </tr>
            </thead>
            <tbody>
              {movimentos.map((m) => (
                <tr key={m.id} className="border-b border-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-900">{caixaMeta[m.caixa].label}</td>
                  <td className="px-5 py-3">
                    <span className={m.tipo === "Entrada" ? "text-emerald-700" : "text-red-600"}>{m.tipo}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-900">{caixaMeta[m.caixa].format(m.valor)}</td>
                  <td className="px-5 py-3 text-gray-600">{m.descricao}</td>
                  <td className="px-5 py-3 text-gray-600">{fmtDate(m.data)}</td>
                </tr>
              ))}
              {movimentos.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-gray-400 text-sm">Nenhuma movimentação registrada.</td></tr>
              )}
            </tbody>
          </table>
        </TableShell>
      </>
    );
  }

  function PessoasPage({ title, data, setData, placeholder }) {
    const showContato = isAdmin;
    return (
      <TableShell
        title={title}
        sub={`${data.length} cadastros`}
        action={
          <button onClick={() => setModal(title === "Clientes" ? "cliente" : "fornecedor")} className="flex items-center gap-1.5 text-sm font-medium bg-emerald-800 hover:bg-emerald-900 text-white rounded-md px-3 py-1.5">
            <Plus size={14} /> Novo
          </button>
        }
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] tracking-wide text-gray-400 border-b border-gray-100">
              <th className="px-5 py-2 font-medium">NOME</th>
              {showContato && <th className="px-5 py-2 font-medium">CONTATO</th>}
              <th className="px-5 py-2 font-medium">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr key={p.id} className="border-b border-gray-50">
                <td className="px-5 py-3 font-medium text-gray-900">{p.nome}</td>
                {showContato && <td className="px-5 py-3 text-gray-600">{p.contato || "—"}</td>}
                <td className="px-5 py-3">
                  {isAdmin ? (
                    <button onClick={() => setData((d) => d.filter((x) => x.id !== p.id))} className="text-gray-400 hover:text-red-600">
                      <Trash2 size={15} />
                    </button>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr><td colSpan={showContato ? 3 : 2} className="py-8 text-center text-gray-400 text-sm">{placeholder}</td></tr>
            )}
          </tbody>
        </table>
      </TableShell>
    );
  }

  function ContasPage() {
    const hoje = todayISO();
    const ordenadas = [...contas].sort((a, b) => a.vencimento.localeCompare(b.vencimento));
    return (
      <TableShell
        title="Contas a pagar"
        sub={`${contasPendentes.length} pendentes · ${fmtUSD(totalContasPendentes)}`}
        action={
          <button onClick={() => { setEditingConta(null); setModal("conta"); }} className="flex items-center gap-1.5 text-sm font-medium bg-emerald-800 hover:bg-emerald-900 text-white rounded-md px-3 py-1.5">
            <Plus size={14} /> Nova conta
          </button>
        }
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] tracking-wide text-gray-400 border-b border-gray-100">
              <th className="px-5 py-2 font-medium">CONTA</th>
              <th className="px-5 py-2 font-medium">CATEGORIA</th>
              <th className="px-5 py-2 font-medium">VALOR</th>
              <th className="px-5 py-2 font-medium">VENCIMENTO</th>
              <th className="px-5 py-2 font-medium">STATUS</th>
              <th className="px-5 py-2 font-medium">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {ordenadas.map((c) => {
              const atrasada = c.status === "Pendente" && c.vencimento < hoje;
              return (
                <tr key={c.id} className="border-b border-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-900">{c.nome}</td>
                  <td className="px-5 py-3 text-gray-600">{c.categoria}</td>
                  <td className="px-5 py-3 text-gray-900 font-medium">{fmtUSD(c.valor)}</td>
                  <td className={`px-5 py-3 ${atrasada ? "text-red-600 font-medium" : "text-gray-600"}`}>
                    {fmtDate(c.vencimento)}{atrasada && " · atrasada"}
                  </td>
                  <td className="px-5 py-3"><Badge status={c.status} /></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {c.status === "Pendente" && (
                        <button onClick={() => { setPayingConta(c); setModal("pagarConta"); }} className="text-gray-400 hover:text-emerald-700" title="Marcar como pago">
                          <Check size={15} />
                        </button>
                      )}
                      {c.status === "Pago" && (
                        <button onClick={() => duplicarConta(c.id)} className="text-gray-400 hover:text-emerald-700" title="Duplicar para o próximo mês">
                          <Copy size={15} />
                        </button>
                      )}
                      <button onClick={() => { setEditingConta(c); setModal("conta"); }} className="text-gray-400 hover:text-emerald-700">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => setContas((cs) => cs.filter((x) => x.id !== c.id))} className="text-gray-400 hover:text-red-600">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {contas.length === 0 && (
              <tr><td colSpan={6} className="py-8 text-center text-gray-400 text-sm">Nenhuma conta cadastrada.</td></tr>
            )}
          </tbody>
        </table>
      </TableShell>
    );
  }

  function gerarTextoOrcamento(orc) {
    const linhas = orc.itens.map((l) => `• ${l.nome} x${l.qtd} — ${fmtUSD(l.precoUnit * l.qtd)}`).join("\n");
    return [
      "*INDUFARMA — DISTRIBUIDORA*",
      "_Orçamento comercial_",
      "",
      `Data: ${fmtDate(orc.data)}`,
      orc.clienteNome ? `Cliente: ${orc.clienteNome}` : null,
      orc.vendedor ? `Atendido por: ${orc.vendedor}` : null,
      "",
      "*Itens:*",
      linhas,
      "",
      `*Total: ${fmtUSD(orc.total)}*`,
      "",
      `⚠️ Orçamento válido somente para o dia ${fmtDate(orc.data)}.`,
      "Qualquer dúvida, estamos à disposição!",
    ].filter((l) => l !== null).join("\n");
  }
  function copiarOrcamento(orc) {
    const texto = gerarTextoOrcamento(orc);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto);
    }
  }
  function abrirWhatsapp(orc) {
    const texto = gerarTextoOrcamento(orc);
    const cliente = clientes.find((c) => c.id === orc.clienteId);
    const fone = cliente?.contato ? cliente.contato.replace(/[^\d]/g, "") : "";
    const url = fone ? `https://wa.me/${fone}?text=${encodeURIComponent(texto)}` : `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
  }

  function imprimirOrcamento(orc) {
    const linhas = (orc.itens || [])
      .map(
        (l) => `
        <tr>
          <td style="padding:6px 0;">${l.nome}</td>
          <td style="padding:6px 0;text-align:center;">${l.qtd}</td>
          <td style="padding:6px 0;text-align:right;">${fmtUSD(l.precoUnit)}</td>
          <td style="padding:6px 0;text-align:right;">${fmtUSD(l.precoUnit * l.qtd)}</td>
        </tr>`
      )
      .join("");
    const html = `
      <html>
      <head>
        <title>Orçamento — ${orc.clienteNome || "Cliente"}</title>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, Arial, sans-serif; color: #111827; padding: 28px; max-width: 480px; margin: 0 auto; }
          .brand { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
          .brand img { height: 34px; object-fit: contain; }
          .brand-name { font-size: 17px; font-weight: 700; color: #065f46; }
          .subtitle { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 18px; }
          .info { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px 14px; margin-bottom: 16px; }
          .info .row { display: flex; justify-content: space-between; font-size: 13px; padding: 2px 0; }
          .info .row span:first-child { color: #6b7280; }
          .info .row strong { color: #111827; }
          table { width: 100%; border-collapse: collapse; margin-top: 4px; font-size: 13px; }
          thead th { text-align: left; border-bottom: 1.5px solid #111827; padding-bottom: 6px; font-size: 10.5px; text-transform: uppercase; color: #6b7280; letter-spacing: 0.03em; }
          tbody tr { border-bottom: 1px solid #e5e7eb; }
          .total { display: flex; justify-content: space-between; font-weight: bold; font-size: 16px; margin-top: 16px; border-top: 1.5px solid #111827; padding-top: 10px; color: #065f46; }
          .validade { margin-top: 14px; background: #fef3c7; border: 1px solid #fde68a; color: #92400e; font-size: 12px; padding: 8px 12px; border-radius: 6px; text-align: center; font-weight: 600; }
          .footer { margin-top: 24px; text-align: center; font-size: 11px; color: #9ca3af; }
        </style>
      </head>
      <body>
        <div class="brand">
          <img src="${LOGO_ICON}" alt="Indufarma" />
          <div class="brand-name">Distribuidora Indufarma</div>
        </div>
        <div class="subtitle">Orçamento comercial</div>
        <div class="info">
          <div class="row"><span>Cliente</span><strong>${orc.clienteNome || "—"}</strong></div>
          <div class="row"><span>Atendido por</span><strong>${orc.vendedor || "—"}</strong></div>
          <div class="row"><span>Data</span><strong>${fmtDate(orc.data)}</strong></div>
        </div>
        <table>
          <thead><tr><th>Item</th><th style="text-align:center;">Qtd</th><th style="text-align:right;">Unit.</th><th style="text-align:right;">Subtotal</th></tr></thead>
          <tbody>${linhas}</tbody>
        </table>
        <div class="total"><span>Total</span><span>${fmtUSD(orc.total)}</span></div>
        <div class="validade">⚠️ Orçamento válido somente para o dia ${fmtDate(orc.data)}</div>
        <div class="footer">Distribuidora Indufarma · Obrigado pela preferência!</div>
      </body>
      </html>`;
    const win = window.open("", "_blank", "width=480,height=680");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 300);
  }

  function OrcamentosPage() {
    return (
      <TableShell
        title="Orçamentos"
        sub={`${orcamentos.length} orçamentos`}
        action={
          <button onClick={() => setModal("orcamento")} className="flex items-center gap-1.5 text-sm font-medium bg-emerald-800 hover:bg-emerald-900 text-white rounded-md px-3 py-1.5">
            <Plus size={14} /> Novo orçamento
          </button>
        }
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] tracking-wide text-gray-400 border-b border-gray-100">
              <th className="px-5 py-2 font-medium">CLIENTE</th>
              <th className="px-5 py-2 font-medium">VENDEDOR</th>
              <th className="px-5 py-2 font-medium">ITENS</th>
              <th className="px-5 py-2 font-medium">TOTAL</th>
              <th className="px-5 py-2 font-medium">DATA</th>
              <th className="px-5 py-2 font-medium">VALIDADE</th>
              <th className="px-5 py-2 font-medium">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {orcamentos.map((o) => (
              <tr key={o.id} className="border-b border-gray-50">
                <td className="px-5 py-3 font-medium text-gray-900 align-top">{o.clienteNome || "Sem nome"}</td>
                <td className="px-5 py-3 text-gray-600 align-top">{o.vendedor || "—"}</td>
                <td className="px-5 py-3 text-gray-600">
                  {o.itens.map((l, idx) => (
                    <div key={idx} className={idx > 0 ? "mt-1" : ""}>{l.nome} × {l.qtd}</div>
                  ))}
                </td>
                <td className="px-5 py-3 font-medium text-gray-900 align-top">{fmtUSD(o.total)}</td>
                <td className="px-5 py-3 text-gray-600 align-top">{fmtDate(o.data)}</td>
                <td className="px-5 py-3 align-top">
                  {o.data === todayISO() ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">Válido hoje</span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">Expirado</span>
                  )}
                </td>
                <td className="px-5 py-3 align-top">
                  <div className="flex items-center gap-3">
                    <button onClick={() => imprimirOrcamento(o)} className="text-gray-400 hover:text-emerald-700" title="Imprimir / PDF">
                      <Printer size={15} />
                    </button>
                    <button onClick={() => copiarOrcamento(o)} className="text-gray-400 hover:text-emerald-700" title="Copiar texto">
                      <Copy size={15} />
                    </button>
                    <button onClick={() => abrirWhatsapp(o)} className="text-gray-400 hover:text-emerald-700" title="Enviar no WhatsApp">
                      <MessageCircle size={15} />
                    </button>
                    <button onClick={() => setOrcamentos((os) => os.filter((x) => x.id !== o.id))} className="text-gray-400 hover:text-red-600" title="Excluir">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {orcamentos.length === 0 && (
              <tr><td colSpan={7} className="py-8 text-center text-gray-400 text-sm">Nenhum orçamento criado ainda.</td></tr>
            )}
          </tbody>
        </table>
      </TableShell>
    );
  }

  function CambioForm({ onSave, initial }) {
    const [tcr, setTcr] = useState(initial.tcr);
    const [cc, setCc] = useState(initial.chacoCompra);
    const [cv, setCv] = useState(initial.chacoVenda);
    return (
      <div>
        <Field label="TCR · BRL/USDT">
          <input type="number" step="0.01" className={inputCls} value={tcr} onChange={(e) => setTcr(Number(e.target.value))} />
        </Field>
        <Field label="Chaco · Compra USD">
          <input type="number" step="0.01" className={inputCls} value={cc} onChange={(e) => setCc(Number(e.target.value))} />
        </Field>
        <Field label="Chaco · Venda USD">
          <input type="number" step="0.01" className={inputCls} value={cv} onChange={(e) => setCv(Number(e.target.value))} />
        </Field>
        <button
          onClick={() => onSave({ tcr, chacoCompra: cc, chacoVenda: cv, modo: "Manual" })}
          className="w-full bg-emerald-800 hover:bg-emerald-900 text-white rounded-md py-2 text-sm font-medium"
        >
          Salvar taxas
        </button>
      </div>
    );
  }

  function CambioPage() {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-lg">
        <div className="text-sm font-semibold text-gray-900 mb-1">Taxas de câmbio</div>
        <div className="text-xs text-gray-400 mb-5">Defina manualmente as cotações usadas no sistema.</div>
        <CambioForm onSave={(vals) => setCambio(vals)} initial={cambio} />
      </div>
    );
  }

  // ---------- MODALS ----------

  function VendaModal() {
    const [clienteId, setClienteId] = useState(clientes[0]?.id || "");
    const [filtroMarca, setFiltroMarca] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");
    const marcas = useMemo(() => Array.from(new Set(estoque.map((i) => i.marca).filter(Boolean))).sort(), [estoque]);
    const tipos = useMemo(() => Array.from(new Set(estoque.map((i) => i.tipo).filter(Boolean))).sort(), [estoque]);
    const itensFiltrados = estoque.filter(
      (i) => (filtroMarca === "" || i.marca === filtroMarca) && (filtroTipo === "" || i.tipo === filtroTipo)
    );
    const [itemId, setItemId] = useState(estoque[0]?.id || "");
    const [qtd, setQtd] = useState(1);
    const [tipoVenda, setTipoVenda] = useState("Varejo");
    const [pagamento, setPagamento] = useState("PIX");
    const [condicao, setCondicao] = useState("À vista");
    const [vencimento, setVencimento] = useState(todayISO());
    const [carrinho, setCarrinho] = useState([]);

    const item = estoque.find((i) => i.id === itemId) || itensFiltrados[0];
    const jaNoCarrinho = carrinho.filter((l) => l.itemId === itemId).reduce((s, l) => s + l.qtd, 0);
    const disponivel = item ? item.qtd - jaNoCarrinho : 0;
    const precoPadrao = item ? (tipoVenda === "Atacado" ? item.atacado : item.varejo) : 0;
    const [precoUnit, setPrecoUnit] = useState(precoPadrao);
    useEffect(() => { setPrecoUnit(precoPadrao); }, [itemId, tipoVenda]);
    const total = carrinho.reduce((s, l) => s + l.precoUnit * l.qtd, 0);

    const custoRef = item ? (isAdmin ? item.custo : (item.custoVendedor ?? item.custo)) : 0;
    const abaixoDoCusto = !isAdmin && item && precoUnit < custoRef;

    function addAoCarrinho() {
      if (!item || qtd < 1 || qtd > disponivel || precoUnit < 0) return;
      if (abaixoDoCusto) return;
      setCarrinho((c) => [...c, { key: uid(), itemId: item.id, nome: item.nome, qtd, tipoVenda, precoUnit }]);
      setQtd(1);
    }
    function removerDoCarrinho(key) {
      setCarrinho((c) => c.filter((l) => l.key !== key));
    }
    function finalizar() {
      if (carrinho.length === 0) return;
      registrarVenda({
        clienteId,
        itens: carrinho.map((l) => ({ itemId: l.itemId, qtd: l.qtd, tipoVenda: l.tipoVenda, precoUnit: l.precoUnit })),
        pagamento,
        condicao,
        vencimento,
      });
    }

    return (
      <Modal title="Nova venda" onClose={() => setModal(null)} wide>
        <Field label="Cliente">
          <select className={inputCls} value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
            <option value="">Sem nome</option>
            {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        </Field>

        <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
          <div className="text-xs font-medium text-gray-500 mb-3">Adicionar produto à nota</div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Field label="Filtrar por marca">
              <select className={inputCls} value={filtroMarca} onChange={(e) => setFiltroMarca(e.target.value)}>
                <option value="">Todas as marcas</option>
                {marcas.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </Field>
            <Field label="Filtrar por tipo">
              <select className={inputCls} value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
                <option value="">Todos os tipos</option>
                {tipos.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Mercadoria">
            <select className={inputCls} value={item?.id || ""} onChange={(e) => setItemId(e.target.value)}>
              {itensFiltrados.length === 0 && <option value="">Nenhum produto com esse filtro</option>}
              {itensFiltrados.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.nome}{i.marca ? ` · ${i.marca}` : ""}{i.tipo ? ` · ${i.tipo}` : ""} ({i.qtd} disp.)
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tipo de venda">
            <div className="flex gap-2">
              {["Varejo", "Atacado"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTipoVenda(t)}
                  className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium ${
                    tipoVenda === t ? "bg-emerald-800 border-emerald-800 text-white" : "border-gray-200 text-gray-600 hover:bg-gray-50 bg-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-3 mb-1">
            <Field label={`Quantidade (${disponivel} disp.)`}>
              <input type="number" min="1" max={disponivel} className={inputCls} value={qtd} onChange={(e) => setQtd(Number(e.target.value))} />
            </Field>
            <Field label="Valor unitário (US$)">
              <input
                type="number"
                step="0.01"
                min="0"
                className={`${inputCls} ${abaixoDoCusto ? "border-red-400 focus:ring-red-500" : ""}`}
                value={precoUnit}
                onChange={(e) => setPrecoUnit(Number(e.target.value))}
              />
            </Field>
          </div>
          {abaixoDoCusto && (
            <div className="text-xs text-red-600 -mt-1 mb-2">Esse valor está abaixo do custo ({fmtUSD(custoRef)}). Vendedores não podem vender abaixo do custo.</div>
          )}
          {item && !abaixoDoCusto && precoUnit !== precoPadrao && (
            <div className="text-xs text-amber-600 -mt-1 mb-2">Preço ajustado manualmente (padrão {tipoVenda.toLowerCase()}: {fmtUSD(precoPadrao)})</div>
          )}
          <button
            type="button"
            onClick={addAoCarrinho}
            disabled={!item || qtd < 1 || qtd > disponivel || abaixoDoCusto}
            className="w-full flex items-center justify-center gap-1.5 border border-emerald-800 text-emerald-800 hover:bg-emerald-50 disabled:opacity-40 rounded-md py-2 text-sm font-medium"
          >
            <Plus size={14} /> Adicionar à nota
          </button>
        </div>

        <div className="mb-4">
          <div className="text-xs font-medium text-gray-500 mb-2">Itens da nota ({carrinho.length})</div>
          {carrinho.length === 0 ? (
            <div className="text-sm text-gray-400 text-center py-4 border border-dashed border-gray-200 rounded-lg">Nenhum produto adicionado ainda.</div>
          ) : (
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
              {carrinho.map((l) => (
                <div key={l.key} className="flex items-center justify-between px-3 py-2 text-sm">
                  <div>
                    <div className="font-medium text-gray-900">{l.nome} × {l.qtd}</div>
                    <div className="text-xs text-gray-400">{l.tipoVenda} · {fmtUSD(l.precoUnit)} un.</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900">{fmtUSD(l.precoUnit * l.qtd)}</span>
                    <button onClick={() => removerDoCarrinho(l.key)} className="text-gray-400 hover:text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Pagamento">
            <select className={inputCls} value={pagamento} onChange={(e) => setPagamento(e.target.value)}>
              <option>PIX</option>
              <option>Real</option>
              <option>Dólar</option>
              <option>USDT</option>
            </select>
          </Field>
          <Field label="Condição">
            <select className={inputCls} value={condicao} onChange={(e) => setCondicao(e.target.value)}>
              <option>À vista</option>
              <option>A prazo</option>
            </select>
          </Field>
        </div>
        {condicao === "A prazo" && (
          <Field label="Data para cobrar o cliente">
            <input type="date" className={inputCls} value={vencimento} onChange={(e) => setVencimento(e.target.value)} />
          </Field>
        )}
        <div className="text-sm text-gray-500 mb-4">
          Total da nota: <span className="font-semibold text-gray-900">{fmtUSD(total)}</span>
        </div>
        <button
          onClick={finalizar}
          disabled={carrinho.length === 0}
          className="w-full bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white rounded-md py-2 text-sm font-medium"
        >
          Finalizar venda
        </button>
      </Modal>
    );
  }

  function OrcamentoModal() {
    const [clienteId, setClienteId] = useState("");
    const [clienteNomeLivre, setClienteNomeLivre] = useState("");
    const [filtroMarca, setFiltroMarca] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");
    const marcas = useMemo(() => Array.from(new Set(estoque.map((i) => i.marca).filter(Boolean))).sort(), [estoque]);
    const tipos = useMemo(() => Array.from(new Set(estoque.map((i) => i.tipo).filter(Boolean))).sort(), [estoque]);
    const itensFiltrados = estoque.filter(
      (i) => (filtroMarca === "" || i.marca === filtroMarca) && (filtroTipo === "" || i.tipo === filtroTipo)
    );
    const [itemId, setItemId] = useState(estoque[0]?.id || "");
    const [qtd, setQtd] = useState(1);
    const [tipoVenda, setTipoVenda] = useState("Varejo");
    const [carrinho, setCarrinho] = useState([]);

    const item = estoque.find((i) => i.id === itemId) || itensFiltrados[0];
    const precoPadrao = item ? (tipoVenda === "Atacado" ? item.atacado : item.varejo) : 0;
    const [precoUnit, setPrecoUnit] = useState(precoPadrao);
    useEffect(() => { setPrecoUnit(precoPadrao); }, [itemId, tipoVenda]);
    const total = carrinho.reduce((s, l) => s + l.precoUnit * l.qtd, 0);
    const custoRef = item ? (isAdmin ? item.custo : (item.custoVendedor ?? item.custo)) : 0;
    const abaixoDoCusto = item && precoUnit < custoRef;

    function addAoCarrinho() {
      if (!item || qtd < 1) return;
      if (abaixoDoCusto) return;
      setCarrinho((c) => [...c, { key: uid(), nome: item.nome, qtd, tipoVenda, precoUnit }]);
      setQtd(1);
    }
    function removerDoCarrinho(key) {
      setCarrinho((c) => c.filter((l) => l.key !== key));
    }
    function finalizar() {
      if (carrinho.length === 0) return;
      for (const l of carrinho) {
        const ref = estoque.find((i) => i.nome === l.nome);
        if (ref) {
          const custoCheck = isAdmin ? ref.custo : (ref.custoVendedor ?? ref.custo);
          if (l.precoUnit < custoCheck) return;
        }
      }
      const cliente = clientes.find((c) => c.id === clienteId);
      const clienteNome = cliente ? cliente.nome : clienteNomeLivre.trim();
      setOrcamentos((os) => [
        { id: uid(), clienteId: clienteId || null, clienteNome, vendedor: authUser?.nome || null, itens: carrinho.map(({ key, ...rest }) => rest), total, data: todayISO() },
        ...os,
      ]);
      setModal(null);
    }

    return (
      <Modal title="Novo orçamento" onClose={() => setModal(null)} wide>
        <Field label="Cliente cadastrado (opcional)">
          <select className={inputCls} value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
            <option value="">— Selecionar —</option>
            {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        </Field>
        {!clienteId && (
          <Field label="Ou nome livre (se não for cliente cadastrado)">
            <input className={inputCls} value={clienteNomeLivre} onChange={(e) => setClienteNomeLivre(e.target.value)} placeholder="Nome do cliente" />
          </Field>
        )}

        <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
          <div className="text-xs font-medium text-gray-500 mb-3">Adicionar produto ao orçamento</div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Field label="Filtrar por marca">
              <select className={inputCls} value={filtroMarca} onChange={(e) => setFiltroMarca(e.target.value)}>
                <option value="">Todas as marcas</option>
                {marcas.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </Field>
            <Field label="Filtrar por tipo">
              <select className={inputCls} value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
                <option value="">Todos os tipos</option>
                {tipos.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Mercadoria">
            <select className={inputCls} value={item?.id || ""} onChange={(e) => setItemId(e.target.value)}>
              {itensFiltrados.length === 0 && <option value="">Nenhum produto com esse filtro</option>}
              {itensFiltrados.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.nome}{i.marca ? ` · ${i.marca}` : ""}{i.tipo ? ` · ${i.tipo}` : ""}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tipo de venda">
            <div className="flex gap-2">
              {["Varejo", "Atacado"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTipoVenda(t)}
                  className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium ${
                    tipoVenda === t ? "bg-emerald-800 border-emerald-800 text-white" : "border-gray-200 text-gray-600 hover:bg-gray-50 bg-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-3 mb-1">
            <Field label="Quantidade">
              <input type="number" min="1" className={inputCls} value={qtd} onChange={(e) => setQtd(Number(e.target.value))} />
            </Field>
            <Field label="Valor unitário (US$)">
              <input
                type="number"
                step="0.01"
                min="0"
                className={`${inputCls} ${abaixoDoCusto ? "border-red-400 focus:ring-red-500" : ""}`}
                value={precoUnit}
                onChange={(e) => setPrecoUnit(Number(e.target.value))}
              />
            </Field>
          </div>
          {abaixoDoCusto && (
            <div className="text-xs text-red-600 -mt-1 mb-2">Esse valor está abaixo do custo ({fmtUSD(custoRef)}). Não é possível enviar orçamento com preço abaixo do custo.</div>
          )}
          <button
            type="button"
            onClick={addAoCarrinho}
            disabled={!item || qtd < 1 || abaixoDoCusto}
            className="w-full flex items-center justify-center gap-1.5 border border-emerald-800 text-emerald-800 hover:bg-emerald-50 disabled:opacity-40 rounded-md py-2 text-sm font-medium"
          >
            <Plus size={14} /> Adicionar ao orçamento
          </button>
        </div>

        <div className="mb-4">
          <div className="text-xs font-medium text-gray-500 mb-2">Itens do orçamento ({carrinho.length})</div>
          {carrinho.length === 0 ? (
            <div className="text-sm text-gray-400 text-center py-4 border border-dashed border-gray-200 rounded-lg">Nenhum produto adicionado ainda.</div>
          ) : (
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
              {carrinho.map((l) => (
                <div key={l.key} className="flex items-center justify-between px-3 py-2 text-sm">
                  <div>
                    <div className="font-medium text-gray-900">{l.nome} × {l.qtd}</div>
                    <div className="text-xs text-gray-400">{l.tipoVenda} · {fmtUSD(l.precoUnit)} un.</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900">{fmtUSD(l.precoUnit * l.qtd)}</span>
                    <button onClick={() => removerDoCarrinho(l.key)} className="text-gray-400 hover:text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-sm text-gray-500 mb-4">
          Total do orçamento: <span className="font-semibold text-gray-900">{fmtUSD(total)}</span>
        </div>
        <button
          onClick={finalizar}
          disabled={carrinho.length === 0}
          className="w-full bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white rounded-md py-2 text-sm font-medium"
        >
          Salvar orçamento
        </button>
      </Modal>
    );
  }

  function CompraModal() {
    const [fornecedorId, setFornecedorId] = useState(fornecedores[0]?.id || "");
    const [nome, setNome] = useState("");
    const [qtd, setQtd] = useState(1);
    const [custo, setCusto] = useState(0);
    const [varejo, setVarejo] = useState(0);
    const [atacado, setAtacado] = useState(0);
    const [pagamento, setPagamento] = useState("PIX");
    const [condicao, setCondicao] = useState("À vista");
    const [vencimento, setVencimento] = useState(todayISO());
    const [carrinho, setCarrinho] = useState([]);

    const nomeTrim = nome.trim();
    const isNovoProduto = nomeTrim !== "" && !estoque.some((i) => i.nome.toLowerCase() === nomeTrim.toLowerCase());
    const podeAdicionar = nomeTrim !== "" && qtd > 0 && custo > 0 && (!isNovoProduto || (varejo > 0 && atacado > 0));
    const total = carrinho.reduce((s, l) => s + l.custo * l.qtd, 0);

    function addAoCarrinho() {
      if (!podeAdicionar) return;
      setCarrinho((c) => [...c, { key: uid(), nome: nomeTrim, qtd, custo, varejo, atacado }]);
      setNome(""); setQtd(1); setCusto(0); setVarejo(0); setAtacado(0);
    }
    function removerDoCarrinho(key) {
      setCarrinho((c) => c.filter((l) => l.key !== key));
    }
    function finalizar() {
      if (carrinho.length === 0) return;
      registrarCompra({ fornecedorId, itens: carrinho, pagamento, condicao, vencimento });
    }

    return (
      <Modal title="Nova compra" onClose={() => setModal(null)} wide>
        <Field label="Fornecedor">
          <select className={inputCls} value={fornecedorId} onChange={(e) => setFornecedorId(e.target.value)}>
            <option value="">Sem nome</option>
            {fornecedores.map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}
          </select>
        </Field>

        <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
          <div className="text-xs font-medium text-gray-500 mb-3">Adicionar produto à nota</div>
          <Field label="Mercadoria">
            <input className={inputCls} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do item (novo ou existente)" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Quantidade">
              <input type="number" min="1" className={inputCls} value={qtd} onChange={(e) => setQtd(Number(e.target.value))} />
            </Field>
            <Field label="Custo unit. (US$)">
              <input type="number" step="0.01" className={inputCls} value={custo} onChange={(e) => setCusto(Number(e.target.value))} />
            </Field>
          </div>
          {isNovoProduto && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Preço varejo (US$) *">
                  <input type="number" step="0.01" min="0.01" className={inputCls} value={varejo} onChange={(e) => setVarejo(Number(e.target.value))} />
                </Field>
                <Field label="Preço atacado (US$) *">
                  <input type="number" step="0.01" min="0.01" className={inputCls} value={atacado} onChange={(e) => setAtacado(Number(e.target.value))} />
                </Field>
              </div>
              <div className="text-xs text-gray-400 -mt-2 mb-3">* Obrigatório — mercadoria nova precisa ter os dois preços de venda cadastrados.</div>
            </>
          )}
          <button
            type="button"
            onClick={addAoCarrinho}
            disabled={!podeAdicionar}
            className="w-full flex items-center justify-center gap-1.5 border border-emerald-800 text-emerald-800 hover:bg-emerald-50 disabled:opacity-40 rounded-md py-2 text-sm font-medium"
          >
            <Plus size={14} /> Adicionar à nota
          </button>
        </div>

        <div className="mb-4">
          <div className="text-xs font-medium text-gray-500 mb-2">Itens da nota ({carrinho.length})</div>
          {carrinho.length === 0 ? (
            <div className="text-sm text-gray-400 text-center py-4 border border-dashed border-gray-200 rounded-lg">Nenhum produto adicionado ainda.</div>
          ) : (
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
              {carrinho.map((l) => (
                <div key={l.key} className="flex items-center justify-between px-3 py-2 text-sm">
                  <div>
                    <div className="font-medium text-gray-900">{l.nome} × {l.qtd}</div>
                    <div className="text-xs text-gray-400">Custo {fmtUSD(l.custo)} un.</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900">{fmtUSD(l.custo * l.qtd)}</span>
                    <button onClick={() => removerDoCarrinho(l.key)} className="text-gray-400 hover:text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Field label="Condição">
          <select className={inputCls} value={condicao} onChange={(e) => setCondicao(e.target.value)}>
            <option>À vista</option>
            <option>A prazo</option>
          </select>
        </Field>
        {condicao === "À vista" ? (
          <Field label="Pago com">
            <select className={inputCls} value={pagamento} onChange={(e) => setPagamento(e.target.value)}>
              <option>PIX</option>
              <option>Real</option>
              <option>Dólar</option>
              <option>USDT</option>
            </select>
          </Field>
        ) : (
          <Field label="Data para pagar o fornecedor">
            <input type="date" className={inputCls} value={vencimento} onChange={(e) => setVencimento(e.target.value)} />
          </Field>
        )}
        <div className="text-sm text-gray-500 mb-4">
          Total da nota: <span className="font-semibold text-gray-900">{fmtUSD(total)}</span>
          {condicao === "A prazo" && <span className="block text-xs text-amber-700 mt-1">Isso vai criar uma conta a pagar em vez de debitar o caixa agora.</span>}
        </div>
        <button
          onClick={finalizar}
          disabled={carrinho.length === 0}
          className="w-full bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white rounded-md py-2 text-sm font-medium"
        >
          Finalizar compra
        </button>
      </Modal>
    );
  }

  function MovimentoModal() {
    const [caixaKey, setCaixaKey] = useState("pix");
    const [tipo, setTipo] = useState("Entrada");
    const [valor, setValor] = useState(0);
    const [descricao, setDescricao] = useState("");
    return (
      <Modal title="Novo movimento" onClose={() => setModal(null)}>
        <Field label="Caixa">
          <select className={inputCls} value={caixaKey} onChange={(e) => setCaixaKey(e.target.value)}>
            {Object.keys(caixaMeta).map((k) => <option key={k} value={k}>{caixaMeta[k].label}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tipo">
            <select className={inputCls} value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option>Entrada</option>
              <option>Saída</option>
            </select>
          </Field>
          <Field label="Valor">
            <input type="number" step="0.01" className={inputCls} value={valor} onChange={(e) => setValor(Number(e.target.value))} />
          </Field>
        </div>
        <Field label="Descrição">
          <input className={inputCls} value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex: Aporte inicial" />
        </Field>
        <button
          onClick={() => { addMovimento(caixaKey, tipo, valor, descricao || "Movimento manual"); setModal(null); }}
          disabled={valor <= 0}
          className="w-full bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white rounded-md py-2 text-sm font-medium"
        >
          Registrar movimento
        </button>
      </Modal>
    );
  }

  function ItemModal() {
    const isEdit = !!editingItem;
    const [nome, setNome] = useState(editingItem?.nome || "");
    const [marca, setMarca] = useState(editingItem?.marca || "");
    const [tipo, setTipo] = useState(editingItem?.tipo || "");
    const [qtd, setQtd] = useState(editingItem?.qtd ?? 1);
    const [custo, setCusto] = useState(editingItem?.custo ?? 0);
    const [custoVendedor, setCustoVendedor] = useState(editingItem?.custoVendedor ?? editingItem?.custo ?? 0);
    const [varejo, setVarejo] = useState(editingItem?.varejo ?? 0);
    const [atacado, setAtacado] = useState(editingItem?.atacado ?? 0);
    const [min, setMin] = useState(editingItem?.min ?? 3);
    const [foto, setFoto] = useState(editingItem?.foto || null);
    const [fotoLoading, setFotoLoading] = useState(false);

    function close() { setModal(null); setEditingItem(null); }

    async function onFotoChange(e) {
      const file = e.target.files?.[0];
      if (!file) return;
      setFotoLoading(true);
      try {
        const dataUrl = await readAndCompressImage(file);
        setFoto(dataUrl);
      } catch (err) {
        console.error(err);
      } finally {
        setFotoLoading(false);
        e.target.value = "";
      }
    }

    function save() {
      if (!nome) return;
      if (isEdit) {
        setEstoque((e) => e.map((x) => (x.id === editingItem.id ? { ...x, nome, marca, tipo, qtd, custo, custoVendedor, varejo, atacado, min, foto } : x)));
      } else {
        setEstoque((e) => [...e, { id: uid(), nome, marca, tipo, qtd, custo, custoVendedor, varejo, atacado, min, foto }]);
      }
      close();
    }

    const invalid = !nome || !(varejo > 0) || !(atacado > 0);

    return (
      <Modal title={isEdit ? "Editar item de estoque" : "Novo item de estoque"} onClose={close}>
        <Field label="Foto do produto">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
              {foto ? (
                <img src={foto} alt="" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon size={20} className="text-gray-300" />
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-sm font-medium border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 cursor-pointer w-fit">
                <Camera size={14} />
                {fotoLoading ? "Carregando..." : foto ? "Trocar foto" : "Adicionar foto"}
                <input type="file" accept="image/*" className="hidden" onChange={onFotoChange} disabled={fotoLoading} />
              </label>
              {foto && (
                <button onClick={() => setFoto(null)} className="text-xs text-red-600 hover:underline w-fit">
                  Remover foto
                </button>
              )}
            </div>
          </div>
        </Field>
        <Field label="Nome"><input className={inputCls} value={nome} onChange={(e) => setNome(e.target.value)} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Marca">
            <input list="lista-marcas" className={inputCls} value={marca} onChange={(e) => setMarca(e.target.value)} placeholder="Ex: EMS, Neo Química..." />
            <datalist id="lista-marcas">
              {Array.from(new Set(estoque.map((i) => i.marca).filter(Boolean))).map((m) => <option key={m} value={m} />)}
            </datalist>
          </Field>
          <Field label="Tipo">
            <input list="lista-tipos" className={inputCls} value={tipo} onChange={(e) => setTipo(e.target.value)} placeholder="Ex: Comprimido, Xarope..." />
            <datalist id="lista-tipos">
              {Array.from(new Set(estoque.map((i) => i.tipo).filter(Boolean))).map((t) => <option key={t} value={t} />)}
            </datalist>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Quantidade"><input type="number" min="0" className={inputCls} value={qtd} onChange={(e) => setQtd(Number(e.target.value))} /></Field>
          <Field label="Estoque mínimo"><input type="number" min="0" className={inputCls} value={min} onChange={(e) => setMin(Number(e.target.value))} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Custo real (US$)">
            <input type="number" step="0.01" className={inputCls} value={custo} onChange={(e) => setCusto(Number(e.target.value))} />
          </Field>
          <Field label="Custo p/ vendedores (US$)">
            <input type="number" step="0.01" className={inputCls} value={custoVendedor} onChange={(e) => setCustoVendedor(Number(e.target.value))} />
          </Field>
        </div>
        <div className="text-xs text-gray-400 -mt-2 mb-4">O custo real só aparece pra administradores. Vendedores só veem o custo que você definir ao lado.</div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Preço varejo (US$) *"><input type="number" step="0.01" min="0.01" className={inputCls} value={varejo} onChange={(e) => setVarejo(Number(e.target.value))} /></Field>
          <Field label="Preço atacado (US$) *"><input type="number" step="0.01" min="0.01" className={inputCls} value={atacado} onChange={(e) => setAtacado(Number(e.target.value))} /></Field>
        </div>
        <div className="text-xs text-gray-400 -mt-2 mb-4">* Obrigatório — todo produto precisa ter preço de varejo e de atacado.</div>
        {isEdit && (
          <button
            onClick={() => { setEstoque((e) => e.filter((x) => x.id !== editingItem.id)); close(); }}
            className="w-full mb-3 border border-red-200 text-red-600 hover:bg-red-50 rounded-md py-2 text-sm font-medium"
          >
            Excluir item
          </button>
        )}
        <button
          onClick={save}
          disabled={invalid}
          className="w-full bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white rounded-md py-2 text-sm font-medium"
        >
          {isEdit ? "Salvar alterações" : "Adicionar item"}
        </button>
      </Modal>
    );
  }

  function ContaModal() {
    const isEdit = !!editingConta;
    const [nome, setNome] = useState(editingConta?.nome || "");
    const [categoria, setCategoria] = useState(editingConta?.categoria || "Água");
    const [valor, setValor] = useState(editingConta?.valor ?? 0);
    const [vencimento, setVencimento] = useState(editingConta?.vencimento || todayISO());

    function close() { setModal(null); setEditingConta(null); }

    function save() {
      if (!nome || !(valor > 0)) return;
      if (isEdit) {
        setContas((cs) => cs.map((c) => (c.id === editingConta.id ? { ...c, nome, categoria, valor, vencimento } : c)));
      } else {
        setContas((cs) => [...cs, { id: uid(), nome, categoria, valor, vencimento, status: "Pendente", dataPagamento: null }]);
      }
      close();
    }

    return (
      <Modal title={isEdit ? "Editar conta" : "Nova conta a pagar"} onClose={close}>
        <Field label="Categoria">
          <select className={inputCls} value={categoria} onChange={(e) => { setCategoria(e.target.value); if (!isEdit && !nome) setNome(e.target.value); }}>
            <option>Água</option>
            <option>Energia</option>
            <option>Internet</option>
            <option>Aluguel</option>
            <option>Fornecedor</option>
            <option>Outro</option>
          </select>
        </Field>
        <Field label="Nome da conta"><input className={inputCls} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Água - Loja Matriz" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Valor (US$)"><input type="number" step="0.01" min="0.01" className={inputCls} value={valor} onChange={(e) => setValor(Number(e.target.value))} /></Field>
          <Field label="Vencimento"><input type="date" className={inputCls} value={vencimento} onChange={(e) => setVencimento(e.target.value)} /></Field>
        </div>
        {isEdit && (
          <button
            onClick={() => { setContas((cs) => cs.filter((x) => x.id !== editingConta.id)); close(); }}
            className="w-full mb-3 border border-red-200 text-red-600 hover:bg-red-50 rounded-md py-2 text-sm font-medium"
          >
            Excluir conta
          </button>
        )}
        <button
          onClick={save}
          disabled={!nome || !(valor > 0)}
          className="w-full bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white rounded-md py-2 text-sm font-medium"
        >
          {isEdit ? "Salvar alterações" : "Adicionar conta"}
        </button>
      </Modal>
    );
  }

  function PagarContaModal() {
    const [caixaKey, setCaixaKey] = useState("pix");
    if (!payingConta) return null;
    return (
      <Modal title={`Pagar: ${payingConta.nome}`} onClose={() => { setModal(null); setPayingConta(null); }}>
        <div className="text-sm text-gray-600 mb-4">
          Valor: <span className="font-semibold text-gray-900">{fmtUSD(payingConta.valor)}</span> · Vencimento: {fmtDate(payingConta.vencimento)}
        </div>
        <Field label="Pagar com">
          <select className={inputCls} value={caixaKey} onChange={(e) => setCaixaKey(e.target.value)}>
            {Object.keys(caixaMeta).map((k) => <option key={k} value={k}>{caixaMeta[k].label}</option>)}
          </select>
        </Field>
        <button
          onClick={() => { pagarConta(payingConta.id, caixaKey); setModal(null); setPayingConta(null); }}
          className="w-full bg-emerald-800 hover:bg-emerald-900 text-white rounded-md py-2 text-sm font-medium"
        >
          Confirmar pagamento
        </button>
      </Modal>
    );
  }

  function ReceberVendaModal() {
    const [caixaKey, setCaixaKey] = useState("pix");
    if (!receivingVenda) return null;
    return (
      <Modal title={`Receber: venda #${receivingVenda.id}`} onClose={() => { setModal(null); setReceivingVenda(null); }}>
        <div className="text-sm text-gray-600 mb-4">
          Cliente: <span className="font-medium text-gray-900">{receivingVenda.clienteNome}</span> · Valor: <span className="font-semibold text-gray-900">{fmtUSD(receivingVenda.valor)}</span>
        </div>
        <Field label="Recebido em">
          <select className={inputCls} value={caixaKey} onChange={(e) => setCaixaKey(e.target.value)}>
            {Object.keys(caixaMeta).map((k) => <option key={k} value={k}>{caixaMeta[k].label}</option>)}
          </select>
        </Field>
        <button
          onClick={() => { marcarVendaPaga(receivingVenda.id, caixaKey); setModal(null); setReceivingVenda(null); }}
          className="w-full bg-emerald-800 hover:bg-emerald-900 text-white rounded-md py-2 text-sm font-medium"
        >
          Confirmar recebimento
        </button>
      </Modal>
    );
  }

  function PessoaModal({ tipo }) {
    const [nome, setNome] = useState("");
    const [contato, setContato] = useState("");
    const isCliente = tipo === "cliente";
    return (
      <Modal title={isCliente ? "Novo cliente" : "Novo fornecedor"} onClose={() => setModal(null)}>
        <Field label="Nome"><input className={inputCls} value={nome} onChange={(e) => setNome(e.target.value)} /></Field>
        <Field label="Contato"><input className={inputCls} value={contato} onChange={(e) => setContato(e.target.value)} placeholder="Telefone ou e-mail" /></Field>
        <button
          onClick={() => {
            if (!nome) return;
            if (isCliente) setClientes((c) => [...c, { id: uid(), nome, contato }]);
            else setFornecedores((f) => [...f, { id: uid(), nome, contato }]);
            setModal(null);
          }}
          disabled={!nome}
          className="w-full bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white rounded-md py-2 text-sm font-medium"
        >
          Salvar
        </button>
      </Modal>
    );
  }

  function CambioModal() {
    return (
      <Modal title="Ajustar câmbio" onClose={() => setModal(null)}>
        <CambioForm initial={cambio} onSave={(v) => { setCambio(v); setModal(null); }} />
      </Modal>
    );
  }

  function backup() {
    const data = { estoque, vendas, compras, clientes, fornecedores, caixas, movimentos, cambio };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "colorshop-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function VendedoresPage() {
    return (
      <TableShell
        title="Vendedores"
        sub={`${usuarios.length} usuários`}
        action={
          <button onClick={() => setModal("vendedor")} className="flex items-center gap-1.5 text-sm font-medium bg-emerald-800 hover:bg-emerald-900 text-white rounded-md px-3 py-1.5">
            <Plus size={14} /> Novo vendedor
          </button>
        }
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] tracking-wide text-gray-400 border-b border-gray-100">
              <th className="px-5 py-2 font-medium">NOME</th>
              <th className="px-5 py-2 font-medium">USUÁRIO</th>
              <th className="px-5 py-2 font-medium">PAPEL</th>
              <th className="px-5 py-2 font-medium">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="border-b border-gray-50">
                <td className="px-5 py-3 font-medium text-gray-900">{u.nome}</td>
                <td className="px-5 py-3 text-gray-600">{u.usuario}</td>
                <td className="px-5 py-3 text-gray-600">{u.papel === "admin" ? "Administrador" : "Vendedor"}</td>
                <td className="px-5 py-3">
                  {u.id !== authUser?.id && (
                    <button onClick={() => setUsuarios((us) => us.filter((x) => x.id !== u.id))} className="text-gray-400 hover:text-red-600">
                      <Trash2 size={15} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableShell>
    );
  }

  function VendedorModal() {
    const [nome, setNome] = useState("");
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const usuarioExiste = usuarios.some((u) => u.usuario.toLowerCase() === usuario.trim().toLowerCase());
    const invalid = !nome || !usuario || senha.length < 4 || usuarioExiste;
    return (
      <Modal title="Novo vendedor" onClose={() => setModal(null)}>
        <Field label="Nome completo"><input className={inputCls} value={nome} onChange={(e) => setNome(e.target.value)} /></Field>
        <Field label="Nome de usuário (login)"><input className={inputCls} value={usuario} onChange={(e) => setUsuario(e.target.value)} placeholder="ex: maria" /></Field>
        {usuarioExiste && <div className="text-xs text-red-600 -mt-3 mb-3">Esse nome de usuário já existe.</div>}
        <Field label="Senha (mín. 4 caracteres)"><input type="text" className={inputCls} value={senha} onChange={(e) => setSenha(e.target.value)} /></Field>
        <div className="text-xs text-gray-400 mb-4">O vendedor não vai poder ver fornecedores nem os contatos dos clientes.</div>
        <button
          onClick={() => {
            if (invalid) return;
            setUsuarios((us) => [...us, { id: uid(), nome, usuario: usuario.trim(), senha, papel: "vendedor" }]);
            setModal(null);
          }}
          disabled={invalid}
          className="w-full bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white rounded-md py-2 text-sm font-medium"
        >
          Criar vendedor
        </button>
      </Modal>
    );
  }

  function LoginScreen() {
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState(false);
    const [verSenha, setVerSenha] = useState(false);

    function tentar() {
      const ok = login(usuario, senha);
      if (!ok) setErro(true);
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl p-8">
          <div className="flex flex-col items-center mb-6">
            <img src={LOGO_FULL} alt="Indufarma" className="h-14 object-contain mb-3" />
            <div className="text-xs text-gray-400">Entre com seu usuário e senha</div>
          </div>
          <Field label="Usuário">
            <input
              className={inputCls}
              value={usuario}
              onChange={(e) => { setUsuario(e.target.value); setErro(false); }}
              onKeyDown={(e) => e.key === "Enter" && tentar()}
              autoFocus
            />
          </Field>
          <Field label="Senha">
            <div className="relative">
              <input
                type={verSenha ? "text" : "password"}
                className={inputCls + " pr-10"}
                value={senha}
                onChange={(e) => { setSenha(e.target.value); setErro(false); }}
                onKeyDown={(e) => e.key === "Enter" && tentar()}
              />
              <button type="button" onClick={() => setVerSenha((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {verSenha ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </Field>
          {erro && <div className="text-xs text-red-600 mb-4">Usuário ou senha incorretos.</div>}
          <button
            onClick={tentar}
            className="w-full flex items-center justify-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-md py-2 text-sm font-medium mt-2"
          >
            <Lock size={14} /> Entrar
          </button>
        </div>
      </div>
    );
  }

  const pages = {
    visao: <VisaoGeral />,
    estoque: <EstoquePage />,
    vendas: <VendasPage />,
    comissoes: <ComissoesPage />,
    orcamentos: <OrcamentosPage />,
    compras: <ComprasPage />,
    caixa: <CaixaPage />,
    contas: <ContasPage />,
    clientes: <PessoasPage title="Clientes" data={clientes} setData={setClientes} placeholder="Nenhum cliente cadastrado." />,
    fornecedores: <PessoasPage title="Fornecedores" data={fornecedores} setData={setFornecedores} placeholder="Nenhum fornecedor cadastrado." />,
    cambio: <CambioPage />,
    vendedores: <VendedoresPage />,
  };

  if (!authChecked || !loaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
        <div className="flex items-center gap-2 text-sm">
          <Loader2 size={16} className="animate-spin" /> Carregando seus dados...
        </div>
      </div>
    );
  }

  if (!authUser) {
    return <LoginScreen />;
  }

  // guard against a vendedor landing on a page restricted to admin (e.g. stale state)
  const currentNavEntry = NAV.find((n) => n.key === page);
  const effectivePage = currentNavEntry && currentNavEntry.roles.includes(authUser.papel) ? page : "visao";

  const navList = (
    <>
      {visibleNav.map((n) => {
        const Icon = n.icon;
        const active = effectivePage === n.key;
        return (
          <button
            key={n.key}
            onClick={() => { setPage(n.key); setMobileNavOpen(false); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              active ? "bg-emerald-50 text-emerald-800" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Icon size={16} />
            {n.label}
          </button>
        );
      })}
    </>
  );

  const userFooter = (
    <div className="px-3 py-4 border-t border-gray-100 flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-semibold shrink-0">
        {authUser.nome.slice(0, 2).toUpperCase()}
      </div>
      <div className="min-w-0">
        <div className="text-xs font-semibold leading-tight truncate">{authUser.nome}</div>
        <div className="text-[11px] text-gray-400 leading-tight">{authUser.papel === "admin" ? "Administrador" : "Vendedor"}</div>
      </div>
      <button onClick={logout} className="ml-auto text-gray-400 hover:text-red-600" title="Sair">
        <LogOut size={15} />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex text-gray-900" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex w-56 bg-white border-r border-gray-200 flex-col shrink-0">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <img src={LOGO_ICON} alt="Indufarma" className="w-9 h-9 object-contain shrink-0" />
          <div>
            <div className="text-sm font-semibold leading-tight">Indufarma</div>
            <div className="text-[11px] text-gray-400 leading-tight">Gestão comercial</div>
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-0.5">{navList}</nav>
        {userFooter}
      </aside>

      {/* Sidebar - mobile drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-gray-900/40" onClick={() => setMobileNavOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white flex flex-col shadow-xl">
            <div className="flex items-center gap-2.5 px-5 py-5">
              <img src={LOGO_ICON} alt="Indufarma" className="w-9 h-9 object-contain shrink-0" />
              <div>
                <div className="text-sm font-semibold leading-tight">Indufarma</div>
                <div className="text-[11px] text-gray-400 leading-tight">Gestão comercial</div>
              </div>
              <button onClick={() => setMobileNavOpen(false)} className="ml-auto text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">{navList}</nav>
            {userFooter}
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 min-w-0">
        <div className="h-1 bg-gray-900" />

        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200">
          <button onClick={() => setMobileNavOpen(true)} className="text-gray-600">
            <Menu size={22} />
          </button>
          <img src={LOGO_ICON} alt="Indufarma" className="w-7 h-7 object-contain shrink-0" />
          <div className="text-sm font-semibold">Indufarma</div>
        </div>

        <div className="px-4 md:px-8 py-4 md:py-6">
          <div className="flex items-start justify-between mb-5 md:mb-6 flex-wrap gap-3">
            <div>
              <div className="text-[11px] tracking-wide text-gray-400 font-medium">{fmtDateLong()}</div>
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mt-0.5">{NAV.find((n) => n.key === effectivePage)?.label}</h1>
            </div>
            <div className="flex items-center gap-2 md:gap-3 flex-wrap w-full sm:w-auto">
              <div className="relative hidden sm:block">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input placeholder="Buscar mercadoria..." className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md w-56 focus:outline-none focus:ring-2 focus:ring-emerald-700" />
              </div>
              {isAdmin && (
                <button onClick={backup} className="flex items-center gap-1.5 text-sm font-medium border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50">
                  <Download size={14} /> <span className="hidden sm:inline">Backup</span>
                </button>
              )}
              <button onClick={() => setModal("venda")} className="flex items-center gap-1.5 text-sm font-medium bg-emerald-800 hover:bg-emerald-900 text-white rounded-md px-3 py-2">
                <Plus size={14} /> Nova venda
              </button>
            </div>
          </div>

          {pages[effectivePage]}
        </div>
      </main>

      {modal === "venda" && <VendaModal />}
      {modal === "compra" && <CompraModal />}
      {modal === "movimento" && <MovimentoModal />}
      {modal === "item" && <ItemModal />}
      {modal === "cliente" && <PessoaModal tipo="cliente" />}
      {modal === "fornecedor" && <PessoaModal tipo="fornecedor" />}
      {modal === "cambio" && <CambioModal />}
      {modal === "conta" && <ContaModal />}
      {modal === "pagarConta" && <PagarContaModal />}
      {modal === "receberVenda" && <ReceberVendaModal />}
      {modal === "orcamento" && <OrcamentoModal />}
      {modal === "vendedor" && <VendedorModal />}
      {lightbox && <PhotoLightbox src={lightbox.src} nome={lightbox.nome} onClose={() => setLightbox(null)} />}
    </div>
  );
}
