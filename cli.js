const program = require('commander');
const api = require('./index')

program
    .option('-x , --xxx', 'what is x')

program
    .command('add')
    .description('add a task')
    .action((...args) => {
        const words = args.slice(0, -1).join(' ')
        api.add(words).then(() => {
            console.log('添加成功')
        }, () => {
            console.log('添加失败')
        })
    });

program
    .command('clear')
    .description('clear all task')
    .action(() => {
        api.clear().then(() => {
            console.log('清楚完毕')
        }, () => {
            console.log('清楚失败')
        })
    });

program.parse(process.argv);

if (process.argv.length === 2) {
    // 用户直接node cli
    void api.showAll()
}



