import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
    subject: Subjects;
    data: any;
}

export abstract class Listener<T extends Event> {
    abstract subject: T['subject'];
    abstract queueGroupName: string;    // Use queue group so we don't dump the durable name even if services restart
    abstract onMessage(data: T['data'], msg: Message): void;
    private client: Stan;
    protected ackWait = 5 * 1000;

    constructor(client: Stan) {
        this.client = client;
    }

    subscriptionOptions() {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()               // get all events emitted in past
            .setManualAckMode(true)
            .setAckWait(this.ackWait)               // customize acknowledge timeout period
            .setDurableName(this.queueGroupName);   // keep track of all events that have gone to the queue group even if offline
    }
    
    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        )

        subscription.on('message', (msg: Message) => {
            console.log( `Message received: ${this.subject} / ${this.queueGroupName}`);

            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg);
        });
    }

    parseMessage(msg: Message) {
        const data = msg.getData();

        return typeof data === 'string'
            ? JSON.parse(data)
            : JSON.parse(data.toString('utf8'));
    }
}