const id = new URLSearchParams(location.search).get('id') || 'eqe-suv';
const car = CARS.find((item) => item.id === id) || CARS[0];
const root = document.getElementById('car-root');
if (!root) throw new Error('car-root missing');
document.title = `${car.name} | АвтоХаус Шелковый путь`;

root.innerHTML = `
  <section class="page-hero">
    <div class="container">
      <p class="kicker"><a href="catalog.html">Каталог</a> · ${car.year}</p>
      <h1>${car.name}</h1>
      <p class="lead">${car.lead}</p>
    </div>
  </section>
  <section class="section car-page">
    <div class="container car-layout">
      <figure class="car-shot">
        <img src="${car.image}" alt="${car.name}">
      </figure>
      <aside class="car-panel">
        <p class="pill">${car.stock === 'in' ? 'В наличии' : 'Под заказ'}</p>
        <p class="note">Цена — по рынку Китая на день разговора. Ниже ориентиры по машине.</p>
        <div class="spec-list">
          <div><span>Тип</span><b>${car.fuel}</b></div>
          <div><span>Привод</span><b>${car.drive}</b></div>
          <div><span>Запас хода</span><b>${car.range}</b></div>
          <div><span>Мощность</span><b>${car.power}</b></div>
          <div><span>Батарея</span><b>${car.battery}</b></div>
          <div><span>Макс. скорость</span><b>${car.speed}</b></div>
          <div><span>Салон</span><b>${car.interior}</b></div>
          <div><span>Цвет</span><b>${car.color}</b></div>
        </div>
        <form class="form" id="quote-form">
          <div class="ok" id="form-ok" role="status">Заявка принята. Перезвоним или ждём вас в салоне на Тимирязева, 122.</div>
          <input type="hidden" name="model" value="${car.name}">
          <label>Телефон
            <input name="phone" id="phone" required inputmode="numeric" autocomplete="tel" placeholder="(29) 000-00-00">
          </label>
          <label>Как к вам можно обращаться
            <input name="name" required minlength="2" autocomplete="name" placeholder="Имя">
          </label>
          <button class="btn" type="submit">Запросить расчет</button>
          <p class="note">Или приезжайте сами: Минск, ул. Тимирязева, 122, пом. 76, ЖК Олимпик Парк. <a href="tel:+375292202020">+375 29 220 20 20</a></p>
        </form>
      </aside>
    </div>
  </section>
`;
