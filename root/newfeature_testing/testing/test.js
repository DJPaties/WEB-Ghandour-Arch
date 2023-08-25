document.addEventListener('DOMContentLoaded', () => {
  const rowContainer = document.getElementById('rowContainer');
  const addRowButton = document.getElementById('addRowButton');

  function deleteRow(event) {
    if (event.target.classList.contains('delete-button')) {
      const row = event.target.closest('.row');
      if (row) {
        row.remove();
      }
    }
  }

  rowContainer.addEventListener('click', deleteRow);

  addRowButton.addEventListener('click', () => {
    const newRow = document.createElement('div');
    newRow.classList.add('row');
    newRow.innerHTML = `
      <input type="text" class="input-field" placeholder="New Row">
      <button class="delete-button">Delete</button>
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

  addRowButton.addEventListener('click', collectRowInput);
});
