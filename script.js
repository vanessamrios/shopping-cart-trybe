function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// Requisito 1
// 1o passo: pegar elementos do JSON e enviar pro html de forma dinâmica

function createProductItemElement({ id: sku, title: name, thumbnail: image }) { // desestruturando. Id, Title e Thumbnail são chaves do json(resposta da API) que contem as informações que preciso nos parâmetros sku, name e img.
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

// function getSkuFromProductItem(item) {
//  return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
  // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//  const li = document.createElement('li');
//  li.className = 'cart__item';
//  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//  li.addEventListener('click', cartItemClickListener);
//  return li;
// }

window.onload = () => { 
  getJson('computador');
};
