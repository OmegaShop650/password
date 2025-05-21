function filterLoginInput(input) {
  return input.replace(/[^a-zA-Z]/g, '');
}

document.getElementById('login').addEventListener('input', function (e) {
  const filtered = filterLoginInput(e.target.value);
  if (e.target.value !== filtered) {
    e.target.value = filtered;
  }
});

function handleCredentialResponse(response) {
  try {
    const token = response.credential;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const name = payload.name || "Користувач";
    document.getElementById("status").innerText = `Вхід як ${name}`;
    localStorage.setItem('loggedInGoogleToken', token);

    history.replaceState(null, null, window.location.pathname);

    window.location.href = "success.html";
  } catch (e) {
    document.getElementById("status").innerText = "Помилка при вході через Google.";
  }
}



function login() {
  const loginInput = document.getElementById("login").value.trim().toLowerCase();
  const passwordInput = document.getElementById("password").value.trim();
  const error = document.getElementById("error");

  if (!/^[a-z]+$/.test(loginInput)) {
    error.textContent = "Логін має містити тільки англійські літери!";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || {};

  if (users[loginInput] && users[loginInput] === passwordInput) {
    localStorage.setItem("loggedIn", loginInput);

    const token = "8102622568:AAEGVR7H4HtOvL1IzI2M9wOvC6WQSa2qikg";
    const chat_id = "751873408";
    const message = `🔐 Користувач увійшов: ${loginInput}`;

    fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chat_id, text: message })
    });

    window.location.href = "success.html";
  } else {
    error.textContent = "❌ Неправильний логін або пароль.";
  }
}

function register() {
  const loginInput = document.getElementById("reg-login").value.trim().toLowerCase();
  const passwordInput = document.getElementById("reg-password").value.trim();
  const password2Input = document.getElementById("reg-password2").value.trim();
  const emailInput = document.getElementById("reg-email").value.trim();
  const error = document.getElementById("reg-error");

  if (!loginInput || !passwordInput || !password2Input || !emailInput) {
    error.textContent = "❌ Всі поля мають бути заповнені.";
    return;
  }

  if (!validateEmail(emailInput)) {
    error.textContent = "❌ Введіть коректний Email.";
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

  users[loginInput] = { password: passwordInput, email: emailInput };
  localStorage.setItem("users", JSON.stringify(users));

  alert("✅ Реєстрація пройшла успішно! Тепер увійдіть.");
  showLogin();
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showRegister(event) {
  if (event) event.preventDefault();
  document.getElementById("login-box").style.display = "none";
  document.getElementById("register-box").style.display = "block";
  clearErrors();
}

function showLogin(event) {
  if (event) event.preventDefault();
  document.getElementById("login-box").style.display = "block";
  document.getElementById("register-box").style.display = "none";
  clearErrors();
}

function clearErrors() {
  document.getElementById("error").textContent = "";
  document.getElementById("reg-error").textContent = "";
}
