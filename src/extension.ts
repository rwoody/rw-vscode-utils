import * as vscode from 'vscode';
import { Command } from './types/commands';
import { saveOpenFiles } from './commands/saveOpenFiles';

// Array of commands
const commands: Command[] = [
    saveOpenFiles,
    // Add new commands here
];

export function activate(context: vscode.ExtensionContext) {
    // Register all commands
    commands.forEach(({ command, handler }) => {
        const disposable = vscode.commands.registerCommand(command, handler);
        context.subscriptions.push(disposable);
    });

    vscode.window.showInformationMessage('RWoody Utilities extension is now active!');
}

export function deactivate() {
    // Cleanup if needed
}
