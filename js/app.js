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
		//console.log(this.form);
		view.init();
		view.updateListCats();
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
				console.log("LI click");
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
			console.log(typeof model.cats[localStorage.currentCat].numClicks);
			model.cats[localStorage.currentCat].numClicks += 1;
		}else{
			model.cats[localStorage.currentCat].numClicks = 0;
		}
		model.updateStorage();
		viewCat.catClicksHTML(model.getAllCats()[localStorage.currentCat].numClicks);
	},
	closeForm: function() {
		model.adminShow = false;
	},
	openForm: function() {
		model.adminShow = true;
	},
	/**
	* @description Updates current cat with data from form
	* @param {array} valueList - List with all data (name, number of clicks, imgURL[optional])
	*/
	updateCurrentCat: function(valueList) {
		console.log(valueList);
		model.cats[localStorage.currentCat].name = valueList[0];
		model.cats[localStorage.currentCat].numClicks = valueList[1];
		model.updateStorage();
		view.updateListCats();
		viewCat.showCat(model.cats[localStorage.currentCat]);
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
		this.imgUrl = document.getElementById("imgURL");
		this.numOfClicks = document.getElementById("num_of_clicks");
		this.listOfCats = document.querySelector(".list");
		this.form = document.getElementById("form");
		this.admin.onclick = e => {
			e.preventDefault();
			console.log("Admin clicked"); 
			this.form.removeAttribute("hidden");
			octopus.openForm();
		}
		// Cancel button
		this.cancel.onclick = e => {
			e.preventDefault();
			console.log("cancel clicked");
			this.form.setAttribute("hidden", true);
			octopus.closeForm();
		}
		// Form submit
		this.submit.onsubmit = e => {
			// cancel the form's default action
			
			let valueList = [];
			valueList.push(this.name.value);
			valueList.push(parseInt(this.numOfClicks.value));
			if (this.imgUrl.value !== "") {
				valueList.push(this.imgUrl.value);
			}
			octopus.updateCurrentCat(valueList);
			octopus.closeForm();
		}
		this.resetButton.onclick = e => {
			e.preventDefault();
			console.log("Reset clicked");
			octopus.updateCounter();
		}
		
	},
	updateListCats: function() {
		// Clear .list
		this.listOfCats.innerHTML = "";
		// Populate list of cat names
		octopus.allCats().forEach( cat => {
			this.listOfCats.insertAdjacentHTML("beforeend", `<li>${cat.name}</li>`);
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
