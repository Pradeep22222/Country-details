'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
const renderError = function (error) {
  countriesContainer.insertAdjacentText('beforeend', error);
  //countriesContainer.style.opacity = 1; As we put it in the finally method of promise as we wanted it on both success or rejection
  // case of rendering
};
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
  // countriesContainer.style.opacity = 1; As we put it in the finally method of promise as we wanted it on both success or rejection
  // case of rendering
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
// Now lets work on rejected promises handling baby
// const getCountryData1 = function (country) {
//   fetch(`https://restcountries.com/v3.1/name/${country}`)
//     .then(
//       function (response) {
//         return response.json();
//       },
//       // this is the another call back function which we pass with the first then method on the fetch to catch error or to handle the error
//       err => {
//         alert(err);
//       }
//     )
//     .then(function (datas) {
//       const [data] = datas;
//       renderCountry(data);
//       const neighbour = Object.values(data.borders)[0];
//       if (!neighbour) {
//         return;
//       }
//       return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`);
//     })
//     .then(
//       function (response) {
//         return response.json();
//       },
//       function (error) {
//         //This is the error handling for this another chained fetch Ajax call
//         alert(error);
//       }
//     )
//     .then(function (data) {
//       const [data2] = data;
//       renderCountry(data2, 'neighbourCountry');
//     });
// };

/// Here we make fetch request inside the last call back of the first fetch
/// but but apply then method outside the callback from all the beginning again.
// If we use then method along with this together it will be a  callback again

//   As in above chained fetch request, we can see the error handling call back function passed in two different request separately, we can avoid doing it by simpley
// passing a single fetch method at the end of the chain as below:
// const getCountryData2 = function (country) {
//   fetch(`https://restcountries.com/v3.1/name/${country}`)
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (datas) {
//       const [data] = datas;
//       renderCountry(data);
//       const neighbour = Object.values(data.borders)[0];
//       if (!neighbour) {
//         return;
//       }
//       return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`);
//     })
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       const [data2] = data;
//       renderCountry(data2, 'neighbourCountry');
//     })
//     .catch(err => {
//       renderError(err);
//     })
//     .finally(() => {
//       countriesContainer.style.opacity = 1;
//     });
// };
btn.addEventListener('click', function () {
  getCountryData2('dafds');
});
// Here it looks like there is only one error handling .
// But the fetch method pass the value in such a way that the error handling function will now be available on all request as if they were the second call back from
// function for error handling on the first then method of all requests.
// So if there were different types of errors for different request,  it will be treated like it was the same error for all requests because the same single fetch method was called
// is going into all requests for handling the error.

// Throwing errors manually
const getCountryData2 = function (country) {
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(function (response) {
      //  following is the three lines to throw the errors manually. Here if the response.ok is false we are throwing an error
      if (!response.ok) {
        throw new Error(`country not found ${response.status}`);
      }
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
    })
    .catch(err => {
      renderError(err);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};
