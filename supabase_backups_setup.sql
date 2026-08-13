-- Tabela de backups automáticos do sistema.
-- Roda isso no MESMO projeto Supabase do site Indufarma (SQL Editor -> New query -> Run).

create table if not exists backups_indufarma (
  id uuid primary key default gen_random_uuid(),
  dados jsonb not null,
  qtd_produtos int,
  criado_em timestamptz default now()
);

alter table backups_indufarma enable row level security;

create policy "Permitir leitura backups" on backups_indufarma for select using (true);
create policy "Permitir gravação backups" on backups_indufarma for insert with check (true);
create policy "Permitir exclusão backups" on backups_indufarma for delete using (true);
