# LeetCode Testcase Runner Extension

A custom VS Code extension designed to enhance your LeetCode coding experience by automating the process of fetching test cases from LeetCode problems and running your solutions against them. For this selenium based webscraping is used and then the files are runned according to their extension. For the purpose of running a template is provided you have to make changes in the template to run the code without any error.

## Features

- **Fetch Test Cases**: Automatically fetch input and output test cases from any LeetCode problem URL.
- **Run Code and Compare Outputs**: Execute your solution and compare the actual output with the expected output.
- **Multi-language Support**: Currently supports Python and C++ for solution execution.

## Requirements

Before using this extension, ensure you have the following installed:

- [VS Code](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org/)
- [Python](https://www.python.org/)
- [G++ Compiler](https://gcc.gnu.org/)

## Installation

1. **Clone the Repository**:
   Clone this repository to your local machine using:
   
   ```bash
   git clone https://github.com/your-username/LeetCode-problem-solver.git
2. Navigate to the Project Folder:
  
       cd LeetCode-problem-solver
   
3. Install Dependencies: Run the following command to install required node modules:

       npm install
       pip install selenium beautifulsoup4

5. Change the path to the path of your scrape_scripe.py in extension.ts
   
        const pythonScriptPath = "D:\\cp-vishesh\\cp-vishesh-problem\\path_to your_scrape_script.py\\scrape_script.py";
   ![Alt text](https://github.com/MaSsKmAn/LeetCode-problem-solver/blob/main/photos/Screenshot%202025-01-18%20145525.png)
7. Launch the Extension: Press F5 in VS Code to launch the extension.

## Commands

### 1. Fetch Test Cases
  * Press Ctrl+Shift+P or Cmd+Shift+P to open the Command Palette.
    ![Alt text](https://github.com/MaSsKmAn/LeetCode-problem-solver/blob/main/photos/Screenshot%202025-01-18%20145714.png)
  * Type and select Fetch Test Cases.
  * Enter the LeetCode problem URL when prompted.
   ![Alt text](https://github.com/MaSsKmAn/LeetCode-problem-solver/blob/main/photos/Screenshot%202025-01-18%20151757.png)
    
  * The extension will fetch the input and output test cases and store them for later use.


### 2. Run File and Compare Outputs
  * Press Ctrl+Shift+P or Cmd+Shift+P again to open the Command Palette.
    ![Alt text](https://github.com/MaSsKmAn/LeetCode-problem-solver/blob/main/photos/Screenshot%202025-01-18%20145714.png)
  * Type and select Run Active Files.
  * Enter the path of the file you want to run (Python or C++) to get the idea of how to make the files read the template folder.
    ![Alt text](https://github.com/MaSsKmAn/LeetCode-problem-solver/blob/main/photos/Screenshot%202025-01-18%20150947.png)
  * The extension will execute the file and compare the output with the expected outputs.
    ![Alt text](https://github.com/MaSsKmAn/LeetCode-problem-solver/blob/main/photos/Screenshot%202025-01-18%20151553.png)

## Supported Languages
Python (.py)

C++ (.cpp)


## How It Works
![Alt text](https://github.com/MaSsKmAn/LeetCode-problem-solver/blob/main/photos/Screenshot%202025-01-18%20145635.png?raw=true)
*  Fetch Test Cases: When you enter a LeetCode problem URL, the extension uses a Python script to scrape the problem's input and expected output test cases, which are then saved locally for later use, you can customize them too in the extension host environment.

* Run the File:

For Python: The extension runs the Python file with input redirection using the fetched test cases you can customize the template python file according to your needs in the extension host environment.

For C++: The extension compiles the C++ file, and then runs the executable with input redirection ,you can customize the template cpp file according to your needs and get the results in the extension host environment.
Compare Outputs: After execution, the extension compares the actual output with the expected output and displays the results in a readable format.
