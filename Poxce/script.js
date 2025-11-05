document.addEventListener("DOMContentLoaded", function () {
        const checkoutItems = document.getElementById('checkout-items');
        const checkoutTotal = document.getElementById('checkout-total');

        // Retrieve cart items from localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Render cart items in the checkout page
        function renderCheckoutItems() {
            checkoutItems.innerHTML = '';
            let total = 0;
            cart.forEach(item => {
                const row = document.createElement('tr');
                const itemCell = document.createElement('td');
                const img = document.createElement('img');
                img.src = item.img;
                itemCell.appendChild(img);
                itemCell.appendChild(document.createTextNode(item.name));
                row.appendChild(itemCell);
                

                // Quantity Controls
                const quantityCell = document.createElement('td');
                const quantityControls = document.createElement('div');
                quantityControls.classList.add('quantity-controls');
                const decreaseButton = document.createElement('button');
                decreaseButton.textContent = '-';
                decreaseButton.addEventListener('click', () => decreaseQuantity(item));
                const quantityValue = document.createElement('span');
                quantityValue.textContent = item.quantity;
                const increaseButton = document.createElement('button');
                increaseButton.textContent = '+';
                increaseButton.addEventListener('click', () => increaseQuantity(item));
                quantityControls.appendChild(decreaseButton);
                quantityControls.appendChild(quantityValue);
                quantityControls.appendChild(increaseButton);
                quantityCell.appendChild(quantityControls);
                row.appendChild(quantityCell);

                const priceCell = document.createElement('td');
                priceCell.textContent = `₱${item.price}`;
                row.appendChild(priceCell);

                const totalCell = document.createElement('td');
                totalCell.textContent = `₱${item.price * item.quantity}`;
                row.appendChild(totalCell);

                // Remove Button
                const removeButtonCell = document.createElement('td');
                const removeButton = document.createElement('button');
                removeButton.textContent = '';
                removeButton.classList.add('remove-button');
                removeButton.addEventListener('click', () => removeFromCart(item));
                removeButtonCell.appendChild(removeButton);
                row.appendChild(removeButtonCell);

                checkoutItems.appendChild(row);
                total += item.price * item.quantity;
            });
            checkoutTotal.textContent = total;
        }

        // Decrease quantity of an item
        function decreaseQuantity(item) {
            if (item.quantity > 1) {
                item.quantity--;
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCheckoutItems();
            }
        }

        // Increase quantity of an item
        function increaseQuantity(item) {
            item.quantity++;
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCheckoutItems();
        }

        // Remove product from cart
        function removeFromCart(itemToRemove) {
            cart = cart.filter(item => item !== itemToRemove);
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCheckoutItems();
        }

        
      // Function to generate QR code
function generateQR() {
    const totalAmount = parseFloat(checkoutTotal.textContent.replace('Total: ₱', ''));
    const purchaseDetails = cart.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }));
  
    // Modify the message to include payment success indication
    const qrText = JSON.stringify({ totalAmount, purchaseDetails, paymentStatus: "Payment Successful" });
    const qr = new QRious({
      element: document.getElementById('qrcode'),
      value: qrText,
      size: 200
    });
  }
  

      // Event listener for generating QR code
      generateQRButton.addEventListener('click', generateQR);

        // Initial rendering of the checkout page
        renderCheckoutItems();

        
    });