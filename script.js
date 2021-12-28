'use strict';

///////////////////////////////////////
//REVEALING SECTIONS
const allSections = document.querySelectorAll('.section');
//MODAL
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
//NAV FADING
const nav = document.querySelector('.nav');
//STICKY NAV
const header = document.querySelector('.header');
//LAZY IMAGES
const imgs = document.querySelectorAll('img[data-src]');
//SCROLLING
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
//OPERATIONS
const tabContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabContent = document.querySelectorAll('.operations__content');
//SLIDER
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const btnNext = document.querySelector('.slider__btn--right');
const btnPrevious = document.querySelector('.slider__btn--left');
const dotContainer = document.querySelector('.dots');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
const fadingNav = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const siblings = e.target.closest('.nav').querySelectorAll('.nav__link');
    const logo = e.target.closest('.nav').querySelector('img');
    siblings.forEach(s => {
      if (s != e.target) s.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
// MODAL WINDOW
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//SCROLLING TO FEATURES SECTION
btnScrollTo.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
});
//SCROLLING TO SECTIONS
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//HANDLING TAB CONTAINER
tabContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  //guard class for null
  if (!clicked) return;
  //Remove Active class for all tabs
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabContent.forEach(t => {
    t.classList.remove('operations__content--active');
  });
  //Add active class for target tab
  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//FADING IN NAV BAR
nav.addEventListener('mouseover', fadingNav.bind(0.5));
nav.addEventListener('mouseout', fadingNav.bind(1));

//STICKY NAV
const stickyNavCallback = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else nav.classList.remove('sticky');
};
const navObserver = new IntersectionObserver(stickyNavCallback, {
  root: null,
  threshold: 0,
  rootMargin: `-${nav.getBoundingClientRect().height}px`,
});
navObserver.observe(header);

//REVEALING SECTIONS
const revealSections = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSections, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(section => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

//LAZY LOADING IMAGES
const loadImgs = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
    observer.unobserve(entry.target);
  });
};
const imgObserver = new IntersectionObserver(loadImgs, {
  root: null,
  threshold: 1,
});
imgs.forEach(img => {
  imgObserver.observe(img);
});

//SLIDER
const sliderFunction = function () {
  let currSlide = 0;
  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  const gotoDot = function (dot) {
    document.querySelectorAll('.dots__dot').forEach(d => {
      d.classList.remove('dots__dot--active');
    });
    document
      .querySelector(`.dots__dot[data-slide="${dot}"]`)
      .classList.add('dots__dot--active');
  };
  const gotoSlide = function (current) {
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${(i - current) * 100}%)`;
    });
  };
  const nextSlide = function () {
    if (
      currSlide === slides.length - 1 ||
      currSlide === String(slides.length - 1)
    )
      currSlide = 0;
    else currSlide++;
    gotoSlide(currSlide);
    gotoDot(currSlide);
  };
  const prevSlide = function () {
    if (currSlide === 0 || currSlide === '0') currSlide = slides.length - 1;
    else currSlide--;
    gotoSlide(currSlide);
    gotoDot(currSlide);
  };
  const init = function () {
    createDots();
    gotoDot(0);
    gotoSlide(0);
  };
  init();
  btnNext.addEventListener('click', nextSlide);
  btnPrevious.addEventListener('click', prevSlide);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;
      gotoSlide(slide);
      gotoDot(slide);
      currSlide = slide;
    }
  });
};
sliderFunction();
/////////////////////////////////////
/////////////////////////////////////////////
const allButtons = document.getElementsByTagName('button');

// const message = document.createElement('div');
// message.classList.add('cookie-message');

// message.innerHTML =
//   'Please accept our cookies, for providing better functionality <button class="btn btn--close--cookie">I accept</button>';

// const cookie = setInterval(function () {
//   header.append(message);
//   document
//     .querySelector('.btn--close--cookie')
//     .addEventListener('click', function () {
//       message.remove();
//     });
//   clearInterval(cookie);
// }, 2000);
