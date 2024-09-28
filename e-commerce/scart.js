
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const search=document.getElementById('search');
const result =document.getElementById("result")
const div=document.getElementById('product-list')
const cartKey = 'cartItems';
   $(document).ready(function(){
    $('.menu-toggle').click(function () {
        $('.nav-links').toggleClass('active');
        $('#result').toggleClass('active');
        
    }); 
});

const secretKey =  'S3cr3tK3y12345678901234567890';  // Keep this key safe

// Encrypt the product key
function encryptProductKey(productKey,secretKey) {
    const encrypted=CryptoJS.AES.encrypt(productKey, secretKey);
    return encrypted.toString();
}

fetch('https://fakestoreapi.com/products')
    .then(res => res.json())


    .then(json => {
       const products=json
      
        search.addEventListener('input',()=>{
            let query=search.value.toLowerCase()
            if (query===""){
                productsList()
                result.innerHTML=""
            }
            else{
             const filter=products.filter(item=>item.title.toLowerCase().includes(query))
             result.innerHTML=""
             if (filter.length==0){
                const li = document.createElement('li')
                li.textContent="NO match found"
                li.className="no-match"
                result.appendChild(li)
             }
             else{
             filter.forEach(item=>{
                const li = document.createElement('li')
                const Link = document.createElement('a');
                Link.textContent=item.title
                Link.style.textDecoration="none";
                Link.style.color="Black"
                const productId=String(item.id);
                const encryptedKey=encryptProductKey(productId,secretKey)
                const id=encodeURIComponent(encryptedKey);
                
                Link.href = `product.html?id=${id}`;
                li.append(Link)
                result.appendChild(li)
             })}
             }
             
            })
   
        
        const ul = document.createElement('ul');
        div.appendChild(ul);
function productsList(){
        json.forEach(product => {
            const listItem = document.createElement('li');
            listItem.className ="product-li";
            // title
            const title = document.createElement('h1');
            title.textContent = ` ${product.title}`;
           // listItem.appendChild(title);
            // create link on image
            listItem.style.listStyle="none"
            const titleLink = document.createElement('a');
            const productId=String(product.id);
            const encryptedKey=encryptProductKey(productId,secretKey)
            const id=encodeURIComponent(encryptedKey);
            titleLink.href = `product.html?id=${id}`;
            titleLink.style.textDecoration="none";
            titleLink.style.color="Black" // Link to product.html with product id as query param
            titleLink.append(title)
            listItem.appendChild(titleLink);
            //create and append the image element
            const image = document.createElement('img');
            image.src = product.image;
            image.alt = product.title;
            image.style.width = '150px';  // Set a fixed width for the image
            listItem.appendChild(image);
            titleLink.append(image)
            // Create and append the title
        
           
            // Convert the price to INR
            const priceInINR = (product.price * 83);

            // Create and append converted product price
            const price = document.createElement('p');
            price.innerHTML = `<h4>Price: ₹${priceInINR}</h4>`;
            listItem.appendChild(price);
           
            // Create and append the description
            const description = document.createElement('p');
            description.innerHTML = `<b>Description</b>: ${product.description}`;
            listItem.appendChild(description);

            // button for products
            const button = document.createElement('button');
            button.type="submit"
            button.className="add-to-cart"
            button.textContent="Add To cart"
            button.dataset.id = product.id;
            button.dataset.title = product.title;
            button.dataset.price = priceInINR;
            button.dataset.url=product.image;
            listItem.appendChild(button);
            // Append the listItem to the ul
            ul.appendChild(listItem);
         
        });}
        productsList()
        // Append the div to the document body or another container
        document.body.appendChild(div);
    }).catch(err => console.error('Error fetching data:', err));

     // Add event listener for dynamically created buttons
     document.getElementById('product-list').addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('add-to-cart')) {
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
