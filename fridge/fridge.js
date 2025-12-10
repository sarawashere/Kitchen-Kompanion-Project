document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const foodList = document.getElementById('food-list');
    function getCards() {
      return Array.from(document.querySelectorAll('.food-card'));
    }
    function applyFilters() {
      const q = (searchInput.value || '').trim().toLowerCase();
      getCards().forEach(card => {
        const name = card.dataset.name.toLowerCase();
        card.style.display = name.includes(q) ? '' : 'none';
      });
    }
    searchInput.addEventListener('input', applyFilters);

    // Quantity counters
    function attachCardEvents(card) {
      const decBtn = card.querySelector('.dec-btn');
      const incBtn = card.querySelector('.inc-btn');
      const qtySpan = card.querySelector('.quantity');
      const info = card.querySelector('.info');

      const removeBtn = document.createElement('button');
      removeBtn.className='remove-btn';
      removeBtn.textContent='x';
      removeBtn.title='Remove item';
      info.appendChild(removeBtn);

      decBtn.addEventListener('click', () => {
          let quantity = parseInt(qtySpan.textContent)||0;
          if (quantity > 0) {
            quantity--;
            qtySpan.textContent = quantity;
          }
      });
      
      incBtn.addEventListener('click', () => {
            let quantity = parseInt(qtySpan.textContent)||0;
            quantity++;
            qtySpan.textContent = quantity;
      });
      removeBtn.addEventListener('click', () => {
            card.remove();
            searchInput.value = '';
            applyFilters();
      });
    }

    getCards().forEach(attachCardEvents);
    const addFoodBtn = document.getElementById('addFoodBtn');
    const addModal = document.getElementById('addFoodModal');
    const foodNameInput = document.getElementById('foodName');
    const foodQtyInput = document.getElementById('foodQuantity');
    const saveFoodBtn = document.getElementById('saveFood');
    const cancelFoodBtn = document.getElementById('cancelBtn');

    addFoodBtn.addEventListener('click', () => {
      addModal.showModal();
      foodNameInput.focus();
    } );

    cancelFoodBtn.addEventListener('click', () => {
      addModal.close();
    });

    saveFoodBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const name = foodNameInput.value.trim();
      const quantity = parseInt(foodQtyInput.value)||1;

      if (!name) {
        return;
      }
      
      const newCard = document.createElement('article');
      newCard.className = 'food-card';
      newCard.dataset.name = name;

      newCard.innerHTML = `
        <div class="info">
          <h3>${name}</h3>
          <div class="counter">
            <button class="dec-btn" aria-label="Decrease quantity">-</button>
            <span class="quantity">${quantity}</span>
            <button class="inc-btn" aria-label="Increase quantity">+</button>
          </div>
        </div>
      `;
      foodList.prepend(newCard);
      attachCardEvents(newCard);
      addModal.close();
      foodNameInput.value = '';
      foodQtyInput.value = '1';
    });
    
  } );