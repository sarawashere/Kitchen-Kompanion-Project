(() => {
  const RECIPES = [
    { id: 1, title: "Lemon Herb Salmon", img:"images/salmon.jpg", calories: 520, skill:"Intermediate", allergens:["fish"], 
      ingredients:["salmon","lemon","garlic","parsley","olive oil"], 
      directions:["Season salmon with lemon + garlic","Bake 400°F for 12-14 minutes","Top with parsley + serve"],
      description:"Oven-baked salmon with a bright lemon-garlic glaze." },

    { id: 2, title: "Creamy Pesto Pasta", img:"images/pesto.jpg", calories: 740, skill:"Beginner", allergens:["gluten","dairy","nuts"], 
      ingredients:["pasta","basil pesto","cream","parmesan"], 
      directions:["Boil pasta until tender","Mix pesto + cream in pan","Toss pasta + top with parmesan"],
      description:"Comfort pasta tossed in a creamy basil pesto sauce." },

    { id: 3, title: "Tofu Stir-Fry", img:"images/tofu.jpg", calories: 480, skill:"Beginner", allergens:["soy","sesame"], 
      ingredients:["tofu","broccoli","bell pepper","soy sauce","sesame oil"], 
      directions:["Sear tofu until crispy","Add veggies + stir fry","Finish with soy + sesame oil"],
      description:"Quick veggie stir-fry with crispy tofu." },

    { id: 4, title: "Chicken Fajita Bowl", img:"images/fajitabowl.jpg", calories: 610, skill:"Intermediate", allergens:["none"], 
      ingredients:["chicken","peppers","onions","rice","spices"], 
      directions:["Sauté chicken + veggies","Add seasoning + mix","Serve over rice"],
      description:"Sizzling fajita flavors over cilantro-lime rice." },

    { id: 5, title: "Avocado Toast Deluxe", img:"images/avotoast.jpg", calories: 420, skill:"Beginner", allergens:["gluten","eggs"], 
      ingredients:["sourdough","avocado","egg","chili flakes"], 
      directions:["Toast bread","Smash avocado + spread","Top with egg + chili flakes"],
      description:"Crispy toast with smashed avocado and jammy egg." },

    { id: 6, title: "Shrimp Tacos", img:"images/stacos.jpg", calories: 560, skill:"Advanced", allergens:["shellfish","gluten"], 
      ingredients:["shrimp","tortillas","slaw","lime","spices"], 
      directions:["Cook shrimp with spices","Warm tortillas","Assemble + squeeze lime"],
      description:"Zesty shrimp tucked in warm tortillas with crunchy slaw." },

    { id: 7, title: "Mushroom Risotto", img:"images/mush.jpg", calories: 690, skill:"Advanced", allergens:["dairy"], 
      ingredients:["arborio rice","mushrooms","stock","butter","parmesan"], 
      directions:["Sauté mushrooms","Slowly add stock while stirring rice","Finish with butter + parmesan"],
      description:"Creamy risotto with sautéed mushrooms." },

    { id: 8, title: "Greek Salad", img:"images/greek.jpg", calories: 330, skill:"Beginner", allergens:["dairy"], 
      ingredients:["cucumber","tomato","feta","olive","oregano"], 
      directions:["Chop vegetables","Toss with olive oil + oregano","Top with feta + serve"],
      description:"Crunchy, refreshing, and tangy classic salad." }
  ];

  const ALLERGENS = ["gluten","dairy","eggs","nuts","soy","sesame","fish","shellfish"];

  const els = {
    search: null, skill: null, calMax: null, calVal: null, chips: null,
    grid: null, empty: null, info: null, clear: null, favsBtn: null,
    modal: null, mTitle: null, mMeta: null, mDesc: null, mIngr: null, mAll: null, mFav: null, mClose: null, mDir:null
  };

  const favKey = 'recipe-favs-v1';
  const getFavs = () => new Set(JSON.parse(localStorage.getItem(favKey) || '[]'));
  const setFavs = (set) => localStorage.setItem(favKey, JSON.stringify([...set]));

  window.addEventListener('DOMContentLoaded', () => {
    els.search = document.getElementById('search');
    els.skill = document.getElementById('skill');
    els.calMax = document.getElementById('calMax');
    els.calVal = document.getElementById('calVal');
    els.chips = document.getElementById('allergyChips');
    els.grid = document.getElementById('grid');
    els.empty = document.getElementById('empty');
    els.info = document.getElementById('resultsInfo');
    els.clear = document.getElementById('clearFilters');
    els.favsBtn = document.getElementById('show-favs');
    els.modal = document.getElementById('modal');
    els.mTitle = document.getElementById('mTitle');
    els.mMeta = document.getElementById('mMeta');
    els.mDesc = document.getElementById('mDesc');
    els.mIngr = document.getElementById('mIngr');
    els.mAll = document.getElementById('mAllergens');
    els.mFav = document.getElementById('mFav');
    els.mClose = document.getElementById('mClose');

    // directions mount
    els.mDir = document.getElementById('mDir');

    buildChips();
    hookEvents();
    render();
  });

  const activeAllergies = new Set();
  let showOnlyFavs = false;

  function buildChips(){
    ALLERGENS.forEach(a => {
      const b = document.createElement('button');
      b.type = 'button'; 
      b.className = 'chip'; 
      b.textContent = a; 
      b.setAttribute('aria-pressed','false');
      
      b.addEventListener('click', () => {
        if(activeAllergies.has(a)) { activeAllergies.delete(a); b.classList.remove('active'); b.setAttribute('aria-pressed','false'); }
        else { activeAllergies.add(a); b.classList.add('active'); b.setAttribute('aria-pressed','true'); }
        render();
      });

      els.chips.appendChild(b);
    });
  }

  function hookEvents(){
    els.search.addEventListener('input', render);
    els.skill.addEventListener('change', render);
    els.calMax.addEventListener('input', () => { els.calVal.textContent = `≤ ${els.calMax.value} kcal`; render(); });
    els.clear.addEventListener('click', () => { resetFilters(); render(); });
    els.favsBtn.addEventListener('click', () => { showOnlyFavs = !showOnlyFavs; els.favsBtn.textContent = showOnlyFavs ? '🩷 Favorites (On)' : '🩷 Favorites'; render(); });
    els.mClose.addEventListener('click', ()=> els.modal.close());
  }

  function resetFilters(){
    els.search.value = '';
    els.skill.value = '';
    els.calMax.value = 900; els.calVal.textContent = '≤ 900 kcal';
    activeAllergies.clear();
    [...els.chips.children].forEach(c => { c.classList.remove('active'); c.setAttribute('aria-pressed','false'); });
    showOnlyFavs = false; els.favsBtn.textContent = '🩷 Favorites';
  }

  function matches(rec, favs){
    const q = els.search.value.trim().toLowerCase();
    const skill = els.skill.value;
    const cal = Number(els.calMax.value);
    const hasQuery = !q || (rec.title.toLowerCase().includes(q) || rec.ingredients.join(' ').toLowerCase().includes(q));
    const skillOk = !skill || rec.skill === skill;
    const calOk = rec.calories <= cal;
    const allergyOk = activeAllergies.size === 0 || ![...activeAllergies].some(a => rec.allergens.includes(a));
    const favOk = !showOnlyFavs || favs.has(rec.id);
    return hasQuery && skillOk && calOk && allergyOk && favOk;
  }

  function card(rec, favs){
    const isFav = favs.has(rec.id);
    const el = document.createElement('article');
    el.className = 'card'; el.tabIndex = 0; el.setAttribute('role','button'); el.setAttribute('aria-label', rec.title);
    el.innerHTML = `
      <button class="fav" aria-label="Toggle favorite" aria-pressed="${isFav}">${isFav ? '🩷' : '🤍'}</button>
      <div class="thumb"><img src="${rec.img}" alt="${rec.title} image"></div>
      <div class="body">
        <div class="title">${rec.title}</div>
        <div class="meta">
          <span class="tag">${rec.skill}</span>
          <span>${rec.calories} kcal</span>
        </div>
      </div>`;
    const favBtn = el.querySelector('.fav');
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const s = getFavs();
      if(s.has(rec.id)) s.delete(rec.id); else s.add(rec.id);
      setFavs(s); render();
    });
    el.addEventListener('click', () => openModal(rec));
    el.addEventListener('keydown', (ev)=>{ if(ev.key==='Enter' || ev.key===' '){ ev.preventDefault(); openModal(rec); }});
    return el;
  }

  function openModal(rec){
    els.mTitle.textContent = rec.title;
    els.mMeta.textContent = `${rec.skill} • ${rec.calories} kcal`;
    els.mDesc.textContent = rec.description;
    els.mIngr.innerHTML = rec.ingredients.map(i=>`<li>${i}</li>`).join('');
    els.mDir.innerHTML = rec.directions.map(d=>`<li>${d}</li>`).join('');
    els.mAll.textContent = rec.allergens[0]==='none' ? 'Allergen-friendly' : `Contains: ${rec.allergens.join(', ')}`;

    const s = getFavs();
    els.mFav.setAttribute('aria-pressed', s.has(rec.id));
    els.mFav.textContent = s.has(rec.id) ? '🩷 Favorited' : '🩷 Favorite';
    els.mFav.onclick = () => { const favs = getFavs(); favs.has(rec.id)?favs.delete(rec.id):favs.add(rec.id); setFavs(favs); render(); openModal(rec); };
    els.modal.showModal();
  }

  function render(){
    const favs = getFavs();
    els.grid.innerHTML = '';
    const filtered = RECIPES.filter(r => matches(r, favs));
    filtered.forEach(r => els.grid.appendChild(card(r, favs)));
    els.empty.hidden = filtered.length !== 0;
    els.info.textContent = `${filtered.length} recipe${filtered.length!==1?'s':''} shown` + (showOnlyFavs? ' • favorites only':'' );
  }
})();
