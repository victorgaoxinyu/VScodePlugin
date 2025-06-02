import * as vscode from 'vscode';

export class DocViewProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    getTreeItem(): vscode.TreeItem {
        const item = new vscode.TreeItem('todos.json');
        item.command = {
            command: 'docview.openTodosJson',
            title: 'Open todos.json',
        };
        item.iconPath = new vscode.ThemeIcon('file-code');
        return item;
    }

    getChildren(): vscode.ProviderResult<vscode.TreeItem[]> {
        return [this.getTreeItem()];
    }
}