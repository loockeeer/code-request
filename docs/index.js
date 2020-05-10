class TextSlider {
	constructor(el, data, interval) {
  	this.el = el;
    this.data = data;
    this.interval = interval;
    this.index = -1
  }
  start() {
  	this.intervalID = setInterval(()=>this.step(), this.interval)
  }
  stop() {
  	clearInterval(this.intervalID)
  }
  step() {
  	this.index++
    if(this.index >= this.data.length) this.index = 0
    this.el.innerHTML = `<p class="fadeInUp ${this.data[this.index].customClasses.join(' ')}">${this.data[this.index].name}</p>`
  }
}


new Typing({
   time : 60,      // latence of typing
   id : 'slug'   // #id of output HTMLElement
}).write('<span class="graphql">GraphQL</span>, <span class="rest">REST</span>. <span class="docker">Docker</span>. Request your run')

new Typing({
   time : 40,      // latence of typing
   id : 'codeone'   // #id of output HTMLElement
}).write(PR.prettyPrintOne('fetch("http://api.coderequest.tk/rest?code=console.log(\'Hello World\')&lang=js")')).then(()=>{
    new Typing({
       time : 40,      // latence of typing
       id : 'codetwo'   // #id of output HTMLElement
   }).write(PR.prettyPrintOne(`
fetch("http://api.coderequest.tk/graphql", {
    <br>
        method: 'post',
   <br>
        body: \`{run(code: "console.log('Hello World')", lang:js)}\`
   <br>
})
`))
})

fetch("https://raw.githubusercontent.com/loockeeer/code-request/master/config.json").then(res=>res.json()).then(json=>{
    console.log(json)
    const data = json.languages.map(lang=>({
        name: lang.fullname,
        customClasses: []
    }))
    const slider = new TextSlider(document.getElementById("languages"), data, 1500)

    slider.start()
})
