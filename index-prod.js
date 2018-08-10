const pageTest = require("./testPage");
const fs = require("fs");
// const sleep = require("./utils/sleep");

async function loop(num, fn, ...fnArgs){
    for(let i = 0; i<num; i++){
        console.log("loop start");
        try{
            await fn(...fnArgs);
            console.log("loop end");
        } catch(e){
            console.log(e);
            console.log("loop error");
        }
        // console.log("loop end");
        // await sleep(1000);
    }
}

async function run(concurrentNum, fn){
    const threadList = [];
    for(let i = 0; i<concurrentNum; i++){
        threadList.push(fn());
    }
    await Promise.all(threadList);
}

async function main(){
    const concurrentNum = 2; //同时并发运行的测试实例
    const singleTask = 3; //每个测试实例运行的测试数量，总数量等于concurrentNum*singleTask
    const resultList = [];
    await run(concurrentNum,async ()=>{
        await loop(singleTask, pageTest, resultList);
    })
    console.log("complete");
    fs.writeFile('./test.txt', JSON.stringify(resultList, null, '\t'), (err)=>{
        if(err) throw err;
        console.log("file saved");
    });
}

main().catch((err)=>{
    console.log(err);
})