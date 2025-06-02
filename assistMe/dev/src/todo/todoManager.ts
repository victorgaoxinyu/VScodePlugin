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
    done?: string;
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
    const todos = getTodos();
    todos.push(todo);
    saveTodos(filePath, todos);

    vscode.window.showInformationMessage(`Added TODO: "${todoText}"`);
    vscode.commands.executeCommand('todo.refresh');
}

export function getTodoFilePath(): string {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const folder = workspaceFolders ? workspaceFolders[0].uri.fsPath : __dirname;
    const todoPath = path.join(folder, '.vscode-notes');

    if (!fs.existsSync(todoPath)) {
        fs.mkdirSync(todoPath);
    }

    return path.join(todoPath, TODO_FILENAME);
}

export function getTodos(): TodoItem[] {
    const filePath = getTodoFilePath();
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        const todos: TodoItem[] = JSON.parse(data);
        return todos.sort((a, b) => (a.done ? 1: 0) - (b.done ? 1: 0));
    }

    return []
}

// does this always rewrite the file?
export function saveTodos(filePath: string, todos: TodoItem[]): void {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(todos, null, 2), 'utf-8');
}

export function updateTodo(updated: TodoItem): void {
    const filePath = getTodoFilePath();
    const todos = getTodos();
    const idx = todos.findIndex(
        // this does not look right
        (t) => t.created === updated.created
    );
    if (idx !== -1) {
        todos[idx] = updated;
        todos.sort((a, b) => (a.done ? 1 : 0) - (b.done ? 1 : 0));
        saveTodos(filePath, todos);
    }
}

export type { TodoItem };