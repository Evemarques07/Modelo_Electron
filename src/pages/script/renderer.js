window.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm"); // Pegar o formulário
  const loginBtn = document.getElementById("loginBtn");
  const erro = document.getElementById("erro");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("senha");
  const rememberMeCheckbox = document.getElementById("rememberMe");
  const togglePasswordBtn = document.getElementById("togglePassword");
  const eyeOpenIcon = document.getElementById("eye-open");
  const eyeClosedIcon = document.getElementById("eye-closed");

  let passwordLoadedFromStorage = false;

  // Carregar credenciais salvas
  const savedEmail = localStorage.getItem("rememberedEmail");
  const savedPassword = localStorage.getItem("rememberedPassword"); // CUIDADO: Salvar senha em localStorage é conveniente mas tem riscos de segurança.

  if (savedEmail) {
    emailInput.value = savedEmail;
    rememberMeCheckbox.checked = true; // Se tem email, provavelmente tinha "lembrar-me"
  }
  if (savedPassword && savedEmail) { // Só carrega senha se email também foi salvo
    passwordInput.value = savedPassword;
    passwordLoadedFromStorage = true;
    togglePasswordBtn.disabled = true; // Desabilita olho se senha foi carregada
    eyeOpenIcon.style.opacity = "0.5"; // Visualmente indica desabilitado
    eyeClosedIcon.style.opacity = "0.5";
  } else {
    togglePasswordBtn.disabled = false;
    passwordLoadedFromStorage = false;
  }

  // Event listener para o botão de mostrar/ocultar senha
  togglePasswordBtn.addEventListener("click", () => {
    if (togglePasswordBtn.disabled) return;

    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);

    if (type === "password") {
      eyeOpenIcon.style.display = "inline-block";
      eyeClosedIcon.style.display = "none";
      togglePasswordBtn.setAttribute("aria-label", "Mostrar senha");
    } else {
      eyeOpenIcon.style.display = "none";
      eyeClosedIcon.style.display = "inline-block";
      togglePasswordBtn.setAttribute("aria-label", "Ocultar senha");
    }
  });

  // Se o usuário começar a digitar na senha (e ela foi carregada), habilita o olho
  passwordInput.addEventListener('input', () => {
    if (passwordLoadedFromStorage && passwordInput.value !== savedPassword) {
        // Se o valor mudar do que foi carregado, considera que não é mais a senha "salva" intocada
        passwordLoadedFromStorage = false;
        togglePasswordBtn.disabled = false;
        eyeOpenIcon.style.opacity = "1";
        eyeClosedIcon.style.opacity = "1";
    } else if (!passwordLoadedFromStorage && passwordInput.value === "" && savedPassword && emailInput.value === savedEmail) {
        // Se o campo for limpo e as credenciais salvas ainda corresponderem, re-desabilita
        passwordLoadedFromStorage = true;
        togglePasswordBtn.disabled = true;
        eyeOpenIcon.style.opacity = "0.5";
        eyeClosedIcon.style.opacity = "0.5";
    } else if (passwordInput.value === "") {
        // Se o campo estiver vazio e não havia senha carregada, garante que o olho esteja habilitado
        togglePasswordBtn.disabled = false;
        eyeOpenIcon.style.opacity = "1";
        eyeClosedIcon.style.opacity = "1";
    }
  });


  // Event listener para o submit do formulário
  loginForm.addEventListener("submit", async (event) => { // Alterado para 'submit' no form
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    erro.style.display = "none";
    erro.textContent = "";


    if (!email || !password) {
      erro.textContent = "Preencha todos os campos.";
      erro.style.display = "block";
      console.warn("⚠️ Campos vazios no formulário.");
      return;
    }

    // Simular delay da API e desabilitar botão para evitar múltiplos cliques
    loginBtn.disabled = true;
    loginBtn.textContent = "Entrando...";

    try {
      // A chamada original era: const result = await window.api.loginUsuario(email, password);
      // Vou manter a estrutura que você tinha antes, com um objeto:
      const result = await window.api.loginUsuario( email, password );

      if (result?.sucesso) { // Usando 'sucesso' e 'mensagem' conforme seu código anterior
        sessionStorage.setItem("authToken", result.token);

        if (rememberMeCheckbox.checked) {
          localStorage.setItem("rememberedEmail", email);
          localStorage.setItem("rememberedPassword", password); // Novamente, CUIDADO com isso.
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
        }
        window.location.href = "pages/html/home.html";
      } else {
        console.warn("❌ Login inválido:", result?.mensagem);
        erro.textContent = result?.mensagem || "Email ou senha inválidos.";
        erro.style.display = "block";
      }
    } catch (err) {
      console.error("❌ Erro durante o login:", err);
      erro.textContent = err.message || "Erro na requisição. Verifique sua conexão ou tente novamente.";
      erro.style.display = "block";
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = "Entrar";
    }
  });
});