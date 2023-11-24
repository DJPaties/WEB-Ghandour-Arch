document.addEventListener("DOMContentLoaded", async () => {


  const inputElement = document.getElementById('input-img-form');
  // const imgContainer = document.querySelector('.imageslider'); // Use querySelector to select the first element with the class
  // async function displayImages() {
  //   console.log('Called function');
  //   try {
  //     const response = await fetch('/listImages'); // Changed to '/listImages'
  //     const imageList = await response.json();

  //     imageList.forEach((element) => {
  //       const img_div = document.createElement('div')
  //       img_div.id = "imgDiv"
  //       const img = document.createElement('img');
  //       img.src = `/images/${element}`;
  //       const btn = document.createElement('button')
  //       btn.id = "delete"
  //       btn.textContent = 'Delete';
  //       img_div.appendChild(img)
  //       img_div.appendChild(btn)
  //       imgContainer.appendChild(img_div);


  //     });
  //   } catch (error) {
  //     console.error('Error fetching and displaying images:', error);
  //   }
  // }

  // displayImages();

  document.getElementById('submit-images').addEventListener('click', () => {
  // Check if the user inputs a single image or more
  const files = inputElement.files; // Get the selected files
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
      const id = 1; // Replace with your actual variable value
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
});
