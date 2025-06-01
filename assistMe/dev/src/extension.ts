import * as vscode from 'vscode';
import { TodoTreeProvider } from './todo/todoTreeProvider';
import { addTodo, updateTodo, TodoItem, getTodos } from './todo/todoManager';
import { NotesProvider } from './todo/notesProvider';


export function activate(context: vscode.ExtensionContext) {
	console.log('assitMe is now active!');

	const todoProvider = new TodoTreeProvider(context);
	const notesProvider = new NotesProvider();
	
	context.subscriptions.push(
		vscode.workspace.registerTextDocumentContentProvider(
			NotesProvider.scheme, notesProvider
		),
		vscode.window.registerTreeDataProvider(
			'todoView', todoProvider
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
			const encodedCreated = encodeURIComponent(todo.created);
			const uri = vscode.Uri.parse(`${NotesProvider.scheme}:/todo/${encodedCreated}.md`);
			const doc = await vscode.workspace.openTextDocument(uri);
			vscode.window.showTextDocument(doc, { preview: false });
			vscode.window.showInformationMessage("Edit the 'Task:' line and press Command + S to update the TODO.")
		})
	);

	// Detect save
	vscode.workspace.onDidSaveTextDocument((doc) => {
		if (doc.uri.scheme === NotesProvider.scheme) {
			const created = decodeURIComponent(doc.uri.path.split('/').pop()?.replace('.md', '') || '');
			const todos = getTodos();
			const idx = todos.findIndex(t => t.created === created);
			if (idx === -1) return;

			const match = doc.getText().match('/Task:\s*(.*)/');
			if (match) {
				todos[idx].text = match[1].trim();
				updateTodo(todos[idx]);
				todoProvider.refresh();
				vscode.window.showInformationMessage("TODO updated successfully.");
			}
		}
	})

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
