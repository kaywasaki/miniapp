import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (!tg) {
      console.log("Открой через Telegram ❗");
      return;
    }

    tg.expand();

    const userData = tg.initDataUnsafe?.user;

    if (userData) {
      setUser(userData);
    }

    tg.MainButton.setText("🚀 Click me");
    tg.MainButton.show();

    tg.MainButton.onClick(() => {
      tg.showAlert("Ты нажал кнопку 😎");
    });

  }, []);

  return (
    <div className="app">
      <h1>Telegram Mini App 🚀</h1>

      {user ? (
        <div>
          <p>👤 {user.first_name}</p>
          <p>🆔 {user.id}</p>
          <p>📛 @{user.username || "no_username"}</p>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      ) : (
        <p>Загружаем пользователя...</p>

      )}

      <button
        onClick={() => {
          window.Telegram.WebApp.showAlert("Это кнопка внутри сайта");
        }}
      >
        Нажми меня
      </button>
    </div>
  );
}

export default App;