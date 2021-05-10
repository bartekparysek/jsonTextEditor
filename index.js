const express = require('express');
const app = express();
const fs = require('fs');
const mv =

   app.use(express.static('public'))
app.use(express.json({
   strict: false,
   type: 'application/json',
}));
app.use(express.urlencoded({ extended: false }));


const port = process.env.PORT || 3000;

app.listen(port, () =>
   console.log(`App is listening on port ${port}.`));

app.post('/upload-text', (req, res) => {
   try {
      if (!req.body) {
         res.send({
            status: false,
            message: "Can't load files"
         });
      } else {
         let data = JSON.stringify(req.body, null, 2);

         const file = fs.writeFile('text.json', data, (err) => {
            if (err) throw err;
            console.log('data written to file');
         });

         res.send({
            status: true,
            message: 'Files were uploaded',
         });
      }
   } catch (err) {
      res.status(500).send(err);
   }
});
app.get('/download-file', (req, res) => {
   res.download('text.json', 'user-facing-filename.json', (err) => { });

})