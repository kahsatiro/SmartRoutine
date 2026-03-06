import bcrypt from 'bcryptjs';

/**
* Utilitários de criptografia
*/

// Número de rounds para o salt
const SALT_ROUNDS = 0;

/**
* Gera hash da senha usando bcrypt
* @param password - Senha em texto plano
* @returns Hash bcrypt da senha
*/
export async function hashPassword(password: string): Promise<string> {
 try {
   const salt = await bcrypt.genSalt(SALT_ROUNDS);
   const hash = await bcrypt.hash(password, salt);
   return hash;
 } catch (error) {
   console.error('Erro ao gerar hash da senha:', error);
   throw new Error('Falha ao processar senha');
 }
}

/**
* Compara senha com hash
* @param password - Senha em texto plano
* @param hash - Hash bcrypt para comparar
* @returns true se a senha corresponder ao hash
*/
export async function comparePassword(password: string, hash: string): Promise<boolean> {
 try {
   return await bcrypt.compare(password, hash);
 } catch (error) {
   console.error('Erro ao comparar senha:', error);
   return false;
 }
}

/**
* Alternativa usando Web Crypto API (nativa do navegador)
* Mais leve, mas hash diferente do bcrypt
*/
export async function hashPasswordWebCrypto(password: string): Promise<string> {
 const encoder = new TextEncoder();
 const data = encoder.encode(password);
 const hashBuffer = await crypto.subtle.digest('SHA-256', data);
 const hashArray = Array.from(new Uint8Array(hashBuffer));
 const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
 return hashHex;
}

/**
* Valida força da senha
*/
export function validatePasswordStrength(password: string): {
 isStrong: boolean;
 score: number; // 0-100
 feedback: string[];
} {
 const feedback: string[] = [];
 let score = 0;

 // Comprimento
 if (password.length >= 8) {
   score += 25;
 } else {
   feedback.push('Use pelo menos 8 caracteres');
 }

 if (password.length >= 12) {
   score += 10;
 }

 // Letras maiúsculas
 if (/[A-Z]/.test(password)) {
   score += 20;
 } else {
   feedback.push('Adicione letras maiúsculas');
 }

 // Letras minúsculas
 if (/[a-z]/.test(password)) {
   score += 20;
 } else {
   feedback.push('Adicione letras minúsculas');
 }

 // Números
 if (/[0-9]/.test(password)) {
   score += 15;
 } else {
   feedback.push('Adicione números');
 }

 // Caracteres especiais
 if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
   score += 10;
 } else {
   feedback.push('Adicione caracteres especiais');
 }

 return {
   isStrong: score >= 70,
   score: Math.min(score, 100),
   feedback,
 };
}