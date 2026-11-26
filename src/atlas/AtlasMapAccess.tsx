import { lazy, useState, type FormEvent } from 'react';

const AtlasMapPage = lazy(() => import('./AtlasMapPage'));
const pinHash =
  'a19fbf8bf0530ca46179b803a8234f56276f21c0e7dc2f84c682924b95de5801';
const accessKey = 'atlas:map-access';

function hasMapAccess() {
  try {
    return sessionStorage.getItem(accessKey) === pinHash;
  } catch {
    return false;
  }
}

export default function AtlasMapAccess() {
  const [unlocked, setUnlocked] = useState(hasMapAccess);
  const [pin, setPin] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  async function unlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (checking) return;
    setChecking(true);
    setError('');

    try {
      const digest = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(pin),
      );
      const hash = Array.from(new Uint8Array(digest), (byte) =>
        byte.toString(16).padStart(2, '0'),
      ).join('');
      if (hash !== pinHash) {
        setError('Неверный PIN-код.');
        return;
      }

      setUnlocked(true);
      try {
        sessionStorage.setItem(accessKey, pinHash);
      } catch {
        return;
      }
    } catch {
      setError('Не удалось проверить PIN-код. Откройте страницу по HTTPS.');
    } finally {
      setChecking(false);
    }
  }

  if (unlocked) return <AtlasMapPage />;

  return (
    <div className="workspace-page empty-state">
      <h1>Карта</h1>
      <form className="map-pin-form" onSubmit={unlock}>
        <label htmlFor="atlas-map-pin">PIN-код</label>
        <input
          id="atlas-map-pin"
          type="password"
          inputMode="numeric"
          autoComplete="off"
          required
          pattern="[0-9]{4}"
          maxLength={4}
          value={pin}
          readOnly={checking}
          aria-invalid={!!error}
          aria-describedby={error ? 'atlas-map-pin-error' : undefined}
          onChange={(event) => {
            setPin(event.target.value);
            setError('');
          }}
        />
        {error && (
          <p id="atlas-map-pin-error" role="alert">
            {error}
          </p>
        )}
        <button className="primary" type="submit" disabled={checking}>
          Открыть карту
        </button>
      </form>
    </div>
  );
}
