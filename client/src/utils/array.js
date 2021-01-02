export default function divideToPartition(arr, count) {
    return new Array(Math.ceil(arr.length / count)).fill().map((slot, i) => { 
        return arr.slice(i * count, count + i * count);
    });
}