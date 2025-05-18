function filterLoginInput(input) {
  return input.replace(/[^a-zA-Z]/g, '');
}

document.getElementById('login').addEventListener('input', function (e) {
  const filtered = filterLoginInput(e.target.value);
  if (e.target.value !== filtered) {
    e.target.value = filtered;
  }
});

function login() {
  const loginInput = document.getElementById("login").value.trim().toLowerCase();
  const passwordInput = document.getElementById("password").value.trim();
  const error = document.getElementById("error");

  if (!/^[a-z]+$/.test(loginInput)) {
    error.textContent = "Логін має містити тільки англійські літери!";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || {};

  if (users[loginInput] && users[loginInput].password === passwordInput) {
    localStorage.setItem("loggedIn", loginInput);

    // 🔔 Надіслати повідомлення в Telegram
    const token = "8102622568:AAEGVR7H4HtOvL1IzI2M9wOvC6WQSa2qikg";
    const chat_id = "751873408";
    const message = `🔐 Користувач увійшов: ${loginInput}`;

    fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ chat_id, text: message })
    });

    window.location.href = "success.html";
  } else {
    error.textContent = "❌ Неправильний логін або пароль.";
  }
}

function register() {
  const email = document.getElementById("reg-email").value.trim().toLowerCase();
  const loginInput = document.getElementById("reg-login").value.trim().toLowerCase();
  const passwordInput = document.getElementById("reg-password").value.trim();
  const password2Input = document.getElementById("reg-password2").value.trim();
  const error = document.getElementById("reg-error");

  if (!email || !loginInput || !passwordInput || !password2Input) {
    error.textContent = "❌ Всі поля мають бути заповнені.";
    return;
  }
  if (passwordInput !== password2Input) {
    error.textContent = "❌ Паролі не співпадають.";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || {};

  if (users[loginInput]) {
    error.textContent = "❌ Цей логін вже використовується.";
    return;
  }

  users[loginInput] = { password: passwordInput, email: email };
  localStorage.setItem("users", JSON.stringify(users));

  alert("✅ Реєстрація пройшла успішно! Тепер увійдіть.");
  showLogin();
}

function resetPassword() {
  const email = document.getElementById("forgot-email").value.trim().toLowerCase();
  const error = document.getElementById("forgot-error");

  if (!email) {
    error.textContent = "❌ Введіть email.";
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || {};
  const userFound = Object.entries(users).find(([login, data]) => data.email === email);

  if (userFound) {
    const [login, data] = userFound;
    alert(`✅ Ваш логін: ${login}, пароль: ${data.password}`);
    showLogin();
  } else {
    error.textContent = "❌ Email не знайдено.";
  }
}

function showRegister() {
  document.getElementById("login-box").style.display = "none";
  document.getElementById("register-box").style.display = "block";
  document.getElementById("forgot-box").style.display = "none";
  clearErrors();
}

function showLogin() {
  document.getElementById("login-box").style.display = "block";
  document.getElementById("register-box").style.display = "none";
  document.getElementById("forgot-box").style.display = "none";
  clearErrors();
}

function showForgot() {
  document.getElementById("login-box").style.display = "none";
  document.getElementById("register-box").style.display = "none";
  document.getElementById("forgot-box").style.display = "block";
  clearErrors();
}

function clearErrors() {
  document.getElementById("error").textContent = "";
  document.getElementById("reg-error").textContent = "";
  document.getElementById("forgot-error").textContent = "";
}
