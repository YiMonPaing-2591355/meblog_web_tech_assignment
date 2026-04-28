const RAW_API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

function getApiOrigin() {
  return RAW_API_BASE
    .replace(/\\/g, '/')
    .replace(/\/+$/, '')
    .replace(/\/api(?:\/v\d+)?$/, '');
}

export function buildStorageImageUrl(imagePath) {
  if (!imagePath) return null;

  const stringPath = String(imagePath).trim();
  const apiOrigin = getApiOrigin();

  if (/^(\/(storage|media)\/)/i.test(stringPath)) {
    return `${apiOrigin}${stringPath}`;
  }

  if (/^https?:\/\//i.test(stringPath)) {
    try {
      const parsedUrl = new URL(stringPath);
      const parsedApiOrigin = new URL(apiOrigin);

      if (
        parsedUrl.hostname === parsedApiOrigin.hostname &&
        /^\/(storage|media)\//i.test(parsedUrl.pathname)
      ) {
        return `${apiOrigin}${parsedUrl.pathname}`;
      }
    } catch (_) {
      return stringPath;
    }

    return stringPath;
  }

  const normalizedPath = stringPath
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .replace(/^public\//, '')
    .replace(/^storage\//, '')
    .replace(/^media\//, '');

  return `${apiOrigin}/media/${normalizedPath}`;
}
