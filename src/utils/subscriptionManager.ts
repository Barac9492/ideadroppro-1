
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionRecord {
  channel: any;
  channelName: string;
  timestamp: number;
  componentId: string;
}

class SubscriptionManager {
  private subscriptions = new Map<string, SubscriptionRecord>();
  private static instance: SubscriptionManager;

  static getInstance(): SubscriptionManager {
    if (!SubscriptionManager.instance) {
      SubscriptionManager.instance = new SubscriptionManager();
    }
    return SubscriptionManager.instance;
  }

  subscribe(
    baseChannelName: string,
    componentId: string,
    config: any,
    callback: (payload: any) => void,
    statusCallback?: (status: string) => void
  ) {
    const subscriptionKey = `${baseChannelName}-${componentId}`;
    
    // Clean up existing subscription for this key
    this.unsubscribe(subscriptionKey);
    
    // Create unique channel name with timestamp
    const uniqueChannelName = `${baseChannelName}-${componentId}-${Date.now()}`;
    
    console.log('Creating subscription:', subscriptionKey, 'with channel:', uniqueChannelName);
    
    const channel = supabase
      .channel(uniqueChannelName)
      .on('postgres_changes', config, callback)
      .subscribe((status) => {
        console.log('Subscription status for', subscriptionKey, ':', status);
        if (statusCallback) statusCallback(status);
      });
    
    // Store subscription record
    this.subscriptions.set(subscriptionKey, {
      channel,
      channelName: uniqueChannelName,
      timestamp: Date.now(),
      componentId
    });
    
    return subscriptionKey;
  }

  unsubscribe(subscriptionKey: string) {
    const record = this.subscriptions.get(subscriptionKey);
    if (record) {
      console.log('Unsubscribing from:', subscriptionKey);
      supabase.removeChannel(record.channel);
      this.subscriptions.delete(subscriptionKey);
    }
  }

  cleanupAll() {
    console.log('Cleaning up all subscriptions');
    for (const [key, record] of this.subscriptions) {
      supabase.removeChannel(record.channel);
    }
    this.subscriptions.clear();
  }

  // Clean up stale subscriptions (older than 5 minutes)
  cleanupStale() {
    const now = Date.now();
    const staleThreshold = 5 * 60 * 1000; // 5 minutes
    
    for (const [key, record] of this.subscriptions) {
      if (now - record.timestamp > staleThreshold) {
        console.log('Cleaning up stale subscription:', key);
        this.unsubscribe(key);
      }
    }
  }
}

export const subscriptionManager = SubscriptionManager.getInstance();
