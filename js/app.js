// Model with all data
let model = {
	// Number of selected cat in the model
	adminShow: false,
	cats: [{ name: "Miki",	img: "cat.jpg",	numClicks: 0 },	{ name: "Donald", img: "cat2.jpg", numClicks: 0	}, { name: "Ana", img: "cat3.jpg", numClicks: 0 }, { name: "Arthur", img: "cat4.jpg", numClicks: 0 }, { name: "Aragorn",img: "cat5.jpg", numClicks: 0 }, { name: "Lilly", img: "cat6.jpg",numClicks: 0 }],
	// Checks for localStorage and add one if none
	init: function() {
		this.jsonCats = JSON.stringify(this.cats);
        if (!localStorage.cats) {
            localStorage.setItem("cats", this.jsonCats);
			localStorage.setItem("currentCat", 0);
        }else{
        	this.cats = this.getAllCats();
        }
    },
    updateStorage:function() {
    	this.jsonCats = JSON.stringify(this.cats);
    	localStorage.setItem("cats", this.jsonCats);
    },
    getAllCats: function() {
    	let localResults = JSON.parse(localStorage.getItem("cats"));
    	return localResults;
    }
};

//**********************************************************************//
// Lary the octopus is the controller
let octopus = {
	init: function() {
		model.init();
		model.getAllCats();
		this.form = document.getElementById("form");
		//console.log(this.form);
		view.init();
		viewCat.init();
		this.catClick();
		viewCat.catClickCounter();
	},
	// maps through all cats
	allCats: function() {
		return model.getAllCats();
	},
	// Tell the view which cat to display after the click on li 
	catClick: function() {
		for(let i = 0; i < model.getAllCats().length; i++) {
			$("li").click(function() {
				//console.log($(this).text());
				if( $(this).text() === model.getAllCats()[i].name ) {
					// Set currentCat
					localStorage.currentCat = i;
					// return clicked cat object
					return viewCat.showCat(model.getAllCats()[i]);
				}
			});
		}
	},
	// Update the counter
	updateCounter: function(one) {
		if (one) {
			model.cats[localStorage.currentCat].numClicks += 1;
		}else{
			model.cats[localStorage.currentCat].numClicks = 0;
		}
		model.updateStorage();
		viewCat.catClicksHTML(model.getAllCats()[localStorage.currentCat].numClicks);
	},
	closeForm: function() {
		this.form.setAttribute("hidden", true);
		model.adminShow = false;
	},
	openForm: function() {
		this.form.removeAttribute("hidden");
		model.adminShow = true;
	},
	updateCurrentCat: function(valueList) {
		console.log(valueList);
	},
};

//**********************************************************************//
let view = {
	// Creates list of all cats and create event listeners for form buttons
	init: function() {
		this.admin = document.getElementById("admin");
		this.cancel = document.getElementById("cancel");
		this.submit = document.querySelector("form");
		this.resetButton = document.getElementById("resetButton");
		this.name = document.getElementById("name");
		this.imgUrl = document.getElementById("imgUrl");
		this.numOfClicks = document.getElementById("num_of_clicks");
		this.admin.onclick = e => {
			e.preventDefault();
			console.log("Admin clicked");
			octopus.openForm();
		}
		this.cancel.onclick = e => {
			e.preventDefault();
			console.log("cancel clicked");
			octopus.closeForm();
		}
		this.submit.onsubmit = e => {
			// cancel the form's default action
			e.preventDefault();
			let valueList = [];
			console.log(this.name.value);
			valueList.push(this.name.value);
			valueList.push(this.imgUrl.value);
			valueList.push(this.numOfClicks.value);
			octopus.updateCurrentCat(valueList);
			octopus.closeForm();
		}
		this.resetButton.onclick = e => {
			e.preventDefault();
			console.log("Reset clicked");
			octopus.updateCounter();
		}
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
		this.container = $(".container");
		containerHtml = `
			<article>
				<h1>${model.getAllCats()[localStorage.currentCat].name}</h1>
				<img src="img/${model.getAllCats()[localStorage.currentCat].img}" alt="${model.getAllCats()[localStorage.currentCat].name} the cat" data-cat="${model.getAllCats()[localStorage.currentCat].name}">
	        	<h2>Number of clicks <span>${model.getAllCats()[localStorage.currentCat].numClicks}</span></h2>
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
	// Update the counter for clicked cat
	catClickCounter: function() {
		this.container.on("click", "img", function() {
			console.log("img clicks");
			octopus.updateCounter("one");
		});
	},
	// Show number of clicks for particular cat
	catClicksHTML: function(clicks) {
		document.querySelector("h2 span").textContent = clicks;
	}
};

octopus.init();
