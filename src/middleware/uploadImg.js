import multer from "multer";
import path from "path"
import message from "../utils/message.js";


const Storage = multer.diskStorage({
    filename: (req, file, cb) => {
        // const ext = path.extname(file.originalname);
        // const result = `img-${Date.now()}${ext}`;  jika ingin merubah nama file
        cb(null, file.originalname)
    },
});

const Upload = multer({
    storage: Storage,
    limits: {fileSize: 1 * 1024 *1024},
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname.toLowerCase());

        const listAllowExt = [".png", ".jpg", ".jpeg"]

        if (!listAllowExt.includes(ext)) {
            cb({
                name: "Multer Error",
                message: "Format file harus png/jpg/jpeg",
                code: "FORMAT_FILE_SALAH",
                field: file.filename,
            },false)
        }

        cb(null, true)
    }
})


export default function UploadImg (req, res, next) {
    const upload = Upload.single("image");

    upload(req, res, (error) => {
        if (error) {
            const {code, message: msg} = error;

            const largeSizeFileLimit = code == "LIMIT_FILE_SIZE";
            const wrongExtFile = code == "WRONG_EXT_FILE";

            const codeRes = largeSizeFileLimit ? 413 : wrongExtFile ? 400 : 500;

            return message(res, codeRes, "Multer error", {
                errors: [
                    {
                        path: code,
                        message: msg,
                    },
                ]
            });
        };
        


        next();
    })
}