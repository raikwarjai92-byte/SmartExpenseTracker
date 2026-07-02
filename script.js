// =======================================================
// Ledger — Smart Expense Tracker
// All data lives in localStorage. No backend required.
// =======================================================

const STORAGE_KEY = 'ledger.entries.v1';

/** @typedef {{id:string, desc:string, amount:number, type:'income'|'expense', category:string, date:string}} Entry */

const els = {
  form: document.getElementById('entryForm'),
  desc: document.getElementById('desc'),
  amount: document.getElementById('amount'),
  type: document.getElementById('type'),
  category: document.getElementById('category'),
  date: document.getElementById('date'),
  entries: document.getElementById('entries'),
  emptyState: document.getElementById('emptyState'),
  totalIncome: document.getElementById('totalIncome'),
  totalExpense: document.getElementById('totalExpense'),
  balance: document.getElementById('balance'),
  categoryBars: document.getElementById('categoryBars'),
  filterChips: document.getElementById('filterChips'),
  clearAll: document.getElementById('clearAll'),
  todayDate: document.getElementById('todayDate'),
  statementRange: document.getElementById('statementRange'),
};

let currentFilter = 'all';

// ---------- storage ----------

/** @returns {Entry[]} */
function loadEntries(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(err){
    console.error('Ledger: failed to read storage', err);
    return [];
  }
}

/** @param {Entry[]} entries */
function saveEntries(entries){
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }catch(err){
    console.error('Ledger: failed to save storage', err);
  }
}

// ---------- helpers ----------

function formatMoney(value){
  const sign = value < 0 ? '-' : '';
  return `${sign}$${Math.abs(value).toFixed(2)}`;
}

function formatDate(iso){
  const d = new Date(iso + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { month: 'short', day: '2-digit' });
}

function uid(){
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

// ---------- rendering ----------

function render(){
  const entries = loadEntries().sort((a, b) => b.date.localeCompare(a.date));

  const visible = entries.filter(e => currentFilter === 'all' ? true : e.type === currentFilter);

  // table
  els.entries.innerHTML = '';
  els.emptyState.style.display = visible.length ? 'none' : 'block';

  visible.forEach(entry => {
    const row = document.createElement('div');
    row.className = 'ledger-row';
    row.setAttribute('role', 'row');

    row.innerHTML = `
      <span class="ledger-row__date">${formatDate(entry.date)}</span>
      <span class="ledger-row__desc">${escapeHtml(entry.desc)}</span>
      <span class="ledger-row__cat">${escapeHtml(entry.category)}</span>
      <span class="ledger-row__amount ${entry.type === 'income' ? 'is-income' : 'is-expense'}">
        ${entry.type === 'income' ? '+' : '−'}${formatMoney(entry.amount)}
      </span>
      <button class="row-delete" title="Delete entry" aria-label="Delete entry">✕</button>
    `;

    row.querySelector('.row-delete').addEventListener('click', () => deleteEntry(entry.id));
    els.entries.appendChild(row);
  });

  // totals (always computed from ALL entries, not filtered view)
  const totalIncome = entries.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0);
  const totalExpense = entries.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
  const balance = totalIncome - totalExpense;

  els.totalIncome.textContent = formatMoney(totalIncome);
  els.totalExpense.textContent = formatMoney(totalExpense);
  els.balance.textContent = formatMoney(balance);
  els.balance.style.color = balance < 0 ? 'var(--coral)' : 'var(--ink)';

  renderCategoryBars(entries);
}

function renderCategoryBars(entries){
  const expenseEntries = entries.filter(e => e.type === 'expense');

  if (!expenseEntries.length){
    els.categoryBars.innerHTML = '<p class="empty-note">Add an expense to see the breakdown.</p>';
    return;
  }

  const byCategory = {};
  expenseEntries.forEach(e => {
    byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
  });

  const max = Math.max(...Object.values(byCategory));

  els.categoryBars.innerHTML = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, total]) => `
      <div class="cat-bar">
        <div class="cat-bar__label">
          <span>${escapeHtml(cat)}</span>
          <span class="mono">${formatMoney(total)}</span>
        </div>
        <div class="cat-bar__track">
          <div class="cat-bar__fill" style="width:${(total / max * 100).toFixed(0)}%"></div>
        </div>
      </div>
    `).join('');
}

function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---------- mutations ----------

function addEntry(entry){
  const entries = loadEntries();
  entries.push(entry);
  saveEntries(entries);
  render();
}

function deleteEntry(id){
  const entries = loadEntries().filter(e => e.id !== id);
  saveEntries(entries);
  render();
}

function clearAllEntries(){
  if (!confirm('Clear every entry? This cannot be undone.')) return;
  saveEntries([]);
  render();
}

// ---------- events ----------

els.form.addEventListener('submit', (e) => {
  e.preventDefault();

  const amount = parseFloat(els.amount.value);
  if (!amount || amount <= 0) return;

  addEntry({
    id: uid(),
    desc: els.desc.value.trim() || 'Untitled entry',
    amount,
    type: els.type.value,
    category: els.category.value,
    date: els.date.value,
  });

  els.form.reset();
  els.date.value = todayISO();
  els.desc.focus();
});

els.filterChips.addEventListener('click', (e) => {
  const btn = e.target.closest('.chip');
  if (!btn) return;
  currentFilter = btn.dataset.filter;
  [...els.filterChips.children].forEach(c => c.classList.toggle('is-active', c === btn));
  render();
});

els.clearAll.addEventListener('click', clearAllEntries);

// ---------- init ----------

function todayISO(){
  const d = new Date();
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 10);
}

function init(){
  els.date.value = todayISO();
  els.todayDate.textContent = new Date().toLocaleDateString(undefined, {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
  });
  els.statementRange.textContent = new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  render();
}

init();
