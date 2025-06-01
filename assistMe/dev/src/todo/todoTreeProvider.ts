import * as vscode from 'vscode';
import { getTodos, TodoItem } from './todoManager';

export class TodoTreeProvider implements vscode.TreeDataProvider<TodoTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<TodoTreeItem | undefined | void> =
        new vscode.EventEmitter<TodoTreeItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<TodoTreeItem | undefined | void> =
        this._onDidChangeTreeData.event;
    
    constructor(private context: vscode.ExtensionContext) {}

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
                new TodoTreeItem(todo.text, vscode.TreeItemCollapsibleState.None, {
                    tooltip: `Created: ${new Date(todo.created).toLocaleString()}`,
                    descriptions: new Date(todo.created).toLocaleDateString()
                })
        );

        return Promise.resolve(items);
    }
}

class TodoTreeItem extends vscode.TreeItem {
    constructor(
        label: string,
        collapsibleState: vscode.TreeItemCollapsibleState,
        options: { tooltip?: string; descriptions?: string }
    ) {
        super(label, collapsibleState);
        this.tooltip = options.tooltip;
        this.description = options.descriptions;
        this.contextValue = 'todoItem';
        this.iconPath = new vscode.ThemeIcon('checklist');
    }
}