function splitArrayToChunks (arr, chunkSize) {
    let resultArr = [];
    let i, arrChunk;
    for (i=0 ; i < arr.length ; i += chunkSize) {
      arrChunk = arr.slice(i, i + chunkSize);
      resultArr.push(arrChunk);
    }
  
    return resultArr;
}

arr = [1,2,3,4,5,6,7];

console.log(splitArrayToChunks(arr, 3));