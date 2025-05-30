# 🖥️ Modelo Electron - Interface Administrativa com Navbar Responsiva

Este projeto é um modelo base para aplicações **Electron.js** com estrutura de pastas organizada, comunicação segura via `preload.js`, integração com API local e layout responsivo com **navbar lateral fixa**.

---

## 📁 Estrutura de Diretórios

```bash
electron/
├── src/
│   ├── pages/
│   │   ├── html/
│   │   │   ├── index.html           # Tela de login
│   │   │   ├── home.html            # Tela inicial após login
│   │   │   ├── clients.html         # Tela de listagem de clientes
│   │   │   └── template.html        # Template base para novas páginas
│   │   ├── css/
│   │   │   ├── global_styles.css    # CSS base compartilhado
│   │   │   ├── navbar.css           # Estilo da navbar lateral
│   │   │   └── clients.css          # Estilo da tela de clientes
│   │   ├── script/
│   │   │   ├── navbar.js            # Script que carrega a navbar
│   │   │   └── clients_renderer.js  # Script JS da página de clientes
│
│   ├── components/
│   │   └── navbar.html              # HTML da navbar lateral
│
│   ├── index.html                   # Tela de login principal
│
├── main.js                          # Arquivo principal do Electron
├── preload.js                       # Script seguro de comunicação (bridge)
├── package.json                     # Gerenciador de dependências
├── .env                             # Variáveis de ambiente (ex: API_BASE_URL)
📦 Instalação e Execução
Pré-requisitos
Node.js instalado na sua máquina

Git (opcional, para clonar diretamente)

Passo a passo
bash
Copiar
Editar
# Clone o repositório
git clone https://github.com/Evemarques07/Modelo_Electron.git

# Acesse a pasta
cd Modelo_Electron

# Instale as dependências
npm install

# Inicie o aplicativo Electron
npm start
🧱 Modelo para Novas Páginas
Você pode criar novas páginas a partir do modelo:

src/pages/html/template.html
Esse arquivo já possui:

Navbar carregada dinamicamente

Layout com .main-content-wrapper

Espaço para conteúdo com .page-container

Script e estilo isolados

📄 Basta duplicá-lo e renomear para, por exemplo, relatorios.html ou vendas.html.

🔒 Segurança
Uso de preload.js com contextBridge (evita nodeIntegration)

Política de segurança (CSP) definida no HTML

Comunicação com API backend em http://localhost:4000

🛠️ Tecnologias Utilizadas
Electron.js

HTML5 + CSS3 (com layout modular)

JavaScript (modular por página)

Fontes do Google (Poppins)

Estrutura segura com .env e preload isolado

✅ Em breve...
 Tela de edição de clientes

 Tela de produtos

 Modo dark

 Empacotamento para .exe (Electron Builder)

👨‍💻 Autor
Desenvolvido por Everton Marques
```
