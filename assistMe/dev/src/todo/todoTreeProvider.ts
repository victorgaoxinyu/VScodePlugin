import * as vscode from 'vscode';
import { getTodos, TodoItem } from './todoManager';
import { title } from 'process';

export class TodoTreeProvider implements vscode.TreeDataProvider<TodoTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<TodoTreeItem | undefined | void> =
        new vscode.EventEmitter<TodoTreeItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<TodoTreeItem | undefined | void> =
        this._onDidChangeTreeData.event;

    constructor(private context: vscode.ExtensionContext) { }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
 
    getTreeItem(element: TodoTreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element
    }

    getChildren(element?: TodoTreeItem): Thenable<TodoTreeItem[]> {
        if (element) {
            return Promise.resolve([]);
        }

        const todos = getTodos();
        const items = todos.map(
            (todo) =>
                new TodoTreeItem(todo)
        );

        return Promise.resolve(items);
    }
}

class TodoTreeItem extends vscode.TreeItem {
    constructor(public readonly todo: TodoItem) {
        const label = todo.done ? `~~${todo.text}~~` : todo.text;
        super(label, vscode.TreeItemCollapsibleState.None);

        this.tooltip = `Created: ${new Date(todo.created).toLocaleString()}${todo.done ? `\nDone: ${new Date(todo.done).toLocaleString()}` : ''}`;
        this.description = todo.done
            ? `✔ Done: ${new Date(todo.done).toLocaleDateString()}`
            : `Created: ${new Date(todo.created).toLocaleDateString()}`;
        this.contextValue = 'todoItem';
        this.iconPath = new vscode.ThemeIcon(todo.done ? 'check' : 'circle-outline');

        this.command = {
            command: 'todo.openDetail',
            title: 'Open TODO Detial',
            arguments: [todo]
        }
    }
}