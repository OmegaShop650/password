// Фільтрація логіна
function filterLoginInput(input) {
  return input.replace(/[^a-zA-Z]/g, '');
}
document.getElementById('login').addEventListener('input', function (e) {
  const filtered = filterLoginInput(e.target.value);
  if (e.target.value !== filtered) {
    e.target.value = filtered;
  }
});

// Вхід
function login() {
  const loginInput = document.getElementById("login").value.trim().toLowerCase();
  const passwordInput = document.getElementById("password").value.trim();
  const error = document.getElementById("error");

  if (!/^[a-z]+$/.test(loginInput)) {
    error.textContent = "Логін має містити тільки англійські літери!";
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || {};

  if (users[loginInput] && users[loginInput].password === passwordInput) {
    localStorage.setItem("loggedIn", loginInput);

    // Надсилання повідомлення в Telegram
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
    error.textContent = "❌ Неправильний логін або пароль.";
  }
}

// Реєстрація
function register() {
  const email = document.getElementById("reg-email").value.trim().toLowerCase();
  const login = document.getElementById("reg-login").value.trim().toLowerCase();
  const pass = document.getElementById("reg-password").value.trim();
  const pass2 = document.getElementById("reg-password2").value.trim();
  const error = document.getElementById("reg-error");

  if (!email || !login || !pass || !pass2) {
    error.textContent = "❌ Всі поля мають бути заповнені.";
    return;
  }
  if (pass !== pass2) {
    error.textContent = "❌ Паролі не співпадають.";
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || {};

  if (users[login]) {
    error.textContent = "❌ Цей логін вже використовується.";
    return;
  }

  users[login] = { password: pass, email: email };
  localStorage.setItem("users", JSON.stringify(users));

  alert("✅ Реєстрація пройшла успішно!");
  showLogin();
}

// Відновлення пароля
function resetPassword() {
  const emailInput = document.getElementById("reset-email").value.trim().toLowerCase();
  const newPassword = document.getElementById("reset-password").value.trim();
  const error = document.getElementById("reset-error");

  if (!emailInput || !newPassword) {
    error.textContent = "❌ Введіть email і новий пароль.";
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || {};
  let found = false;

  for (let user in users) {
    if (users[user].email === emailInput) {
      users[user].password = newPassword;
      found = true;
      break;
    }
  }

  if (found) {
    localStorage.setItem("users", JSON.stringify(users));
    alert("✅ Пароль оновлено. Тепер увійдіть.");
    showLogin();
  } else {
    error.textContent = "❌ Користувача з таким email не знайдено.";
  }
}

// Перемикання форм
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
function showReset() {
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
