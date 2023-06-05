import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const API_KEY = '37052329-2dd91dbcff678e92a49d718af';
const BASE_URL = `https://pixabay.com/api/?key=${API_KEY}&image_type=photo&orientation=horizontal&safesearch=true`;

const lightbox = new SimpleLightbox('.gallery a');

let currentPage = 1;
let searchQuery = '';
form.addEventListener('submit', event => {
  event.preventDefault();
  searchQuery = event.target.elements.searchQuery.value.trim();

  if (searchQuery) {
    currentPage = 1;
    clearGallery();
    searchImages();
  }
});

loadMoreBtn.addEventListener('click', () => {
  currentPage++;
  searchImages();
});
async function searchImages() {
  const url = `${BASE_URL}&q=${searchQuery}&page=${currentPage}`;

  try {
    const response = await axios.get(url);

    if (response.data.hits.length === 0) {
      if (currentPage === 1) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    } else {
      renderImages(response.data.hits);
      if (currentPage === 1) {
        Notiflix.Notify.success(
          `Hooray! We found ${response.data.totalHits} images.`
        );
      }
      lightbox.refresh();
      smoothScroll();
    }
  } catch (error) {
    Notiflix.Notify.failure(
      'Oops! Something went wrong. Please try again later.'
    );
  }
}
function smoothScroll() {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
function renderImages(images) {
  images.forEach(image => {
    const photoCard = document.createElement('div');
    photoCard.classList.add('photo-card');

    const img = document.createElement('img');
    img.src = image.webformatURL;
    img.alt = image.tags;
    img.loading = 'lazy';

    const info = document.createElement('div');
    info.classList.add('info');

    const likes = document.createElement('p');
    likes.classList.add('info-item');
    likes.innerHTML = `<b>Likes:</b> ${image.likes}`;

    const views = document.createElement('p');
    views.classList.add('info-item');
    views.innerHTML = `<b>Views:</b> ${image.views}`;

    const comments = document.createElement('p');
    comments.classList.add('info-item');
    comments.innerHTML = `<b>Comments:</b> ${image.comments}`;

    const downloads = document.createElement('p');
    downloads.classList.add('info-item');
    downloads.innerHTML = `<b>Downloads:</b> ${image.downloads}`;

    info.appendChild(likes);
    info.appendChild(views);
    info.appendChild(comments);
    info.appendChild(downloads);
    photoCard.appendChild(img);
    photoCard.appendChild(info);
    gallery.appendChild(photoCard);
  });

  if (gallery.children.length > 0) {
    loadMoreBtn.style.display = 'block';
  } else {
    loadMoreBtn.style.display = 'none';
  }
}
function clearGallery() {
  gallery.innerHTML = '';
  loadMoreBtn.style.display = 'none';
}
