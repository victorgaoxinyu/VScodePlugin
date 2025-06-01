import * as vscode from 'vscode';
import { TodoTreeProvider } from './todo/todoTreeProvider';
import { addTodo, updateTodo, TodoItem } from './todo/todoManager';

export function activate(context: vscode.ExtensionContext) {
	console.log('assitMe is now active!');

	// Register TODO sidebar view
	const todoProvider = new TodoTreeProvider(context);
	vscode.window.registerTreeDataProvider('todoView', todoProvider);

	// add TODO
	context.subscriptions.push(
		vscode.commands.registerCommand(
			'todo.add', async () => {
				// take logic out
				await addTodo();
			}
		)
	);

	// Refresh TreeView when new TODO is added
	context.subscriptions.push(
		vscode.commands.registerCommand('todo.refresh', () => {
			todoProvider.refresh();
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('todo.openDetail', async (todo: TodoItem) => {
			const doc = await vscode.workspace.openTextDocument({
				content:
				`# TODO Item\n\n` + 
				`**Task**: ${todo.text}\n\n` + 
				`**Created**: ${new Date(todo.created).toLocaleString()}\n` +
				(todo.done ? `**Done**: ${new Date(todo.done).toLocaleString()}` : ''),
				language: 'markdown'
			});
			vscode.window.showTextDocument(doc);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('todo.markDone', async (todo: TodoItem) => {
			todo.done = new Date().toISOString();
			updateTodo(todo);
			todoProvider.refresh();
		})
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}
