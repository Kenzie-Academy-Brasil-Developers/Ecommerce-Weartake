let products = document.getElementById("products")
let containerCategorias = document.getElementById("filterProducts");
let searchArea = document.getElementById('searchValue');
let btnSearch = document.getElementById('search')
let cart = document.getElementById('cart');
let emptyCart = document.getElementById('emptyCart');
let cartCalc = document.getElementById('total');
let cartItens = document.getElementById('totalItens');
let cartPrice = document.getElementById('totalPrice');
let finalizarCompra = document.getElementById('fim')

btnSearch.addEventListener('click', searchProduct);

cartCalc.style.display = 'none';

containerCategorias.addEventListener('click', filterProduct);

finalizarCompra.addEventListener('click', resetCart)


function filterProduct (event) {
    let btnNav = document.querySelectorAll('li');
    let itemClicked = event.target;

    if(itemClicked.id != "filterProducts") {
        btnNav.forEach((liItem) => {
            liItem.classList.remove("active");
        })

        itemClicked.classList.add("active");

        let categoriaConteudoClicado = itemClicked.innerText;

        const arrObjFilteredCategory = banco.filter(function (character) {
            return character.categoria.includes(categoriaConteudoClicado);
          })

        products.innerHTML = "";

        if (categoriaConteudoClicado == "Todos") {
            atualizaProdutos();
        } else {
            atualizaProdutos(arrObjFilteredCategory);
        }
    }
}

function searchProduct(event) {
    event.preventDefault();
    
    let textToSearch = searchArea.value;

    const arrObjFilteredInput = banco.filter(function (input) {
            return input.nomeProduto.toLocaleLowerCase().includes(`${textToSearch.toLocaleLowerCase()}`) || input.categoria.toLocaleLowerCase().includes(`${textToSearch.toLocaleLowerCase()}`)
    })

    products.innerHTML = "";
    atualizaProdutos(arrObjFilteredInput);
    searchArea.value = ''
}


function createProduct (
    srcImg,
    altImg,
    categoria,
    nomeProduto,
    descricao,
    preco
) {
    let produto = document.createElement("section");
    produto.classList.add("product");
    produto.addEventListener('click', () => {
    addCart(
        srcImg,
        altImg,
        nomeProduto,
        preco)});

    produto.innerHTML = `
    <img src=${srcImg} alt=${altImg}>
    <div class="description">
        <h4>${categoria}</h4>
        <h3 class="productName">${nomeProduto}</h3>
        <p class="caption">${descricao}</p>
        <p class="price">R$ ${preco}</p>
        <a class="addCart">Adicionar ao carrinho</a>
    </div>`;
        
        products.appendChild(produto);
}
    
function atualizaProdutos (font = banco) {
    font.forEach(function (item) {
    createProduct (
        item.srcImg,
        item.altImg,
        item.categoria,
        item.nomeProduto,
        item.descricao,
        item.preco
        )
    })
}

atualizaProdutos();


function addCart(srcImg,altImg,nomeProduto,preco) {
    
    emptyCart.style.display = 'none';
    cartCalc.style.display = 'flex';
    
    let quantity = document.getElementById(`quantity-${nomeProduto}`);
    
    for(let i=1; i < cart.children.length; i++){
        if(cart.children[i].id === nomeProduto){
            +(quantity.innerText)++;
            actualCount()
            return cartItens.innerText = atualizaCarrinho();
            
        }
    }
    
    let cartProduct = document.createElement('section');
    cartProduct.classList.add('cartProduct');
    cartProduct.setAttribute('id', nomeProduto);
    cartProduct.innerHTML = `
    <div class="cartImgArea">
        <img class="cartImg" src="${srcImg}" alt="${altImg}">
    </div>
    <section class="cartProductDescription">
        <h3>${nomeProduto}</h3>
        <p class="cartProductPrice">R$ ${preco}</p>
    ${/*
    <div class="cartProductAmount">
        <button class="cartButton">-</button>
        <p>1</p>
        <button class="cartButton">+</button>
    </div>
    <a class="cartProductRemove">Remover</a>
    */""}
    </section>
    `;
    
    
    let cartProductAmount = document.createElement('div');
    let cartProductSub = document.createElement('button');
    let cartProductSum = document.createElement('button');
    let cartProductAmountElement = document.createElement('p');
    let cartProductRemove = document.createElement('a');
    
    
    cartProductAmount.setAttribute("class", "cartProductAmount");
    cartProductSub.setAttribute("class", "cartButton");
    cartProductSum.setAttribute("class", "cartButton");
    cartProductAmountElement.setAttribute('id', `quantity-${nomeProduto}`);
    cartProductAmountElement.classList.add('quantidadeProduto');
    cartProductRemove.setAttribute("class", "cartProductRemove");
    
    cartProductSub.addEventListener('click', () => {
        let areaValorAtual = document.getElementById(`quantity-${nomeProduto}`)
        let valorAtual = +areaValorAtual.innerText - 1;
        areaValorAtual.innerText = valorAtual;
        actualCount();
        atualizaCarrinho();
        if (+areaValorAtual.innerText < 1){
            removeCart(cartProduct);
        }
    })
    cartProductSum.addEventListener('click', () => {
        let areaValorAtual = document.getElementById(`quantity-${nomeProduto}`)
        let valorAtual = +areaValorAtual.innerText + 1;
        areaValorAtual.innerText = valorAtual;
        actualCount();
        atualizaCarrinho();
    })
    cartProductRemove.addEventListener('click', () => {
        removeCart(cartProduct);
        actualCount();
        atualizaCarrinho();
        if (cartItens.innerText < 1){
            emptyCart.style.display = 'flex';
            emptyCart.style.flexFlow= 'column';
            cartCalc.style.display = 'none';
        }
    })
    
    cartProductSub.innerText = "-";
    cartProductSum.innerText = "+";
    cartProductRemove.innerText = 'Remover';
    cartProductAmountElement.innerText = `1`;
    
    
    cartProductAmount.appendChild(cartProductSub);
    cartProductAmount.appendChild(cartProductAmountElement);
    cartProductAmount.appendChild(cartProductSum);
    cartProduct.children[1].appendChild(cartProductAmount);
    cartProduct.children[1].appendChild(cartProductRemove);
    cart.appendChild(cartProduct);
    
    actualCount();
    atualizaCarrinho();
}


function atualizaCarrinho(n){
    let arrItemHtmlQuantity = document.getElementsByClassName('quantidadeProduto');
    let arrItemHtmlPrice = document.getElementsByClassName('cartProductPrice');
    let countItemQuantity = 0;
    let countItemPrice = 0;
    for (let i = 0; i < arrItemHtmlQuantity.length; i++) {
        countItemQuantity += +(arrItemHtmlQuantity[i].innerText);
        let arrPriceSplitted = (arrItemHtmlPrice[i].innerText.split(''));
        countItemPrice += +arrPriceSplitted.slice(3, -3).join('') * +(arrItemHtmlQuantity[i].innerText);
        
    }
    return n === 1 ? countItemPrice : countItemQuantity;
}


function actualCount() {
    cartItens.innerText = `${atualizaCarrinho()}`;
    cartPrice.innerText = `R$ ${atualizaCarrinho(1)},00`;
}

function removeCart(product) {
    product.remove();
}

function resetCart() {

    
    for (let i = cart.children.length; i > 1; i--) {
        cart.children[1].remove()
        
    }
    emptyCart.style.display = 'flex';
    emptyCart.style.flexFlow= 'column';
    cartCalc.style.display = 'none';
}