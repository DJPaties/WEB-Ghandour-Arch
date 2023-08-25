document.addEventListener("DOMContentLoaded", async () => {
    const imageId = new URLSearchParams(window.location.search).get("id");

    const imageDescriptionElement = document.getElementById("image-description");
    const collect_data_btn = document.getElementById("submit-Details")
    const rowContainer = document.getElementById("remove-row")
    const addRowButton = document.getElementById("add-project-spec-row")
    

    function deleteRow(event) {
        if (event.target.classList.contains('remove-project-spec')) {
          const row = event.target.closest('.project-specs-row');
          if (row) {
            row.remove();
          }
        }
      }
    
      rowContainer.addEventListener('click', deleteRow);
    
      addRowButton.addEventListener('click', () => {
        const newRow = document.createElement('div');
        newRow.classList.add('project-specs-row');
        newRow.innerHTML = `
        <input type="text" name="project-spec" class="project-spec">
        <button class="remove-project-spec" id="remove-row">Remove</button>
        `;
        rowContainer.appendChild(newRow);
      });
    
      function collectRowInput() {
        const inputFields = document.querySelectorAll('.input-field');
        const inputValues = [];
    
        inputFields.forEach(input => {
          inputValues.push(input.value);
        });
    
        console.log('Input Values:', inputValues);
      }
    
    //   addRowButton.addEventListener('click', collectRowInput);

    // function collectRowInput() {
    //     const inputFields = document.querySelectorAll('.project-spec');
    //     const inputValues = [];
    
    //     inputFields.forEach(input => {
    //       inputValues.push(input.value);
    //     });
    
    //     console.log('Input Values:', inputValues);
    //   }
    
    //   add_row.addEventListener('click', collectRowInput);
    

    try {
        const response = await fetch(`/image/${imageId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch image details.");
        }

        const imageDetails = await response.json();
        console.log(imageDetails)
        console.log(imageDetails.filename)
        // imageDetailElement.src = `/uploads/${imageDetails.filename}`;
        
        // imageDetailElement.alt = imageDetails.description;
        // imageDescriptionElement.textContent = imageDetails.description;

        // // Populate input fields with existing data
        // document.getElementById("type-project").value = imageDetails.type_project || "";
        // document.getElementById("location").value = imageDetails.location || "";
        // document.getElementById("area").value = imageDetails.area || "";
        // document.getElementById("client").value = imageDetails.client || "";
        // document.getElementById("objective").value = imageDetails.objective || "";

        collect_data_btn.addEventListener("click", ()=>{
            const type_project = document.getElementById("type-project").value.trim();
            const location = document.getElementById("location").value.trim();
            const area = document.getElementById("area").value.trim();
            const client = document.getElementById("client").value.trim();
            const objective = document.getElementById("objective").value.trim();
            if(type_project === "" || location === "" || area === "" || client === "" || objective === ""){
                window.alert("Please fill all the required fields!")
            }
            else{
                console.log(type_project,location,area,client,client,objective);
            }
        });



        // Create the image slider with delete buttons
        // const imageSlider = document.querySelector(".image-slider");
        // imageDetails.images.forEach(image => {
        //     const imageElement = document.createElement("img");
        //     imageElement.src = `/uploads/${image}`;
        //     imageElement.alt = "Image";
        //     const deleteButton = document.createElement("button");
        //     deleteButton.textContent = "Delete";
        //     deleteButton.addEventListener("click", async () => {
        //         try {
        //             const deleteResponse = await fetch(`/deleteImage/${image}`, {
        //                 method: "DELETE"
        //             });
        //             if (!deleteResponse.ok) {
        //                 throw new Error("Failed to delete image.");
        //             }
        //             // Refresh the slider after deletion
        //             window.location.reload();
        //         } catch (error) {
        //             console.error(error);
        //             alert("Failed to delete image.");
        //         }
        //     });

    //         const imageContainer = document.createElement("div");
    //         imageContainer.appendChild(imageElement);
    //         imageContainer.appendChild(deleteButton);
    //         imageSlider.appendChild(imageContainer);
    //     });

    } catch (error) {
        console.error(error);
        imageDescriptionElement.textContent = "Failed to load image details.";
    }
    });

