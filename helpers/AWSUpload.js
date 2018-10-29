const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

AWS.config.update({
    accessKeyId: '',
    secretAccessKey: '',
    region: ''
});

const s3 = new AWS.S3();
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'chatterbox-bucket',
        acl: 'public-read',
        metadata(req, file, cb) {
            cb(null, {fieldname: file.fieldname});
        },
        key(req, file, cb) {
            cb(null, file.originalname);
        },
        rename(fieldname, filename) {
            return filename.replace(/\W+/g, '-');
        }
    })
});

module.exports.Upload = upload;