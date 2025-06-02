import * as vscode from 'vscode';
import { TodoItem, getTodoFilePath, getTodos, saveTodos, updateTodo } from './todoManager';


export class NotesFsProvider implements vscode.FileSystemProvider {
    private _emitter = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
    readonly onDidChangeFile = this._emitter.event;

    stat(uri: vscode.Uri): vscode.FileStat {
        return { type: vscode.FileType.File, ctime: 0, mtime: Date.now(), size: 0 };
    }

    readFile(uri: vscode.Uri): Uint8Array | Thenable<Uint8Array> {
        console.log("FS: Reading file...")
        const id = decodeURIComponent(uri.path.slice(1));

        // need refactor this part
        if (id === 'todos.json') {
            const todos = getTodos();
            return Buffer.from(JSON.stringify(todos, null, 2), 'utf-8');
        }

        const todos = getTodos();
        const todo = todos.find(t => t.created === id);
        if (!todo) {
            throw vscode.FileSystemError.FileNotFound();
        }

        const content = `#TODO Item\n\n` +
        `Task: ${todo.text}\n\n` +
        `Created: ${new Date(todo.created).toLocaleString()}\n\n` +
        (todo.done ? `Done: ${new Date(todo.done).toLocaleString()}` : '')
        
        return Buffer.from(content, 'utf-8');
    }

    writeFile(uri: vscode.Uri, content: Uint8Array, options: { readonly create: boolean; readonly overwrite: boolean; }): void | Thenable<void> {
        console.log("FS: Writing file...")
        const id = decodeURIComponent(uri.path.slice(1));
        
        if (id === 'todos.json') {
            const raw = Buffer.from(content).toString('utf-8');
            try {
                const parsed = JSON.parse(raw);
                const filePath = getTodoFilePath();
                saveTodos(filePath, parsed);
            } catch (e) {
                vscode.window.showErrorMessage('Invalid JSON format in todos.json');
            }
            return
        }
        
        const todos = getTodos();
        const todo = todos.find(t => t.created === id);
        if (!todo) return;

        const newText = Buffer.from(content).toString('utf-8');
        todo.text = newText.trim()
        updateTodo(todo)
    }

    // No-op methods for readonly FS
    watch(): vscode.Disposable { return new vscode.Disposable(() => {}); }
    readDirectory(uri: vscode.Uri): [string, vscode.FileType][] | Thenable<[string, vscode.FileType][]> {
        return [];
    }
    createDirectory(uri: vscode.Uri): void | Thenable<void> {}
    delete(uri: vscode.Uri, options: { readonly recursive: boolean; }): void | Thenable<void> {}
    rename(oldUri: vscode.Uri, newUri: vscode.Uri, options: { readonly overwrite: boolean; }): void | Thenable<void> {}
}
