const cartItems = '.cart__items';
// cria imagens que serão renderizadas no browser
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// cria elementos e classes no html
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// ==============================
// Requisito 1
// 1o passo: pegar os valores do JSON e enviar pro html de forma dinâmica
// 2o passo Requisito 1 - usar os valores do json e adicioná-los ao html em suas sections.
// ==============================

// 2o passo Requisito 1 - função já existente
function createProductItemElement({ id: sku, title: name, thumbnail: image }) { // desestruturando. Id, Title e Thumbnail são chaves do json(resposta da API) que contem as informações que preciso nos parâmetros sku, name e img. Ta informado no requisito.
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// 1o passo do requisito 1 - teve que criar essa função para pegar os elementos jo json e mandar pro html.
const getJson = async (query) => {
  const fetchApi = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=$${query}`);
  const apiJson = await fetchApi.json();
  const products = apiJson.results; // retorna um array com todos os computadores
  products.forEach((product) => document.querySelector('.items') // percorre cada computador que tem a classe items e cria o elemento no hatml correspondente a cada um
    .appendChild(createProductItemElement(product))); // usa a função createProductElement (que já existia) para executar os outros passos de colocar os elementos nas sections.
};

// =====================================
// Requisito 4 
// Carregar o carrinho de acordo com o local Storage
// 1o passo: criar uma função pra fazer o setItem do local storage
// 2o passo: chama a função no evento de clique cartItemClickListener
// 3o passo: fazer o getItem nos itens do local storage
// 4o passo: chamar a função setItemsLocalStorage() no evento de click
// =====================================

// 1o passo do requisito 4
const setItemsLocalStorage = () => {
  const ol = document.querySelector(cartItems); // recupera a ol
  const text = ol.innerHTML; 
  localStorage.setItem('cartList', '');
  localStorage.setItem('cartList', JSON.stringify(text));
};

// =====================================
// Requisito 3
// 1o passo: como já existe a função createCartItemElement (que cria as lis), precisamos apenas removemos o evento criado
// Feita com a ajuda de Lanai Conceição (e com a lógica de Luiza Antiques)
// =====================================

// 1o passo do requisito 3
function cartItemClickListener(event) {
  event.target.remove();
  setItemsLocalStorage(); // 2o passo do requisito 4
}

const getItemsLocalStorage = () => {
  const getLocalStorage = JSON.parse(localStorage.getItem('cartList')); // recupera o item criado no requisito 4
  const ol = document.querySelector(cartItems);
  ol.innerHTML = getLocalStorage;
  ol.addEventListener('click', (event) => {
    if (event.target.className === 'cart__item') {
      cartItemClickListener(event);
    }
  });
};

// ===================================
// Requisito 2 - COMPLEXO DEMAIS (Feita com a ajuda de Lanai Conceição)
// 1o passo - Criar uma função para acessar cada link de cada computador da lista que a API fornece - getComputers 
// 2o passo - A função já existente cria os li's na ol no formato esperado. Só foi preciso desestruturar.
// 3o passo - Criar função que seleciona o botão 'Adicionar ao carrinho' e cria um evento de click que cria uma lista

// ===================================

// 2o passo do requisito 2 - função já existente
function createCartItemElement({ id: sku, title: name, price: salePrice }) { // desestrutu como explicado no reuisito 1
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener); // o segundo parâmetro só é implementado no Requisito 3.
  return li;
 }

// 1o passo do requisito 2
const getComputers = async (id) => {
  const fetchApi = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const apiJson = await fetchApi.json();
  return apiJson;
};

function getSkuFromProductItem(item) {
 return item.querySelector('span.item__sku').innerText;
}

// 2o passo do requisito 2
const buttonAddToCart = () => {
  const parent = document.querySelector('.items'); // recupera a classe que tem 50 computadores
  parent.addEventListener('click', async (event) => {
    if (event.target.className === 'item__add') {
      const buttonParent = event.target.parentElement;
      const buttonId = getSkuFromProductItem(buttonParent);
      const buttonData = await getComputers(buttonId);
      const createComputer = createCartItemElement(buttonData);
      document.querySelector(cartItems).appendChild(createComputer);
      setItemsLocalStorage(); // 4o passo do requisito 4
    }
  });
};

// function cartItemClickListener(event) {
  // coloque seu código aqui
// }

window.onload = () => { 
  getJson('computador');
  buttonAddToCart();
  getItemsLocalStorage();
};
