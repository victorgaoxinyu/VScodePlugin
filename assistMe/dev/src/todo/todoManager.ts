import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'

const TODO_FILENAME = 'todos.json'

// TODO: 
// - add priority
// - add reminder time?
// - add related people?
// - add, auto detect tag/type
//   - monitor/check
//   - do/implement


interface TodoItem {
    text: string;
    created: string;
}


export async function addTodo() {
    const todoText = await vscode.window.showInputBox({
        prompt: 'What do you want to add to your TODO list?',
        placeHolder: 'e.g., Drink coffee'
    });

    if (!todoText) {
        return;
    }

    const todo: TodoItem = {
        text: todoText,
        created: new Date().toISOString()
    };

    const filePath = getTodoFilePath();
    const todos = loadTodos(filePath);
    todos.push(todo);
    saveTodos(filePath, todos);

    vscode.window.showInformationMessage(`Added TODO: "${todoText}"`);
    vscode.commands.executeCommand('todo.refresh');
}

function getTodoFilePath(): string {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const folder = workspaceFolders ? workspaceFolders[0].uri.fsPath : __dirname;
    const todoPath = path.join(folder, '.vscode-notes');

    if (!fs.existsSync(todoPath)) {
        fs.mkdirSync(todoPath);
    }

    return path.join(todoPath, TODO_FILENAME);
}

function loadTodos(filePath: string): TodoItem[] {
    try {
        const content = fs.readFileSync(
            filePath, 'utf-8'
        );
        return JSON.parse(content);
    } catch (e) {
        return [];
    }
}

function saveTodos(filePath: string, todos: TodoItem[]) {
    fs.writeFileSync(filePath, JSON.stringify(todos, null, 2));
}

export function getTodos(): TodoItem[] {
    return loadTodos(getTodoFilePath());
}

export type { TodoItem };