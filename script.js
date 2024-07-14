const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const newsContainer = document.getElementById('news-container');
const shimmerContainer = document.getElementById('shimmer-container');
const navBtns = document.querySelectorAll('.nav-btn');

const API_KEY = '6hPTKDip1AXnwFb1iicwShoghYU09B';

const fetchNews = async (url) => {
    displayShimmer();
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayNews(data.articles);
    } catch (error) {
        console.error('Error fetching the news:', error);
    } finally {
        hideShimmer();
    }
};

const displayShimmer = () => {
    shimmerContainer.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        const shimmerCard = document.createElement('div');
        shimmerCard.className = 'shimmer-wrapper';
        shimmerCard.innerHTML = `
            <div class="shimmer-img"></div>
            <div class="shimmer-title"></div>
            <div class="shimmer-desc"></div>
            <div class="shimmer-desc"></div>
        `;
        shimmerContainer.appendChild(shimmerCard);
    }
    shimmerContainer.style.display = 'grid';
    newsContainer.style.display = 'none';
};

const hideShimmer = () => {
    shimmerContainer.style.display = 'none';
    newsContainer.style.display = 'grid';
};

const displayNews = (articles) => {
    newsContainer.innerHTML = '';
    articles.forEach(article => {
        if (!article.urlToImage || !article.url) {
            return;
        }
        const newsArticle = document.createElement('article');
        newsArticle.innerHTML = `
            <img src="${article.urlToImage}" alt="${article.title}">
            <h2>${article.title}</h2>
            <p>${article.description}</p>
            <a href="${article.url}" >Read more</a>
        `;
        newsArticle.addEventListener('click', () => {
            window.location.href = article.url;
        });
        newsContainer.appendChild(newsArticle);
    });
};

searchBtn.addEventListener('click', () => {
    const query = searchInput.value;
    if (query) {
        const searchUrl = `https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}`;
        fetchNews(searchUrl);
        searchInput.value = ''; // Clear the search input box
    }
});

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-category');
        document.title = `The Global Chronicle | ${category}`;
        let categoryUrl;

        if (category === 'other') {
            categoryUrl = `https://newsapi.org/v2/top-headlines?country=us&category=general&apiKey=${API_KEY}`;
        } else {
            categoryUrl = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`;
        }

        fetchNews(categoryUrl);
        navBtns.forEach(button => button.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Fetch general news by default on page load and set the "News" button as active
window.onload = () => {
    const generalNewsUrl = `https://newsapi.org/v2/top-headlines?country=us&category=general&apiKey=${API_KEY}`;
    fetchNews(generalNewsUrl);
    document.querySelector('.nav-btn[data-category="general"]').classList.add('active');
};
