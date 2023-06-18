import crypto from "crypto";
// 次のコードはパスワード暗号化のためにソルト(Salt)を生成して、与えられた平文パスワードとSaltを利用してハッシュ(Hash)されたパスワードを生成する関数で構成されています。

/* Saltを生成する関数
   Salt:Hashの前に任意の文字列を追加すること　*/
const createSalt = () =>
    new Promise((resolve, reject) => {
    crypto.randomBytes(64, (err, buf) => {
        if (err) reject(err);
        resolve(buf.toString("base64"));
    });
});

// 生成したSaltでパスワードを生成
const createHashedPassword = (plainPassword, salt) =>
    new Promise(async (resolve, reject) => {
    if (!salt){
        const createdSalt = await createSalt();
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