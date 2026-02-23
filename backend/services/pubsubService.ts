import { PubSub } from '@google-cloud/pubsub';
import { PubSubMessage, PubSubResult } from '../types/index.js';
import env from '../utils/Env.js';

let pubsubClient: PubSub | null;
try {
  pubsubClient = new PubSub();
} catch (e) {
  console.log(e);
  pubsubClient = null;
}

const TOPIC = env.GCP_PUBSUB_TOPIC;

class PubsubService {
  publishAudioUpload = async (messageObj: PubSubMessage): Promise<PubSubResult> => {
    const payload = JSON.stringify(messageObj);
    if (pubsubClient && TOPIC) {
      const topic = pubsubClient.topic(TOPIC);
      const dataBuffer = Buffer.from(payload);
      try {
        const messageId = await topic.publishMessage({ data: dataBuffer });
        return { ok: true, messageId };
      } catch (err) {
        console.error('Pub/Sub publish error', err);
        return { ok: false, error: (err as Error).message };
      }
    }

    console.log('Pub/Sub not configured — event:', payload);
    return { ok: false, error: 'not-configured' };
  };
}

export default new PubsubService();
