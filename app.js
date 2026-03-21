const groupFilter = document.querySelector('#group-filter');
const priorityFilter = document.querySelector('#priority-filter');
const searchInput = document.querySelector('#search');
const ideasGrid = document.querySelector('#ideas-grid');
const featuredGrid = document.querySelector('#featured-grid');
const heroStats = document.querySelector('#hero-stats');
const resultsCount = document.querySelector('#results-count');
const template = document.querySelector('#idea-card-template');

function uniqueGroups() {
  return ['all', ...new Set(IDEAS.map((idea) => idea.group))];
}

function renderGroupOptions() {
  groupFilter.innerHTML = uniqueGroups()
    .map((group) => `<option value="${group}">${group === 'all' ? 'All groups' : group}</option>`)
    .join('');
}

function createCard(idea) {
  const fragment = template.content.cloneNode(true);
  fragment.querySelector('.idea-card__id').textContent = `#${idea.id}`;
  fragment.querySelector('.badge--priority').textContent = idea.priority;
  fragment.querySelector('h3').textContent = idea.title;
  fragment.querySelector('.idea-card__group').textContent = idea.group;
  fragment.querySelector('.idea-card__summary').textContent = idea.summary;
  fragment.querySelector('.badge--effort').textContent = `${idea.effort} effort`;
  fragment.querySelector('.badge--leverage').textContent = `${idea.leverage} leverage`;
  return fragment;
}

function matchesFilters(idea) {
  const groupValue = groupFilter.value;
  const priorityValue = priorityFilter.value;
  const term = searchInput.value.trim().toLowerCase();

  const matchesGroup = groupValue === 'all' || idea.group === groupValue;
  const matchesPriority = priorityValue === 'all' || idea.priority === priorityValue;
  const haystack = `${idea.title} ${idea.group} ${idea.summary}`.toLowerCase();
  const matchesSearch = !term || haystack.includes(term);

  return matchesGroup && matchesPriority && matchesSearch;
}

function renderIdeas() {
  const filteredIdeas = IDEAS.filter(matchesFilters);
  ideasGrid.innerHTML = '';

  if (!filteredIdeas.length) {
    ideasGrid.innerHTML = '<div class="empty-state">No ideas matched your current filters. Try broadening the search.</div>';
  } else {
    filteredIdeas.forEach((idea) => ideasGrid.appendChild(createCard(idea)));
  }

  resultsCount.textContent = `${filteredIdeas.length} of ${IDEAS.length} ideas shown`;
}

function renderFeatured() {
  featuredGrid.innerHTML = '';
  FEATURED_IDS.map((id) => IDEAS.find((idea) => idea.id === id))
    .filter(Boolean)
    .forEach((idea) => featuredGrid.appendChild(createCard(idea)));
}

function renderHeroStats() {
  const counts = {
    total: IDEAS.length,
    now: IDEAS.filter((idea) => idea.priority === 'Now').length,
    next: IDEAS.filter((idea) => idea.priority === 'Next').length,
    groups: uniqueGroups().length - 1,
  };

  heroStats.innerHTML = [
    `${counts.total} total ideas`,
    `${counts.now} ready now`,
    `${counts.next} queued next`,
    `${counts.groups} strategic groups`,
  ]
    .map((label) => `<span class="stat-pill">${label}</span>`)
    .join('');
}

[groupFilter, priorityFilter, searchInput].forEach((element) => {
  element.addEventListener('input', renderIdeas);
  element.addEventListener('change', renderIdeas);
});

renderGroupOptions();
renderFeatured();
renderHeroStats();
renderIdeas();
