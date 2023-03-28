import crypto from "crypto";

const createSalt = () =>
    new Promise((resolve, reject) => {
    crypto.randomBytes(64, (err, buf) => {
        if (err) reject(err);
        resolve(buf.toString("base64"));
    });
});

const createHashedPassword = (plainPassword, salt) =>
    new Promise(async (resolve, reject) => {
    if (!salt){
        const createdSalt = await createSalt(); // salt 만들어서 대입
        crypto.pbkdf2(plainPassword, createdSalt, 9999, 64, "sha512", (err, key) => {
            if (err) reject(err);
            resolve({password: key.toString("base64"), createdSalt });
        });
    } else
        crypto.pbkdf2(plainPassword, salt, 9999, 64, "sha512", (err, key) => {
            if (err) reject(err);
            resolve({password: key.toString("base64")});
          });
});

export {createHashedPassword}