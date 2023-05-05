//proceed to checkout only if the member is logged in
let logged_member = JSON.parse(localStorage.getItem('logged_member'));
let cart_size = localStorage.getItem('cart_size');
let subtotal = 0;

//if cart is not empty parse it,else set empty array
let cart = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : [];

if (cart_size) {
  document.querySelector('.cart-counter').innerHTML = cart_size;
}

//alert delay function
const wait = time => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

if (logged_member) {
  let cart_content = '';
  subtotal = 0;
  cart.forEach(item => {
    //more icons at https://icons.getbootstrap.com/
    cart_content += `<tr>
                      <td>${item.product.productTitle}</td>
                      <td><input type="text" maxlength="3" size="8" value='${
                        item.quantity
                      }' /></td>
                      <td>${formatCurrency(
                        Number(item.product.productPrice)
                      )}</td>
                      <td><a onclick=removeItem(this) id="item_${
                        item.product.id
                      }"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
<path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
</svg></a></td>
                      </tr>`;

    subtotal += Number(item.product.productPrice) * Number(item.quantity);
  });
  cart_content += `<tr>
    <td style="text-align:right;font-weight:bold;"colspan="2">Subtotal:
      </td>
    <td id="subtotal" style="font-weight:bold;" colspan="2">${formatCurrency(
      subtotal
    )}
      </td></tr>`;
  document.querySelector('tbody').innerHTML = cart_content;

  document.getElementById('checkout').addEventListener('click', orderCheckout);
} else {
  //the member is not logged in redirect to registration
  window.location.replace('/customer.html');
}

function orderCheckout(event) {
  const user = JSON.parse(localStorage.getItem('logged_member'));
  const alert = document.getElementById('balance_alert');

  //if cart is empty
  if (subtotal == 0) {
    const payload = {
      message: 'Plese add items to the cart!',
      success: false,
    };

    displayMessage(payload, alert);
    return;
  }

  //check deposit balance
  if (user.deposit < subtotal) {
    const payload = {
      message: `Insufficent balance. Your deposited amount is $${user.deposit}`,
      success: false,
    };
    displayMessage(payload, alert);
  } else {
    //store ordered items
    const orders = localStorage.getItem('orders')
      ? JSON.parse(localStorage.getItem('orders'))
      : [];
    const cart = JSON.parse(localStorage.getItem('cart'));

    orders.push({
      email: user.email,
      amount: subtotal,
      date: new Date(),
      product: cart.map(item => {
        return {
          id: item.product.id,
          price: item.product.productPrice,
          quantity: item.quantity,
        };
      }),
    });
    localStorage.setItem('orders', JSON.stringify(orders));

    //notify sucsses
    const payload = {
      message: 'You have Successfully Chekedout! Thanks for your order',
      success: true,
    };
    displayMessage(payload, alert);

    //empty cart
    clearCart();
    return;
  }
}
//display notification  message
function displayMessage(payload, alert) {
  //
  alert.style.display = 'flex';
  alert.innerHTML = payload.message;

  if (payload.success) {
    alert.classList.add('alert-success');
  } else {
    alert.classList.add('alert-danger');
  }

  //hide notification
  wait(3000)
    .then(() => {
      alert.style.display = 'none';
      alert.classList.remove('alert-danger');
      alert.classList.remove('alert-success');
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

//clear after checkout
function clearCart() {
  document.querySelector('tbody').innerHTML = '';
  localStorage.setItem('cart', JSON.stringify([]));
  localStorage.setItem('cart_size', '0');
  document.querySelector('.cart-counter').innerHTML = 0;
  subtotal = 0;
}

//remove item from cart
function removeItem(item_link) {
  const productId = item_link.id.split('_')[1];
  const row = item_link.parentNode.parentNode;
  const rowItem = cart.find(item => item.product.id == productId);

  //remove product from cart
  cart = cart.filter(item => item.product.id != productId);
  localStorage.setItem('cart', JSON.stringify(cart));

  //set cart counter
  cart_size = cart_size - Number(rowItem.quantity);
  localStorage.setItem('cart_size', cart_size);
  document.querySelector('.cart-counter').innerHTML = cart_size;

  //recalculate subtotal amount
  subtotal =
    Number(subtotal) -
    Number(rowItem.product.productPrice) * Number(rowItem.quantity);
  document.getElementById('subtotal').innerHTML = formatCurrency(subtotal);

  row.remove();
}

//formating number to USD currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

//Get current year and display it on the footer
document.getElementById('footeryear').innerHTML = new Date().getFullYear();

//display logged member name
(() => {
  const logged_member = JSON.parse(localStorage.getItem('logged_member'));
  const welcomeMember = document.getElementById('logged_member');
  if (logged_member && welcomeMember) {
    welcomeMember.innerHTML = `<i class="bi bi-person"></i> ${logged_member.name}`;
  }
})();
