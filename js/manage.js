//for product management page.
let stored_products = JSON.parse(localStorage.getItem('products'));
console.log(stored_products);
const loadForEdit = () => {
  let html_format = stored_products.map(item => {
    return `<tr class=${
      item.previousPrice > item.productPrice ? `"discount"` : ''
    }>
        <th scope="row">${item.id}</th>
        <td>${item.productTitle}</td>
        <td>${item.previousPrice ? item.previousPrice : item.productPrice}</td>
        <td>${item.productPrice}</td>
        <td>${item.rating}</td>
        <td><a href="/edit-product.html?id=${item.id}">Edit</a></td>
      </tr>`;
  });
  document.getElementById('content_holder').innerHTML =
    `<table class="table">
    <thead>
      <tr>
        <th scope="col">Id</th>
        <th scope="col">Title</th>
        <th scope="col">Prev Price</th>
        <th scope="col">Price</th>
        <th scope="col">Rating</th>
        <th scope="col">Edit</th>
      </tr>
    </thead>
    <tbody>
      <tr>` + html_format.reduce((acc, format) => acc + format); //Do we need <tr> here?
  `</tr>   
  </table>`;
};

loadForEdit();

//Get current year and display it on the footer
(() => {
  const year = new Date().getFullYear();
  const footer = document.getElementById('footeryear');
  footer.innerHTML = year;
})();
