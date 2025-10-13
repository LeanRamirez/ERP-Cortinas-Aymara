import dotenv from 'dotenv';
dotenv.config();


import { encrypt, decrypt, generateEncryptionKey, isEncrypted } from './src/config/encryption.js';

console.log('🔐 Probando sistema de cifrado AES-256-GCM...\n');

try {
  // Probar cifrado y descifrado
  const testText = 'mi_usuario_smtp@gmail.com';
  console.log('📝 Texto original:', testText);
  
  const encrypted = encrypt(testText);
  console.log('🔒 Texto cifrado:', encrypted);
  console.log('📏 Formato cifrado:', encrypted.split(':').map((part, i) => `Parte ${i+1}: ${part.length} chars`).join(', '));
  
  const decrypted = decrypt(encrypted);
  console.log('🔓 Texto descifrado:', decrypted);
  
  console.log('✅ Cifrado/Descifrado:', testText === decrypted ? 'CORRECTO' : 'ERROR');
  
  // Probar validación de formato
  console.log('🔍 Es cifrado válido:', isEncrypted(encrypted) ? 'SÍ' : 'NO');
  console.log('🔍 Texto plano es cifrado:', isEncrypted(testText) ? 'SÍ' : 'NO');
  
  // Probar con contraseña
  const testPassword = 'mi_contraseña_super_secreta_123';
  console.log('\n📝 Contraseña original:', testPassword);
  
  const encryptedPassword = encrypt(testPassword);
  console.log('🔒 Contraseña cifrada:', encryptedPassword);
  
  const decryptedPassword = decrypt(encryptedPassword);
  console.log('🔓 Contraseña descifrada:', decryptedPassword);
  
  console.log('✅ Contraseña cifrado/descifrado:', testPassword === decryptedPassword ? 'CORRECTO' : 'ERROR');
  
  console.log('\n🎉 Sistema de cifrado funcionando correctamente!');
  
} catch (error) {
  console.error('❌ Error en el sistema de cifrado:', error.message);
  process.exit(1);
}
