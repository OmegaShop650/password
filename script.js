function filterLoginInput(input) {
  return input.replace(/[^a-zA-Z]/g, '');
}

document.getElementById('login').addEventListener('input', function (e) {
  const filtered = filterLoginInput(e.target.value);
  if (e.target.value !== filtered) {
    e.target.value = filtered;
  }
});
// Google OAuth callback
function handleCredentialResponse(response) {
  const id_token = response.credential;
  console.log("Google ID Token:", id_token);
  alert("✅ Успішний вхід через Google!");
  window.location.href = "success.html";
}

// Інші твої функції (login, register, showLogin, showRegister тощо)

function login() {
  const loginInput = document.getElementById("login").value.trim().toLowerCase();
  const passwordInput = document.getElementById("password").value.trim();
  const error = document.getElementById("error");

  if (!/^[a-z]+$/.test(loginInput)) {
    error.textContent = "Логін має містити лише англійські літери!";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || {};

  if (users[loginInput] && users[loginInput].password === passwordInput) {
    localStorage.setItem("loggedIn", loginInput);

    const token = "8102622568:AAEGVR7H4HtOvL1IzI2M9wOvC6WQSa2qikg";
    const chat_id = "751873408";
    const message = `🔐 Користувач увійшов: ${loginInput}`;

    fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id, text: message })
    });

    window.location.href = "success.html";
  } else {
    error.textContent = "❌ Невірний логін або пароль.";
  }
}

function register() {
  const loginInput = document.getElementById("reg-login").value.trim().toLowerCase();
  const passwordInput = document.getElementById("reg-password").value.trim();
  const password2Input = document.getElementById("reg-password2").value.trim();
  const emailInput = document.getElementById("reg-email").value.trim().toLowerCase();
  const error = document.getElementById("reg-error");

  if (!loginInput || !passwordInput || !password2Input || !emailInput) {
    error.textContent = "❌ Усі поля мають бути заповнені.";
    return;
  }

  if (passwordInput !== password2Input) {
    error.textContent = "❌ Паролі не співпадають.";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || {};

  if (users[loginInput]) {
    error.textContent = "❌ Логін вже зайнятий.";
    return;
  }

  users[loginInput] = {
    password: passwordInput,
    email: emailInput
  };
  localStorage.setItem("users", JSON.stringify(users));

  alert("✅ Реєстрація успішна! Увійдіть.");
  showLogin();
}

function resetPassword() {
  const email = document.getElementById("reset-email").value.trim().toLowerCase();
  const error = document.getElementById("reset-error");
  const users = JSON.parse(localStorage.getItem("users")) || {};

  let found = false;

  for (let login in users) {
    if (users[login].email === email) {
      const newPassword = prompt("Введіть новий пароль:");
      if (newPassword) {
        users[login].password = newPassword;
        localStorage.setItem("users", JSON.stringify(users));
        alert("✅ Пароль змінено. Тепер увійдіть.");
        showLogin();
      }
      found = true;
      break;
    }
  }

  if (!found) {
    error.textContent = "❌ Користувача з такою поштою не знайдено.";
  }
}

function showRegister() {
  document.getElementById("login-box").style.display = "none";
  document.getElementById("register-box").style.display = "block";
  document.getElementById("reset-box").style.display = "none";
  clearErrors();
}

function showLogin() {
  document.getElementById("login-box").style.display = "block";
  document.getElementById("register-box").style.display = "none";
  document.getElementById("reset-box").style.display = "none";
  clearErrors();
}

function showResetForm() {
  document.getElementById("login-box").style.display = "none";
  document.getElementById("register-box").style.display = "none";
  document.getElementById("reset-box").style.display = "block";
  clearErrors();
}

function clearErrors() {
  document.getElementById("error").textContent = "";
  document.getElementById("reg-error").textContent = "";
  document.getElementById("reset-error").textContent = "";
}

