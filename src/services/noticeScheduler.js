/**
 * Notice Scheduler Service
 * Handles automated notice lifecycle: scheduled publishing, expiry, and archiving
 */

import { getNotices, updateNotice } from "./noticeService";
import { NOTICE_STATUS } from "../mockDB/seed/notices";

// Scheduler interval in milliseconds (check every minute)
const SCHEDULER_INTERVAL = 60000;

// Default auto-archive after expiry (in days)
const DEFAULT_AUTO_ARCHIVE_DAYS = 30;

let schedulerInterval = null;
let isRunning = false;

/**
 * Process scheduled notices
 * Publishes notices whose scheduled time has arrived
 */
async function processScheduledNotices() {
  try {
    const notices = await getNotices();
    const now = new Date();
    const scheduledNotices = notices.filter(
      (n) => n.status === NOTICE_STATUS.SCHEDULED && n.publishedAt,
    );

    for (const notice of scheduledNotices) {
      const scheduledTime = new Date(notice.publishedAt);
      if (scheduledTime <= now) {
        // Time to publish
        await updateNotice(notice.id, {
          status: NOTICE_STATUS.PUBLISHED,
          publishedAt: now.toISOString(), // Update to actual publish time
        });
        console.log(`[NoticeScheduler] Published scheduled notice: ${notice.id}`);
      }
    }
  } catch (error) {
    console.error("[NoticeScheduler] Error processing scheduled notices:", error);
  }
}

/**
 * Process expired notices
 * Expires notices whose expiry time has passed
 */
async function processExpiredNotices() {
  try {
    const notices = await getNotices();
    const now = new Date();
    const publishedNotices = notices.filter(
      (n) => n.status === NOTICE_STATUS.PUBLISHED && n.expiresAt,
    );

    for (const notice of publishedNotices) {
      const expiryTime = new Date(notice.expiresAt);
      if (expiryTime <= now) {
        // Time to expire
        await updateNotice(notice.id, {
          status: NOTICE_STATUS.EXPIRED,
        });
        console.log(`[NoticeScheduler] Expired notice: ${notice.id}`);
      }
    }
  } catch (error) {
    console.error("[NoticeScheduler] Error processing expired notices:", error);
  }
}

/**
 * Process auto-archive notices
 * Archives expired notices after their auto-archive period
 */
async function processAutoArchiveNotices() {
  try {
    const notices = await getNotices();
    const now = new Date();
    const expiredNotices = notices.filter((n) => n.status === NOTICE_STATUS.EXPIRED);

    for (const notice of expiredNotices) {
      const expiryTime = new Date(notice.expiresAt);
      const autoArchiveDays = notice.autoArchiveAfter || DEFAULT_AUTO_ARCHIVE_DAYS;
      const autoArchiveTime = new Date(expiryTime);
      autoArchiveTime.setDate(autoArchiveTime.getDate() + autoArchiveDays);

      if (autoArchiveTime <= now) {
        // Time to archive
        await updateNotice(notice.id, {
          status: NOTICE_STATUS.ARCHIVED,
        });
        console.log(`[NoticeScheduler] Auto-archived notice: ${notice.id}`);
      }
    }
  } catch (error) {
    console.error("[NoticeScheduler] Error processing auto-archive notices:", error);
  }
}

/**
 * Process old notices for auto-archiving
 * Archives published notices older than a specified threshold (default 90 days)
 * This is a cleanup mechanism for notices without explicit expiry
 */
async function processOldNotices() {
  try {
    const notices = await getNotices();
    const now = new Date();
    const oldNoticeThreshold = 90; // days

    const oldNotices = notices.filter((n) => {
      if (n.status !== NOTICE_STATUS.PUBLISHED) return false;
      if (!n.expiresAt) {
        // No expiry set, check age
        const createdTime = new Date(n.createdAt);
        const daysSinceCreation = (now - createdTime) / (1000 * 60 * 60 * 24);
        return daysSinceCreation > oldNoticeThreshold;
      }
      return false;
    });

    for (const notice of oldNotices) {
      await updateNotice(notice.id, {
        status: NOTICE_STATUS.ARCHIVED,
      });
      console.log(`[NoticeScheduler] Auto-archived old notice: ${notice.id}`);
    }
  } catch (error) {
    console.error("[NoticeScheduler] Error processing old notices:", error);
  }
}

/**
 * Main scheduler tick function
 * Runs all scheduled tasks
 */
async function schedulerTick() {
  console.log("[NoticeScheduler] Running scheduled tasks...");
  await processScheduledNotices();
  await processExpiredNotices();
  await processAutoArchiveNotices();
  await processOldNotices();
  console.log("[NoticeScheduler] Scheduled tasks completed");
}

/**
 * Start the notice scheduler
 * Begins periodic processing of notice lifecycle events
 */
export function startNoticeScheduler() {
  if (isRunning) {
    console.log("[NoticeScheduler] Already running");
    return;
  }

  console.log("[NoticeScheduler] Starting...");
  isRunning = true;

  // Run immediately on start
  schedulerTick();

  // Set up interval
  schedulerInterval = setInterval(schedulerTick, SCHEDULER_INTERVAL);
  console.log(`[NoticeScheduler] Started (interval: ${SCHEDULER_INTERVAL}ms)`);
}

/**
 * Stop the notice scheduler
 */
export function stopNoticeScheduler() {
  if (!isRunning) {
    console.log("[NoticeScheduler] Not running");
    return;
  }

  console.log("[NoticeScheduler] Stopping...");
  isRunning = false;

  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
  }

  console.log("[NoticeScheduler] Stopped");
}

/**
 * Check if scheduler is running
 */
export function isSchedulerRunning() {
  return isRunning;
}

/**
 * Manually trigger scheduler tick
 * Useful for testing or immediate processing
 */
export async function triggerSchedulerTick() {
  console.log("[NoticeScheduler] Manual trigger");
  await schedulerTick();
}

/**
 * Get scheduler status
 */
export function getSchedulerStatus() {
  return {
    isRunning,
    interval: SCHEDULER_INTERVAL,
    intervalMinutes: SCHEDULER_INTERVAL / 60000,
    lastTick: new Date().toISOString(),
  };
}

/**
 * Schedule a notice for future publication
 * @param {string} noticeId - The notice ID
 * @param {Date} scheduledTime - The scheduled publish time
 * @param {Date} [expiryTime] - Optional expiry time
 * @param {number} [autoArchiveAfter] - Optional days after expiry to auto-archive
 */
export async function scheduleNotice(
  noticeId,
  scheduledTime,
  expiryTime = null,
  autoArchiveAfter = null,
) {
  const updates = {
    status: NOTICE_STATUS.SCHEDULED,
    publishedAt: scheduledTime.toISOString(),
  };

  if (expiryTime) {
    updates.expiresAt = expiryTime.toISOString();
  }

  if (autoArchiveAfter) {
    updates.autoArchiveAfter = autoArchiveAfter;
  }

  await updateNotice(noticeId, updates);
  console.log(`[NoticeScheduler] Scheduled notice ${noticeId} for ${scheduledTime.toISOString()}`);
}

/**
 * Set expiry for a published notice
 * @param {string} noticeId - The notice ID
 * @param {Date} expiryTime - The expiry time
 * @param {number} [autoArchiveAfter] - Optional days after expiry to auto-archive
 */
export async function setNoticeExpiry(noticeId, expiryTime, autoArchiveAfter = null) {
  const updates = {
    expiresAt: expiryTime.toISOString(),
  };

  if (autoArchiveAfter) {
    updates.autoArchiveAfter = autoArchiveAfter;
  }

  await updateNotice(noticeId, updates);
  console.log(`[NoticeScheduler] Set expiry for notice ${noticeId} at ${expiryTime.toISOString()}`);
}

/**
 * Get notices due for publication soon (within next hour)
 * Useful for admin dashboard alerts
 */
export async function getUpcomingScheduledNotices() {
  const notices = await getNotices();
  const now = new Date();
  const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

  return notices.filter((n) => {
    if (n.status !== NOTICE_STATUS.SCHEDULED || !n.publishedAt) return false;
    const scheduledTime = new Date(n.publishedAt);
    return scheduledTime > now && scheduledTime <= oneHourFromNow;
  });
}

/**
 * Get notices expiring soon (within next 24 hours)
 * Useful for admin dashboard alerts
 */
export async function getExpiringNotices() {
  const notices = await getNotices();
  const now = new Date();
  const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  return notices.filter((n) => {
    if (n.status !== NOTICE_STATUS.PUBLISHED || !n.expiresAt) return false;
    const expiryTime = new Date(n.expiresAt);
    return expiryTime > now && expiryTime <= oneDayFromNow;
  });
}

/**
 * Get notices that need archiving (expired beyond auto-archive period)
 * Useful for admin dashboard alerts
 */
export async function getNoticesNeedingArchive() {
  const notices = await getNotices();
  const now = new Date();

  return notices.filter((n) => {
    if (n.status !== NOTICE_STATUS.EXPIRED || !n.expiresAt) return false;
    const expiryTime = new Date(n.expiresAt);
    const autoArchiveDays = n.autoArchiveAfter || DEFAULT_AUTO_ARCHIVE_DAYS;
    const autoArchiveTime = new Date(expiryTime);
    autoArchiveTime.setDate(autoArchiveTime.getDate() + autoArchiveDays);
    return autoArchiveTime <= now;
  });
}

// Export the scheduler as a singleton object
export const noticeScheduler = {
  start: startNoticeScheduler,
  stop: stopNoticeScheduler,
  isRunning: isSchedulerRunning,
  trigger: triggerSchedulerTick,
  getStatus: getSchedulerStatus,
  scheduleNotice,
  setNoticeExpiry,
  getUpcomingScheduledNotices,
  getExpiringNotices,
  getNoticesNeedingArchive,
};
