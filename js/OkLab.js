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
// L: Lightnes (0-1)    How light the color is
// C: Chroma (0-1)      How vivid/dull color is
// h: Hue (0-360)       Color hue
function OkLChToRGB(LCh){return oklabToRGB(OkLChToOklab(LCh))}