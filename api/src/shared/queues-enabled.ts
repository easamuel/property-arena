/** Local Windows often only has Redis 3.x; BullMQ needs Redis >= 5. */
export function isQueuesEnabled(): boolean {
  if (process.env.SKIP_REDIS === 'true') return false;
  if (process.env.ENABLE_QUEUES === 'true') return true;
  // Default: disable queues on Windows unless explicitly enabled
  return process.platform !== 'win32';
}
