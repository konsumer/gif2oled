const palette=[[0,0,0], [255,255,255]]

function colorDistance(a, b) {
    return Math.sqrt(
        Math.pow( ((a[0]) - (b[0])),2 ) +
        Math.pow( ((a[1]) - (b[1])),2 ) +
        Math.pow( ((a[2]) - (b[2])),2 )
    );
};

function approximateColor(color, palette) {
    var findIndex = function(fun, arg, list, min) {
        if (list.length == 2) {
            if (fun(arg,min) <= fun(arg,list[1])) {
                return min;
            }else {
                return list[1];
            }
        } else {
            var tl = list.slice(1);
            if (fun(arg,min) <= fun(arg,list[1])) {
                min = min;
            } else {
                min = list[1];
            }
            return findIndex(fun,arg,tl,min);
        }
    };
    var foundColor = findIndex(colorDistance, color, palette, palette[0]);
    return foundColor;
}

// just b&w
export function none(imageData, step=0) {
    for (let i=0;i<imageData.data.length;i+=4) {
      const avg = (imageData.data[i]+imageData.data[i+1]+imageData.data[i+2])/3 > 126 ? 255 : 0;
      imageData.data[i] = avg;
      imageData.data[i+1] = avg;
      imageData.data[i+2] = avg;
      imageData.data[i+3] = 255;
    }
}

export function atkinson(imageData, step=4) {
    const w = imageData.width
    const h = imageData.height

    var d = new Uint8ClampedArray(imageData.data);
    var ratio = 1/8;

    var $i = function(x,y) {
        return (4*x) + (4*y*w);
    };

    var r, g, b, a, q, i, color, approx, tr, tg, tb, dx, dy, di;

    for (var y=0;y<h;y += step) {
        for (var x=0;x<w;x += step) {
            i = (4*x) + (4*y*w);

            // Define bytes
            r = i;
            g = i+1;
            b = i+2;
            a = i+3;

            color = new Array(d[r],d[g],d[b]);
            approx = approximateColor(color, palette);

            q = [];
            q[r] = d[r] - approx[0];
            q[g] = d[g] - approx[1];
            q[b] = d[b] - approx[2];

            // Diffuse the error for three colors
            d[$i(x+step,y) + 0] += ratio * q[r];
            d[$i(x-step,y+step) + 0] += ratio * q[r];
            d[$i(x,y+step) + 0] += ratio * q[r];
            d[$i(x+step,y+step) + 0] += ratio * q[r];
            d[$i(x+(2*step),y) + 0] += ratio * q[r];
            d[$i(x,y+(2*step)) + 0] += ratio * q[r];

            d[$i(x+step,y) + 1] += ratio * q[g];
            d[$i(x-step,y+step) + 1] += ratio * q[g];
            d[$i(x,y+step) + 1] += ratio * q[g];
            d[$i(x+step,y+step) + 1] += ratio * q[g];
            d[$i(x+(2*step),y) + 1] += ratio * q[g];
            d[$i(x,y+(2*step)) + 1] += ratio * q[g];

            d[$i(x+step,y) + 2] += ratio * q[b];
            d[$i(x-step,y+step) + 2] += ratio * q[b];
            d[$i(x,y+step) + 2] += ratio * q[b];
            d[$i(x+step,y+step) + 2] += ratio * q[b];
            d[$i(x+(2*step),y) + 2] += ratio * q[b];
            d[$i(x,y+(2*step)) + 2] += ratio * q[b];

            tr = approx[0];
            tg = approx[1];
            tb = approx[2];

            // Draw a block
            for (dx=0;dx<step;dx++){
                for (dy=0;dy<step;dy++){
                    di = i + (4 * dx) + (4 * w * dy);

                    // Draw pixel
                    imageData.data[di] = tr;
                    imageData.data[di+1] = tg;
                    imageData.data[di+2] = tb;
                    imageData.data[di+3] = 255
                }
            }
        }
    }
}

export function diffusion(imageData, step=4) {
    const w = imageData.width
    const h = imageData.height

    var d = new Uint8ClampedArray(imageData.data);
    var ratio = 1/16;

    var $i = function(x,y) {
        return (4*x) + (4*y*w);
    };

    var r, g, b, a, q, i, color, approx, tr, tg, tb, dx, dy, di;

    for (let y=0;y<h;y += step) {
        for (let x=0;x<w;x += step) {
            i = (4*x) + (4*y*w);

            // Define bytes
            r = i;
            g = i+1;
            b = i+2;
            a = i+3;

            color = new Array(d[r],d[g],d[b]);
            approx = approximateColor(color, palette);

            q = [];
            q[r] = d[r] - approx[0];
            q[g] = d[g] - approx[1];
            q[b] = d[b] - approx[2];

            // Diffuse the error
            d[$i(x+step,y)] =  d[$i(x+step,y)] + 7 * ratio * q[r];
            d[$i(x-step,y+1)] =  d[$i(x-1,y+step)] + 3 * ratio * q[r];
            d[$i(x,y+step)] =  d[$i(x,y+step)] + 5 * ratio * q[r];
            d[$i(x+step,y+step)] =  d[$i(x+1,y+step)] + 1 * ratio * q[r];

            d[$i(x+step,y)+1] =  d[$i(x+step,y)+1] + 7 * ratio * q[g];
            d[$i(x-step,y+step)+1] =  d[$i(x-step,y+step)+1] + 3 * ratio * q[g];
            d[$i(x,y+step)+1] =  d[$i(x,y+step)+1] + 5 * ratio * q[g];
            d[$i(x+step,y+step)+1] =  d[$i(x+step,y+step)+1] + 1 * ratio * q[g];

            d[$i(x+step,y)+2] =  d[$i(x+step,y)+2] + 7 * ratio * q[b];
            d[$i(x-step,y+step)+2] =  d[$i(x-step,y+step)+2] + 3 * ratio * q[b];
            d[$i(x,y+step)+2] =  d[$i(x,y+step)+2] + 5 * ratio * q[b];
            d[$i(x+step,y+step)+2] =  d[$i(x+step,y+step)+2] + 1 * ratio * q[b];

            // Color
            tr = approx[0];
            tg = approx[1];
            tb = approx[2];

            // Draw a block
            for (dx=0;dx<step;dx++){
                for (dy=0;dy<step;dy++){
                    di = i + (4 * dx) + (4 * w * dy);

                    // Draw pixel
                    imageData.data[di] = tr;
                    imageData.data[di+1] = tg;
                    imageData.data[di+2] = tb;

                }
            }
        }
    }
}

export function ordered(imageData, step=2) {
    const w = imageData.width
    const h = imageData.height

    var d = imageData.data;
    var ratio = 3;
    var m = new Array(
        [  1,  9,  3, 11 ],
        [ 13,  5, 15,  7 ],
        [  4, 12,  2, 10 ],
        [ 16,  8, 14,  6 ]
    );

    var r, g, b, a, i, color, approx, tr, tg, tb, dx, dy, di;

    for (var y=0;y<h;y += step) {
        for (var x=0;x<w;x += step) {
            i = (4*x) + (4*y*w);

            // Define bytes
            r = i;
            g = i+1;
            b = i+2;
            a = i+3;

            d[r] += m[x%4][y%4] * ratio;
            d[g] += m[x%4][y%4] * ratio;
            d[b] += m[x%4][y%4] * ratio;

            color = new Array(d[r],d[g],d[b]);
            approx = approximateColor(color, palette);
            tr = approx[0];
            tg = approx[1];
            tb = approx[2];

            // Draw a block
            for (dx=0;dx<step;dx++){
                for (dy=0;dy<step;dy++){
                    di = i + (4 * dx) + (4 * w * dy);

                    // Draw pixel
                    d[di] = tr;
                    d[di+1] = tg;
                    d[di+2] = tb;

                }
            }
        }
    }
}