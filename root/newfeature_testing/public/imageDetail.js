document.addEventListener("DOMContentLoaded", async () => {
  const imageId = new URLSearchParams(window.location.search).get("id");
  // console.log(imageId)
  const imageDescriptionElement = document.getElementById("image-description");
  const collect_data_btn = document.getElementById("submit-Details");

  const inputContainer = document.getElementById('inputFields');
  const addButton = document.getElementById(  'addInput');
  const form_image = document.getElementById('image-form');
  const image_submit_button = document.getElementById('submit-images'); 
  const images_uploaded = document.getElementById('input-img-form');
  let allFieldsFilled ;
  
  //images form button click
  image_submit_button.addEventListener('click', () => {
    // Check if the user inputs a single image or more
    const files = images_uploaded.files; // Get the selected files
    if (files.length === 0) {
      alert('Please select one or more images to upload.');
      return;
    }else{
        const fileInput = document.getElementById('input-img-form');
        const fileList = fileInput.files;
  
        // Create a FormData object to send files and additional data
        const formData = new FormData();
  
        // Append each file to the FormData object
        for (const file of fileList) {
            formData.append('images', file);
        }
  
        // Append the 'id' variable to the FormData object
        const id = imageId; // Replace with your actual variable value
        formData.append('id', id);
  
        // Use Fetch API to send a POST request to the server
        fetch('/upload', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.text())
        .then(data => {
            console.log(data); // Log the response from the server
        })
        .catch(error => {
            console.error('Error:', error);
        });
    
    }
  });




  //Populate the inputs with the current information from the database
  try {
    const response = await fetch(`/image/${imageId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch image details.");
    }

    const imageDetails = await response.json();
  //  document.getElementById('image-detail').src = `/uploads/resized-${imageId.filename}`

    // Populate input fields
    document.getElementById("type-project").value = imageDetails.type_project;
    document.getElementById("location").value = imageDetails.location;
    document.getElementById("area").value = imageDetails.area;
    document.getElementById("client").value = imageDetails.client;
    document.getElementById("objective").value = imageDetails.objective;


    let ipnut_specs = imageDetails.project_specs
    if(ipnut_specs === null){}
      // Other code using ipnut_specs
    else{
    ipnut_specs = ipnut_specs.split("/")
    document.getElementById("input").value = ipnut_specs.shift()
    console.log(ipnut_specs)
    // const inputContainer = document.getElementById("inputFields");
    const inputFields = document.querySelectorAll('.input');

    while (ipnut_specs.length > 0) {
      const firstElement = ipnut_specs.shift();
      if(firstElement === "" || firstElement === " "){}
      else{
      console.log("Current element:", firstElement);
      const newInput = document.createElement("div");
      newInput.className = "input-container";
      newInput.innerHTML = `
            <input type="text" class="input" placeholder="Enter something" value="${firstElement}">
            <button class="remove">Remove</button>
        `;
        inputContainer.appendChild(newInput);
  }}
  console.log("Array is now empty.")
    }

} catch (error) {
    console.error(error);
    imageDescriptionElement.textContent = "Failed to load image details.";
}




  //add button to add rows for project specs
  addButton.addEventListener('click', () => {
    const newInput = document.createElement('div');
    newInput.className = 'input-container';
    newInput.innerHTML = `
      <input type="text" class="input" placeholder="Enter something">
      <button class="remove">Remove</button>
    `;
    inputContainer.appendChild(newInput);
  });
  

  //remove button for removing rows
  inputContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove')) {
      if (inputContainer.childElementCount > 1) {
        event.target.parentElement.remove();
      } else {
        const inputFields = document.querySelectorAll('.input');
        inputFields.forEach((input, index)=>{
          
        });
        window.alert("At least one input field must be present.");
      }
    }
  });
    

  // sending info to the server to save it
  try {
      const response = await fetch(`/image/${imageId}`);
      if (!response.ok) {
          throw new Error("Failed to fetch image details.");
      }

      const imageDetails = await response.json();
      console.log(imageDetails);
      console.log(imageDetails.filename);

      collect_data_btn.addEventListener("click", async    () => {
          const type_project = document.getElementById("type-project").value.trim();
          const location = document.getElementById("location").value.trim();
          const area = document.getElementById("area").value.trim();
          const client = document.getElementById("client").value.trim();
          const objective = document.getElementById("objective").value.trim();
          const inputFields = document.querySelectorAll('.input');
          const imageInput = document.getElementById("image-input");
    



      
          inputFields.forEach((input, index) => {
              if (input.value.trim() === "") {
                  allFieldsFilled = false;
                  console.log(`Field ${index + 1} is not filled.`);
              }else{
                allFieldsFilled = true;
              }
          });
          console.log(allFieldsFilled)
          if (type_project === "" || location === "" || area === "" || client === "" || objective === "" || allFieldsFilled === false) {
              window.alert("Please fill all the required fields!");
          }
           else {
            let proj_specs = "";
            inputFields.forEach((input, index) => {
                proj_specs += input.value + "/";
            });
            // let selectedImageNamescombined = "";
            // selectedImageNames.forEach((imageName, index) => {
            // selectedImageNamescombined += imageName;
            // if (index < selectedImageNames.length - 1) {
            //     selectedImageNamescombined += "/";
            // }
        // });
            // console.log(selectedImageNamescombined)
            const data = {
                id: imageId,
                type_project,
                location,
                area,
                client,
                objective,
                proj_specs,
                // selectedImageNamescombined,
            };
            // console.log(`DATA is;${data}`)
            try {
                const response = await fetch('/saveDetails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                if (!response.ok) {
                    throw new Error('Failed to save details on the server.');
                }
    
                // Handle success as needed
    
            } catch (error) {
                console.error(error);
                window.alert('Failed to save details on the server.');
            }
            
          }
      });
  } catch (error) {
      console.error(error);
      imageDescriptionElement.textContent = "Failed to load image details.";
  }



});
