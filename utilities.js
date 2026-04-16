/**
 * 
 * @param {string[]} rgbaColor - string of colors
 * @returns {string} string of black and white
 */
export function getContrastColor(rgbaColor) {
    let parse_string = rgbaColor.substring(5,rgbaColor.length-1);
    parse_string = parse_string.split(",");

    //find the perceived brightness value
    let brightness = Math.sqrt((parse_string[0]*parse_string[0]*.241)+(parse_string[1]*parse_string[1]*.691)+(parse_string[2]*parse_string[2]*.068));
    if(brightness>130) {
        return 'rgba(0,0,0,1)';
    } else {
        return 'rgba(255,255,255,1)';
    }
}
/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @returns {number} number for index
 */

export function convertCoordsToIndex(x,y) {
    return (y*16)+x;
}