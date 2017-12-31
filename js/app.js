// Model with all data
let model = {
	// Number of selected cat in the model
	currentCat: 0,
	cats:[ 
		{
			name: "Miki",
			img: "cat.jpg",
			numClicks: 0
		},
		{
			name: "Donald",
			img: "cat2.jpg",
			numClicks: 0
		},
		{
			name: "Ana",
			img: "cat3.jpg",
			numClicks: 0
		},
		{
			name: "Arthur",
			img: "cat4.jpg",
			numClicks: 0
		},
		{
			name: "Aragorn",
			img: "cat5.jpg",
			numClicks: 0
		},
		{
			name: "Lilly",
			img: "cat6.jpg",
			numClicks: 0
		}
	]
};

//**********************************************************************//
// Lary the octopus is the controller
let octopus = {
	init: function() {
		viewList.init();
		viewCat.init();
		this.catClick();
		this.catClickCounter();
	},
	// maps through all cats
	allCats: function() {
		return model.cats;
	},
	// Tell the view which cat to display after the click on li 
	catClick: function() {
		for(let i = 0; i < model.cats.length; i++) {
			$("li").click(function() {
				console.log($(this).text());
				if( $(this).text() === model.cats[i].name ) {
					// Set currentCat
					model.currentCat = i;
					// return clicked cat object
					return viewCat.showCat(model.cats[i]);
				}
			});
		}
	},
	// Update the counter for each cat and tells the view to display
	catClickCounter: function() {
		$(".container").on("click", "img", function() {
			model.cats[model.currentCat].numClicks += 1;
			viewCat.catClicksHTML(model.cats[model.currentCat].numClicks);
		});
	}
};

//**********************************************************************//
let viewList = {
	// Creates list of all cats
	init: function() {
		const listOfCats = document.querySelector(".list");
		octopus.allCats().forEach( cat => {
			listOfCats.insertAdjacentHTML("beforeend", `<li>${cat.name}</li>`);
		});
	}
};
//**********************************************************************//
// display cat window
let viewCat = {
	// Create cat window
	init: function() {
		containerHtml = `
			<article>
				<h1>${model.cats[0].name}</h1>
				<img src="img/${model.cats[0].img}" alt="${model.cats[0].name} the cat" data-cat="${model.cats[0].name}">
	        	<h2>Number of clicks <span>${model.cats[0].numClicks}</span></h2>
	        </article>
		`;
		document.querySelector(".container").insertAdjacentHTML("afterbegin", containerHtml);
	},

	showCat: function(cat) {
		// Clear .container
		document.querySelector(".container").innerHTML = "";
		// Add new cat to the container
		containerHtml = `
			<article>
				<h1>${cat.name}</h1>
				<img src="img/${cat.img}" alt="${cat.name} the cat" data-cat="${cat.name}">
	        	<h2>Number of clicks <span>${cat.numClicks}</span></h2>
	        </article>
		`;
		document.querySelector(".container").insertAdjacentHTML("afterbegin", containerHtml);
	},
	// Show number of clicks for particular cat
	catClicksHTML: function(clicks) {
		document.querySelector("h2 span").textContent = clicks;
	}
}; 

octopus.init();
