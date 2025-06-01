import * as vscode from 'vscode';
import { TodoItem, getTodos, updateTodo } from './todoManager';

const scheme = 'notes';

export class NotesProvider implements vscode.TextDocumentContentProvider {
    static readonly scheme = scheme;
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
    readonly onDidChange = this._onDidChange.event

    provideTextDocumentContent(uri: vscode.Uri): string {
        const todos = getTodos();
        const [_, created] = uri.path.split('/');
        const todo = todos.find(t => t.created === decodeURIComponent(created));
        if (!todo) return 'TODO not found';

        const content = `# TODO Item\n\n` +
            `**Task**: ${todo.text}\n\n` +
            `**Created**: ${new Date(todo.created).toLocaleString()}\n\n` +
            (todo.done ? `**Done**: ${new Date(todo.done).toLocaleString()}` : '')

        return content
    }

    refresh(uri: vscode.Uri) {
        this._onDidChange.fire(uri);
    }
}