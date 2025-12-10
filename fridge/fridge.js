document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search');
  const foodList = document.getElementById('food-list');

  const confirmFridgeDeleteModal = document.getElementById('confirmFridgeDeleteModal');
  const confirmFridgeDeleteText  = document.getElementById('confirmFridgeDeleteText');
  const confirmFridgeDeleteBtn   = document.getElementById('confirmFridgeDelete');
  const cancelFridgeDeleteBtn    = document.getElementById('cancelFridgeDelete');

  let pendingDeleteCard = null;

  
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
      // Remember which card we want to delete
      pendingDeleteCard = card;

      // Use the card name in the message, like the grocery tab
      const name = card.dataset.name || card.querySelector('h3')?.textContent || 'this item';
      confirmFridgeDeleteText.textContent =
        `Are you sure you want to remove "${name}" from your fridge?`;

      // Show in-app confirmation dialog
      confirmFridgeDeleteModal.showModal();


    });

    confirmFridgeDeleteBtn.addEventListener('click', () => {
      if (pendingDeleteCard) {
        pendingDeleteCard.remove();
        pendingDeleteCard = null;
        searchInput.value = '';
        applyFilters();
      }
      confirmFridgeDeleteModal.close();
    });
  
    cancelFridgeDeleteBtn.addEventListener('click', () => {
      pendingDeleteCard = null;
      confirmFridgeDeleteModal.close();
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