# EstudaZen — versão profissional para GitHub Pages

Site estático de estudos de Fundamentos de Administração, com visual de fichário A4, exercícios, progresso, glossário interativo e ranking local/global.

## Arquivos da publicação

- `index.html`
- `styles.css`
- `content.js`
- `app.js`
- `config.js`
- `README.md`

## Publicação simples pelo navegador

Use este método quando **cada arquivo tiver menos de 25 MB**.

1. Crie um repositório no GitHub.
2. Extraia o ZIP do projeto no seu computador.
3. No repositório, clique em **Add file → Upload files**.
4. Envie os arquivos **individualmente**. O `index.html` deve ficar na raiz.
5. Faça o commit.
6. Em **Settings → Pages**, selecione **Deploy from a branch**, escolha `main` e `/(root)`.

## Quando os arquivos ficarem mais pesados

Se o upload pelo navegador falhar, use um clone local:

```bash
git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
cd SEU-REPOSITORIO
# copie os arquivos do EstudaZen para dentro da pasta do repositório
git add .
git commit -m "Atualiza o EstudaZen"
git push origin main
```

### Para arquivos grandes de mídia

- GitHub aceita normalmente arquivos de até **100 MB por arquivo**, mas o ideal é ficar bem abaixo disso.
- Para muitos arquivos pesados (imagens, vídeos, PDFs, mockups), prefira:
  - comprimir imagens em WebP/AVIF;
  - manter apenas os arquivos necessários ao site publicado;
  - usar **Git LFS** se realmente precisar versionar binários pesados.

Exemplo com Git LFS:

```bash
git lfs install
git lfs track "*.png" "*.jpg" "*.jpeg" "*.webp" "*.pdf"
git add .gitattributes
git add .
git commit -m "Adiciona arquivos pesados com Git LFS"
git push origin main
```

## Ranking global

O ranking local funciona imediatamente.

Para ativar o ranking global, é necessário configurar um banco online. Esta versão já está preparada para **Supabase**.

### Estrutura sugerida no Supabase

Tabela: `estudazen_ranking`

Campos:
- `name` (text, chave única)
- `points` (int)
- `correct_answers` (int)
- `updated_at` (timestamptz)

### Política mínima esperada

- leitura pública (`SELECT`)
- inserção/atualização pública controlada (`INSERT` / `UPSERT`)

### Depois disso

Edite o arquivo `config.js`:

```js
window.ESTUDAZEN_CLOUD = {
  enabled: true,
  provider: 'supabase',
  url: 'https://SEU-PROJETO.supabase.co',
  anonKey: 'SUA-CHAVE-ANON',
  table: 'estudazen_ranking'
};
```

Quando a configuração estiver ativa, o site exibirá o modo **Global** na tela de ranking e sincronizará automaticamente a pontuação.

## Observações

- Esta versão usa a chave local `estudazen_v3` no navegador, facilitando a aplicação das páginas novas.
- O glossário, as ilustrações interativas e o layout A4 funcionam sem bibliotecas externas.
- O ranking global depende de conectividade com o serviço configurado.
