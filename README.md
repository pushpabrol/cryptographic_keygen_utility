# README for Key Generation Script

## Overview

This script is a Node.js application designed for generating cryptographic keys using various algorithms and configurations. It leverages `node-jose` and `jose` libraries for cryptographic operations and `inquirer` for interactive command-line prompts.

## Features

- **Multiple Key Types**: Supports RSA, Elliptic Curve (EC), Octet Key Pair (OKP), and Octet Sequence (oct) key types.
- **Variety of Algorithms**: Offers a range of algorithms for both signing (sig) and encryption (enc) purposes.
- **Customizable Key Sizes and Curves**: Allows selection of key sizes for RSA and oct keys, and curves for EC and OKP keys.
- **Output Formats**: Generates keys in both JSON Web Key Set (JWKS) and PEM formats.

## Prerequisites

- Node.js
- npm (Node Package Manager)

## Installation

1. Clone the repository or download the script file.
2. Navigate to the script's directory.
3. Run `npm install` to install required dependencies.

## Usage

To use the script, follow these steps:

1. Run the script using `node index`.
2. Follow the interactive prompts to choose the key type, purpose (signing or encryption), algorithm, and key size/curve.
3. The script will output the generated key in JWKS and PEM formats.

### Key Configuration

- **RSA**: Supports key sizes of 2048, 4096, and 8192 bits.
- **EC**: Supports `P-256`, `P-384`, `P-521`, and `secp256k1` curves.
- **OKP**: Supports `Ed25519`, `Ed448`, `X25519`, and `X448` curves.
- **oct**: Supports various key sizes and algorithms, including HMAC and AES.

### Output

- Displays the generated keys in both JWKS and PEM formats.
- For asymmetric keys (RSA, EC), it provides both private and public keys.
- For symmetric keys (oct), it generates a shared key.

## Error Handling

The script includes error handling to catch and display any issues encountered during the key generation process.

## Note

This script is intended for educational and development purposes. Ensure to follow best practices for key management and security in production environments. 

---

For further customization or issues, refer to the documentation of the `node-jose` and `jose` libraries.