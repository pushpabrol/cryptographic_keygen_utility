#!/usr/bin/env node

import pkg from 'node-jose';
const { JWK } = pkg;

import * as jose from 'jose'
import inquirer from 'inquirer';

const keyConfig = {
  RSA: {
    KeyUses: ["sig", "enc"],
    Algorithms: {
      sig: [
        "RS256",
        "RS384",
        "RS512",
        "PS256",
        "PS384",
        "PS512"
      ],
      enc: [
        "RSA-OAEP",
        "RSA-OAEP-256",
        "RSA-OAEP-384",
        "RSA-OAEP-512",
        "RSA1_5"
      ]
    },
    KeySizes: [2048, 4096, 8192]
  },
  EC: {
    Curves: ["P-256", "P-384", "P-521", "secp256k1"],
    KeyUses: ["sig", "enc"],
    Algorithms: {
      sig: [
        "ES256",
        "ES384",
        "ES512",
        "ES256K"
      ],
      enc: [
        "ECDH-ES",
        "ECDH-ES+A128KW",
        "ECDH-ES+A192KW",
        "ECDH-ES+A256KW"
      ]
    },
    KeySizes: ["P-256", "P-384", "P-521", "secp256k1"]
  },
  OKP: {
    Curves: ["Ed25519", "Ed448", "X25519", "X448"],
    KeyUses: ["sig", "enc"],
    Algorithms: {
      sig: [
        "EdDSA"
      ],
      enc: [
        "ECDH-ES",
        "ECDH-ES+A128KW",
        "ECDH-ES+A192KW",
        "ECDH-ES+A256KW"
      ]
    },
    KeySizes: [ {"sig" : ["Ed25519","Ed448"]}, { "enc": ["P-256", "P-384", "P-521", "X25519", "X448"]}]
  },
  oct: {
    KeyUses: ["enc", "sig"],
    Algorithms: {
      sig: [
        "HS256",
        "HS384",
        "HS512"
      ],
      enc: [
        "A128GCM",
        "A192GCM",
        "A256GCM",
        "A128CBC-HS256",
        "A192CBC-HS384",
        "A256CBC-HS512",
        "A128KW",
        "A192KW",
        "A256KW",
        "dir",
        "A128GCMKW", // Added "A128GCMKW" algorithm
        "A192GCMKW",
        "A256GCMKW",
        "PBES2-HS256+A128KW",
        "PBES2-HS384+A192KW",
        "PBES2-HS512+A256KW"
      ]
    },
    KeySizes: [
      { "HS256": ["256"] },
      { "HS384": ["384"] },
      { "HS512": ["512"] },
      { "A128GCM": ["128"] },
      { "A192GCM": ["192"] },
      { "A256GCM": ["256"] },
      { "A128CBC-HS256": ["256"] },
      { "A192CBC-HS384": ["384"] },
      { "A256CBC-HS512": ["512"] },
      { "A128KW": ["128"] },
      { "A192KW": ["192"] },
      { "A256KW": ["256"] },
      { "dir": ["128", "192", "256"] },
      { "A128GCMKW": ["128"] },
      { "A192GCMKW": ["192"] },
      { "A256GCMKW": ["256"] },
      {"PBES2-HS256+A128KW" : ["256"]},
      {"PBES2-HS384+A192KW" : ["384"]},
      {"PBES2-HS512+A256KW" : ["512"]},
    ]

  }
};



async function generateKey() {
  const questions = [
    {
      type: 'list',
      name: 'keyType',
      message: 'Choose the type of key to generate:',
      choices: Object.keys(keyConfig),
    },
    {
      type: 'list',
      name: 'keyUse',
      message: 'Choose the purpose of the key (sig or enc):',
      choices: (answers) => keyConfig[answers.keyType].KeyUses,
    },
    {
      type: 'list',
      name: 'algorithm',
      message: 'Choose an algorithm:',
      choices: (answers) => keyConfig[answers.keyType].Algorithms[answers.keyUse],
    },
    {
      type: 'list',
      name: 'keySize',
      message: 'Enter the key size or EC Curve for keyType - EC:',
      choices: (answers) => {
        if (answers.keyType === "oct") {
          return keyConfig[answers.keyType].KeySizes.find((item) => answers.algorithm in item)[answers.algorithm];
        }
        else if(answers.keyType === "OKP"){
          return keyConfig[answers.keyType].KeySizes.find((item) => answers.keyUse in item)[answers.keyUse];
        }
        else return keyConfig[answers.keyType].KeySizes;
      }
    },
  ];

  try {
    const answers = await inquirer.prompt(questions);
    console.log(answers);
    const { keyType, keyUse, algorithm, keySize } = answers;
    
    const asymmetric = keyType === "RSA" || keyType === "EC"

    if (keyType === "OKP") {

      const { publicKey, privateKey } = await jose.generateKeyPair(algorithm, {crv: keySize, exportable: true });
      console.log('Generated Public Key (JWKS):');
      const jwk = await jose.exportJWK(publicKey);
      jwk.use = keyUse;
      console.log(jwk);
      console.log('\nGenerated Public Key (PEM): ');
      console.log(await jose.exportSPKI(publicKey));
      console.log('Generated Key (JWKS):');
      const jwkPrivateKey = await jose.exportJWK(privateKey);
      jwkPrivateKey.use = keyUse;
      console.log(jwkPrivateKey);
      console.log('Generated Key (PEM):');
      console.log(await jose.exportPKCS8(privateKey))
    }
    else {

      const keystore = JWK.createKeyStore();
      const key = await keystore.generate(keyType, keySize, { use: keyUse, alg: algorithm });

      const jwksKey = key.toJSON(true);

      console.log(asymmetric ? 'Generated Private Key (JWKS):' : 'Shared Key (JWKS):');
      console.log(jwksKey);
      if (asymmetric) {
        console.log(asymmetric ? 'Generated Private Key (PEM):' : 'Shared Key (PEM):');
        const pemKey = await key.toPEM(true);
        console.log(pemKey);
        console.log('Generated Public Key (JWKS):');
        console.log(key.toJSON());
        console.log('Generated Public Key (PEM):');
        console.log(key.toPEM());
      }
    }

  } catch (error) {
    console.log(error);
    console.error('Error generating key:', error.message);
  }
}

generateKey();
