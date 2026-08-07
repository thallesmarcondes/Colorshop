# Indufarma

Painel de gestão comercial (login, estoque, vendas, compras, caixa, contas a pagar, orçamentos, câmbio).

## Login padrão
- Usuário: `admin`
- Senha: `admin123`

Recomendo trocar a senha assim que possível (crie um novo usuário admin de sua confiança e delete/ajuste o padrão pela tela de "Vendedores").

## Rodar localmente (opcional, exige Node.js instalado)
```
npm install
npm run dev
```

## Publicar
1. Suba esta pasta para um repositório no GitHub (arquivos soltos na raiz, sem subpasta).
2. Importe o repositório na Cloudflare Pages ou Vercel.
3. Build command: `npm run build` — Output directory: `dist`.

## Observação sobre os dados
Os dados ficam salvos no `localStorage` do navegador — ou seja, por aparelho/navegador.
Se você quiser dados compartilhados entre vários aparelhos/usuários ao mesmo tempo,
é necessário um banco de dados real (ex: Supabase), que pode ser adicionado depois.
