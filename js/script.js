let cart = [];

// Добавляет товар в корзину
function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      name,
      price,
      quantity: 1
    });
  }

  showNotification(`Вы добавили "${name}" в корзину`);
  updateCart();

  // Симулируем движение кнопки в корзину
  const button = event.target;
  animateDrop(button);
}

// Обновляет таблицу товаров в корзине
function updateCart() {
  let totalAmount = 0;
  document.getElementById("cart-items").innerHTML = '';

  cart.forEach((item, idx) => {
    const row = `
      <tr>
        <td>${item.name}</td>
        <td>${item.price} руб.</td>
        <td>${item.quantity}</td>
        <td>${item.price * item.quantity} руб.</td>
        <td><button onclick="removeFromCart(${idx})">Удалить</button></td>
      </tr>
    `;
    document.getElementById("cart-items").insertAdjacentHTML("beforeend", row);
    totalAmount += item.price * item.quantity;
  });

  document.getElementById("total-amount").innerText = `Итого: ${totalAmount} руб.`;
}

// Убирает товар из корзины
function removeFromCart(idx) {
  cart.splice(idx, 1);
  updateCart();
}

// Эмулирует отправку заказа
function checkout() {
  alert("Ваш заказ отправлен! Спасибо за покупку.");
}

// Показывает временное уведомление
function showNotification(message) {
  const notificationEl = document.createElement('div');
  notificationEl.className = 'notification';
  notificationEl.textContent = message;
  document.body.appendChild(notificationEl);

  setTimeout(() => {
    notificationEl.remove();
  }, 3000); // Время существования уведомления — 3 секунды
}

// Анимация падения товара в корзину
function animateDrop(button, duration = 500) {
  const rect = button.getBoundingClientRect();
  const targetPosition = {
    x: rect.left + rect.width / 2,
    y: rect.bottom
  };

  const cartPosition = document.getElementById('cart').getBoundingClientRect();

  const animationDuration = duration || 500;

  requestAnimationFrame(() => {
    const now = performance.now();
    const endTime = now + animationDuration;

    const step = timestamp => {
      const progress = Math.min(timestamp - now, animationDuration) / animationDuration;
      const easingProgress = cubicBezier(progress, 0.42, 0, 0.58, 1);

      const newX = targetPosition.x + (cartPosition.left - targetPosition.x) * easingProgress;
      const newY = targetPosition.y + (cartPosition.top - targetPosition.y) * easingProgress;

      button.style.transform = `translate(${newX - rect.left}px, ${newY - rect.bottom}px)`;

      if (timestamp <= endTime) {
        requestAnimationFrame(step);
      } else {
        button.style.transform = ''; // Возвращаем позицию назад
      }
    };

    requestAnimationFrame(step);
  });
}

// Кубический бикубический сплайн для сглаживания анимации
function cubicBezier(t, m0, m1, m2, m3) {
  return ((1-t)*(1-t)*m0 + 2*(1-t)*t*m1 + t*t*m2) + t*t*(3*m3-m2-m1+m0);
}

// Настройка обработчиков события для каждого товара
document.querySelectorAll(".buy-button").forEach(btn => {
  btn.addEventListener("click", e => {
    e.stopPropagation();
    animateDrop(btn);
  });
});