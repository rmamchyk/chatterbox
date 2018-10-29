// It's needed for saving files locally in 'uploads' folder instead of AWS bucket.
// const path = require('path');
// const fs = require('fs');

module.exports = function(formidable, Club, aws) {
    return {
        setRouting: function(router) {
            router.get('/dashboard', this.adminPage);

            router.post('/uploadFile', aws.Upload.any(), this.uploadFile);
            router.post('/dashboard', this.adminPostPage);
        },

        adminPage(req, res) {
            res.render('admin/dashboard');
        },
        uploadFile(req, res) {
            const form = new formidable.IncomingForm();
            // Saving files locally in 'uploads' folder.
            //form.uploadDir = path.join(__dirname, '../public/uploads');
            
            form.on('file', (field, file) => {
                // Saving files locally in 'uploads' folder.
                // fs.rename(file.path, path.join(form.uploadDir, file.name), (err)=> {
                //     if (err) throw err;
                //     console.log('File renamed successfully');
                // });
            });

            form.on('error', (err) => {
                console.error(err);
            });

            form.on('end', () => {
                console.log('File upload is successful');
            });

            form.parse(req);
        },
        adminPostPage(req, res) {
            const newClub = new Club();
            newClub.name = req.body.club;
            newClub.country = req.body.country;
            newClub.image = req.body.upload;

            newClub.save(err => {
                res.render('admin/dashboard');
            })
        }
    }
};