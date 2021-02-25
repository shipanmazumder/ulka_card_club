const { getRandomInt } = require("./helpers");

const maleName = [
  "Aarav",
  "Vihaan",
  "Vivaan",
  "Ananya",
  "Daya",
  "Advik",
  "Kabir",
  "Anaya",
  "Aarav",
  "Vivaan",
  "Aditya",
  "Vivaan",
  "Vihban",
  "Arjun",
  "Vivaan",
  "Reyansh",
  "Mohammed",
  "Sai",
  "Arnav",
  "Aayan",
  "Krishna",
  "Ishaan",
  "Shaurya",
  "Atharva",
  "Advik",
  "Pranav",
  "Advaith",
  "Aaryan",
  "Dhruv",
  "Kabir",
  "Ritvik",
  "Aarush",
  "Kian",
  "Darsh",
  "Veer",
];
const femaleName = [
  "Saanvi",
  "Anya",
  "Aadhya",
  "Aaradhya",
  "Ananya",
  "Pari",
  "Anika",
  "Navya",
  "Angel",
  "Diya",
  "Myra",
  "Sara",
  "Iraa",
  "Ahana",
  "Anvi",
  "Prisha",
  "Riya",
  "Aarohi",
  "Anaya",
  "Akshara",
  "Eva",
  "Shanaya",
  "Kyra",
  "Siya",
];
const location=[
  {
    country:"BD",
    city:"Mirpur"
  },
  {
    country:"IN",
    city:"Kolkata"
  },
  {
    country:"BD",
    city:"Gulshan"
  },
  {
    country:"BD",
    city:"Mohakhali"
  },
  {
    country:"IN",
    city:"Mumbai"
  }
]
exports.maleNameGenerate = (generateLength) => {
    let names=[];
  let getRandomIndexArray=getRandomIndex(generateLength,maleName.length)
  for(var i=0; i<getRandomIndexArray.length;i++){
    names.push(maleName[i])
  }
  return names;
};
exports.femaleNameGenerate = (generateLength) => {
    let names=[];
  let getRandomIndexArray=getRandomIndex(generateLength,femaleName.length)
  for(var i=0; i<getRandomIndexArray.length;i++){
    names.push(femaleName[i])
  }
  return names;
};
exports.locationGenerate = () => {
  let index=getRandomInt(location.length)
  return location[index]
};

let getRandomIndex = (generateLength, arrayLength) => {
  let newIndexArray = [];
  let index = 0;
  for (var i = 0; i < generateLength; i++) {
    index = getRandomInt(arrayLength);
    while (newIndexArray.indexOf(index) !== -1) {
        index = getRandomInt(arrayLength);
    }
    newIndexArray.push(index);
  }
  return newIndexArray;
};