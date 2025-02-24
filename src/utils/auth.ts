
export const generateRandomPassword = () => {
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

export const generateUsername = (name: string) => {
  // Remove acentos e caracteres especiais
  const normalizedName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  // Converte para minúsculas e remove espaços
  const baseName = normalizedName.toLowerCase().replace(/\s+/g, "");
  
  // Adiciona um número aleatório para garantir unicidade
  const randomNum = Math.floor(Math.random() * 1000);
  
  return `${baseName}${randomNum}`;
};
