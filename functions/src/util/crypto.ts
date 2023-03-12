import crypto from "node:crypto";

const ENCRYPTION_ALGORITHM = "aes-256-cbc";
const KEY = process.env.ENCRYPTION_KEY as string;

const encrypt = async (text: string): Promise<string> => {
    const key = await deriveKey(KEY, "salt", 16);
    console.log(key, key.length);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;
};

const decrypt = async (text: string): Promise<string> => {
    const key = await deriveKey(KEY, "salt", 16);

    const [iv, encrypted] = text.split(":");
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, Buffer.from(iv, "hex"));
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
};

const deriveKey = async (password: string, salt: string, keyLength: number): Promise<string> => {
    const key = await new Promise<Buffer>((resolve, reject) => {
        crypto.scrypt(password, salt, keyLength, (err, derivedKey) => {
            if (err) {
                reject(err);
            } else {
                resolve(derivedKey);
            }
        });
    });
    return key.toString("hex");
};


export {encrypt, decrypt, deriveKey};
