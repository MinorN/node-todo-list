const db = require('./db.js')
const inquirer = require('inquirer')

module.exports.add = async (title) => {
    // 读取之前的任务
    const list = await db.read()
    // 添加一个任务
    list.push({title, done: false})
    // 存储
    await db.write(list)
}

module.exports.clear = async () => {
    await db.write([])
}

function createTak(list) {
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: "input your task title",
    },).then((answer) => {
        list.push({title: answer.title, done: false})
        db.write(list)
    });
}

function taskForAction(list, index) {
    if (index >= 0) {
        // 选择的是一个任务
        inquirer.prompt({
            type: 'list',
            name: 'action',
            message: '请选择操作',
            choices: [
                {name: '退出', value: 'quit'},
                {name: '已完成', value: 'markAsDone'},
                {name: '未完成', value: 'markAsUndone'},
                {name: '改标题', value: 'updateTitle'},
                {name: '删除', value: 'remove'},
            ]
        }).then((answer2) => {
            switch (answer2.action) {
                case 'markAsDone':
                    list[index].done = true
                    db.write(list)
                    break;
                case 'markAsUndone':
                    list[index].done = false
                    db.write(list)
                    break;
                case 'updateTitle':
                    inquirer.prompt({
                        type: 'input',
                        name: 'title',
                        message: "update your title",
                        default: list[index].title
                    },).then((answer) => {
                        list[index].title = answer.title
                        db.write(list)
                    });
                    break;
                case 'remove':
                    list.splice(index, 1)
                    db.write(list)
                    break;
            }
        })
    } else if (index === -2) {
        // 创建任务
        createTak(list)
    }
}

function printTasks(list) {
    inquirer
        .prompt(
            {
                type: 'list',
                name: 'index',
                message: 'please select you want to done task',
                choices: [{name: '退出', value: '-1'}, ...list.map((task, index) => {
                    return {
                        name: `${task.done ? '[x]' : '[_]'} ${index + 1} - ${task.title}`
                        , value: index.toString()
                    }
                }), {name: '+ 创建任务', value: '-2'}],
            },
        )
        .then((answer) => {
            const index = parseInt(answer.index)
            taskForAction(list, index)
        });
}

module.exports.showAll = async () => {
    // 读取当前任务
    const list = await db.read()
    // 打印所有任务
    printTasks(list)
}
