const DButils = {}

DButils.splitArrayToChunks = (arr, chunkSize) => {
    arr = DButils.parseObjectArray(arr);
    let resultArr = [];
    let i, arrChunk;
    for (i=0 ; i < arr.length ; i += chunkSize) {
      arrChunk = arr.slice(i, i + chunkSize);
      resultArr.push(arrChunk);
    }
  
    return resultArr;
}

DButils.parseObjectArray = (arr) => {
    const resultArr = [];
    arr.forEach(lesson => {
      resultArr.push(JSON.parse(lesson));
    });
  
    return resultArr;
}

module.exports = DButils;