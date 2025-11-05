let subMenu = document.getElementById("subMenu");

        function menu(){
            subMenu.classList.toggle("open-menu");
        }

        let subMenu2 = document.getElementById("subMenu2");

        function menu2(){
            subMenu2.classList.toggle("open-menu2");
        }

        let count = 1; 

        function add(){
            count += 1;
            document.getElementById('qty').innerText = count;
        }

        function minus(){
            if (count > 1) {
                count -= 1;
                document.getElementById('qty').innerText = count;
            }
        }



        function openModal(id) {
            let modal = document.getElementById(id);
            modal.style.display = "block";
        }

      
        function closeModal(id) {
            let modal = document.getElementById(id);
            modal.style.display = "none";
        }

        
        window.onclick = function(event) {
            let modals = document.getElementsByClassName('modal');
            for (let i = 0; i < modals.length; i++) {
            if (event.target == modals[i]) {
                modals[i].style.display = "none";
            }
            }
        }





        function showContainer(containerId) {
            // Hide all containers
            let containers = document.getElementsByClassName("container");
            for (let i = 0; i < containers.length; i++) {
              containers[i].style.display = "none";
            }
            // Show the selected container
            document.getElementById(containerId).style.display = "block";
          }






          document.addEventListener("DOMContentLoaded", function() {
            const addToCartButtons = document.querySelectorAll('.add-to-cart');
            const cartItems = document.getElementById('cart-items');
            const cartTotal = document.getElementById('cart-total');
            const checkoutItems = document.getElementById('checkout-items');
            const checkoutTotal = document.getElementById('checkout-total');
          
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
            function renderCart() {
                cartItems.innerHTML = '';
                let total = 0;
                cart.forEach(item => {
                    const li = document.createElement('li');
                    const img = document.createElement('img');
                    img.src = item.img; // Ensure correct image URL is set
                    img.alt = item.name; // Optionally set alt attribute
                    img.classList.add('cart-item-image'); // Add class for styling
                    li.appendChild(img);
                    li.appendChild(document.createTextNode(`${item.name} - Price: $${item.price * item.quantity}`));
                    const removeButton = document.createElement('button');
                    removeButton.textContent = 'Remove';
                    removeButton.addEventListener('click', () => removeFromCart(item));
                    li.appendChild(removeButton);
                    cartItems.appendChild(li);
                    total += item.price * item.quantity;
                });
                cartTotal.textContent = total;
            }
        
            function renderCheckout() {
                checkoutItems.innerHTML = '';
                let total = 0;
                cart.forEach(item => {
                    const row = document.createElement('tr');
                    const itemCell = document.createElement('td');
                    const img = document.createElement('img');
                    img.src = item.img; // Ensure correct image URL is set
                    img.alt = item.name; // Optionally set alt attribute
                    img.classList.add('checkout-item-image'); // Add class for styling
                    itemCell.appendChild(img);
                    itemCell.appendChild(document.createTextNode(item.name));
                    row.appendChild(itemCell);
                    const quantityCell = document.createElement('td');
                    quantityCell.textContent = item.quantity;
                    row.appendChild(quantityCell);
                    const priceCell = document.createElement('td');
                    priceCell.textContent = `₱${item.price}`;
                    row.appendChild(priceCell);
                    const totalCell = document.createElement('td');
                    totalCell.textContent = `₱${item.price * item.quantity}`;
                    row.appendChild(totalCell);
                    checkoutItems.appendChild(row);
                    total += item.price * item.quantity;
                });
                checkoutTotal.textContent = total;
            }
        
            function addToCart(name, price, quantity, img) {
                const existingItem = cart.find(item => item.name === name);
                if (existingItem) {
                    existingItem.quantity += parseInt(quantity);
                } else {
                    cart.push({ name, price, quantity: parseInt(quantity), img });
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            }
        
            function removeFromCart(itemToRemove) {
                cart = cart.filter(item => item !== itemToRemove);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            }
        
            addToCartButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const name = this.getAttribute('data-name');
                    const price = parseFloat(this.getAttribute('data-price'));
                    const img = this.getAttribute('data-img');
                    addToCart(name, price, 1, img);
                });
            });
        
            renderCart();
            renderCheckout();
        });
         
        
        
        
        
        
        
        
        
        document.addEventListener("DOMContentLoaded", function() {
            // Variables to reference HTML elements
            const addToCartButtons = document.querySelectorAll('.add-to-cart');
            const cartItems = document.getElementById('cart-items');
            const cartTotal = document.getElementById('cart-total');
            
            // Load cart items from localStorage if available
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // Render cart items
            function renderCart() {
                cartItems.innerHTML = '';
                let total = 0;
                cart.forEach(item => {
                    const li = createCartItemElement(item);
                    cartItems.appendChild(li);
                    total += item.price * item.quantity;
                });
                cartTotal.textContent = total;
            }
            
            // Create cart item HTML element
            function createCartItemElement(item) {
                const li = document.createElement('li');
                const img = document.createElement('img');
                img.src = item.img;
                li.appendChild(img);
                
                const quantityInput = document.createElement('input');
                quantityInput.type = 'number';
                quantityInput.classList.add('quantity-input');
                quantityInput.value = item.quantity;
                quantityInput.addEventListener('change', () => updateQuantityInCart(item.name, parseInt(quantityInput.value)));
                li.appendChild(quantityInput);
                
                li.appendChild(document.createTextNode(`${item.name} - Price: $${item.price * item.quantity}`));
                
                const removeButton = document.createElement('button');
                removeButton.textContent = '';
                removeButton.classList.add('remove-button');
                removeButton.addEventListener('click', () => removeFromCart(item));
                li.appendChild(removeButton);
                
                return li;
            }
            
            // Add to cart
            function addToCart(name, price, quantity, img) {
                const existingItem = cart.find(item => item.name === name);
                if (existingItem) {
                    existingItem.quantity += parseInt(quantity);
                } else {
                    cart.push({ name, price, quantity: parseInt(quantity), img });
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            }
            
            // Remove from cart
            function removeFromCart(itemToRemove) {
                cart = cart.filter(item => item !== itemToRemove);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            }
            
            // Update quantity in cart
            function updateQuantityInCart(name, newQuantity) {
                const cartItem = cart.find(item => item.name === name);
                if (cartItem && newQuantity >= 1) {
                    cartItem.quantity = newQuantity;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    renderCart();
                }
            }
            
            // Add event listeners to all "Add to Cart" buttons
            addToCartButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const name = this.getAttribute('data-name');
                    const price = parseFloat(this.getAttribute('data-price'));
                    const img = this.getAttribute('data-img');
                    const parentDiv = this.closest('.product');
                    const quantityInput = parentDiv.querySelector('.quantity-input');
                    const quantity = parseInt(quantityInput.value);
                    addToCart(name, price, quantity, img);
                });
            });
            
            // Initial rendering of the cart
            renderCart();
        });
          