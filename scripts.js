/*
    Lógica de Programação

    [x] Pegar os dados do input, quando o botão for clicacdo
    [x] Ir até o servidor e trazer os produtos
    [ ] Colocar os produtos na tela
    [ ] Criar um gráfico de Preços
*/

const productForm = document.querySelector(".product-form");
const productList = document.querySelector(".product-list");
const priceChat = document.querySelector(".price-chart");

let myChart = "";

productForm.addEventListener("submit", async (event) => {
	event.preventDefault();
	const inputValue = event.target[0].value;

	const data = await fetch(
		`https://api.mercadolibre.com/sites/MLB/search?q=${inputValue}`,
	);

	const products = (await data.json()).results.slice(0, 12);

	getProducts(products);
	updatePriceChart(products);
});

function getProducts(products) {
	productList.innerHTML = products
		.map(
			(product) => `
      <div class="product-card">
        <img src='${product.thumbnail.replace(/\w\.jpg/gi, "W.jpg")}' alt='${product.title}'>
        <h3>${product.title}</h3>
        <p class="price">R$ ${product.price}</p>
        <p class="store">Loja: ${product.seller.nickname}</p>
      
      </div>
    `,
		)
		.join("");
}

function updatePriceChart(products) {
	const ctx = priceChat.getContext("2d");

	if (myChart) {
		myChart.destroy();
	}

	myChart = new Chart(ctx, {
		type: "bar",
		data: {
			labels: products.map((product) => `${product.title.substring(0, 20)}...`),
			datasets: [
				{
					label: "Preço (R$)",
					data: products.map((product) => product.price),
					backgroundColor: "rgba(46, 204, 113, 0.6 )",
					borderColor: "rgba(46, 204, 113, 1)",
					borderWidth: 1,
				},
			],
		},
		options: {
			responsive: true,
			scale: {
				y: {
					beginAtZero: true,
					ticks: {
						callback: (value) => `R$ ${value}`,
					},
					plugins: {
						legend: {
							display: false,
						},
						title: {
							display: true,
							text: "Preços dos produtos",
							size: 18,
						},
					},
				},
			},
		},
	});
}
