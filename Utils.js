module.exports = {
    distance(x0, y0, x1, y1) {
        console.log(x0, y0, x1, y1);
        console.log(Math.sqrt(Math.pow((x1 - x0), 2) + Math.pow((y1 - y0), 2)));
        return Math.sqrt(Math.pow((x1 - x0), 2) + Math.pow((y1 - y0), 2));
    }
}
