(function installRamaEditionRegistry(global) {
  "use strict";

  const descriptors = [
    {
      id: "text",
      label: "CP/M Text Edition",
      shortLabel: "Text Edition",
      route: "../editions/text/",
      launcherAvailable: true,
      status: "Available edition",
      implementation: "complete-text",
      description: "The canonical parser-driven RAMA voyage, preserved behind its original textual interface."
    },
    {
      id: "book-1982",
      label: "1982 Choose Your Path Book",
      shortLabel: "1982 Book Edition",
      route: "../editions/book-1982/",
      launcherAvailable: true,
      sessionMode: "standalone",
      status: "Available book",
      implementation: "branching-page-book",
      description: "A separate, abridged branching-book interpretation with its own pages, choices, endings and bookmark."
    },
    {
      id: "illustrated",
      label: "Illustrated Adventure Edition",
      shortLabel: "Illustrated Edition",
      route: "../editions/illustrated/",
      launcherAvailable: true,
      status: "Early Access edition",
      implementation: "opening-arc-production",
      description: "A parser-led illustrated adventure that reveals selected moments through sparse early-computer pictures and falls back deliberately to text."
    },
    {
      id: "era-1989",
      label: "1989 Adventure System",
      shortLabel: "1989 Edition",
      route: "../editions/era-1989/",
      launcherAvailable: true,
      status: "Early Access edition",
      implementation: "static-graphical-parser",
      description: "A 1989 EGA-era static graphical adventure shell around the same canonical parser voyage. Hero scenes give way to intentional text fallback."
    },
    {
      id: "era-1994",
      label: "VGA Adventure Edition",
      shortLabel: "1994 Edition",
      route: "../editions/era-1994/",
      launcherAvailable: true,
      status: "Early Access edition",
      implementation: "static-graphical-parser",
      description: "A polished 1994 VGA static graphical presentation of the same parser-driven voyage, with safe text fallback beyond its hero scene."
    }
  ];

  const EDITIONS = Object.freeze(descriptors.map(descriptor => Object.freeze({ ...descriptor })));
  const EDITION_IDS = Object.freeze(EDITIONS.map(descriptor => descriptor.id));

  function edition(id) {
    return EDITIONS.find(descriptor => descriptor.id === id) || null;
  }

  function launcherEdition(id) {
    const descriptor = edition(id);
    return descriptor && descriptor.launcherAvailable && descriptor.route ? descriptor : null;
  }

  function resolveLauncherRoute(id, baseHref) {
    const descriptor = launcherEdition(id);
    if (!descriptor) return null;
    try {
      return new URL(descriptor.route, baseHref);
    } catch (error) {
      return null;
    }
  }

  global.RamaEditionRegistry = Object.freeze({
    EDITIONS,
    EDITION_IDS,
    edition,
    launcherEdition,
    resolveLauncherRoute
  });
})(globalThis);
