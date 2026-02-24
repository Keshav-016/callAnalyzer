import { PubSub } from '@google-cloud/pubsub';
import { PubSubMessage, PubSubResult } from '../types/index.js';
import env from '../utils/Env.js';

class PubsubService {
  private readonly pubsubClient: PubSub | null;
  private readonly topic: string;

  constructor() {
    try {
      this.pubsubClient = new PubSub();
      console.log('[PubSub] Client initialized');
    } catch (e) {
      console.error('[PubSub] Failed to initialize client:', e);
      this.pubsubClient = null;
    }
    this.topic = env.GCP_PUBSUB_TOPIC;
  }

  publishAudioUpload = async (messageObj: PubSubMessage): Promise<PubSubResult> => {
    const payload = JSON.stringify(messageObj);
    if (this.pubsubClient && this.topic) {
      const topicObj = this.pubsubClient.topic(this.topic);
      const dataBuffer = Buffer.from(payload);
      try {
        const messageId = await topicObj.publishMessage({ data: dataBuffer });
        console.log(`[PubSub] Message published: ${messageId}`);
        return { ok: true, messageId };
      } catch (err) {
        console.error('[PubSub] Publish error:', (err as Error).message);
        return { ok: false, error: (err as Error).message };
      }
    }

    console.warn('[PubSub] Not configured — event:', payload);
    return { ok: false, error: 'not-configured' };
  };
}

export default new PubsubService();
