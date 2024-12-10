import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';

async function saveOpenFiles() {
	try {
			const defaultDir = os.homedir();

			const selectedUri = await vscode.window.showOpenDialog({
					canSelectFiles: false,
					canSelectFolders: true,
					canSelectMany: false,
					defaultUri: vscode.Uri.file(defaultDir),
					openLabel: 'Select Target Directory',
			});

			if (!selectedUri || selectedUri.length === 0) {
					vscode.window.showErrorMessage('No directory selected. Operation canceled.');
					return;
			}

			const targetDir = selectedUri[0].fsPath;

			// Get workspace folders for the current VS Code instance
			const workspaceFolders = vscode.workspace.workspaceFolders;
			if (!workspaceFolders || workspaceFolders.length === 0) {
					vscode.window.showWarningMessage('No workspace folder is open.');
					return;
			}

			const workspacePaths = workspaceFolders.map(folder => folder.uri.fsPath);

			// Filter open files to include only those within the current workspace
			const openFiles = vscode.workspace.textDocuments
					.filter(doc => 
							!doc.isUntitled && 
							doc.uri.scheme === 'file' && 
							workspacePaths.some(wsPath => doc.fileName.startsWith(wsPath)) // Check file is within the workspace
					)
					.map(doc => doc.fileName);

			if (openFiles.length === 0) {
					vscode.window.showWarningMessage('No valid open files to save in the current workspace.');
					return;
			}

			await fs.ensureDir(targetDir);

			for (const file of openFiles) {
					const fileName = path.basename(file);
					const destinationPath = path.join(targetDir, fileName);
					await fs.copyFile(file, destinationPath);
			}

			vscode.window.showInformationMessage(`Open files saved to ${targetDir}`);
	} catch (error) {
			vscode.window.showErrorMessage(`Error saving files: ${error}`);
	}
}


// Central command registry
const commands: { [key: string]: (...args: any[]) => void | Promise<void> } = {
    'rwutils.saveOpenFiles': saveOpenFiles,
};

export function activate(context: vscode.ExtensionContext) {
    Object.keys(commands).forEach(command => {
        const disposable = vscode.commands.registerCommand(command, commands[command]);
        context.subscriptions.push(disposable);
    });

    vscode.window.showInformationMessage('RWoody Utilities extension is now active!');
}

export function deactivate() {
    // Cleanup if needed
}
