import { useEffect, useId, useRef, useState } from 'react';
import { CaretDown, GlobeHemisphereEast, MapPin } from '@phosphor-icons/react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { assetUrl, guideUrl } from './model';
import { useCatalog } from './store';
import './main-navigation.css';

export default function MainNavigation({
  activeCountryId,
}: {
  activeCountryId?: string;
}) {
  const { catalog } = useCatalog();
  const location = useLocation();
  const listId = useId();
  const disclosure = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const countryList = useRef<HTMLUListElement>(null);
  const [openMode, setOpenMode] = useState<'hover' | 'press' | null>(null);
  const open = openMode !== null;
  const hasActiveCountry = catalog.countries.some(
    (country) => country.id === activeCountryId,
  );

  useEffect(() => setOpenMode(null), [location]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !disclosure.current?.contains(event.target)
      ) {
        setOpenMode(null);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;

      setOpenMode(null);
      if (disclosure.current?.contains(document.activeElement)) {
        event.preventDefault();
        trigger.current?.focus();
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <nav className="atlas-primary-nav" aria-label="Основная навигация">
      <div
        className="country-disclosure"
        ref={disclosure}
        onPointerEnter={(event) => {
          if (
            event.pointerType === 'mouse' &&
            window.matchMedia('(min-width: 761px) and (any-hover: hover)')
              .matches
          ) {
            setOpenMode((mode) => mode ?? 'hover');
          }
        }}
        onPointerLeave={(event) => {
          if (
            event.pointerType === 'mouse' &&
            !countryList.current?.contains(document.activeElement)
          ) {
            setOpenMode((mode) => (mode === 'hover' ? null : mode));
          }
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setOpenMode(null);
        }}
      >
        <button
          type="button"
          ref={trigger}
          aria-expanded={open}
          aria-controls={listId}
          className="atlas-primary-tab"
          data-active={hasActiveCountry || undefined}
          onClick={() =>
            setOpenMode((mode) => (mode === 'press' ? null : 'press'))
          }
        >
          <GlobeHemisphereEast size={22} aria-hidden="true" />
          Страны
          <CaretDown className="country-caret" size={15} aria-hidden="true" />
        </button>
        <ul
          className="country-disclosure-list"
          id={listId}
          ref={countryList}
          hidden={!open}
        >
          {catalog.countries.map((country) => {
            const cover = country.cover || country.cities[0]?.cover;
            return (
              <li key={country.id}>
                <Link
                  to={guideUrl(country)}
                  aria-current={
                    country.id === activeCountryId ? 'true' : undefined
                  }
                  onClick={(event) => {
                    if (document.activeElement === event.currentTarget)
                      trigger.current?.focus();
                    setOpenMode(null);
                  }}
                >
                  {cover ? (
                    <img src={assetUrl(cover)} alt="" loading="lazy" />
                  ) : (
                    <GlobeHemisphereEast size={24} aria-hidden="true" />
                  )}
                  <span>{country.nameRu}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <NavLink className="atlas-primary-tab" to="/map" end>
        <MapPin size={22} aria-hidden="true" />
        Карта
      </NavLink>
    </nav>
  );
}
