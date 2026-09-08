import CryptoJS from 'crypto-js';

const SECRET_SALT = 'jme3_la_baghi_tjme3_secure_salt_2026';

const getKey = (uid: string) => {
  return CryptoJS.SHA256(uid + SECRET_SALT).toString();
};

export const encryptData = (data: string | number, uid: string): string => {
  const key = getKey(uid);
  return CryptoJS.AES.encrypt(data.toString(), key).toString();
};

export const decryptData = (ciphertext: string, uid: string): string => {
  if (!ciphertext) return '0';
  const key = getKey(uid);
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedData;
};
