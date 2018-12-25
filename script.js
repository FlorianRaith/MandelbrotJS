window.addEventListener('load', () => {

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;

    const zoom = 0.6;
    const check = 2000;
    const iterations = 100;

    /* below some random values for random coloring */
    const r1 = Math.random() * 2 - 1;
    const r2 = Math.random() * 2 - 1;
    const r3 = Math.random() * 2;

    render();
    function render() {
        const imgData = ctx.createImageData(width, height);

        let z;
        let c;

        let bound = 2 * zoom;
        let xOffset = width / 2 - height / 2;

        for(let x = 0; x < width; x++) {
            for(let y = 0; y < height; y++) {

                z = {a: 0, b: 0};
                c = {a: map(x, xOffset, height + xOffset, -bound, bound), b: map(y, 0, height, -bound, bound)};
                let i = 0;
            
                while(abssq(z) < check && i++ < iterations) z = add(square(z), c);
            
                calcPixel(x, y, i, imgData);

            }
        }

        ctx.putImageData(imgData, 0, 0);
    }


    function calcPixel(x, y, i, imgData) {

        let c = hslToRgb(r1 *  (i / iterations), r2 * (i / iterations),  r3 * (i / iterations *2));

        let index = 4 * (x + y * width);

        imgData.data[index + 0] = c[0];
        imgData.data[index + 1] = c[1];
        imgData.data[index + 2] = c[2];
        imgData.data[index + 3] = 255;
        
    }

    // add two complex numbers
    function add(c1, c2) {
        return {a: c1.a + c2.a, b: c1.b + c2.b};
    }

    // square a complex number
    function square(c) {
        return {a: c.a * c.a - c.b * c.b, b: c.a * c.b * 2}
    }

    function abssq(c) {
        return c.a * c.a + c.b * c.b;
    }

    function norm(value, min, max) {
        return (value - min) / (max - min);
    }

    function lerp(norm, min, max) {
        return (max - min) * norm + min;
    }

    function map(value, min1, max1, min2, max2) {
        return lerp(norm(value, min1, max1), min2, max2);
    }

    /*
    * Copied the function below from stackoverflow, don't blame me
    * https://stackoverflow.com/a/9493060
    */
    function hslToRgb(h, s, l){
        let r, g, b;

        if(s == 0){
            r = g = b = l;
        }else{
            let hue2rgb = function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }


});