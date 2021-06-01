let inputs = process.argv[2];

inputJSON=JSON.parse(inputs,null,3)
console.log(inputJSON['location']);