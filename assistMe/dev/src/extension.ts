import * as vscode from 'vscode';
import { TodoTreeProvider } from './todo/todoTreeProvider';
import { DocViewProvider } from './todo/docViewProvider';
import { addTodo, updateTodo, TodoItem, getTodos } from './todo/todoManager';
import { NotesFsProvider } from './todo/notesProvider';


export function activate(context: vscode.ExtensionContext) {
	console.log('assitMe is now active!');

	const todoProvider = new TodoTreeProvider(context);
	const docViewProvider = new DocViewProvider();
	const fsProvider = new NotesFsProvider();
	const scheme = 'notesfs'
	
	context.subscriptions.push(
		vscode.workspace.registerFileSystemProvider(
			scheme, fsProvider, { isReadonly: false }
		),
		vscode.window.registerTreeDataProvider(
			'todoView', todoProvider
		),
		vscode.window.registerTreeDataProvider(
			'docView', docViewProvider
		)
	)

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
			console.log("Open details")
			const encodedCreated = encodeURIComponent(todo.created);
			const uri = vscode.Uri.parse(`${scheme}:/${encodedCreated}`);
			const doc = await vscode.workspace.openTextDocument(uri);
			vscode.window.showTextDocument(doc, { preview: false });
			vscode.window.showInformationMessage("Edit the 'Task:' line and press Command + S to update the TODO.")
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('todo.markDone', async (todo: TodoItem) => {
			todo.done = new Date().toISOString();
			updateTodo(todo);
			todoProvider.refresh();
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('docview.openTodosJson', async () => {
			const uri = vscode.Uri.parse(`${scheme}:/todos.json`);
			const doc = await vscode.workspace.openTextDocument(uri);
			vscode.window.showTextDocument(doc, { preview: false });
		})
	)
}

// This method is called when your extension is deactivated
export function deactivate() {}
