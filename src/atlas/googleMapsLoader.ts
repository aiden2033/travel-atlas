type GoogleMapsWindow = Window & {
  atlasGoogleMapsReady?: () => void;
  gm_authFailure?: () => void;
};

export const googleMapsFailureEvent = 'atlas-google-maps-auth-failure';

let loading: Promise<void> | undefined;
let authFailed = false;

export function loadGoogleMaps(key: string): Promise<void> {
  if (authFailed)
    return Promise.reject(new Error('Google Maps authentication failed'));
  if (loading) return loading;

  loading = new Promise((resolve, reject) => {
    const browser = window as GoogleMapsWindow;
    const script = document.createElement('script');
    const params = new URLSearchParams({
      key,
      language: 'ru',
      loading: 'async',
      auth_referrer_policy: 'origin',
      callback: 'atlasGoogleMapsReady',
    });
    const previousAuthFailure = browser.gm_authFailure;
    const fail = () => {
      window.clearTimeout(timeout);
      script.remove();
      reject(new Error('Google Maps did not load'));
    };
    const timeout = window.setTimeout(fail, 12_000);

    browser.atlasGoogleMapsReady = () => {
      window.clearTimeout(timeout);
      resolve();
    };
    browser.gm_authFailure = () => {
      authFailed = true;
      fail();
      browser.dispatchEvent(new Event(googleMapsFailureEvent));
      previousAuthFailure?.();
    };
    script.onerror = fail;
    script.async = true;
    script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
    document.head.append(script);
  });

  return loading;
}
