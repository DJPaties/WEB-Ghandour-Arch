const express = require("express");
const multer = require("multer");
const sqlite3 = require("sqlite3").verbose();
const fs = require('fs');
const path = require('path');
const { Console } = require("console");


const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
// app.use("/uploads", express.static("uploads"));
app.set("view engine", "ejs");
// Serve static files
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use('/extraImages', express.static('extraImages'));
app.use('/logo',express.static("logo"))
const db = new sqlite3.Database("database.db");


//variables
let uploaded_images_name = ""
let uploaded_videos_name = ""

//Getting the user home page
app.get('/user-home-page', (req, res) => {
    db.all("SELECT id, filename, description FROM images", (err, images) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error retrieving image details from the database.");
        } else {
            if (images.length > 0) {
                images.forEach((image) => {
                    console.log("ID:", image.id);
                    console.log("Filename:", image.filename);
                    console.log("Description:", image.description);
                });

                // Pass the images data to the EJS view
                res.render('homePage', { images: images });
            } else {
                res.status(404).send("No images found in the database.");
            }
        }
    });
});

//upload videos
app.use("/extraVideos",express.static("extraVideos"));

// Configure multer for image uploads
const Videostorage = multer.diskStorage({
    
    destination: (req, file, cb) => {
        
      cb(null, './extraVideos');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      uploaded_videos_name += file.fieldname + '-'+ uniqueSuffix +ext+"/";
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    },
  });
  
  const Videoupload = multer({ storage: Videostorage });


// Handle image uploads
app.post('/uploadVideos', Videoupload.array('videos', 15), (req, res) => {
    // Access the id sent with the form data
    const id = req.body.id;
    // Log the id value
    console.log('Received id:', id);

    // Log the uploaded files
    // console.log(uploaded_images_name);
    let additional_videonames_to_upload = "";

    // Fetch the current additional images
    db.get("SELECT additional_videos FROM images WHERE id = ?", [id], (err, additional_names_videos) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error retrieving image details from the database.");
        } else {
            additional_videonames_to_upload = additional_names_videos ? additional_names_videos.additional_videos : "";
            
            // Check if additional_names_to_upload is null or undefined before using it
            if (additional_videonames_to_upload === null || additional_videonames_to_upload === undefined) {
                additional_videonames_to_upload = uploaded_videos_name;
            } else {
                additional_videonames_to_upload += uploaded_videos_name;
            }
            console.log(additional_videonames_to_upload)
            // Update the database with the new value
            db.run(
                "UPDATE images SET additional_videos = ? WHERE id = ?",
                [additional_videonames_to_upload, id],
                (updateErr) => {
                    if (updateErr) {
                        console.error(updateErr);
                        res.status(500).send('Error saving details of additional videos to the database.');
                    } else {
                        // Send a success response
                        res.json({ success: true });
                        uploaded_videos_name = "";

                    }
                }
            );
        }
    });

    // Do not send a response here; it's already being sent inside the callback above
    // res.send('Image uploaded successfully!');
});



//clear columns of database
// app.get('/test/clear', (req, res) => {
//     const id = 1; // Change the ID as needed

//     // Update the database to clear the additional images for the specified ID
//     db.run("ALTER Table images ADD COLUMN additional_videos TEXT", (err) => {
//         if (err) {
//             console.error(err);
//             res.status(500).send('Error clearing additional images in the database.');
//         } else {
//             res.send('Additional images cleared successfully!');
//         }
//     });
// });


//Deleet Videos
app.post("/deleteextravideo", express.json(), (req, res) => {
    const idImage = req.body.id;
    const folder = req.body.extraVideos;
    const videoname = req.body.extravideoname;

    console.log(folder, videoname);

    db.get("SELECT additional_videos FROM images WHERE id = ?", [idImage], (err, image) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Error retrieving image details from database." });
        } else {
            console.log(image);

            // Assuming additional_images is the property containing the string
            const splitvideo = image.additional_videos.split("/");
            const index = splitvideo.indexOf(videoname);

            if (index !== -1) {
                splitvideo.splice(index, 1);

                fs.unlink("./extraVideos/" + videoname, (err) => {
                    if (err) {
                        console.error(`Error deleting Video: ${err}`);
                    } else {
                        console.log('Video deleted successfully.');
                    }
                });

                console.log("Removed item from list. New array:");
                const newVideos = splitvideo.join("/");
                
                db.run("UPDATE images SET additional_videos = ? WHERE id = ?", [newVideos, idImage], (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Error updating additional images in the database.');
                    } else {
                        res.send('Updated images values');
                    }
                });
            } else {
                console.log(`${videoname} is not in the array.`);
            }
        }
    });

    // Don't send a response here; it's already being sent inside the callback above
    // res.sendStatus(200);
});






// Delete Images 
app.post("/deleteextraimg", express.json(), (req, res) => {
    const idImage = req.body.id;
    const folder = req.body.extraImages;
    const imgname = req.body.extraimagename;

    console.log(folder, imgname);

    db.get("SELECT additional_images FROM images WHERE id = ?", [idImage], (err, image) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Error retrieving image details from database." });
        } else {
            console.log(image);

            // Assuming additional_images is the property containing the string
            const splitimage = image.additional_images.split("/");
            const index = splitimage.indexOf(imgname);

            if (index !== -1) {
                splitimage.splice(index, 1);

                fs.unlink("./extraImages/" + imgname, (err) => {
                    if (err) {
                        console.error(`Error deleting image: ${err}`);
                    } else {
                        console.log('Image deleted successfully.');
                    }
                });

                console.log("Removed item from list. New array:");
                const newimages = splitimage.join("/");
                
                db.run("UPDATE images SET additional_images = ? WHERE id = ?", [newimages, idImage], (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Error updating additional images in the database.');
                    } else {
                        res.send('Updated images values');
                    }
                });
            } else {
                console.log(`${imgname} is not in the array.`);
            }
        }
    });

    // Don't send a response here; it's already being sent inside the callback above
    // res.sendStatus(200);
});




// Serve image details
app.get("/image/:id", (req, res) => {
    const imageId = req.params.id;

    db.get("SELECT * FROM images WHERE id = ?", [imageId], (err, image) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Error retrieving image details from database." });
        } else {
            db.all("SELECT id FROM images", (updateErr, ids) => {
                if (updateErr) {
                    console.error(updateErr);
                    res.status(500).send("Error retrieving image IDs.");
                } else {
                    const ArrayimageIds = ids.map(id => id.id);
                    image.allImageIds = ArrayimageIds; // Append the array to the image object
                    res.json(image);
                }
            });
            
        }
    });


});


app.get("/imageDetail", (req, res) => {
    const imageId = req.query.id;
    let filteredArray;
    let filteredVideoArray;
    db.get("SELECT * FROM images WHERE id = ?", [imageId], (err, image) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error retrieving image details from database.");
        } else {
            if (image) {
                // console.log(image.additional_images)
                let add_img = image.additional_images
                let add_video = image.additional_videos
                if(add_img !== null){
                    const resultArray = add_img.split('/');
                    console.log(resultArray)
                    console.log(resultArray.length)
                    filteredArray = resultArray.filter(str => str !== '');
                    console.log("Filtered Array:")
                    console.log(filteredArray)
                    console.log(filteredArray.length)
                }
                if(add_video !== null){
                    const resultVideoArray = add_video.split('/');
                    console.log(resultVideoArray)
                    console.log(resultVideoArray.length)
                    filteredVideoArray = resultVideoArray.filter(str => str !== '');
                    console.log("Filtered Video Array:")
                    console.log(filteredVideoArray)
                    console.log(filteredVideoArray.length)
                }
                res.render("imageDetail", { image,filteredArray, filteredVideoArray }); // Render the EJS view
            } else {
                res.status(404).send("Image not found.");
            }
        }
    });
});




app.delete("/delete/:id", (req, res) => {
    const imageId = req.params.id;
    console.log("This is the server that has the ID image:", imageId)
    db.get("SELECT * FROM images WHERE id = ?", [imageId], (err, image) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error retrieving image details from database.");
        } else {
            if (typeof myVariable === 'undefined' || myVariable === null) {
            fs.unlink("./uploads/" + image.filename, (err) => {
                if (err) {
                    console.error(`Error deleting image: ${err}`);
                } else {
                    console.log('Image deleted successfully.');
                }
            });}
                let add_img = image.additional_images
                console.log(add_img)
                if(add_img !== null){
                    const resultArray = add_img.split('/');
                    console.log(resultArray)
                    // console.log(resultArray.length)
                    filteredArray = resultArray.filter(str => str !== '');
                    // console.log("Filtered Array:")
                    // console.log(filteredArray)
                    // console.log(filteredArray.length)
                    filteredArray.forEach(element => {
                        fs.unlink("./extraImages/" + element, (err) => {
                            if (err) {
                                console.error(`Error deleting image: ${err}`);
                            } else {
                                console.log('Image deleted successfully.');
                            }
                        });
                    });
                    
                }
                db.run("DELETE FROM images WHERE id = ?", [imageId], (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send("Error deleting image from database.");
                    } else {
                        res.sendStatus(200);
                    }
                });
    }});

    
    
});

// Configure multer for image uploads
const storage = multer.diskStorage({
    
    destination: (req, file, cb) => {
        
      cb(null, './extraImages');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      uploaded_images_name += file.fieldname + '-'+ uniqueSuffix +ext+"/";
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    },
  });
  
  const upload = multer({ storage: storage });









// Initialize database and create table
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, filename TEXT, description TEXT)");
});

// Handle image uploads
app.post('/upload', upload.array('images', 15), (req, res) => {
    // Access the id sent with the form data
    const id = req.body.id;
    // Log the id value
    console.log('Received id:', id);

    // Log the uploaded files
    // console.log(uploaded_images_name);
    let additional_names_to_upload = "";

    // Fetch the current additional images
    db.get("SELECT additional_images FROM images WHERE id = ?", [id], (err, additional_names) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error retrieving image details from the database.");
        } else {
            additional_names_to_upload = additional_names ? additional_names.additional_images : "";
            
            // Check if additional_names_to_upload is null or undefined before using it
            if (additional_names_to_upload === null || additional_names_to_upload === undefined) {
                additional_names_to_upload = uploaded_images_name;
            } else {
                additional_names_to_upload += uploaded_images_name;
            }
            console.log(additional_names_to_upload)
            // Update the database with the new value
            db.run(
                "UPDATE images SET additional_images = ? WHERE id = ?",
                [additional_names_to_upload, id],
                (updateErr) => {
                    if (updateErr) {
                        console.error(updateErr);
                        res.status(500).send('Error saving details of additional images to the database.');
                    } else {
                        // Send a success response
                        res.json({ success: true });
                        uploaded_images_name = "";

                    }
                }
            );
        }
    });

    // Do not send a response here; it's already being sent inside the callback above
    // res.send('Image uploaded successfully!');
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


// Info saving function

app.post("/saveDetails", express.json(), (req, res) => {
    id = req.body.id;
    type_project= req.body.type_project;
    location = req.body.location;
    area= req.body.area;
    client = req.body.client;
    objective = req.body.objective;
    proj_specs = req.body.proj_specs;
    db.run("UPDATE images set type_project=?, location=?,area=?,client=?, objective=?, project_specs=? where id=?",[type_project,location,area,client,objective,proj_specs,id],(updateErr)=>{
        if (updateErr) {
            console.error(updateErr);
            res.status(500).send("Error updating image details.");
        } else {
            res.sendStatus(200);
        }
    });
})

// Specify the storage destination and filename
const storageNew = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Specify the destination folder here
    },
    filename: (req, file, cb) => {
        // You can customize the filename as needed
        const uniqueSuffix =  Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = file.originalname.split('.').pop();
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext);
    },
});

// Create the multer instance with the specified storage
const uploadNewVilla = multer({ storage: storageNew });

// Use the multer middleware in your route
app.post("/uploadNewVilla", uploadNewVilla.single("image"), async (req, res) => {
    const description = req.body.description;
    const filename = req.file.filename;

    try {
        // Save the filename and description in the database
        db.run("INSERT INTO images (filename, description) VALUES (?, ?)", [filename, description], (err) => {
            if (err) {
                console.error(err);
                res.status(500).send("Error saving image details to the database.");
            } else {
                res.json({ success: true });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error processing the request.");
    }
});


// Display images on homepage
app.get("/", (req, res) => {
    
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
