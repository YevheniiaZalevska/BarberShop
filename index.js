//---------------------------------------- menu

const menuBttns = document.querySelectorAll('[data-menu-button]');
const mobileMenuRef = document.querySelector('[data-menu]');
const menuOverlay = document.querySelector('.menu__overlay');

menuBttns.forEach(el => el.addEventListener('click', toggleMenuVisibility));
menuOverlay.addEventListener('click', toggleMenuVisibility);
mobileMenuRef.addEventListener('click', e => {
  if (e.target.nodeName !== 'A') return;
  if (e.target.nodeName === 'A') {
    document.body.classList.remove('is-menu-shown');
  }
});

function toggleMenuVisibility() {
  const expanded = document.body.classList.contains('is-menu-shown');

  menuBttns.forEach(el => el.setAttribute('aria-expanded', !expanded));
  document.body.classList.toggle('is-menu-shown');

  expanded
    ? document.body.removeEventListener('keydown', onKeyDown)
    : document.body.addEventListener('keydown', onKeyDown);
}

function onKeyDown(event) {
  event.code === 'Escape' ? toggleMenuVisibility() : null;
}


//---------------------------------------- modal
!(function (e) {
  'function' != typeof e.matches &&
    (e.matches =
      e.msMatchesSelector ||
      e.mozMatchesSelector ||
      e.webkitMatchesSelector ||
      function (e) {
        for (
          var t = this,
            o = (t.document || t.ownerDocument).querySelectorAll(e),
            n = 0;
          o[n] && o[n] !== t;

        )
          ++n;
        return Boolean(o[n]);
      }),
    'function' != typeof e.closest &&
      (e.closest = function (e) {
        for (var t = this; t && 1 === t.nodeType; ) {
          if (t.matches(e)) return t;
          t = t.parentNode;
        }
        return null;
      });
})(window.Element.prototype);

document.addEventListener('DOMContentLoaded', function () {
  /* Записываем в переменные массив элементов-кнопок и подложку.
      Подложке зададим id, чтобы не влиять на другие элементы с классом overlay*/
  var modalButtons = document.querySelectorAll('.js-open-modal'),
    overlay = document.querySelector('.js-overlay-modal'),
    closeButtons = document.querySelectorAll('.js-modal-close');

  /* Перебираем массив кнопок */
  modalButtons.forEach(function (item) {
    /* Назначаем каждой кнопке обработчик клика */
    item.addEventListener('click', function (e) {
      /* Предотвращаем стандартное действие элемента. Так как кнопку разные
            люди могут сделать по-разному. Кто-то сделает ссылку, кто-то кнопку.
            Нужно подстраховаться. */
      e.preventDefault();

      /* При каждом клике на кнопку мы будем забирать содержимое атрибута data-modal
            и будем искать модальное окно с таким же атрибутом. */
      var modalId = this.getAttribute('data-modal'),
        modalElem = document.querySelector(
          '.modal[data-modal="' + modalId + '"]'
        );

      /* После того как нашли нужное модальное окно, добавим классы
            подложке и окну чтобы показать их. */
      modalElem.classList.add('active');
      overlay.classList.add('active');
      document.body.classList.add('modal-open');
      document.body.classList.remove('is-menu-shown');
    }); // end click
  }); // end foreach

  closeButtons.forEach(function (item) {
    item.addEventListener('click', function (e) {
      var parentModal = this.closest('.modal');

      parentModal.classList.remove('active');
      overlay.classList.remove('active');
      document.body.classList.remove('modal-open');
    });
  }); // end foreach

  document.body.addEventListener(
    'keyup',
    function (e) {
      var key = e.keyCode;

      if (key == 27) {
        document.querySelector('.modal.active').classList.remove('active');
        document.querySelector('.overlay').classList.remove('active');
      }
    },
    false
  );

  overlay.addEventListener('click', function () {
    document.querySelector('.modal.active').classList.remove('active');
    this.classList.remove('active');
    document.body.classList.remove('modal-open');
  });
}); 


//---------------------------------------- to-top 

const toTopButton = document.querySelector('.scroll-to-top');

window.onscroll = () => changeScrollButtonVisibility();

toTopButton.addEventListener('click', () =>
  document.getElementById('header').scrollIntoView()
);

function changeScrollButtonVisibility() {
  const offsetTrigger = 80;
  const pageOffset = window.pageYOffset;

  if (pageOffset > offsetTrigger) {
    toTopButton.classList.remove('js-transparent');
  } else {
    toTopButton.classList.add('js-transparent');
  }
}


//---------------------------------------- agreement 

const termsCheckBox = document.querySelector('[data-modal-checkbox]');

termsCheckBox.addEventListener('click', e => {
  terms_changed(e.target);
});

//JavaScript function that enables or disables a submit button depending
//on whether a checkbox has been ticked or not.
function terms_changed(termsCheckBox) {
  //If the checkbox has been checked
  if (termsCheckBox.checked) {
    //Set the disabled property to FALSE and enable the button.
    document.querySelector('[data-submit-btn]').disabled = false;
  } else {
    //Otherwise, disable the submit button.
    document.querySelector('[data-submit-btn]').disabled = true;
  }
}


//--------------------------------------------- form

import Throttle from 'lodash.throttle';
const STORAGE_KEY = 'modal-form';
const CONTACT_KEY = 'contact-form';

const overlay = document.querySelector('.js-overlay-modal ');
const modal = document.querySelector('.modal-wrapper');

// Modal in header and others

const modal_form = document.querySelector('.modal__form');

modal_form.addEventListener('submit', evt => {
  evt.preventDefault();

  evt.currentTarget.reset();
  localStorage.removeItem(STORAGE_KEY);
  overlay.classList.remove('active');
  modal.classList.remove('active');
});

modal_form.addEventListener(
  'input',
  Throttle(evt => {
    let formData = localStorage.getItem(STORAGE_KEY);
    formData = formData ? JSON.parse(formData) : {};

    formData[evt.target.name] = evt.target.value;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, 500)
);
initForm();
function initForm() {
  let parsedData = localStorage.getItem(STORAGE_KEY);

  if (parsedData) {
    parsedData = JSON.parse(parsedData);

    Object.entries(parsedData).forEach(([name, value]) => {
      modal_form.elements[name].value = value;
    });
  }
}

// Contacts section

const send = document.querySelector('.contacts__form');

send.addEventListener('submit', evt => {
  evt.preventDefault();

  evt.currentTarget.reset();
  localStorage.removeItem(CONTACT_KEY);
});

send.addEventListener(
  'input',
  Throttle(evt => {
    let formData = localStorage.getItem(CONTACT_KEY);
    formData = formData ? JSON.parse(formData) : {};

    formData[evt.target.name] = evt.target.value;

    localStorage.setItem(CONTACT_KEY, JSON.stringify(formData));
  }, 500)
);

checkStorage();

function checkStorage() {
  let parsedData = localStorage.getItem(CONTACT_KEY);

  if (parsedData) {
    parsedData = JSON.parse(parsedData);

    Object.entries(parsedData).forEach(([name, value]) => {
      send.elements[name].value = value;
    });
  }
}