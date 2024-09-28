
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
$(document).ready(function(){
    $('.menu-toggle').click(function () {
        $('.nav-links').toggleClass('active');
    }); 
});
const cartKey = 'cartItems';
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

const secretKey =  'S3cr3tK3y12345678901234567890';
function decryptProductKey(encryptedKey,secretKey) {
    const bytes = CryptoJS.AES.decrypt(encryptedKey, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);  // Convert to plain text
}
async function product(){
if (productId) {
    try{
    const id=decodeURIComponent(productId);
    const decryptProduct = decryptProductKey(id,secretKey);
    
   const response=await fetch(`https://fakestoreapi.com/products/${decryptProduct}`)
   if(response.status===200){
    const product = await response.json()
   
   
           const productDetailsDiv = document.getElementById('product-details');
            // Create and display the product details
            const title = document.createElement('h1');
            title.textContent = product.title;
            productDetailsDiv.appendChild(title);


            const image = document.createElement('img');
            image.src = product.image;
            image.alt = product.title;
            image.style.width = '300px';
            productDetailsDiv.appendChild(image);
            
            const price = document.createElement('h1');
            const priceInINR = (product.price * 83).toFixed(2);
            price.textContent = ` Rs:${priceInINR}`;
            productDetailsDiv.appendChild(price);

            const description = document.createElement('p');
            description.innerHTML ="<b>Description:</b> " +product.description;
            productDetailsDiv.appendChild(description);

            const button = document.createElement('button');
            button.type="submit"
            button.className="cart"
            button.textContent="Add To cart"
            button.dataset.id = product.id;
            button.dataset.title = product.title;
            button.dataset.price = product.price;
            button.dataset.url=product.image;
            productDetailsDiv.appendChild(button);
}
else{
    console.log("Product not found")
   }
    }
catch(err){
    const h1=document.createElement("h1");
    h1.textContent=" 404 Product not found ";
    document.body.append(h1)
}}
else{
    const h1=document.createElement("h1");
    h1.textContent=" Id not found ";
    document.body.append(h1)
}
}
   
product()
document.getElementById('product-details').addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('cart')) {
        const id = event.target.dataset.id;
        const title = event.target.dataset.title;
        const price = event.target.dataset.price;
        const url = event.target.dataset.url;
    
        const cartItem = {
            id: id,
            title: title,
            price: price,
            image:url,
            quantity: 1
        };
       
        addToCart(cartItem);
    }
});

function addToCart(item) {
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    
    // Check if the item is already in the cart
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
    if (existingItemIndex > -1) {
        // Item exists, update quantity
        cart[existingItemIndex].quantity += 1;
        
    } else {
        // Item does not exist, add to cart
        cart.push(item);
       
    }
    
    // Save updated cart to localStorage
    localStorage.setItem(cartKey, JSON.stringify(cart));
  alert("item added to cart")
}
