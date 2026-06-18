// ===== ДАННЫЕ ТОВАРОВ =====
const allItems = [
    { id: 1, name: "Платье", category: "женская", price: 89, rating: 4.8 },
    { id: 2, name: "Блузка", category: "женская", price: 55, rating: 4.5 },
    { id: 3, name: "Юбка", category: "женская", price: 65, rating: 4.3 },
    { id: 4, name: "Костюм", category: "мужская", price: 199, rating: 4.9 },
    { id: 5, name: "Рубашка", category: "мужская", price: 45, rating: 4.4 },
    { id: 6, name: "Джинсы", category: "мужская", price: 75, rating: 4.6 }
];

// ===== ПЕРЕМЕННЫЕ =====
let currentItems = [...allItems];
let currentPage = 1;
const itemsPerPage = 3;
let currentSort = null;
let sortAsc = true;

// ===== ПОИСК =====
function filterItems(searchText) {
    const text = searchText.toLowerCase().trim();

    if (!text) {
        currentItems = [...allItems];
    } else {
        currentItems = allItems.filter(item =>
            item.name.toLowerCase().includes(text) ||
            item.category.toLowerCase().includes(text)
        );
    }

    if (currentSort) {
        applySort();
    } else {
        currentPage = 1;
        render();
    }
}

// ===== СОРТИРОВКА =====
function applySort() {
    if (currentSort === 'name') {
        currentItems.sort((a, b) => {
            return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        });
    } else if (currentSort === 'price') {
        currentItems.sort((a, b) => {
            return sortAsc ? a.price - b.price : b.price - a.price;
        });
    } else if (currentSort === 'rating') {
        currentItems.sort((a, b) => {
            return sortAsc ? a.rating - b.rating : b.rating - a.rating;
        });
    }

    currentPage = 1;
    render();
    updateSortButtons();
}

// ===== ПЕРЕКЛЮЧЕНИЕ СОРТИРОВКИ =====
function toggleSort(sortType) {
    if (currentSort === sortType) {
        sortAsc = !sortAsc;
    } else {
        currentSort = sortType;
        sortAsc = true;
    }
    applySort();
}

// ===== ОБНОВЛЕНИЕ КНОПОК СОРТИРОВКИ =====
function updateSortButtons() {
    const buttons = document.querySelectorAll('.sort-btn');

    buttons.forEach(btn => {
        const sortType = btn.getAttribute('data-sort');
        if (!sortType) return;

        btn.style.background = '#f0f0f0';
        btn.style.color = '#333';

        if (currentSort === sortType) {
            btn.style.background = '#ff6b6b';
            btn.style.color = 'white';

            const label = sortType === 'name' ? 'имени' :
                         sortType === 'price' ? 'цене' : 'рейтингу';
            btn.textContent = `По ${label} ${sortAsc ? '↑' : '↓'}`;
        } else {
            const label = sortType === 'name' ? 'имени' :
                         sortType === 'price' ? 'цене' : 'рейтингу';
            btn.textContent = `По ${label} ↑`;
        }
    });
}

// ===== ОТОБРАЖЕНИЕ ТОВАРОВ =====
function render() {
    const container = document.getElementById('itemsContainer');
    const pagination = document.getElementById('pagination');

    // Скрываем все товары
    const allItemsInDOM = container.querySelectorAll('.item');
    allItemsInDOM.forEach(item => item.style.display = 'none');

    // Пагинация
    const totalPages = Math.ceil(currentItems.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = currentItems.slice(start, end);

    // Показываем нужные товары
    pageItems.forEach(item => {
        const element = container.querySelector(`.item[data-id="${item.id}"]`);
        if (element) {
            element.style.display = 'block';
        }
    });

    // Сообщение "ничего не найдено"
    if (currentItems.length === 0) {
        const noResults = document.createElement('p');
        noResults.className = 'no-results';
        noResults.textContent = '😕 Товары не найдены';
        container.appendChild(noResults);
    } else {
        const existing = container.querySelector('.no-results');
        if (existing) existing.remove();
    }

    // Пагинация
    if (totalPages > 1) {
        let pagesHtml = '';
        for (let i = 1; i <= totalPages; i++) {
            pagesHtml += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        pagination.innerHTML = pagesHtml;
    } else {
        pagination.innerHTML = '';
    }

    updateSortButtons();
}

// ===== ПАГИНАЦИЯ =====
function goToPage(page) {
    const totalPages = Math.ceil(currentItems.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    render();
}

// ===== СБРОС =====
function resetFilters() {
    document.getElementById('searchInput').value = '';
    currentItems = [...allItems];
    currentSort = null;
    sortAsc = true;
    currentPage = 1;
    render();
    updateSortButtons();
}

// ===== СОБЫТИЯ =====
document.addEventListener('DOMContentLoaded', function() {
    render();
    updateSortButtons();

    // Поиск
    document.getElementById('searchInput').addEventListener('input', function() {
        filterItems(this.value);
    });

    // Кнопки сортировки
    document.querySelectorAll('.sort-btn').forEach(btn => {
        const sortType = btn.getAttribute('data-sort');
        if (sortType) {
            btn.addEventListener('click', function() {
                toggleSort(sortType);
            });
        }
    });

    // Кнопка сброса
    document.getElementById('resetFilters').addEventListener('click', resetFilters);

    // Клики по пагинации
    document.getElementById('pagination').addEventListener('click', function(e) {
        if (e.target.classList.contains('page-btn')) {
            const page = parseInt(e.target.getAttribute('data-page'));
            goToPage(page);
        }
    });
});