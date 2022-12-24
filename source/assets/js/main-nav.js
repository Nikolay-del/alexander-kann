const mainNav = document.querySelector('.main-nav');
const burgerButton = mainNav.querySelector('.main-nav__button-burger');

burgerButton.addEventListener('click', () => {
  console.log('ddd')
  if (mainNav.classList.contains('main-nav--closed')) {
    document.body.classList.add('open-header')
    mainNav.classList.remove('main-nav--closed');
    mainNav.classList.add('main-nav--opened');
    console.log('+')
  } else {
    document.body.classList.remove('open-header')
    mainNav.classList.add('main-nav--closed');
    mainNav.classList.remove('main-nav--opened');
    console.log('-')
  }
})
