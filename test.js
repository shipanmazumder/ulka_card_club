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
    "Vihaan",
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
let randomIntFromInterval=(min, max) => {// min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}
//   function getRandomInt(max) {
//     return Math.floor(Math.random() * Math.floor(max));
//   }
//   let newIndexArray=[];
//   let index=0;
//   for(var i=0;i<7;i++){
//       index=getRandomInt(maleName.length);
//       while(newIndexArray.indexOf(index) !== -1){
//         index=getRandomInt(maleName.length);
//         console.log(index)
//       }
//       newIndexArray.push(index)
      
//     }
    console.log(randomIntFromInterval(3,5))
//   console.log(maleName[index])