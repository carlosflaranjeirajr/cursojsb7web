let cart = [];
let modalQt = 1; // variável para iniciar em 1 pizza
let modalKey = 0; // variável para  identificar a pizza selecionada
const c =(el)=>document.querySelector(el);  //função anônima para pegar o item 
const cs = (el)=>document.querySelectorAll(el);  //retorna um array com os itens que achou

//Listagem de pizza
pizzaJson.map((item, index)=>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true)

    pizzaItem.setAttribute('data-key', index) //aqui o id, em pizzas.js, da pizza é selecionado e coletado as informações
    pizzaItem.querySelector('.pizza-item--img img').src = item.img
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`; //utilizando com string e centavos
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault(); //bloquear a ação natural da tag a, ou seja, não atualizar a tela
        let key = e.target.closest('.pizza-item').getAttribute('data-key'); 
        modalQt = 1; // iniciando em 1 pizza
        modalKey = key;

        c('.pizzaBig img').src = pizzaJson[key].img; // linha 17 a 2* pega as info do pizzaJson e bota na seleção de pizza
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        c('.pizzaInfo--size.selected').classList.remove('selected'); //tira a marcação do tamanho da pizza
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{          //essa função insere o tamanho grande como padrão sempre que clicar
            if(sizeIndex == 2){
                size.classList.add('selected');
            }              
           
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
            
        })
        
        c('.pizzaInfo--qt').innerHTML = modalQt;
       
        c('.pizzaWindowArea').style.opacity = 0; //aqui a caixa  de seleção inicia do zero de opacity
        c('.pizzaWindowArea').style.display = 'flex'; //irá mostrar a tela de seleção da pizza, trocando none por flex
        setTimeout(()=>{                        // aqui foi criado uma função para a opacity sair do 0 para 1 usando um Time de 200
            c('.pizzaWindowArea').style.opacity = 1;
        },200);         

    });


    c('.pizza-area').append(pizzaItem);
});

//Eventos do modal

function closeModal(){
    c('.pizzaWindowArea').style.opacity = 0;
   setTimeout(()=>{
    c('.pizzaWindowArea').style.display = 'none';
   },500); 
    
};

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click',closeModal);
});
//Incrementar e decrementar a quantidade de pizza sem passar de 1 quantidade
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if (modalQt > 1) {
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;    
});
//Seleção de tamanho da pizza
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected'); //size faz a área do botão clicável
    });
    
})
//inclusão das pizzas no carrinho
c('.pizzaInfo--addButton').addEventListener('click',()=>{
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key')); //variável pega o tamanho no html em data-key

//variaveis para o numero de pizza bata corretamente no carrinho    
    let identifier = pizzaJson[modalKey].id+'@'+size;
    let key = cart.findIndex((item) => item.identifier == identifier);

//pega o id do pedido e coloca no carrinho     
// verificação para as pizzas se organizem no carrinho
if (key > -1) {
    cart[key].qt += modalQt;
} else {
  
    cart.push({  
        identifier,
        id:pizzaJson[modalKey].id,
        size,
        qt:modalQt
    });
}
    updateCart();
    closeModal();
});
//atualização de coisas no carrinho mobile
c('.menu-openner').addEventListener('click',()=>{

    if (cart.length > 0) {
        c('aside').style.left = 0;
    } 

});
//fechar carrinho mobile

c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
});

//atualização de coisas no carrinho
function updateCart(){

    c('.menu-openner span').innerHTML = cart.length;
    
    if (cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;


        for(let i in cart){

            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;


            let cartItem = c('.models .cart--item').cloneNode(true);
        
            let pizzaSizeName;
            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;                    
            }
                   
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
            
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName; 
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;    
                } else{
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });
            
            
            c('.cart').append(cartItem);
            
        }

        //cálculo do carrinho
        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal. toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto. toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total. toFixed(2)}`;

    } else {
        c('aside').classList.remove('show');
        c('aside').style.left ='100vw';
    }
}