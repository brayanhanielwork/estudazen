/*
  EstudaZen — configuração opcional.
  Ative o ranking global preenchendo os dados do Supabase.
  Se você não pretende usar ranking global, mantenha enabled: false.
*/
window.ESTUDAZEN_CLOUD = {
  enabled: false,
  provider: 'supabase',
  url: '',
  anonKey: '',
  table: 'estudazen_ranking'
};
