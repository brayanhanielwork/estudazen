# EstudaZen 📖🌱

Site estático interativo em **HTML, CSS e JavaScript**, com estética de fichário, animações de folhear páginas, conteúdo de Fundamentos de Administração, atividades ao longo da leitura, simulado objetivo e envio da redação para análise em ChatGPT por copiar/colar.

## Como abrir

Abra `index.html` em um navegador moderno. Para servir localmente com endereço HTTP: `python -m http.server 8000` na pasta do projeto; acesse `http://localhost:8000`.

## Publicação gratuita no GitHub Pages

1. Crie um repositório público no [GitHub](https://github.com/new), por exemplo `estudazen`.
2. Envie `index.html`, `styles.css`, `content.js`, `app.js` e a pasta `assets/` para a raiz do repositório. Pode usar **Add file → Upload files**.
3. Vá a **Settings → Pages → Build and deployment → Deploy from a branch**, selecione `main` e `/ (root)`; salve.
4. Aguarde a publicação. O link normalmente segue o formato `https://SEU-USUARIO.github.io/estudazen/` (substitua pelos dados reais do seu repositório).

**Nenhum link real do GitHub foi criado automaticamente por este pacote.** A publicação depende do repositório na sua conta.

## Organização didática

Sete unidades dos temas dos PDFs enviados: introdução, ambiente organizacional, tomada de decisão, planejamento/estratégia, organização, direção e controle. Cada unidade tem **4 páginas de teoria e 2 páginas de exercícios** em três aberturas de duas páginas. São **14 questões durante o estudo**, além do **simulado final com 10 questões de múltipla escolha e uma discursiva**.

Os textos foram redigidos como sínteses didáticas originais dos temas. Os capítulos 7 e 8 têm páginas predominantemente digitalizadas, e não foi possível verificar todo o conteúdo textual do capítulo. O texto complementar de Porter foi abordado em termos gerais. A leitura integral dos materiais originais pode oferecer nuances adicionais.

## Como funciona o ranking

A versão pronta funciona **sem backend**: os perfis, notas, conquistas e ranking ficam salvos no `localStorage` do mesmo navegador. Cada acerto no fichário dá 10 pontos; cada acerto no simulado final adiciona 8 pontos. Respostas já registradas não dão pontos extras quando refeitas. Esse placar **não é um ranking global**: outro computador terá seus próprios dados.

Para um **ranking online entre pessoas em dispositivos diferentes**, será necessário criar um backend com autenticação e banco de dados, como Supabase ou Firebase, e trocar as funções `load`, `save` e `ranks` por operações autenticadas. Uma implementação de produção precisa validar pontuações no servidor e ter proteções contra manipulação, duplicidade e nomes abusivos. **Não publique uma chave privada de serviço no JavaScript.**

## Correção discursiva por IA

O botão **Solicitar correção pela IA** abre o ChatGPT e copia para a área de transferência um pedido com enunciado, resposta e rubrica. O usuário cola o texto no ChatGPT. Uma correção totalmente automática e integrada no próprio site exigiria backend e credenciais da API de IA guardadas no servidor; não inclua chaves de API no frontend.

## Personalização

- Conteúdo pedagógico: `content.js`.
- Tema, adaptação mobile e animações: `styles.css`.
- Estado, pontuação, navegação e correções: `app.js`.
- Referências visuais anexadas ao projeto em `assets/`, apenas para consulta, não usadas como tela estática.

## Privacidade e limitações

Os nomes e respostas são armazenados localmente. Não há sincronização, conta com senha ou recuperação entre dispositivos. As folhas interativas e a revisão de erros funcionam offline depois de carregar os arquivos; a fonte remota pode ser substituída por fontes locais se precisar de isolamento total. A correção por IA exige acesso externo e a escolha consciente de compartilhar sua resposta.
