'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
const renderCountry = function (data, className) {
  const language = Object.values(data.languages);
  const currency = Object.values(data.currencies);
  const html = `
         <article class="country ${className}">
          <img class="country__img" src="${data.flags.svg}" />
          <div class="country__data">
            <h3 class="country__name">${data.name.common}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(
              +data.population / 1000000
            ).toFixed(1)} million</p>
            <p class="country__row"><span>🗣️</span>${language[0]}</p>
            <p class="country__row"><span>💰</span>${currency[0].name}</p>
          </div>
        </article>`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};
// const getCountriesData = function (country) {
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
//   request.send();
//   request.addEventListener('load', function () {
//     const [data] = JSON.parse(this.responseText);
//     renderCountry(data);
//     const neighbour = Object.values(data.borders);
//     const request2 = new XMLHttpRequest();
//     request2.open(
//       'GET',
//       `https://restcountries.com/v3.1/alpha/${neighbour[0]}`
//     );
//     request2.send();
//     request2.addEventListener('load', function () {
//       const [data2] = JSON.parse(this.responseText);
//       renderCountry(data2, 'neighbourCountry');
//     });
//   });
// };

// getCountriesData('nepal');

// Here we are doing AJAX call using modern ES6 feature call fetch API method.
// It might be  better idea to use arrow function in the following case
const getCountryData = function (country) {
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (datas) {
      const [data] = datas;
      renderCountry(data);
      const neighbour = Object.values(data.borders)[0];
      if (!neighbour) {
        return;
      }
      return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`);
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const [data2] = data;
      renderCountry(data2, 'neighbourCountry');
    });
};
getCountryData('nepal');
/// Here we make fetch request inside the last call back of the first fetch
/// but but apply then method outside the callback from all the beginning again.
// If we use then method along with this together it will be a  callback again
