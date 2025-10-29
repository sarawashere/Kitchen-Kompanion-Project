(function () {
    // ---- State / storage ----
    var STORAGE_KEY = 'shopping-list-v2';
    var items = []; // {id, food, amount, store, notes, checked}
  
    // ---- Helpers ----
    function $(sel) { return document.querySelector(sel); }
    function uid() { return Math.random().toString(36).slice(2, 9); }
    function norm(s) { return (s || '').trim(); }
    function save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch (e) {} }
    function load() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        items = raw ? JSON.parse(raw) : [];
      } catch (e) {
        items = [];
      }
    }
  
    // ---- DOM refs (filled on DOMContentLoaded) ----
    var list, emptyState, form, inputFood, inputAmount, inputStore, inputNotes, search, groupBy, clearBtn;
  
    document.addEventListener('DOMContentLoaded', function () {
      // Wire DOM
      list = $('#itemsList');
      emptyState = $('#emptyState');
      form = $('#addForm');
      inputFood = $('#food');
      inputAmount = $('#amount');
      inputStore = $('#store');
      inputNotes = $('#notes');
      search = $('#search');
      groupBy = $('#groupBy');
      clearBtn = $('#clearList');
  
      // Load + initial render
      load();
      render();
  
      // Events
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        addItem({
          food: inputFood.value,
          amount: inputAmount.value,
          store: inputStore.value,
          notes: inputNotes.value
        });
        form.reset();
        inputFood.focus();
      });
  
      clearBtn.addEventListener('click', function () { clearAll(); });
      groupBy.addEventListener('change', function () { render(); });
  
      var t = 0;
      search.addEventListener('input', function () {
        clearTimeout(t);
        t = setTimeout(function () { render(); }, 120);
      });
  
      // Event delegation for list (delete + toggle)
      list.addEventListener('click', function (e) {
        var delBtn = e.target.closest('button[data-action="delete"]');
        var row = e.target.closest('li.item');
        if (!row) return;
        var id = row.getAttribute('data-id');
        if (delBtn) {
          removeItem(id);
        }
      });
  
      list.addEventListener('change', function (e) {
        if (e.target.matches('input[type="checkbox"][data-action="toggle"]')) {
          var row = e.target.closest('li.item');
          if (!row) return;
          var id = row.getAttribute('data-id');
          toggleItem(id, e.target.checked);
        }
      });
    });
  
    // ---- CRUD ----
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
  
    // ---- View helpers ----
    function getFilteredAndGrouped() {
      var q = norm(search.value).toLowerCase();
      var mode = groupBy.value; // 'alpha' or 'store'
      var list = items.slice();
  
      if (q) {
        list = list.filter(function (i) {
          var blob = (i.food + ' ' + (i.store || '') + ' ' + (i.notes || '')).toLowerCase();
          return blob.indexOf(q) !== -1;
        });
      }
  
      if (mode === 'alpha') {
        list.sort(function (a, b) {
          return a.food.localeCompare(b.food, undefined, { sensitivity: 'base' });
        });
        return [{ key: 'A→Z', items: list }];
      } else {
        // group by store
        var map = {};
        for (var k = 0; k < list.length; k++) {
          var it = list[k];
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
    }
  
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
  
          // build meta text
          var metaParts = [];
          if (it.amount) metaParts.push('Amount: ' + it.amount);
          if (it.store) metaParts.push('• Store: ' + it.store);
          if (it.notes) metaParts.push('• Notes: ' + it.notes);
          var metaText = metaParts.join(' ');
  
          li.innerHTML =
            '<label>' +
              '<input type="checkbox" data-action="toggle" ' + (it.checked ? 'checked' : '') + ' />' +
              ' <span class="name">' + escapeHtml(it.food) + '</span>' +
            '</label>' +
            '<div class="meta">' + escapeHtml(metaText) + '</div>' +
            '<button type="button" class="btn danger" data-action="delete" aria-label="Delete ' + escapeHtml(it.food) + '">✕</button>';
  
          list.appendChild(li);
        }
      }
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
  })();