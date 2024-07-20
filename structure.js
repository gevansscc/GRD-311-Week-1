const fs = require('fs-extra');
const path = require('path');
const validator = require('html-validate');

const checkFileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch (err) {
    return false;
  }
};

const checkDirectoryExists = async (dirPath) => {
  try {
    const stats = await fs.stat(dirPath);
    return stats.isDirectory();
  } catch (err) {
    return false;
  }
};

const validateHTML = async (htmlContent) => {
  const options = {
    data: htmlContent,
    format: 'text' // you can also use 'json' for detailed output
  };
  return await validator(options);
};

const checkNamingConventions = (filePath) => {
  const fileName = path.basename(filePath);
  if (/[A-Z]/.test(fileName)) {
    console.error(`Test failed: File or directory name "${fileName}" contains uppercase letters.`);
    return false;
  }
  if (/\s/.test(fileName)) {
    console.error(`Test failed: File or directory name "${fileName}" contains spaces.`);
    return false;
  }
  return true;
};

const runTests = async () => {
  const htmlFilePath = path.join(__dirname, 'index.html');
  const cssDirPath = path.join(__dirname, 'css');
  const jsDirPath = path.join(__dirname, 'js');
  const imgDirPath = path.join(__dirname, 'img');

  // Check for the presence of the index.html file
  const isHTMLFilePresent = await checkFileExists(htmlFilePath);
  if (!isHTMLFilePresent) {
    console.error('Test failed: index.html file is missing or improperly named.');
    process.exit(1);
  }

  // Check for the presence of css, js, and img directories
  const isCSSDirPresent = await checkDirectoryExists(cssDirPath);
  if (!isCSSDirPresent) {
    console.error('Test failed: css directory is missing.');
    process.exit(1);
  }

  const isJSDirPresent = await checkDirectoryExists(jsDirPath);
  if (!isJSDirPresent) {
    console.error('Test failed: js directory is missing.');
    process.exit(1);
  }

  const isIMGDirPresent = await checkDirectoryExists(imgDirPath);
  if (!isIMGDirPresent) {
    console.error('Test failed: img directory is missing.');
    process.exit(1);
  }

  // Check naming conventions for all files and directories
  const filesAndDirsToCheck = [htmlFilePath, cssDirPath, jsDirPath, imgDirPath];

  const checkDirContents = async (dirPath) => {
    const items = await fs.readdir(dirPath);
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const isDirectory = await checkDirectoryExists(itemPath);
      if (!checkNamingConventions(itemPath)) {
        process.exit(1);
      }
      if (isDirectory) {
        await checkDirContents(itemPath);
      }
    }
  };

  for (const item of filesAndDirsToCheck) {
    if (!checkNamingConventions(item)) {
      process.exit(1);
    }
  }

  // Check contents of css, js, and img directories
  await checkDirContents(cssDirPath);
  await checkDirContents(jsDirPath);
  await checkDirContents(imgDirPath);

  // Validate the index.html file
  const htmlContent = await fs.readFile(htmlFilePath, 'utf8');
  const validationResult = await validateHTML(htmlContent);

  if (validationResult.includes('Error')) {
    console.error('Test failed: index.html is not W3C compliant.');
    console.error(validationResult);
    process.exit(1);
  } else {
    console.log('Test passed: All checks passed.');
  }
};

runTests().catch(err => {
  console.error('An error occurred:', err);
  process.exit(1);
});
