-- Tabela única que guarda todos os dados do sistema (estoque, vendas, clientes, etc.)
create table if not exists app_data (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- Permite que o sistema leia e grave dados (o controle de quem pode entrar
-- já é feito pela tela de login do próprio ColorShop)
alter table app_data enable row level security;

create policy "Permitir leitura" on app_data
  for select using (true);

create policy "Permitir gravação" on app_data
  for insert with check (true);

create policy "Permitir atualização" on app_data
  for update using (true);
