# DES Encryption and Decryption Using JavaScript

A client-side demonstration of DES encryption and decryption using CryptoJS.

## Run locally

1. Open `index.html` directly in a modern browser, or serve this folder with a local static server.
2. The page loads CryptoJS 4.2.0 from cdnjs, so an internet connection is needed unless the library is downloaded locally.
3. The sample values are already filled in:
   - Plaintext: `HELLO WORLD`
   - Secret key: `12345678`
   - IV: `12345678`
4. Click **Encrypt message**.
5. The generated Base64 ciphertext is copied into the decryption field automatically. Click **Decrypt message** to restore `HELLO WORLD`.

## Project files

- `index.html` - page structure, navigation, forms, and DES process explanation.
- `styles.css` - responsive cybersecurity-themed dashboard styling and animations.
- `script.js` - CryptoJS DES-CBC encryption/decryption, validation, copying, notifications, and workspace controls.

## Implementation details

- Algorithm: DES
- Mode: CBC
- Padding: PKCS7
- Key: exactly 8 UTF-8 characters
- IV: exactly 8 UTF-8 characters
- Ciphertext output: Base64

All cryptographic operations happen in the browser. DES is included here for educational purposes; it is considered legacy cryptography and should not be used for new production systems.
