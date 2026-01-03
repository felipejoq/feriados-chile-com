export interface FilterState {
  activeTypeFilter: string | null;
  activeMonthFilter: number | null;
  activeSearchQuery: string;
}

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function filterCards(filters: FilterState): void {
  const allCards = document.querySelectorAll<HTMLElement>('.holiday-card');
  let visibleCount = 0;

  allCards.forEach((card) => {
    const type = card.dataset.holidayType || '';
    const month = card.dataset.holidayMonth || '';
    const searchableText = [
      card.dataset.holidayDescription,
      card.dataset.holidayBeneficiaries,
      card.dataset.holidayLegal,
      card.dataset.holidayLongDate,
      card.dataset.holidayId?.replace('-', ' '),
      type.toLowerCase(),
    ].join(' ');

    const matchesType = !filters.activeTypeFilter || type === filters.activeTypeFilter;
    const matchesMonth = !filters.activeMonthFilter || parseInt(month) === filters.activeMonthFilter;
    const matchesSearch = !filters.activeSearchQuery || normalize(searchableText).includes(normalize(filters.activeSearchQuery.trim()));

    if (matchesType && matchesMonth && matchesSearch) {
      card.style.display = '';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  const noResultsMessage = document.getElementById('no-results-message');
  if (noResultsMessage) {
    if (visibleCount === 0) {
      noResultsMessage.classList.remove('hidden');
    } else {
      noResultsMessage.classList.add('hidden');
    }
  }
}

export function setupFilterListeners(filterState: FilterState): void {
  // Listener para cambios en el tipo de feriado
  document.addEventListener('holiday-type-change', ((e: CustomEvent) => {
    filterState.activeTypeFilter = e.detail.type;
    filterCards(filterState);
  }) as EventListener);

  // Listener para cambios en el mes
  document.addEventListener('holiday-month-change', ((e: CustomEvent) => {
    filterState.activeMonthFilter = e.detail.month;
    filterCards(filterState);
  }) as EventListener);

  // Listener para búsqueda
  document.addEventListener('holiday-search-change', ((e: CustomEvent) => {
    filterState.activeSearchQuery = e.detail.query;
    filterCards(filterState);
  }) as EventListener);

  // Listener para reset de filtros
  document.addEventListener('holiday-filters-reset', () => {
    filterState.activeTypeFilter = null;
    filterState.activeMonthFilter = null;
    filterState.activeSearchQuery = '';
    filterCards(filterState);
  });
}
