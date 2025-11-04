(function () {
  /* State & Storage */
  var STORAGE_KEY = 'shopping-list-v2';
  var items = []; // shape: { id, food, amount, store, notes, checked }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {}
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      items = raw ? JSON.parse(raw) : [];
    } catch (e) {
      items = [];
    }
  }

  /* Utilities */
  function $(sel) { 
    return document.querySelector(sel); 
  }

  function uid() { 
    return Math.random().toString(36).slice(2, 9); 
  }

  function norm(s) { 
    return (s || '').trim(); 
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, function (c) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[c];
    });
  }

  /* DOM References (initialized on DOMContentLoaded) */
  var list, emptyState, form, inputFood, inputAmount, inputStore, inputNotes, search, groupBy, clearBtn;

  document.addEventListener('DOMContentLoaded', function () {
    // Wire DOM
    list        = $('#itemsList');
    emptyState  = $('#emptyState');
    form        = $('#addForm');
    inputFood   = $('#food');
    inputAmount = $('#amount');
    inputStore  = $('#store');
    inputNotes  = $('#notes');
    search      = $('#search');
    groupBy     = $('#groupBy');
    clearBtn    = $('#clearList');

    // Load + initial render
    load();
    render();

    /* Events: add item, clear list, group change, debounced search, delegated list actions (delete/toggle)*/

    // Add item
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      addItem({
        food:   inputFood.value,
        amount: inputAmount.value,
        store:  inputStore.value,
        notes:  inputNotes.value
      });
      form.reset();
      inputFood.focus();
    });

    // Clear list
    clearBtn.addEventListener('click', function () { clearAll(); });

    // Re-render on grouping change
    groupBy.addEventListener('change', function () { render(); });

    // Debounced search
    var t = 0;
    search.addEventListener('input', function () {
      clearTimeout(t);
      t = setTimeout(function () { render(); }, 120);
    });

    // Event delegation: delete item
    list.addEventListener('click', function (e) {
      var delBtn = e.target.closest('button[data-action="delete"]');
      var row = e.target.closest('li.item');
      if (!row) return;
      var id = row.getAttribute('data-id');
      if (delBtn) removeItem(id);
    });

    // Event delegation: toggle checked
    list.addEventListener('change', function (e) {
      if (e.target.matches('input[type="checkbox"][data-action="toggle"]')) {
        var row = e.target.closest('li.item');
        if (!row) return;
        var id = row.getAttribute('data-id');
        toggleItem(id, e.target.checked);
      }
    });
  });

  /* CRUD Operations */
  function addItem(data) {
    var food = norm(data.food);
    if (!food) {
      alert('Please enter a food name.');
      return;
    }
    var item = {
      id: uid(),
      food: food,
      amount: norm(data.amount),
      store: norm(data.store),
      notes: norm(data.notes),
      checked: false
    };
    items.push(item);
    save();
    render();
  }

  function removeItem(id) {
    items = items.filter(function (i) { return i.id !== id; });
    save();
    render();
  }

  function toggleItem(id, checked) {
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) {
        items[i].checked = !!checked;
        break;
      }
    }
    save();
    render();
  }

  function clearAll() {
    if (!items.length) return;
    if (confirm('Clear entire list?')) {
      items = [];
      save();
      render();
    }
  }

  /* View Model Helpers: filter & group */
  function getFilteredAndGrouped() {
    var q = norm(search.value).toLowerCase();
    var mode = groupBy.value; // 'alphabetical' or 'store'
    var listCopy = items.slice();

    // Text filter across food/store/notes
    if (q) {
      listCopy = listCopy.filter(function (i) {
        var blob = (i.food + ' ' + (i.store || '') + ' ' + (i.notes || '')).toLowerCase();
        return blob.indexOf(q) !== -1;
      });
    }

    if (mode === 'alpha') {
      listCopy.sort(function (a, b) {
        return a.food.localeCompare(b.food, undefined, { sensitivity: 'base' });
      });
      return [{ key: 'A→Z', items: listCopy }];
    }

    // Group by store
    var map = {};
    for (var k = 0; k < listCopy.length; k++) {
      var it = listCopy[k];
      var key = it.store ? it.store : 'No Store';
      if (!map[key]) map[key] = [];
      map[key].push(it);
    }

    var groups = [];
    for (var name in map) {
      var arr = map[name].slice();
      arr.sort(function (a, b) {
        return a.food.localeCompare(b.food, undefined, { sensitivity: 'base' });
      });
      groups.push({ key: name, items: arr });
    }

    groups.sort(function (a, b) {
      return a.key.localeCompare(b.key, undefined, { sensitivity: 'base' });
    });

    return groups;
  }

  /* Render */
  function render() {
    var groups = getFilteredAndGrouped();
    list.innerHTML = '';
  
    if (items.length === 0) {
      emptyState.hidden = false;
      return;
    } else {
      emptyState.hidden = true;
    }
  
    for (var g = 0; g < groups.length; g++) {
      var group = groups[g];
  
      // Only show a group header when there are multiple groups
      if (groups.length > 1) {
        var head = document.createElement('li');
        head.className = 'group-title';
        head.textContent = group.key;
        list.appendChild(head);
      }
  
      for (var j = 0; j < group.items.length; j++) {
        var it = group.items[j];
  
        var li = document.createElement('li');
        li.className = 'item' + (it.checked ? ' checked' : '');
        li.setAttribute('data-id', it.id);
  
        // Build stacked meta lines in fixed order
        var metaLines = [];
        if (it.amount) metaLines.push('<div class="line"><strong>Amount:</strong> ' + escapeHtml(it.amount) + '</div>');
        if (it.store)  metaLines.push('<div class="line"><strong>Store:</strong> '  + escapeHtml(it.store)  + '</div>');
        if (it.notes)  metaLines.push('<div class="line"><strong>Notes:</strong> '  + escapeHtml(it.notes)  + '</div>');
  
        li.innerHTML =
          // left column: checkbox (flush to left edge)
          '<input class="chk" type="checkbox" data-action="toggle" ' + (it.checked ? 'checked' : '') + ' />' +
          // middle column: name + stacked meta
          '<div class="content">' +
            '<div class="name">' + escapeHtml(it.food) + '</div>' +
            '<div class="meta">' + metaLines.join('') + '</div>' +
          '</div>' +
          // right column: delete button
          '<button type="button" class="btn danger" data-action="delete" aria-label="Delete ' + escapeHtml(it.food) + '">✕</button>';
  
        list.appendChild(li);
      }
    }
  }
})();