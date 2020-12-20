import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

// @ts-ignore
stan.on('connect', () => {
    console.log('Listener connected to NATS');

    // setDeliverAllAvailable() - Get all events emitted in past
    // setDurableName() - Keep track of all events that have gone to the queue group even if offline
    // 'orders-service-queue-group' -
        // Use queue group so we don't dump the durable name even if services restart
        // Makes sure it goes to only one instance regardless if multiple are running

    const options = stan
        .subscriptionOptions()
        .setManualAckMode(true)
        .setDeliverAllAvailable()
        .setDurableName('accounting-service');

    const subscription = stan.subscribe(
        'ticket:created',
        'orders-service-queue-group',
        options
    );

    stan.on('close', () => {
        console.log('NATS connection closed!');
        process.exit();
    });

    subscription.on('message', (msg: Message) => {
        const data = msg.getData();

        if (typeof data === 'string') {
            console.log((`Received event #${msg.getSequence()}, with data: ${data}`));
        }
        
        msg.ack();
    });
});

// Gracefully shutdown client to correctly mark as offline
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());