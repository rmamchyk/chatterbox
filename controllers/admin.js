const path = require('path');
const fs = require('fs');

module.exports = function(formidable) {
    return {
        setRouting: function(router) {
            router.get('/dashboard', this.adminPage);

            router.post('/uploadFile', this.uploadFile);
            
        },

        adminPage(req, res) {
            res.render('admin/dashboard');
        },
        uploadFile(req, res) {
            const form = new formidable.IncomingForm();
            form.uploadDir = path.join(__dirname, '../public/uploads');
            
            form.on('file', (field, file) => {
                fs.rename(file.path, path.join(form.uploadDir, file.name), (err)=> {
                    if (err) throw err;
                    console.log('File renamed successfully');
                });
            });

            form.on('error', (err) => {
                console.error(err);
            });

            form.on('end', () => {
                console.log('File upload is successful');
            });

            form.parse(req);
        }
    }
};