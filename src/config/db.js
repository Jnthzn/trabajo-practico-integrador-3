import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // Intenta conectar con la URL definida en tu .env
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    // Si falla la conexión, muestra el error y frena el servidor
    console.error(`Error de conexión a MongoDB: ${error.message}`);
    process.exit(1);
  }
};
