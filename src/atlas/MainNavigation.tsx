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
  const [open, setOpen] = useState(false);
  const hasActiveCountry = catalog.countries.some(
    (country) => country.id === activeCountryId,
  );

  useEffect(() => setOpen(false), [location]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;

      setOpen(false);
      if (disclosure.current?.contains(document.activeElement)) {
        event.preventDefault();
        trigger.current?.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <nav className="atlas-primary-nav" aria-label="Основная навигация">
      <div className="country-disclosure" ref={disclosure}>
        <button
          type="button"
          ref={trigger}
          aria-expanded={open}
          aria-controls={listId}
          className="atlas-primary-tab"
          data-active={hasActiveCountry || undefined}
          onClick={() => setOpen((current) => !current)}
        >
          <GlobeHemisphereEast size={22} aria-hidden="true" />
          Страны
          <CaretDown className="country-caret" size={15} aria-hidden="true" />
        </button>
        <ul className="country-disclosure-list" id={listId} hidden={!open}>
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
                    setOpen(false);
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
