/* TYPER */
const TYPER = function () {
  if (TYPER.instance_) {
	 return TYPER.instance_
  }
  TYPER.instance_ = this

  this.WIDTH = window.innerWidth
  this.HEIGHT = window.innerHeight
  this.canvas = null
  this.ctx = null

  this.words = []
  this.word = null
  this.wordMinLength = 5
  this.guessedWords = 0
  this.level=1

  this.length=0;
  this.score=-5;
  this.array = [];
  this.darken = 1;

  this.init()
  
}

window.TYPER = TYPER

TYPER.prototype = {
  init: function () {
	 this.canvas = document.getElementsByTagName('canvas')[0]
	 this.ctx = this.canvas.getContext('2d')

	 this.canvas.style.width = this.WIDTH + 'px'
	 this.canvas.style.height = this.HEIGHT + 'px'

	 this.canvas.width = this.WIDTH * 2
	 this.canvas.height = this.HEIGHT * 2
	 console.log(this.score)
	 document.getElementById('saveScore').onclick = function() {
		console.log("Hakkan salvestama");
		typer.TestSave();
		console.log("SALVESTATUD");
  }
	 document.getElementById('refreshScore').onclick = function(){
		typer.refreshScoreBoard();
	 }
	 
	 this.addScore()
	 this.loadWords()
	 document.getElementById('darkButton').onclick = function(){
		typer.changeBackBackgroundColor()
	 }


  

  },

  loadWords: function () {
	 const xmlhttp = new XMLHttpRequest()

	 xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState === 4 && (xmlhttp.status === 200 || xmlhttp.status === 0)) {
		  const response = xmlhttp.responseText
		  const wordsFromFile = response.split('\n')

		  typer.words = structureArrayByWordLength(wordsFromFile)

		  typer.start()
		}
	 }
	 xmlhttp.open('GET', './lemmad2013.txt', true)
	 xmlhttp.send()
  },

  TestSave: function () {

	 if (typeof image_array !== 'undefined' && image_array.length > 0) {
		p1 = { Name: 'Placeholder', Score: -5}
		this.array.push(p1)
		localString = JSON.stringify(this.array)
		localStorage.setItem("scoreboard", localString)
		//console.log(this.array)      
	 }else{
		array = JSON.parse(localStorage.getItem("scoreboard"));
		p1 = { Name: document.getElementById('nameHTML').value, Score: this.score }
		this.array.push(p1)
		localString = JSON.stringify(this.array)
		localStorage.setItem("scoreboard", localString)
	 }
  },

  refreshScoreBoard: function(){
	 
	 let scoreboardText = document.getElementsByClassName('ScoreBoardTop10')[0];
	 let ARR = JSON.parse(localStorage.getItem("scoreboard"));
	 let ScrArr = [];
	 console.log(ARR);
	 let ArrLength = ARR.length;
	 let MaxScore = 0;
	 let MaxIndex = 0;
	 for(i=0; i<10; i++){
		for(j=0; j<ArrLength; j++){
		  if(ARR[j].Score>MaxScore){
			 MaxIndex = j;
		  }
		}
		SBString = { Name: ARR[MaxIndex].Name, Score: ARR[MaxIndex].Score }
		ScrArr.push(SBString);
		ArrLength=ArrLength-1;
		ARR.splice(MaxIndex, 1, -5);
		MaxScore = 0;
	 }
	 console.log(ARR);
	 console.log(ScrArr);
	 for (i = 0; i < 10; i++) {
		scoreboardText.innerHTML += "<li>" + "Name: " + ScrArr[i].Name + " Score: " + ScrArr[i].Score + "</li>";
	 }
  },
  

changeBackBackgroundColor: function(){
  console.log('muudan värvi')
  if(this.darken == 117){
	 console.log('White')
	 r = 255
	 g = 255
	 b = 255
	 document.body.style.backgroundColor = 'rgb('+ r +','+ g +','+ b +')'
	 r1 = 0
	 g1 = 0
	 b1 = 0
	 document.body.style.color = 'rgb('+ r1 +','+ g1 +','+ b1 +')'
	 this.darken = 255
  }else{
	 console.log('Darken')
	 r = 100
	 g = 100
	 b = 100
	 document.body.style.backgroundColor = 'rgb('+ r +','+ g +','+ b +')'
	 r1 = 255
	 g1 = 255
	 b1 = 255
	 document.body.style.color = 'rgb('+ r1 +','+ g1 +','+ b1 +')'
	 this.darken = 117
  }
},


  start: function () {
	 this.generateWord()
	 this.word.Draw()

	 
	 window.addEventListener('keypress', this.keyPressed.bind(this))
  },

  generateWord: function () {
	 const generatedWordLength = this.wordMinLength + parseInt(this.guessedWords / 5)
	 const randomIndex = (Math.random() * (this.words[generatedWordLength].length - 1)).toFixed()
	 const wordFromArray = this.words[generatedWordLength][randomIndex]

	 this.word = new Word(wordFromArray, this.canvas, this.ctx)
  },
  
  addScore: function (){
	
		this.score+=5*this.level;
	
	 document.getElementById("score").innerHTML="Läbi kirjutatud sõnade arv: "+this.guessedWords+"<br>"
	+"Skoor: "+this.score+"<br>"
	+"Level: "+this.level;
  },

  keyPressed: function (event) {
	 const letter = String.fromCharCode(event.which)

	 if (letter === this.word.left.charAt(0)) {
		this.word.removeFirstLetter()
		this.addScore()

		if (this.word.left.length === 0) {
		  this.guessedWords += 1
		
		if((this.guessedWords % 5) == 0){
			this.level+= 1
		}
		this.addScore()

		  this.generateWord()
		}

		this.word.Draw()
	 }
  }
}




/* WORD */
const Word = function (word, canvas, ctx) {
  this.word = word
  this.left = this.word
  this.canvas = canvas
  this.ctx = ctx
}

Word.prototype = {
  Draw: function () {
	 this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

	 this.ctx.textAlign = 'center'
	 this.ctx.font = '140px Courier'
	 this.ctx.fillText(this.left, this.canvas.width / 2, this.canvas.height / 2)
  },

  removeFirstLetter: function () {
	 this.left = this.left.slice(1)
  }
}

/* HELPERS */
function structureArrayByWordLength (words) {
  let tempArray = []

  for (let i = 0; i < words.length; i++) {
	 const wordLength = words[i].length
	 if (tempArray[wordLength] === undefined)tempArray[wordLength] = []

	 tempArray[wordLength].push(words[i])
  }

  return tempArray
}

window.onload = function () {
  const typer = new TYPER()
  window.typer = typer
  console.log(typer)
}
