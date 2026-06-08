/**
 * Communication Contracts
 * Defines the boundaries for notices and messaging.
 */
export const CommunicationContract = {
  createNotice(data) {
    return {
      id: data?.id ?? '',
      title: data?.title ?? '',
      content: data?.content ?? '',
      targetAudience: Array.isArray(data?.targetAudience) ? data.targetAudience : [],
      publishDate: data?.publishDate ?? new Date().toISOString(),
      priority: data?.priority ?? 'Normal'
    };
  }
};
