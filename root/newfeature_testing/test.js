const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Create a storage engine using Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { files: 5 } });

// Serve static files (for example, an HTML form to upload images)
app.use(express.static('test'));

// Create the "extraImages" directory if it doesn't exist
const uploadFolder = 'extraImages';
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}

// Handle image uploads and resizing
app.post('/upload', upload.array('images', 5), async (req, res) => {
    const images = req.files;

    if (!images || images.length === 0) {
        return res.status(400).send('No images uploaded.');
    }

    try {
        const resizedImages = await Promise.all(
            images.map(async (image, index) => {
                const imageName = `image_${index + 1}.jpg`;
                const outputPath = `${uploadFolder}/${imageName}`;

                await sharp(image.buffer)
                    .resize(510, 320)
                    .toFile(outputPath);

                return imageName;
            })
        );

        res.json({ success: true, resizedImages });
    } catch (err) {
        console.error(`Error resizing and saving images: ${err}`);
        res.status(500).send('Error resizing and saving images.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
