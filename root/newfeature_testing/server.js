const express = require("express");
const multer = require("multer");
const sqlite3 = require("sqlite3").verbose();
const sharp = require("sharp"); // Import the sharp library

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.set("view engine", "ejs");

const db = new sqlite3.Database("database.db");

// Serve image details
app.get("/image/:id", (req, res) => {
    const imageId = req.params.id;

    db.get("SELECT * FROM images WHERE id = ?", [imageId], (err, image) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Error retrieving image details from database." });
        } else {
            res.json(image);
        }
    });
});


app.get("/imageDetail", (req, res) => {
    const imageId = req.query.id;

    db.get("SELECT * FROM images WHERE id = ?", [imageId], (err, image) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error retrieving image details from database.");
        } else {
            if (image) {
                res.render("imageDetail", { image }); // Render the EJS view
            } else {
                res.status(404).send("Image not found.");
            }
        }
    });
});




app.delete("/delete/:id", (req, res) => {
    const imageId = req.params.id;
    console.log("This is the server that has the ID image:", imageId)
    db.run("DELETE FROM images WHERE id = ?", [imageId], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error deleting image from database.");
        } else {
            res.sendStatus(200);
        }
    });
});

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "additionalImages/"); //name of the folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + ".jpg"); // Save as JPG
    },
});
const upload = multer({ storage });






// Serve static files
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Initialize database and create table
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, filename TEXT, description TEXT)");
});

// Handle image uploads
app.post("/upload", upload.single("image"), async (req, res) => {
    const { description } = req.body;
    const filename = req.file.filename;

    // Resize and save the image
    try {
        await sharp(req.file.path)
            .resize(510, 320)
            .toFile(`uploads/resized-${filename}`);
        
        db.run("INSERT INTO images (filename, description) VALUES (?, ?)", [filename, description], (err) => {
            if (err) {
                console.error(err);
                res.status(500).send("Error saving image to database.");
            } else {
                res.redirect("/");
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error resizing and saving image.");
    }
});

app.delete("/deleteImage/:filename", (req, res) => {
    const filename = req.params.filename;

    fs.unlink(path.join("uploads", filename), err => {
        if (err) {
            console.error(err);
            res.status(500).send("Error deleting image.");
        } else {
            // Update the image details in the database to remove the deleted image
            db.run(`
                UPDATE images
                SET images = array_remove(images, ?)
                WHERE id = ?
            `, [filename, req.params.id], (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send("Error updating image details.");
                } else {
                    res.sendStatus(200);
                }
            });
        }
    });
});

// Serve JSON data for images
app.get("/images", (req, res) => {
    db.all("SELECT * FROM images", (err, images) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Error retrieving images from database." });
        } else {
            res.json(images);
        }
    });
});


// saves the details of a specified image 
// TODO save the images in the folder 
app.post("/saveDetails", express.json(), (req, res) => {
    const { id, type_project, location, area, client, objective, proj_specs, selectedImageNamescombined } = req.body;

    db.all(
        "SELECT additional_images FROM images WHERE id = ?",
        [id],
        (err, add_image) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: "Error retrieving images from database." });
            } else {
                const additionalImagesValue = add_image[0]?.additional_images;
                console.log(`Value of additional_images: ${additionalImagesValue === null ? "null" : additionalImagesValue}`);
                

                // Now, update the details in the database
                db.run(
                    "UPDATE images SET type_project = ?, location = ?, area = ?, client = ?, objective = ?, project_specs = ? WHERE id = ?",
                    [type_project, location, area, client, objective, proj_specs, id],
                    (err) => {
                        if (err) {
                            console.error(err);
                            res.status(500).send("Error saving details to the database.");
                        } else {
                            res.json(add_image);
                            console.log(`These are the additional images: ${add_image}`);
                        }
                    }
                );
            }
        }
    );
});



// Display images on homepage
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
