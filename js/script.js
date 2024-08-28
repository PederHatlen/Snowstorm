let hueEl = document.getElementById("hue");
let saturationEl = document.getElementById("saturation");
let speedEl = document.getElementById("speed");
let sizeEl = document.getElementById("size");
let sizevarEl = document.getElementById("sizevar");
let particlesEl = document.getElementById("particles");
let bounceModeEl = document.getElementById("bouncemode");
let charEl = document.getElementById("char");
let charCustomEl = document.getElementById("charCustom");

let cEL = document.getElementById("c");
let ctx = cEL.getContext("2d");

const KeyMash = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!\"#$%&/()=?+¨^*@<>,.-;:_§'".split("");

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

const gammaToLinear = (c) => c >= 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92;
const linearToGamma = (c) => c >= 0.0031308 ? 1.055 * Math.pow(c, 1 / 2.4) - 0.055 : 12.92 * c;
function OkLChToOklab(LCh){
    let a = LCh[1]*Math.cos(LCh[2]*(Math.PI/180));
    let b = LCh[1]*Math.sin(LCh[2]*(Math.PI/180));
    return [LCh[0], a, b];
}
function rgbToOklab(rgb) {
    rgb.map((c)=>{return gammaToLinear(c/255)});
    let l = Math.cbrt(0.4122214708 * rgb[0] + 0.5363325363 * rgb[1] + 0.0514459929 * rgb[2]);
    let m = Math.cbrt(0.2119034982 * rgb[0] + 0.6806995451 * rgb[1] + 0.1073969566 * rgb[2]);
    let s = Math.cbrt(0.0883024619 * rgb[0] + 0.2817188376 * rgb[1] + 0.6299787005 * rgb[2]);
    return [    
        (l*+0.2104542553) + (m*+0.7936177850) + (s*-0.0040720468),
        (l*+1.9779984951) + (m*-2.4285922050) + (s*+0.4505937099),
        (l*+0.0259040371) + (m*+0.7827717662) + (s*-0.8086757660),
    ];
}
function oklabToRGB(Lab) {
    var l = (Lab[0] + Lab[1] * +0.3963377774 + Lab[2] * +0.2158037573) ** 3;
    var m = (Lab[0] + Lab[1] * -0.1055613458 + Lab[2] * -0.0638541728) ** 3;
    var s = (Lab[0] + Lab[1] * -0.0894841775 + Lab[2] * -1.2914855480) ** 3;
    return [
        l * +4.0767416621 + m * -3.3077115913 + s * +0.2309699292,
        l * -1.2684380046 + m * +2.6097574011 + s * -0.3413193965,
        l * -0.0041960863 + m * -0.7034186147 + s * +1.7076147010,
    ].map(c=>Math.round(Math.min(Math.max(255*linearToGamma(c), 0), 255)));
}
function OkLChToRGB(LCh){return oklabToRGB(OkLChToOklab(LCh))}

let items = [];

class item{
    constructor() {
        this.X = Math.random()*cEL.width;
        this.Y = Math.random()*cEL.height;
        this.Z = Math.random();
        
        if (!bounceModeEl.checked){
            this.velX = (this.Z)-1;
            this.velY = this.Z;

            this.size;
            this.speed = this.Z;
        }else{
            this.velX = (Math.random()*2)-1;
            this.velY = (Math.random()*2)-1;

            this.size;
            this.speed = Math.random();
        }

        this.char = Math.random();

        // this.char = "❄";                                                 // Snowflake
        // this.char = "●";                                                 // circular Snow
        // this.char = "☭";                                                 // Communism ☭
        // this.char = KeyMash[Math.floor(chars.length*Math.random())];     // Random specified
        // this.char = String.fromCharCode(0x25A0 + Math.random()*96);      // All geometric shapes
        // this.char = String.fromCharCode(0x2600 + Math.random()*256);     // Miscellaneous Symbols
        // this.char = String.fromCharCode(Math.random()*1114111);          // All symbols


        this.sizeMod = (Math.random()*2)-1;
        this.speed = this.Z;
        this.color = "#FFF";
        this.recolor();
    }
    checkForHit(){
        // Normal
        // if(cEL.width+this.size/2 < this.X || this.X < this.size/2) this.velX *= -1
        // if(cEL.height+this.size/2 < this.Y || this.Y < this.size/2) this.velY *= -1

        // console.log(cEL.width+this.size, this.X, this.Y)

        // Falling
        if (!bounceModeEl.checked){
            if(cEL.width+this.size < this.X || this.X+this.size < 0) this.X = cEL.width+this.size ;
            if(cEL.height+this.size < this.Y || this.Y+this.size < 0) this.Y = -this.size;
        }else{
            if(cEL.width < this.X || this.X < 0) this.velX *= -1
            if(cEL.height < this.Y || this.Y < 0) this.velY *= -1
        }
    }
    move(){
        let YStep = (this.velY * this.speed) + this.velY * parseInt((speedEl.value**Math.E)/1000);

        this.X += (this.velX * this.speed) + this.velX * parseInt((speedEl.value**Math.E)/1000);
        this.Y += (bounceModeEl.checked? YStep:Math.abs(YStep));
    }
    wavecolor(){
        this.color = rgbToHex(OkLChToRGB([this.Y/cEL.height, clamp(this.speed, 0.2, 1), this.X/cEL.width*365]));
    }
    recolor(){
        // this.recolor_random()
        this.color = rgbToHex(OkLChToRGB([clamp(this.speed, 0.2, 1), saturationEl.value, hueEl.value]));
    }
    recolor_random(){
        this.color = rgbToHex(OkLChToRGB([0.7656, 0.1632, Math.random()*360]));
    }
    draw(){
        ctx.fillStyle = this.color;

        // ctx.beginPath();
        // ctx.ellipse(this.X, this.Y, this.size, this.size, 0, 0, 2*Math.PI);
        // ctx.fill();
        this.size = parseInt(sizeEl.value) * ((this.Z*5)+2.5)
        this.size += this.sizeMod * this.size * parseFloat(sizevarEl.value)

        ctx.font = `${this.size}px Arial`;

        let outChar = "";

        switch (charEl.value) {
            case "[KEYMASH]":
                outChar = KeyMash[Math.floor(KeyMash.length * this.char)];
                break;
            case "[GEOMETRIC]":
                outChar = String.fromCharCode(0x25A0 + this.char*96);
                break;
            case "[MISCSYMBOLS]":
                outChar = String.fromCharCode(0x2600 + this.char*256);
                break;
            case "[CUSTOM]":
                outChar = charCustomEl.value.split("")[Math.floor(charCustomEl.value.length*this.char)]
                break;
            default:
                outChar = charEl.value;
                break;
        }

        ctx.fillText(outChar, this.X, this.Y);2
    }
}

// converts RGB integer values to hex:
function rgbToHex(rgb){return "#" + (rgb[2] | (rgb[1] << 8) | (rgb[0] << 16) | (1 << 24)).toString(16).slice(1);}
function randColor(){return rgbToHex(OkLChToRGB([0.5, 0.12, Math.random()*360]));}

function render(){
    // if(Math.random() <= 0.005) items.push(new item());

    if(items.length <= particlesEl.value){
        let missing = (particlesEl.value - items.length);
        for(let i=0; i < missing; i++) items.push(new item());
        items.sort((a, b)=>{return a.Z - b.Z});
    }
    if(items.length >= particlesEl.value){
        let missing = (items.length - particlesEl.value);
        for(let i=0; i < missing; i++) items.splice(Math.floor(items.length*Math.random()), 1);
    }

    // ctx.fillStyle = "Red";
    // ctx.fillRect(0,0, cEL.width, cEL.height);
    ctx.clearRect(0, 0, cEL.width, cEL.height);
    for(let e of items){
        e.move();
        e.checkForHit();

        e.draw()

        // ctx.fillStyle = e.color;
        // ctx.beginPath();
        // ctx.ellipse(e.X, e.Y, e.size, e.size, 0, 0, 2*Math.PI);
        // ctx.fill();
    }
    window.requestAnimationFrame(render);
}

function resize(){
    cEL.setAttribute("width", window.innerWidth*2);
    cEL.setAttribute("height", window.innerHeight*2);
}

hueEl.oninput = (e)=>{
    if(hueEl.value > 360) hueEl.value = 360;
    if(hueEl.value < 0) hueEl.value = 0;

    for(let e of items) e.recolor();
};
saturationEl.oninput = (e)=>{
    if(saturationEl.value > 1) saturationEl.value = 1;
    if(saturationEl.value < 0) saturationEl.value = 0;

    for(let e of items) e.recolor();
};

document.onkeydown = (e)=>{
    if(e.key == "f" && e.target == document.body){
        if(document.fullscreenElement){document.exitFullscreen()}
        else{document.documentElement.requestFullscreen()}
    }
}

resize();
window.onresize = resize;
render();