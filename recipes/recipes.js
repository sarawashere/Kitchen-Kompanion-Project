(() => {
  // Add "course" to each recipe
  const RECIPES = [
    { id: 1, title: "Lemon Herb Salmon", img:"../images/salmon.jpg", calories: 520, skill:"Intermediate", course:"main",
      allergens:["fish"],
      ingredients:["salmon","lemon","garlic","parsley","olive oil"],
      directions:[
        "Preheat oven to 400°F. Line a sheet pan and pat the salmon dry on all sides.",
        "In a small bowl, stir together minced garlic, 1 tbsp olive oil, the zest and juice of half the lemon, and a pinch of salt.",
        "Rub the mixture over the salmon (skin side down on the pan). If time allows, marinate 10–15 minutes.",
        "Roast until the thickest part flakes with a fork and reads ~125–130°F, about 10–12 minutes for a 1-inch fillet.",
        "Optional: broil 1–2 minutes to lightly brown the top.",
        "Rest 3 minutes. Shower with chopped parsley and serve with extra lemon wedges."
      ],
      description:"Oven-baked salmon with a bright lemon-garlic glaze." },

    { id: 2, title: "Creamy Pesto Pasta", img:"../images/pesto.jpg", calories: 740, skill:"Beginner", course:"main",
      allergens:["gluten","dairy","nuts"],
      ingredients:["pasta","basil pesto","cream","parmesan"],
      directions:[
        "Bring a large pot of well-salted water to a boil. Cook pasta until just shy of al dente.",
        "Reserve 1/2 cup pasta water, then drain.",
        "In a skillet over low heat, gently warm the cream until steaming (do not boil). Whisk in pesto until smooth.",
        "Add drained pasta to the pan and toss, adding splashes of reserved pasta water to emulsify and coat the noodles.",
        "Off heat, stir in grated parmesan. Taste and adjust salt as needed.",
        "Rest 1 minute to thicken slightly, then plate and serve immediately."
      ],
      description:"Comfort pasta tossed in a creamy basil pesto sauce." },

    { id: 3, title: "Tofu Stir-Fry", img:"../images/tofu.jpg", calories: 480, skill:"Beginner", course:"main",
      allergens:["soy","sesame"],
      ingredients:["tofu","broccoli","bell pepper","soy sauce","sesame oil"],
      directions:[
        "Press tofu 10–15 minutes to remove excess moisture. Pat dry and cut into 3/4-inch cubes.",
        "Heat a large skillet or wok over medium-high. Add 1–2 tbsp oil and sear tofu, undisturbed, 3–4 minutes per side until golden. Remove to a plate.",
        "Add broccoli florets and sliced bell pepper to the hot pan. Stir-fry 2–3 minutes until crisp-tender.",
        "Return tofu to the pan. Drizzle soy sauce around the edges of the hot pan so it sizzles, then toss to coat everything evenly.",
        "Finish with sesame oil and toss 30 seconds until glossy.",
        "Serve hot as is or over steamed rice."
      ],
      description:"Quick veggie stir-fry with crispy tofu." },

    { id: 4, title: "Chicken Fajita Bowl", img:"../images/fajitabowl.jpg", calories: 610, skill:"Intermediate", course:"main",
      allergens:["none"],
      ingredients:["chicken","peppers","onions","rice","spices"],
      directions:[
        "Slice chicken, peppers, and onions into thin strips.",
        "Toss chicken with spices and 1 tbsp oil until evenly coated; rest 10 minutes if you can.",
        "Sauté chicken over medium-high heat 5–7 minutes until browned and cooked through. Transfer to a plate to rest.",
        "In the same pan, cook peppers and onions with another pinch of spices 4–5 minutes until tender-crisp with light char.",
        "Fluff hot rice and divide into bowls.",
        "Top rice with chicken, peppers, and onions, spooning over any pan juices."
      ],
      description:"Sizzling fajita flavors over cilantro-lime rice." },

    { id: 5, title: "Avocado Toast Deluxe", img:"../images/avotoast.jpg", calories: 420, skill:"Beginner", course:"appetizer",
      allergens:["gluten","eggs"],
      ingredients:["sourdough","avocado","egg","chili flakes"],
      directions:[
        "Toast sourdough until deeply golden and crisp so it can hold toppings.",
        "In a bowl, smash avocado with a pinch of salt. Taste and adjust. Stir in a pinch of chili flakes if you like heat.",
        "Cook the egg to your preference: jammy boiled (~7 minutes), fried, or poached.",
        "Spread avocado edge-to-edge on the toast. Top with the egg.",
        "Finish with another pinch of chili flakes and a tiny pinch of salt. Serve immediately."
      ],
      description:"Crispy toast with smashed avocado and jammy egg." },

    { id: 6, title: "Shrimp Tacos", img:"../images/stacos.jpg", calories: 560, skill:"Advanced", course:"main",
      allergens:["shellfish","gluten"],
      ingredients:["shrimp","tortillas","slaw","lime","spices"],
      directions:[
        "Pat shrimp dry. Toss with spices and 1 tbsp oil until evenly coated.",
        "Heat a large skillet over high heat. Cook shrimp 1–2 minutes per side until pink and just opaque; remove to a plate.",
        "Warm tortillas in a dry pan or directly over a low flame until pliable.",
        "Fill each tortilla with a handful of slaw and a few shrimp.",
        "Squeeze fresh lime over the top and serve right away."
      ],
      description:"Zesty shrimp tucked in warm tortillas with crunchy slaw." },

    { id: 7, title: "Mushroom Risotto", img:"../images/mush.jpg", calories: 690, skill:"Advanced", course:"main",
      allergens:["dairy"],
      ingredients:["arborio rice","mushrooms","stock","butter","parmesan"],
      directions:[
        "Bring stock to a bare simmer in a separate pot and keep it warm.",
        "In a wide pan, sauté sliced mushrooms in a little butter/oil over medium-high heat until browned; season lightly. Transfer to a bowl.",
        "Add arborio rice to the pan and stir 1–2 minutes until the grains are coated and edges look translucent.",
        "Add a ladle of hot stock, stirring frequently. When nearly absorbed, add another ladle. Continue for 18–20 minutes until creamy and the rice is al dente.",
        "Stir the mushrooms back in and add a small splash more stock for a loose, silky consistency.",
        "Off heat, fold in butter and grated parmesan until glossy. Cover 2 minutes, then serve."
      ],
      description:"Creamy risotto with sautéed mushrooms." },

    { id: 8, title: "Greek Salad", img:"../images/greek.jpg", calories: 330, skill:"Beginner", course:"appetizer",
      allergens:["dairy"],
      ingredients:["cucumber","tomato","feta","olive","oregano"],
      directions:[
        "Cut cucumber and tomatoes into bite-size pieces; slice or halve olives. Lightly crush dried oregano between your fingers.",
        "In a bowl, toss cucumber and tomato with a drizzle of olive oil and a pinch of salt; let sit 5 minutes to release juices.",
        "Fold in olives and oregano. Taste and adjust salt.",
        "Top with crumbled or sliced feta. Chill 10–15 minutes if possible, then serve with the salad juices spooned over."
      ],
      description:"Crunchy, refreshing, and tangy classic salad." },

    { id: 9, title: "Nanaimo Bars", img:"../images/nanaimo.jpg", calories: 450, skill:"Intermediate", course:"dessert",
      allergens:["dairy","gluten","nuts"],
      ingredients:["graham crumbs","butter","coconut","custard powder","cream","chocolate"],
      directions:[
        "Line an 8-inch square pan with parchment, leaving overhang for easy lifting.",
        "Base: Gently melt butter, then stir in graham crumbs and shredded coconut until evenly moistened. Press firmly and evenly into the pan. Chill 10–15 minutes.",
        "Middle: Whisk custard powder with cream until thick, smooth, and spreadable. Spread evenly over the chilled base. Chill 20–30 minutes to set.",
        "Top: Melt chocolate gently until smooth. Pour over the custard layer and tilt the pan to coat evenly. Tap to release air bubbles.",
        "Chill until the chocolate is just set. Score the top into bars, then refrigerate fully before slicing cleanly."
      ],
      description:"Classic Canadian layered dessert bar with chocolate top, custard middle, and coconut graham crust." },

    { id: 10, title: "Frozen Berry Yogurt Cups", img:"../images/frozenberry.jpg", calories: 210, skill:"Beginner", course:"dessert",
      allergens:["dairy"],
      ingredients:["greek yogurt","berries","honey","granola"],
      directions:[
        "Line a muffin tin with paper liners.",
        "In a bowl, whisk yogurt and honey until smooth, then fold in the berries (crush a few to streak the yogurt).",
        "Spoon into liners, tapping the tray to level. Cover lightly.",
        "Freeze until solid, 2–3 hours.",
        "To serve, let sit 3–5 minutes at room temperature, then top with granola and enjoy."
      ],
      description:"Light frozen yogurt cups with mixed berries and crunchy granola." },
  ];

  const ALLERGENS = ["gluten","dairy","eggs","nuts","soy","sesame","fish","shellfish"];
  const COURSES  = ["main","appetizer","dessert"]; // filter options

  const els = {
    search: null, skill: null, calMax: null, calVal: null,
    courseChips: null, chips: null,               // NEW: courseChips
    grid: null, empty: null, info: null, clear: null, favsBtn: null,
    modal: null, mTitle: null, mMeta: null, mDesc: null, mIngr: null, mAll: null, mFav: null, mClose: null, mDir:null
  };

  // Favorites state (persisted)
  const favKey = 'recipe-favs-v1';
  const getFavs = () => new Set(JSON.parse(localStorage.getItem(favKey) || '[]'));
  const setFavs = (set) => localStorage.setItem(favKey, JSON.stringify([...set]));

  // helpers
  const prettyCourse = (c) => c === "main" ? "Main" : c.charAt(0).toUpperCase()+c.slice(1);

  // app init once DOM ready
  window.addEventListener('DOMContentLoaded', () => {
    els.search = document.getElementById('search');
    els.skill = document.getElementById('skill');
    els.calMax = document.getElementById('calMax');
    els.calVal = document.getElementById('calVal');
    els.courseChips = document.getElementById('courseChips'); // NEW
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
    els.mDir = document.getElementById('mDir');

    buildCourseChips(); // NEW
    buildAllergyChips();
    hookEvents();
    render();
  });

  const activeAllergies = new Set();
  const activeCourses = new Set(); // NEW
  let showOnlyFavs = false;

  function makeChip(label, setRef){
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = label;
    b.setAttribute('aria-pressed','false');
    b.addEventListener('click', () => {
      if(setRef.has(label)) {
        setRef.delete(label);
        b.classList.remove('active');
        b.setAttribute('aria-pressed','false');
      } else {
        setRef.add(label);
        b.classList.add('active');
        b.setAttribute('aria-pressed','true');
      }
      render();
    });
    return b;
  }

  function buildCourseChips(){
    // build 3 chips: main/appetizer/dessert
    COURSES.forEach(c => {
      const btn = makeChip(c, activeCourses);
      els.courseChips.appendChild(btn);
    });
  }

  function buildAllergyChips(){
    ALLERGENS.forEach(a => {
      const btn = makeChip(a, activeAllergies);
      els.chips.appendChild(btn);
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
    activeCourses.clear(); // NEW
    // clear visual states
    [...els.chips.children].forEach(c => { c.classList.remove('active'); c.setAttribute('aria-pressed','false'); });
    [...els.courseChips.children].forEach(c => { c.classList.remove('active'); c.setAttribute('aria-pressed','false'); });
    showOnlyFavs = false; els.favsBtn.textContent = '🩷 Favorites';
  }

  function matches(rec, favs){
    const q = els.search.value.trim().toLowerCase();
    const skill = els.skill.value;
    const cal = Number(els.calMax.value);

    const hasQuery = !q || (rec.title.toLowerCase().includes(q) || rec.ingredients.join(' ').toLowerCase().includes(q));
    const skillOk = !skill || rec.skill === skill;
    const calOk = rec.calories <= cal;

    // NEW: course filter: if no chip selected, allow all. If some selected, rec.course must be in set.
    const courseOk = activeCourses.size === 0 || activeCourses.has(rec.course);

    // Allergy logic stays the same (block recipes that contain any active allergen)
    const allergyOk = activeAllergies.size === 0 || ![...activeAllergies].some(a => rec.allergens.includes(a));

    const favOk = !showOnlyFavs || favs.has(rec.id);
    return hasQuery && skillOk && calOk && courseOk && allergyOk && favOk;
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
          <span class="tag">${prettyCourse(rec.course)}</span>
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
    els.mMeta.textContent = `${rec.skill} • ${rec.calories} kcal • ${prettyCourse(rec.course)}`;
    els.mDesc.textContent = rec.description;
    els.mIngr.innerHTML = rec.ingredients.map(i=>`<li>${i}</li>`).join('');
    els.mDir.innerHTML = rec.directions.map(d=>`<li>${d}</li>`).join('');
    els.mAll.textContent = rec.allergens[0]==='none' ? 'Allergen-friendly' : `Contains: ${rec.allergens.join(', ')}`;

    const s = getFavs();
    els.mFav.setAttribute('aria-pressed', s.has(rec.id));
    els.mFav.textContent = s.has(rec.id) ? '🩷 Favorited' : '🩷 Favorite';
    els.mFav.onclick = () => {
      const favs = getFavs();
      favs.has(rec.id)?favs.delete(rec.id):favs.add(rec.id);
      setFavs(favs);
      render();
      openModal(rec);
    };
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
