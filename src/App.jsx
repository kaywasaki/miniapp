import { useEffect, useState } from "react";
import "./App.css";

const MENU = {
  kebab: [
    { id: 1, name: "Шаурма классик", price: 350, emoji: "🌯", desc: "Говядина, овощи, соус" },
    { id: 2, name: "Донер кебаб", price: 420, emoji: "🥙", desc: "Баранина, зелень, специи" },
    { id: 3, name: "Кебаб люля", price: 480, emoji: "🍢", desc: "Мясной фарш на углях" },
    { id: 4, name: "Шаурма XXL", price: 550, emoji: "🌯", desc: "Двойная порция, соус чесночный" },
    { id: 5, name: "Кебаб микс", price: 620, emoji: "🍖", desc: "Говядина + баранина, овощи" },
  ],
  soup: [
    { id: 6, name: "Шурпа", price: 280, emoji: "🍲", desc: "Наваристый бульон с бараниной" },
    { id: 7, name: "Лагман", price: 320, emoji: "🍜", desc: "Домашняя лапша, говядина" },
    { id: 8, name: "Харчо", price: 290, emoji: "🫕", desc: "Острый суп с рисом" },
    { id: 9, name: "Мастава", price: 260, emoji: "🍲", desc: "Узбекский суп с рисом" },
  ],
  drinks: [
    { id: 10, name: "Айран", price: 120, emoji: "🥛", desc: "Освежающий кисломолочный" },
    { id: 11, name: "Чай зелёный", price: 90, emoji: "🍵", desc: "С мятой и лимоном" },
    { id: 12, name: "Кола", price: 100, emoji: "🥤", desc: "0.5л холодная" },
    { id: 13, name: "Свежевыжатый сок", price: 200, emoji: "🧃", desc: "Апельсин / гранат / яблоко" },
    { id: 14, name: "Вода газ/без газ", price: 60, emoji: "💧", desc: "0.5л" },
  ],
};

const TABS = [
  { key: "kebab", label: "Кебаб", emoji: "🥙" },
  { key: "soup", label: "Супы", emoji: "🍲" },
  { key: "drinks", label: "Напитки", emoji: "🥤" },
  { key: "cart", label: "Корзина", emoji: "🛒" },
];

function App() {
  const [activeTab, setActiveTab] = useState("kebab");
  const [cart, setCart] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderForm, setOrderForm] = useState({ name: "", phone: "", address: "", comment: "" });
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [user, setUser] = useState(null);
  const [animating, setAnimating] = useState(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.expand();
      tg.setHeaderColor("#1a0a00");
      setUser(tg.initDataUnsafe?.user);
    }
  }, []);

  const totalItems = Object.values(cart).reduce((s, v) => s + v, 0);
  const totalPrice = Object.entries(cart).reduce((s, [id, qty]) => {
    const item = Object.values(MENU).flat().find((m) => m.id === +id);
    return s + (item ? item.price * qty : 0);
  }, 0);

  const addToCart = (item) => {
    setCart((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
    setAnimating(item.id);
    setTimeout(() => setAnimating(null), 400);
  };

  const removeFromCart = (item) => {
    setCart((prev) => {
      const next = { ...prev };
      if (next[item.id] > 1) next[item.id]--;
      else delete next[item.id];
      return next;
    });
  };

  const clearCart = () => setCart({});

  const placeOrder = (e) => {
    e.preventDefault();
    setOrderPlaced(true);
    setShowOrderForm(false);
    setCart({});
    const tg = window.Telegram?.WebApp;
    if (tg) tg.showAlert("✅ Заказ принят! Ожидайте доставку.");
  };

  const cartItems = Object.entries(cart)
    .map(([id, qty]) => {
      const item = Object.values(MENU).flat().find((m) => m.id === +id);
      return item ? { ...item, qty } : null;
    })
    .filter(Boolean);

  if (orderPlaced) {
    return (
      <div className="app">
        <div className="order-success">
          <div className="success-icon">✅</div>
          <h2>Заказ принят!</h2>
          <p>Мы начали готовить ваш заказ.<br />Ожидайте доставку в течение 40–60 минут.</p>
          <button className="btn-primary" onClick={() => { setOrderPlaced(false); setActiveTab("kebab"); }}>
            Сделать новый заказ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <div className="header-logo">🔥 KebabHouse</div>
        <div className="header-sub">{user ? `Привет, ${user.first_name}!` : "Лучший кебаб в городе"}</div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`tab-btn ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="tab-emoji">{tab.emoji}</span>
            <span className="tab-label">{tab.label}</span>
            {tab.key === "cart" && totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="content">
        {/* Menu Sections */}
        {(activeTab === "kebab" || activeTab === "soup" || activeTab === "drinks") && (
          <div className="menu-list">
            <div className="section-title">
              {TABS.find((t) => t.key === activeTab)?.emoji}{" "}
              {activeTab === "kebab" ? "Кебаб и шаурма" : activeTab === "soup" ? "Первые блюда" : "Напитки"}
            </div>
            {MENU[activeTab].map((item) => (
              <div key={item.id} className={`menu-card ${animating === item.id ? "pop" : ""}`}>
                <div className="menu-emoji">{item.emoji}</div>
                <div className="menu-info">
                  <div className="menu-name">{item.name}</div>
                  <div className="menu-desc">{item.desc}</div>
                  <div className="menu-price">{item.price} ₽</div>
                </div>
                <div className="menu-actions">
                  {cart[item.id] ? (
                    <div className="qty-control">
                      <button className="qty-btn minus" onClick={() => removeFromCart(item)}>−</button>
                      <span className="qty-num">{cart[item.id]}</span>
                      <button className="qty-btn plus" onClick={() => addToCart(item)}>+</button>
                    </div>
                  ) : (
                    <button className="add-btn" onClick={() => addToCart(item)}>+ Добавить</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cart Section */}
        {activeTab === "cart" && (
          <div className="cart-section">
            <div className="section-title">🛒 Корзина</div>
            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-icon">🛒</div>
                <p>Корзина пуста</p>
                <button className="btn-secondary" onClick={() => setActiveTab("kebab")}>
                  Перейти к меню
                </button>
              </div>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-emoji">{item.emoji}</div>
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-price">{item.price} ₽ × {item.qty}</div>
                    </div>
                    <div className="cart-item-controls">
                      <div className="qty-control">
                        <button className="qty-btn minus" onClick={() => removeFromCart(item)}>−</button>
                        <span className="qty-num">{item.qty}</span>
                        <button className="qty-btn plus" onClick={() => addToCart(item)}>+</button>
                      </div>
                      <div className="cart-item-total">{item.price * item.qty} ₽</div>
                    </div>
                  </div>
                ))}

                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Позиций:</span>
                    <span>{totalItems} шт.</span>
                  </div>
                  <div className="summary-row total">
                    <span>Итого:</span>
                    <span>{totalPrice} ₽</span>
                  </div>
                </div>

                <div className="cart-actions">
                  <button className="btn-ghost" onClick={clearCart}>Очистить</button>
                  <button className="btn-primary" onClick={() => setShowOrderForm(true)}>
                    Оформить заказ →
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Order Form Modal */}
      {showOrderForm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowOrderForm(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>📦 Оформление заказа</h3>
              <button className="modal-close" onClick={() => setShowOrderForm(false)}>✕</button>
            </div>
            <div className="order-summary-mini">
              <span>Ваш заказ: {totalItems} позиций</span>
              <span className="order-total-mini">{totalPrice} ₽</span>
            </div>
            <form onSubmit={placeOrder} className="order-form">
              <div className="form-group">
                <label>Ваше имя</label>
                <input
                  type="text"
                  placeholder="Введите имя"
                  value={orderForm.name}
                  onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Телефон</label>
                <input
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={orderForm.phone}
                  onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Адрес доставки</label>
                <input
                  type="text"
                  placeholder="Улица, дом, квартира"
                  value={orderForm.address}
                  onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Комментарий (необязательно)</label>
                <textarea
                  placeholder="Пожелания к заказу..."
                  value={orderForm.comment}
                  onChange={(e) => setOrderForm({ ...orderForm, comment: e.target.value })}
                  rows={2}
                />
              </div>
              <button type="submit" className="btn-primary full-width">
                🔥 Подтвердить заказ — {totalPrice} ₽
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating cart button */}
      {totalItems > 0 && activeTab !== "cart" && (
        <button className="floating-cart" onClick={() => setActiveTab("cart")}>
          🛒 Корзина · {totalItems} · {totalPrice} ₽
        </button>
      )}
    </div>
  );
}

export default App;