import bcrypt from "bcrypt";

// Hashea la contraseña antes de guardarla en la base de datos
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Compara la contraseña en texto plano con el hash guardado
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
