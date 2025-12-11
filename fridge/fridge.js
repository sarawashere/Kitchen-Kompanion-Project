// const { get } = require("express/lib/response");

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search');
  const foodList = document.getElementById('food-list');

  const emptyFridgeMessage = document.getElementById('emptyFridgeMessage');
  const noSearchResultsMessage = document.getElementById('noSearchResultsMessage');
  const clearSearchBtn = document.getElementById('clearSearch');
  const searchwr = document.querySelector('.search-wr');
  const confirmFridgeDeleteModal = document.getElementById('confirmFridgeDeleteModal');
  const confirmFridgeDeleteText  = document.getElementById('confirmFridgeDeleteText');
  const confirmFridgeDeleteBtn   = document.getElementById('confirmFridgeDelete');
  const cancelFridgeDeleteBtn    = document.getElementById('cancelFridgeDelete');
    
  const expiryInput=document.getElementById('expiryDate');
  
  const addFoodBtn=document.getElementById('addFoodBtn');
  const addModal=document.getElementById('addFoodModal');
  const foodNameInput=document.getElementById('foodName');
  const foodQtyInput=document.getElementById('foodQuantity');
  const saveFoodBtn=document.getElementById('saveFood');
  const cancelFoodBtn=document.getElementById('cancelBtn');
    
  const unitSelect=document.getElementById('unitSelect');
  const otherWrapper=document.getElementById('otherUnitWrapper');
  const otherUnitInput=document.getElementById('otherUnitInput');

  unitSelect.addEventListener('change',()=>{
    if(unitSelect.value==='other'){
      otherWrapper.style.display='block';
      otherUnitInput.required=true;
      otherUnitInput.focus();
    } else {
      otherWrapper.style.display='none';
      otherUnitInput.required=false;
      otherUnitInput.value='';
    }
  });

  let pendingDeleteCard = null;

  const STORAGE_KEY = 'fridgeFoodItems';

  function loadFood(){
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error loading food items from localStorage', e);
      return [];
    }
  }

  function saveFood(items){
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  let foodItems = loadFood();
  let editCard=null;
  let editIndex=null;

  const modalTitle=document.querySelector('#addFoodModal h2');
  function resetForm(){
    foodNameInput.value='';
    foodQtyInput.value='1';
    unitSelect.value='';
    otherWrapper.style.display='none';
    otherUnitInput.value='';
    expiryInput.value='';
    modalTitle.textContent='Add Food Item';
    editCard=null;
    editIndex=null;
  }

  function getCards() {
    return Array.from(document.querySelectorAll('.food-card'));
  }
  function updateEmpty(){
    const cards=getCards();
    const hasItems= cards.length>0;
    const query=(searchInput.value||'').trim().toLowerCase();
    const anyVisible= cards.some(card=> card.style.display !=='none');

    emptyFridgeMessage.hidden=true;
    noSearchResultsMessage.hidden=true;

    if(!hasItems){
      emptyFridgeMessage.hidden=false;
    } else if(hasItems && !anyVisible){
      noSearchResultsMessage.textContent=`No matching food items found for "${query}".`;
      noSearchResultsMessage.hidden=false;
    }
  }
  function applyFilters() {
    const q = (searchInput.value || '').trim().toLowerCase();
    const cards=getCards();
    cards.forEach(card => {
      const name = card.dataset.name.toLowerCase();
      card.style.display = name.includes(q) ? '' : 'none';
    });
    updateEmpty();
  }
  searchInput.addEventListener('input', () => {
    applyFilters();
  });
  clearSearchBtn.addEventListener('click',()=>{
    searchInput.value='';
    applyFilters();
    clearSearchBtn.hidden=true;
    searchInput.focus();
  });
  searchInput.addEventListener('focus',()=>{
    searchwr.classList.add('active');
  });
  searchInput.addEventListener('blur',()=>{
    searchwr.classList.remove('active');
  });

  function updateFoodItems(card,quantity){
    const name = card.dataset.name;
    const existingItem = foodItems.find(item => item.name === name);
    if(existingItem){
      existingItem.quantity = quantity;
      saveFood(foodItems);
    }
  }

  function removeFoodItem(card){
    const name = card.dataset.name;
    foodItems = foodItems.filter(item => item.name !== name);
    saveFood(foodItems);
  }

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
    removeBtn.type='button';
    info.appendChild(removeBtn);

    decBtn.addEventListener('click', () => {
        let quantity = parseInt(qtySpan.textContent)||0;
        if (quantity > 0) {
          quantity--;
          qtySpan.textContent = quantity;
          updateFoodItems(card,quantity);
        }
    });
    
    incBtn.addEventListener('click', () => {
          let quantity = parseInt(qtySpan.textContent)||0;
          quantity++;
          qtySpan.textContent = quantity;
          updateFoodItems(card,quantity);
    });
    removeBtn.addEventListener('click', () => {
      pendingDeleteCard = card;
      const name = card.dataset.name || card.querySelector('h3')?.textContent || 'this item';
      confirmFridgeDeleteText.textContent =
        `Are you sure you want to remove "${name}" from your fridge?`;
      confirmFridgeDeleteModal.showModal();
    });

    const editBtn = card.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => {
      const name = card.dataset.name;
      const quantity = parseInt(card.querySelector('.quantity').textContent)||1;
      const unit = card.dataset.unit||'';
      const expiry = card.dataset.expiry||'';
      editIndex= foodItems.findIndex(item => item.name === name 
        && item.quantity === quantity
        && item.unit === unit
        && item.expiry === expiry);
      editCard=card;
      modalTitle.textContent='Edit Food Item';
      foodNameInput.value=name;
      foodQtyInput.value=quantity;

      const optionsthere=Array.from(unitSelect.options).some(opt=>opt.value===unit);
      if(optionsthere && unit!=='other'){
        unitSelect.value=unit;
        otherWrapper.style.display='none';
        otherUnitInput.value='';
      } else if(unit){
        unitSelect.value='other';
        otherWrapper.style.display='block';
        otherUnitInput.value=unit;
      } else {
        unitSelect.value='';
        otherWrapper.style.display='none';
        otherUnitInput.value='';
      }
      expiryInput.value=expiry;

      addModal.showModal();
      foodNameInput.focus();
    });
  }

  confirmFridgeDeleteBtn.addEventListener('click', () => {
      if (pendingDeleteCard) {
        removeFoodItem(pendingDeleteCard);
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
  

  addFoodBtn.addEventListener('click', () => {
    resetForm();
    modalTitle.textContent='Add Food Item';
    addModal.showModal();
    foodNameInput.focus();
  });

  cancelFoodBtn.addEventListener('click', () => {
    addModal.close();
  });

  function expirDateLabel(dateval){
    if(!dateval) return '';
    const now = new Date(dateval);
    if(Number.isNaN(now.getTime())) return dateval;
    return now.toLocaleDateString(undefined,{month:'short',day:'numeric'});
  }
  function makeFoodCard(name,quantity,unit,expiry){
    const card = document.createElement('article');
    card.className = 'food-card';
    card.dataset.name = name;
    card.dataset.unit=unit||'';
    card.dataset.expiry=expiry||'';

    const expLabel= expirDateLabel(card.dataset.expiry);

    card.innerHTML = `
      <div class="info">
        <h3>${name}</h3>
        <p class="expiry">${expLabel ? `Expires: ${expLabel}` : ''}</p>
      <div class="controls">
        <div class="counter">
          <button class="dec-btn" type="button" aria-label="Decrease quantity">-</button>
          <span class="quantity">${quantity}</span>
          <span class="unit">${unit}</span>
          <button class="inc-btn" type="button" aria-label="Increase quantity">+</button>
        </div>
        <button class="edit-btn" type="button" title="Edit item">Edit</button>
        </div>
      </div>
    `;
    attachCardEvents(card);
    return card;
  }

  if(foodItems.length>0){
    foodItems.forEach(item=>{
      const card = makeFoodCard(item.name,item.quantity,item.unit,item.expiry);
      foodList.appendChild(card);
    });
  } else {
    getCards().forEach(card=>{
      const name = card.dataset.name||card.querySelector('h3').textContent;
      const quantity = parseInt(card.querySelector('.quantity').textContent)||1;
      if(name){
        foodItems.push({name,quantity,unit:card.dataset.unit||'',expiry:card.dataset.expiry||''});
      }
      attachCardEvents(card);
    });
    saveFood(foodItems);
  }
    saveFoodBtn.addEventListener('click',(e)=>{
      e.preventDefault();
      const name=foodNameInput.value.trim();
      const quantity=parseInt(foodQtyInput.value)||1;

      let unit=unitSelect.value==='other' ? otherUnitInput.value.trim() : unitSelect.value;
      const expiry=expiryInput.value;
      const isEditing= editCard !==null && editIndex !==null && editIndex>=0;
      
      if(!isEditing){
      if(!name){
        alert('Please enter a food name.');
        return;
      }
      if(!unit){
        alert('Please specify a unit for the food item.');
        return;
      }
      if(!expiry){
        alert('Please specify an expiry date for the food item.');
        return;
      }
      if (isNaN(quantity) || quantity < 0) quantity = 1;
      const item = {
        name:name,
        quantity:quantity,
        unit:unit,
        expiry:expiry
      };
      foodItems.push(item);
      saveFood(foodItems);
      const card=makeFoodCard(item.name,item.quantity,item.unit,item.expiry);
      foodList.prepend(card);
    } else {
      const oldItem = foodItems[editIndex];
      if (isNaN(quantity)|| quantity<0){
        quantity=oldItem.quantity;
      }
      const update={
        name:name|| oldItem.name,
        quantity: quantity,
        unit: unit || oldItem.unit,
        expiry: expiry || oldItem.expiry
      };
      foodItems[editIndex]=update;
      saveFood(foodItems);

      editCard.dataset.name=update.name;
      editCard.dataset.unit=update.unit;
      editCard.dataset.expiry=update.expiry;

      editCard.querySelector('h3').textContent=update.name;
      editCard.querySelector('.quantity').textContent=update.quantity;
      editCard.querySelector('.unit').textContent=update.unit;
      const expLabel= expirDateLabel(update.expiry);
      editCard.querySelector('.expiry').textContent= expLabel ? `Expires: ${expLabel}` : ''; 
    }
    resetForm();
    addModal.close();
    searchInput.value='';
    applyFilters();
  });
  updateEmpty();
});