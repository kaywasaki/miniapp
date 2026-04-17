import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [clicks, setClicks] = useState(0); // Количество монет
  const [lvl, setLvl] = useState(1); // Уровень прокачки

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.expand();
      setUser(tg.initDataUnsafe?.user);

      // Настраиваем главную кнопку TG как кнопку "Upgrade"
      tg.MainButton.setText(`Прокачать уровень (Цена: ${lvl * 10})`);
      tg.MainButton.show();

      tg.MainButton.onClick(() => {
        upgradeLvl();
      });
    }
  }, [lvl]); // Обновляем кнопку при изменении уровня

  const addClick = () => {
    setClicks(clicks + lvl); // Прирост зависит от уровня
    window.Telegram?.WebApp.HapticFeedback.impactOccurred("medium"); // Вибрация при клике
  };

  const upgradeLvl = () => {
    const price = lvl * 10;
    if (clicks >= price) {
      setClicks(clicks - price);
      setLvl(lvl + 1);
      window.Telegram?.WebApp.showAlert("Уровень повышен! 🚀");
    } else {
      window.Telegram?.WebApp.showAlert("Не хватает монет! 🪙");
    }
  };

  return (
    <div className="app">
      <div className="header">
        <span>👤 {user?.first_name || "Player"}</span>
        <span>🏆 LVL: {lvl}</span>
      </div>

      <div className="score-section">
        <h1 className="score">🪙 {clicks}</h1>
        <p>Монет за клик: {lvl}</p>
      </div>

      <div className="hamster-container">
        {/* Вместо картинки можно вставить эмодзи или фото хомяка */}
        <div className="hamster-circle" onClick={addClick}>
          🐹
        </div>
      </div>

      <button className="click-btn" onClick={addClick}>
        ТАПАЙ!
      </button>
    </div>
  );
}

export default App;