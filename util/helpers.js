const fs = require('fs')
const fetch = require('node-fetch');
exports.download=async (uri, filename)=>{
    const response = await fetch(uri);
    const buffer = await response.buffer();
    fs.writeFile(filename, buffer, () => 
      console.log('finished downloading!'));
}
exports.imageFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
      req.fileValidationError = "Only image files are allowed!";
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  };
  exports.deleteFile = (filePath) => {
    fs.access(filePath, fs.F_OK, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      fs.unlink(filePath, (err) => {
        if (err) {
          throw err;
        }
      });
    });
  };
  exports.getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
  };
  exports.randomIntFromInterval=(min, max) => {// min and max included 
      return Math.floor(Math.random() * (max - min + 1) + min);
  }