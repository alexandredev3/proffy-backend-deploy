"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bull_1 = __importDefault(require("bull"));
const redis_1 = __importDefault(require("../config/redis"));
const RecoveryMail_1 = __importDefault(require("../app/jobs/RecoveryMail"));
const jobs = [RecoveryMail_1.default];
// Object.values retorna apenas o valor de determinado objeto.
const queues = Object.values(jobs).map(job => ({
    bull: new bull_1.default(job.key, { redis: redis_1.default }),
    name: job.key,
    handle: job.handle
}));
exports.default = {
    queues,
    add(name, data) {
        // metodo para adicionar um job na fila.
        const queue = this.queues.find((queue) => queue.name === name);
        return queue === null || queue === void 0 ? void 0 : queue.bull.add(data);
        /*
          * queue?: eu estou verificando se tem algum job na variavel queue.
          * pode se que ele não encontre nenhum job com o nome que foi passado como parametro.
        */
    },
    process() {
        // processar cada job na fila
        return this.queues.forEach(queue => {
            queue.bull.process(queue.handle);
            queue.bull.on('failed', (job, err) => {
                console.log(`Job ${job} Failed:`, err);
            });
        });
    }
};
