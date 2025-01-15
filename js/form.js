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

// / Contacts section

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