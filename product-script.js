// ===== ПЕРЕКЛЮЧЕНИЕ ТОВАРОВ ПО ID =====
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id') || 4;

// Скрываем все товары
document.querySelectorAll('.product-detail').forEach(el => el.style.display = 'none');
document.querySelectorAll('.reviews-section').forEach(el => el.style.display = 'none');

// Показываем нужный
const productEl = document.getElementById('product' + productId);
const reviewsEl = document.getElementById('reviews' + productId);

if (productEl) productEl.style.display = 'grid';
if (reviewsEl) reviewsEl.style.display = 'block';

// ===== ГАЛЕРЕЯ: КЛИК ПО МИНИАТЮРАМ =====
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('thumbnail')) {
        const parentGallery = e.target.closest('.gallery');
        if (parentGallery) {
            // Убираем активный класс
            parentGallery.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');

            // Меняем главное изображение
            const mainImage = parentGallery.querySelector('.main-image img');
            if (mainImage) {
                const newSrc = e.target.getAttribute('data-main');
                if (newSrc) {
                    mainImage.src = newSrc;
                }
            }
        }
    }
});

// ===== ДОБАВЛЕНИЕ ОТЗЫВОВ =====
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-submit-review')) {
        const targetId = e.target.getAttribute('data-target');

        // Получаем данные из формы
        const authorInput = document.getElementById('reviewAuthor' + targetId);
        const ratingSelect = document.getElementById('reviewRating' + targetId);
        const textInput = document.getElementById('reviewText' + targetId);

        const author = authorInput.value.trim();
        const rating = ratingSelect.value;
        const text = textInput.value.trim();

        // Проверка: все поля должны быть заполнены
        if (!author) {
            alert('Пожалуйста, введите ваше имя');
            authorInput.focus();
            return;
        }

        if (!text) {
            alert('Пожалуйста, напишите отзыв');
            textInput.focus();
            return;
        }

        // Текущая дата
        const now = new Date();
        const date = now.getDate() + ' ' +
            ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
             'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'][now.getMonth()] +
            ' ' + now.getFullYear();

        // Создаём новый отзыв
        const reviewHTML = `
            <div class="review">
                <div class="review-header">
                    <span class="review-author">${author}</span>
                    <span class="review-rating">${rating}</span>
                    <span class="review-date">${date}</span>
                </div>
                <p class="review-text">${text}</p>
            </div>
        `;

        // Добавляем отзыв в контейнер
        const container = document.getElementById('reviewsContainer' + targetId);
        if (container) {
            container.insertAdjacentHTML('beforeend', reviewHTML);

            // Очищаем поля
            authorInput.value = '';
            textInput.value = '';
            ratingSelect.value = '⭐⭐⭐⭐';

            // Сообщение об успехе
            alert('✅ Спасибо! Ваш отзыв добавлен.');
        }
    }
});

// ===== АКТИВНАЯ МИНИАТЮРА ПРИ ЗАГРУЗКЕ =====
document.addEventListener('DOMContentLoaded', function() {
    // Делаем первую миниатюру активной
    document.querySelectorAll('.gallery').forEach(gallery => {
        const firstThumb = gallery.querySelector('.thumbnail');
        if (firstThumb) {
            firstThumb.classList.add('active');
        }
    });
});