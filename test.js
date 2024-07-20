const fs = require('fs-extra');
const path = require('path');

// Path to the HTML file
const htmlFilePath = path.join(__dirname, 'index.html'); // Change 'index.html' if your file has a different name

// Function to check if the HTML file has the correct doctype
const checkDoctype = async () => {
  try {
    const data = await fs.readFile(htmlFilePath, 'utf8');
    const firstLine = data.split('\n')[0].trim();
    const expectedDoctype = '<!DOCTYPE html>';

    if (firstLine.toLowerCase() === expectedDoctype.toLowerCase()) {
      console.log('Test passed: Proper DOCTYPE declaration found.');
    } else {
      console.error('Test failed: Proper DOCTYPE declaration not found.');
      process.exit(1);
    }
  } catch (err) {
    console.error('Error reading the HTML file:', err);
    process.exit(1);
  }
};

// Run the doctype check
checkDoctype();
