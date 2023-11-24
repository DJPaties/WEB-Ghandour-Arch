const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'test')));
// Set up Multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'extraImages/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({ storage: storage });

// Serve HTML form for image upload
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/test/test.html');
});

// Handle image uploads
app.post('/upload', upload.array('images', 15), (req, res) => {
  // Access the id sent with the form data
  const id = req.body.id;

  // Log the id value
  console.log('Received id:', id);

  // Log the uploaded files
  console.log('Uploaded files:', req.files);

  res.send('Image uploaded successfully!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
