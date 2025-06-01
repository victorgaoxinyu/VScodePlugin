import * as vscode from 'vscode';
import { TodoTreeProvider } from './todo/todoTreeProvider';
import { addTodo } from './todo/todoManager';

export function activate(context: vscode.ExtensionContext) {
	console.log('assitMe is now active!');

	// add TODO
	context.subscriptions.push(
		vscode.commands.registerCommand(
			'todo.add', async () => {
				await addTodo();
			}
		)
	);

	// Register TODO sidebar view
	const todoProvider = new TodoTreeProvider(context);
	vscode.window.registerTreeDataProvider('todoView', todoProvider);

	// Refresh TreeView when new TODO is added
	context.subscriptions.push(
		vscode.commands.registerCommand('todo.refresh', () => {
			todoProvider.refresh();
		})
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}
