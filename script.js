const API = "https://quote-garden.onrender.com/api/v3/quotes/random"

const QuoteApp = document.getElementById('random-quote');
const favQuotes = document.getElementById('favorite-quotes')

const addBtn = document.querySelector('.add');

const nextBtn = document.querySelector('.next');

const goToFavBtn = document.getElementById('favorites-button');
const exitFavBtn = document.querySelector('.exit-fav-button');

let data;
let count = 1;


addBtn.addEventListener('click', ()=> {
  if (addBtn.classList.contains('active')) {
    addBtn.classList.remove('active');
    
    deleteQuoteLS(data);
    loadFavQuoteLS();
  } else {
    addBtn.classList.add('active');

    addToFavQuote(data, count);
    addQuoteLS(data);

    count += 1;
  }
});



nextBtn.addEventListener('click', async()=>{
  data = await randomQuote();
})


goToFavBtn.addEventListener('click', ()=>{
  QuoteApp.classList.add('hidden');
  favQuotes.classList.remove('hidden');
})

exitFavBtn.addEventListener('click', ()=>{
  QuoteApp.classList.remove('hidden');
  favQuotes.classList.add('hidden');
})

//Display some random Quotes after first load
window.addEventListener('keydown', (e)=>{
  if (e.key === 'Enter') {
    nextBtn.click();
  }
})
window.onload = async()=>{
  loadFavQuoteLS();

  data = await randomQuote();
}


async function getRandomQuote () {
  const resp = await fetch(API);
  const respData = await resp.json();
  return respData.data[0];
}

function renderQuote (data) {
  const quoteEl = document.querySelector('.quote');
  const authorEl = document.querySelector('.author');
  const genreEl = document.querySelector('.genre');
  
  if (data === undefined) {
    return;
  }

  quoteEl.innerText = data.quoteText;
  authorEl.innerText = "- " + data.quoteAuthor;
  genreEl.innerHTML = `Genre: <span class="genre-undrln">${(data.quoteGenre).slice(0, 1).toUpperCase() + data.quoteGenre.slice(1)}</span>`
}


async function randomQuote() {
  const data = await getRandomQuote();
  addBtn.classList.remove('active'); 

  renderQuote(data);

  return data;
}

//add the quote to favorites
function addToFavQuote (data, count) {
  const favQuote = document.createElement('div');
  favQuote.classList.add('fav-quote');
  favQuote.innerHTML = `
    <span class="fav-num">${count}</span>

    <div class="fav-quote-author">
      <p class="fav-quote-text">
        "${data.quoteText}"
      </p>
      <p class="fav-author-text">
        ${data.quoteAuthor}
      </p>
    </div>
    
    <p class="genre-text">
      ${(data.quoteGenre).slice(0, 1).toUpperCase() + data.quoteGenre.slice(1)}
    </p>

    <button class="remove-fav">
      <i class="fa-sharp fa-solid fa-trash"></i>
    </button>
  `;

  const removeBtn = favQuote.querySelector('.remove-fav');

  removeBtn.addEventListener('click', ()=>{
    favQuote.remove();
    deleteQuoteLS(data);
    loadFavQuoteLS();
  })
  

  favQuotes.append(favQuote);
}

function addQuoteLS (data) {
  const quotes = getQuotesLS();
  quotes.push(data);

  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function deleteQuoteLS (data) {
  const quotes = getQuotesLS();

  if (quotes) {
    quotes.forEach((quote, index)=>{
      if (JSON.stringify(quote) === JSON.stringify(data)) {
        console.log(index);
        quotes.splice(index, 1);
      }
    })
  } else {
    return;
  }
  console.log(quotes);
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function getQuotesLS () {
  const quotes = JSON.parse(localStorage.getItem('quotes'));
  return quotes || [];
}

//after deleting from fav, this can be call to update the counting of quotes
function loadFavQuoteLS() {
  //first remove all the fav-quote
  const allFavQuote = favQuotes.querySelectorAll('.fav-quote');
  count = 1;

  allFavQuote.forEach(favQuote=>{
    favQuote.remove()
  })

  let quoteLS = getQuotesLS();

  if (quoteLS) {
    quoteLS.forEach(quote=>{
      addToFavQuote(quote, count);
      count += 1;
    })
  } 
}