function rgbToOklab(rgb){
    rgb.map((c)=>(c/255)>=0.04045?(((c/255)+0.055)/1.055)**2.4:(c/255)/12.92);
    let l = Math.cbrt(0.4122214708*rgb[0]+0.5363325363*rgb[1]+0.0514459929*rgb[2]);
    let m = Math.cbrt(0.2119034982*rgb[0]+0.6806995451*rgb[1]+0.1073969566*rgb[2]);
    let s = Math.cbrt(0.0883024619*rgb[0]+0.2817188376*rgb[1]+0.6299787005*rgb[2]);
    return [l*0.2104542553+m*0.7936177850-s*0.0040720468,l*1.9779984951-m*2.4285922050+s*0.4505937099,l*0.0259040371+m*0.7827717662-s*0.8086757660];
}
function oklabToRGB(Lab){
    let l = (Lab[0]+Lab[1]*0.3963377774+Lab[2]*0.2158037573)**3;
    let m = (Lab[0]-Lab[1]*0.1055613458-Lab[2]*0.0638541728)**3;
    let s = (Lab[0]-Lab[1]*0.0894841775-Lab[2]*1.2914855480)**3;
    return [+l*4.0767416621-m*3.3077115913+s*0.2309699292,-l*1.2684380046+m*2.6097574011-s*0.3413193965,-l*0.0041960863-m*0.7034186147+s*1.7076147010,].map((c)=>Math.round(Math.min(Math.max(255*c>=0.0031308?1.055*(c**1/2.4)-0.055:12.92*c,0),255)));
}
const OkLChToOklab=(c)=>[c[0]/100, c[1]*Math.cos(c[2]*(Math.PI/180)), c[1]*Math.sin(c[2]*(Math.PI/180))];
const OkLChToRGB=(c)=>oklabToRGB(OkLChToOklab(c));