import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    
    let fetchTestcasesDisposable = vscode.commands.registerCommand('extension.fetchTestcases', async () => {
        const url = await vscode.window.showInputBox({
            placeHolder: "Enter the LeetCode problem URL",
            validateInput: (input) => {
                if (!input) {
                    return "URL is required!";
                }
                return null;
            }
        });

        if (url) {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                vscode.window.showErrorMessage("Please open a folder in VS Code before running the command.");
                return;
            }

            const workspacePath = workspaceFolders[0].uri.fsPath;

            
            const pythonScriptPath = "D:\\cp-vishesh\\cp-vishesh-problem\\src\\scrape_script.py";

            exec(
                `python "${pythonScriptPath}" "${url}" "${workspacePath}"`,
                (error, stdout, stderr) => {
                    if (error) {
                        vscode.window.showErrorMessage(`Error: ${error.message}`);
                        console.error(error.message);
                        return;
                    }
                    if (stderr) {
                        vscode.window.showErrorMessage(`Script Error: ${stderr}`);
                        console.error(stderr);
                        return;
                    }

                    console.log(stdout);

                    if (stdout.includes("Inputs saved to:") && stdout.includes("Outputs saved to:")) {
                        const inputsPath = stdout.match(/Inputs saved to: (.+)/)?.[1]?.trim();
                        const outputsPath = stdout.match(/Outputs saved to: (.+)/)?.[1]?.trim();

                        // Save paths to global state for later use
                        context.globalState.update('inputsPath', inputsPath);
                        context.globalState.update('outputsPath', outputsPath);

                        vscode.window.showInformationMessage(`Inputs saved to: ${inputsPath}`);
                        vscode.window.showInformationMessage(`Outputs saved to: ${outputsPath}`);
                    } else {
                        vscode.window.showWarningMessage("Script executed, but no test cases were found or saved.");
                    }
                }
            );
        } else {
            vscode.window.showErrorMessage("URL is required!");
        }
    });

    
    let runFileWithTestCasesDisposable = vscode.commands.registerCommand('extension.runFileWithTestCases', async () => {
        
        const filePath = await vscode.window.showInputBox({
            placeHolder: "Enter the path of the file you want to run",
            validateInput: (input) => {
                if (!input) {
                    return "File path is required!";
                }
                return null;
            }
        });

        if (!filePath) {
            vscode.window.showErrorMessage("File path is required!");
            return;
        }

        const fileExtension = path.extname(filePath); 

        
        const inputsPath = context.globalState.get<string>('inputsPath');
        const outputsPath = context.globalState.get<string>('outputsPath');

        if (!inputsPath || !outputsPath) {
            vscode.window.showErrorMessage("Test cases not found. Please fetch test cases first.");
            return;
        }

        if (fileExtension === ".py") {
            
            exec(`python "${filePath}" < "${inputsPath}"`, (error, stdout, stderr) => {
                if (error) {
                    vscode.window.showErrorMessage(`Execution Error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    vscode.window.showErrorMessage(`Error: ${stderr}`);
                    return;
                }
                compareAndDisplay(stdout.trim(), outputsPath);
            });
        } else if (fileExtension === ".cpp") {
            
            const execPath = path.join(path.dirname(filePath), 'a.out');

            exec(`g++ "${filePath}" -o "${execPath}"`, (error, stdout, stderr) => {
                 if (error) {
                    vscode.window.showErrorMessage(`Compilation Error: ${stderr}`);
                    return;
                }
                exec(`${execPath} < "${inputsPath}"`, (execError, execStdout, execStderr) => {
                    if (execError) {
                        vscode.window.showErrorMessage(`Execution Error: ${execStderr}`);
                        return;
                    }
                    compareAndDisplay(execStdout.trim(), outputsPath);
                });
            });
        } else {
            vscode.window.showErrorMessage("Unsupported file type. Only Python and C++ are supported.");
        }
    });

    context.subscriptions.push(fetchTestcasesDisposable);
    context.subscriptions.push(runFileWithTestCasesDisposable);
}

function compareAndDisplay(actualOutput: string, outputsPath: string) {
    fs.readFile(outputsPath, 'utf-8', (err, expectedOutput) => {
        if (err) {
            vscode.window.showErrorMessage(`Error reading outputs file: ${err.message}`);
            return;
        }

        const actualLines = actualOutput.split('\n');
        const expectedLines = expectedOutput.trim().split('\n');

        let message = "Comparison of Outputs:\n\n";
        for (let i = 0; i < Math.max(actualLines.length, expectedLines.length); i++) {
            const actual = actualLines[i] || "(No Output)";
            const expected = expectedLines[i] || "(No Expected Output)";
            message += `Test Case ${i + 1}:\n  Actual: ${actual}\n  Expected: ${expected}\n\n`;
        }

        vscode.window.showInformationMessage(message);
    });
}

export function deactivate() {}
