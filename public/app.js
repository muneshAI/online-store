const authPanel = document.querySelector('#auth-panel');
const appShell = document.querySelector('#app-shell');
const loginForm = document.querySelector('#login-form');
const loginError = document.querySelector('#login-error');
const logoutButton = document.querySelector('#logout-button');
const userChip = document.querySelector('#user-chip');
const groupFilter = document.querySelector('#group-filter');
const priorityFilter = document.querySelector('#priority-filter');
const statusFilter = document.querySelector('#status-filter');
const searchInput = document.querySelector('#search');
const heroStats = document.querySelector('#hero-stats');
const featuredGrid = document.querySelector('#featured-grid');
const ideasGrid = document.querySelector('#ideas-grid');
const paymentGrid = document.querySelector('#payment-grid');
const resultsCount = document.querySelector('#results-count');
const cardTemplate = document.querySelector('#idea-card-template');

const state = {
  ideas: [],
  featuredIds: [],
  user: null,
  paymentProfiles: [],
};

async function request(url, options = {}) {
  const response = await fetch(url, {
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

function uniqueGroups() {
  return ['all', ...new Set(state.ideas.map((idea) => idea.group))];
}

function renderGroupOptions() {
  const current = groupFilter.value || 'all';
  groupFilter.innerHTML = uniqueGroups()
    .map((group) => `<option value="${group}">${group === 'all' ? 'All groups' : group}</option>`)
    .join('');
  groupFilter.value = uniqueGroups().includes(current) ? current : 'all';
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function renderPaymentProfiles() {
  paymentGrid.innerHTML = '';

  state.paymentProfiles.forEach((profile) => {
    const article = document.createElement('article');
    article.className = 'payment-card';
    article.innerHTML = `
      <p class="payment-provider">${profile.provider}</p>
      <h3>${profile.user}</h3>
      <p class="muted">Registered wallet user for ${profile.provider} payment flows.</p>
    `;
    paymentGrid.appendChild(article);
  });
}

function matchesFilters(idea) {
  const term = searchInput.value.trim().toLowerCase();
  const haystack = `${idea.title} ${idea.group} ${idea.summary} ${idea.owner || ''} ${idea.notes || ''}`.toLowerCase();

  return (groupFilter.value === 'all' || idea.group === groupFilter.value)
    && (priorityFilter.value === 'all' || idea.priority === priorityFilter.value)
    && (statusFilter.value === 'all' || idea.status === statusFilter.value)
    && (!term || haystack.includes(term));
}

function createCard(idea) {
  const fragment = cardTemplate.content.cloneNode(true);
  const card = fragment.querySelector('.idea-card');
  card.dataset.id = idea.id;
  fragment.querySelector('.idea-id').textContent = `#${idea.id}`;
  fragment.querySelector('.badge-priority').textContent = idea.priority;
  fragment.querySelector('.idea-title').textContent = idea.title;
  fragment.querySelector('.idea-group').textContent = `${idea.group} • ${idea.status}`;
  fragment.querySelector('.idea-summary').textContent = idea.summary;
  fragment.querySelector('.badge-effort').textContent = `${idea.effort} effort`;
  fragment.querySelector('.badge-leverage').textContent = `${idea.leverage} leverage`;

  const statusSelect = fragment.querySelector('.status-select');
  const ownerInput = fragment.querySelector('.owner-input');
  const notesInput = fragment.querySelector('.notes-input');
  const updatedAt = fragment.querySelector('.updated-at');
  const saveButton = fragment.querySelector('.save-button');

  statusSelect.value = idea.status;
  ownerInput.value = idea.owner || '';
  notesInput.value = idea.notes || '';
  updatedAt.textContent = `Updated ${formatDate(idea.updatedAt)}`;

  saveButton.addEventListener('click', async () => {
    saveButton.disabled = true;
    saveButton.textContent = 'Saving...';

    try {
      const payload = {
        status: statusSelect.value,
        owner: ownerInput.value,
        notes: notesInput.value,
      };
      const data = await request(`/api/ideas/${idea.id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });

      const index = state.ideas.findIndex((entry) => entry.id === idea.id);
      state.ideas[index] = data.idea;
      renderAll();
    } catch (error) {
      window.alert(error.message);
    } finally {
      saveButton.disabled = false;
      saveButton.textContent = 'Save';
    }
  });

  return fragment;
}

function renderStats() {
  const stats = [
    `${state.ideas.length} total ideas`,
    `${state.ideas.filter((idea) => idea.priority === 'Now').length} priority now`,
    `${state.ideas.filter((idea) => idea.status === 'Building').length} actively building`,
    `${state.ideas.filter((idea) => idea.owner).length} assigned owners`,
  ];

  heroStats.innerHTML = stats.map((label) => `<div class="stat-pill">${label}</div>`).join('');
}

function renderCollection(target, ideas) {
  target.innerHTML = '';

  if (!ideas.length) {
    target.innerHTML = '<div class="empty-state">No ideas matched your current filters.</div>';
    return;
  }

  ideas.forEach((idea) => target.appendChild(createCard(idea)));
}

function renderFeatured() {
  const ideas = state.featuredIds
    .map((id) => state.ideas.find((idea) => idea.id === id))
    .filter(Boolean);

  renderCollection(featuredGrid, ideas);
}

function renderIdeas() {
  const filteredIdeas = state.ideas.filter(matchesFilters);
  resultsCount.textContent = `${filteredIdeas.length} of ${state.ideas.length} ideas shown`;
  renderCollection(ideasGrid, filteredIdeas);
}

function renderAll() {
  renderGroupOptions();
  renderStats();
  renderPaymentProfiles();
  renderFeatured();
  renderIdeas();
}

async function loadIdeas() {
  const data = await request('/api/ideas');
  state.ideas = data.ideas;
  state.featuredIds = data.featuredIds;
  state.paymentProfiles = data.paymentProfiles || [];
  renderAll();
}

async function showAuthenticatedApp(user) {
  state.user = user;
  userChip.textContent = `${user.name} • ${user.email}`;
  authPanel.classList.add('hidden');
  appShell.classList.remove('hidden');
  await loadIdeas();
}

async function checkSession() {
  const session = await request('/api/session');
  if (session.authenticated) {
    await showAuthenticatedApp(session.user);
  }
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  loginError.textContent = '';
  const formData = new FormData(loginForm);

  try {
    const data = await request('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password'),
      }),
    });

    await showAuthenticatedApp(data.user);
  } catch (error) {
    loginError.textContent = error.message;
  }
});

logoutButton.addEventListener('click', async () => {
  await request('/api/logout', { method: 'POST' });
  state.ideas = [];
  state.featuredIds = [];
  state.user = null;
  state.paymentProfiles = [];
  appShell.classList.add('hidden');
  authPanel.classList.remove('hidden');
});

[groupFilter, priorityFilter, statusFilter, searchInput].forEach((element) => {
  element.addEventListener('input', renderIdeas);
  element.addEventListener('change', renderIdeas);
});

checkSession().catch((error) => {
  loginError.textContent = error.message;
});
