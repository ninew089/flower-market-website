import { env } from '@/env.mjs';
import CryptoJS from 'crypto-js';

export function aesEncrypt(word: string) {
  const encJson = CryptoJS.AES.encrypt(
    JSON.stringify(word),
    env.NEXT_PUBLIC_AES_KEY,
    {
      iv: CryptoJS.enc.Utf8.parse(env.NEXT_PUBLIC_AES_IV), //import.meta.env.VITE_APP_FORWARD_API_NEXT_PUBLIC_AES_IV), // parse the IV
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    },
  ).toString();
  const encData = CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Utf8.parse(encJson),
  );
  return encData;
}

export function aesDecrypt(word: string): string;
export function aesDecrypt(word?: null): undefined;
export function aesDecrypt(word?: string | null) {
  if (!word) return;
  const decData = CryptoJS.enc.Base64.parse(word).toString(CryptoJS.enc.Utf8);
  const bytes = CryptoJS.AES.decrypt(decData, env.NEXT_PUBLIC_AES_KEY, {
    iv: CryptoJS.enc.Utf8.parse(env.NEXT_PUBLIC_AES_IV), // parse the IV
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  }).toString(CryptoJS.enc.Utf8);
  return JSON.parse(bytes);
}
