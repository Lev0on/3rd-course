// todo.js
export class TodoApp {
    constructor(inputBox, listContainer, taskCountSpan, storageKey = 'todoData') {
        this.inputBox = inputBox;
        this.listContainer = listContainer;
        this.taskCountSpan = taskCountSpan;
        this.storageKey = storageKey;
    }

    addTask() {
        const text = this.inputBox.value.trim();
        if (text === '') {
            return false;
        }

        const li = document.createElement("li");
        li.textContent = text;

        const span = document.createElement("button");
        span.innerHTML = "\u00d7";
        span.className = "delete-btn";
        li.appendChild(span);

        this.listContainer.appendChild(li);
        this.inputBox.value = "";
        this.saveData();
        this.updateStats();
        return true;
    }

    handleListClick(e) {
        if (e.target.tagName === "LI") {
            e.target.classList.toggle("checked");
            this.saveData();
            this.updateStats();
            return true;
        } else if (e.target.className === "delete-btn") {
            e.target.parentElement.remove();
            this.saveData();
            this.updateStats();
            return true;
        }
        return false;
    }

    saveData() {
        try {
            localStorage.setItem(this.storageKey, this.listContainer.innerHTML);
        } catch (e) {
            console.warn('LocalStorage недоступен');
        }
    }

    loadData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                this.listContainer.innerHTML = data;
                this.updateStats();
            }
        } catch (e) {
            console.warn('LocalStorage недоступен');
        }
    }

    updateStats() {
        if (this.taskCountSpan) {
            const count = this.listContainer.children.length;
            const completed = Array.from(this.listContainer.children)
                .filter(li => li.classList.contains('checked')).length;
            this.taskCountSpan.textContent = `Задач: ${count} | Выполнено: ${completed}`;
        }
    }

    getTaskCount() {
        return this.listContainer.children.length;
    }

    getTasks() {
        return Array.from(this.listContainer.children).map(li => ({
            text: li.textContent.replace('×', '').trim(),
            completed: li.classList.contains('checked')
        }));
    }

    clearAll() {
        this.listContainer.innerHTML = '';
        this.saveData();
        this.updateStats();
    }
}
