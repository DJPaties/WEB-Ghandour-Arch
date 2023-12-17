document.addEventListener("DOMContentLoaded", async () => {
    const imageForm = document.getElementById("image-form");
    const imageInput = document.getElementById("image-input");
    const descriptionInput = document.getElementById("description-input");
    const imageGallery = document.getElementById("image-gallery");

    // Fetch images from the server and populate the gallery
    await fetchImages();

    // Add event listeners for delete buttons
    const deleteButtons = document.querySelectorAll(".deletePhoto");
    deleteButtons.forEach(button => {
        button.addEventListener("click", async () => {
            const confirmation = confirm("Are you sure you want to delete this image?");
            if (confirmation) {
                const imageContainer = button.closest(".DescriptivePhoto");
                const imgID = imageContainer.querySelector("img").getAttribute("alt");

                // Send a request to delete the image
                try {
                    const response = await fetch(`/delete/${imgID}`, { method: "DELETE" });
                    if (response.ok) {
                        // Image deleted successfully, remove the container
                        imageContainer.remove();
                    } else {
                        throw new Error("Error deleting image.");
                    }
                } catch (error) {
                    console.error(error);
                    alert("Error deleting image.");
                }
            }
        });
    });

    imageForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const file = imageInput.files[0];
        const description = descriptionInput.value;

        if (file && description) {
            // Save the image and description on the server
            try {
                const formData = new FormData();
                formData.append("image", file);
                formData.append("description", description);

                await fetch("/uploadNewVilla", {
                    method: "POST",
                    body: formData,
                });

                // Clear inputs and fetch images again
                descriptionInput.value = "";
                imageInput.value = null;
                await fetchImages();
            } catch (error) {
                console.error(error);
                alert("Error uploading image.");
            }
        } else {
            alert("Please select an image and provide a description.");
        }
    });

    async function fetchImages() {
        // Fetch images from the server and update the gallery
        try {
            const response = await fetch("/images");
            const images = await response.json();

            imageGallery.innerHTML = ""; // Clear the gallery

            images.forEach(image => {
                const imageElement = document.createElement("div");
                imageElement.classList.add("DescriptivePhoto");
                imageElement.innerHTML = `
                <a href="/imageDetail?id=${image.id}"><img src="/uploads/${image.filename}" alt="${image.id}" class="static_image"></a>
                    <p id="imgDesc">${image.description}</p>
                    <button class="deletePhoto"> Delete </button>
                `;
                imageGallery.appendChild(imageElement);
            });
        } catch (error) {
            console.error(error);
            alert("Error fetching images.");
        }
    }
});
