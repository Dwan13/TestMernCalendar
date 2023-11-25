const mongoose = require("mongoose");
console.log('connections',process.env.DB_CNN);

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CNN);
    console.log('DB online');
  } catch (error) {
    console.log(error);
    throw new Error("Error a la hora de inicializar la base de datos");
  }
};

module.exports={
    dbConnection
}
