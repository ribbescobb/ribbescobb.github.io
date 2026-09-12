// bulletins.js — the yellow rows in the guide: the cable system talking. Three kinds, munged deterministically so everyone
// sees the same nonsense at the same half hour: what's on PREMIUM, a lost dog, and somebody's stupid store.
(function () {
  const OWNERS = ['Chris', 'Zach', 'Jon'];
  const GOODS = ['Waterbed', 'Velour Truck Bed Liner', 'Wholesale Denture', 'Microwave Fireplace', 'Carpet Remnant', 'Ceiling Fan', 'Discount Hot Tub',
    'Orthopedic Recliner', 'Lawn Ornament', 'Satellite Dish', 'Imitation Crab', 'Car Phone', 'Beaded Curtain', 'Tanning Bed', 'Novelty Doormat',
    'Above-Ground Pool', 'Vinyl Siding', 'Crystal Figurine', 'Boat Motor', 'Bulk Tube Sock', 'Bean Bag Chair', 'Lava Lamp', 'Rotary Phone',
    'Ceramic Dalmatian', 'Wicker Furniture', 'Fog Machine', 'Ceiling Mirror', 'Pet Rock', 'Airbrushed T-Shirt', 'Discount Wig', 'Shag Carpet',
    'Cassette Rewinder', 'Console TV', 'Corn Dog', 'Karaoke Machine', 'Aluminum Awning', 'Gravel', 'Exotic Bird', 'Ferret', 'Firework'];
  const KINDS = ['Warehouse', 'Hut', 'Shoppe', 'Barn', 'Emporium', 'Outlet', 'Palace', 'Depot', 'World', 'Village', 'Shack', 'Superstore', 'Corner', 'Kingdom'];
  const DOGS = ['General', 'Mr. Business', 'Captain Underpants', 'Dennis', 'The Senator', 'Boss Hogg', 'Pudding', 'Reverend Jim', 'Kevin', 'Sergeant Pepper',
    'Meatloaf', 'Ambassador Bark', 'Professor', 'Gravy', 'Little Debbie', 'Diesel', 'Rambo', 'Muffin Top', 'Chairman', 'Sir Barksalot', 'Nacho', 'Duke of Earl',
    'Biscuit', 'Fonzie', 'Gordon Lightfoot', 'Coach', 'Deputy', 'Brisket', 'Marshmallow', 'Mayor McCheese', 'Judge Wapner', 'Sparky', 'Waffles', 'Doctor'];
  const DEALS = ['SALE!', 'BIG SALE!', 'GOING OUT OF BUSINESS!', 'EVERYTHING MUST GO!', 'GRAND OPENING!', '3 DAYS ONLY!', 'NO PAYMENTS TIL 1989!', 'WE FINANCE!', 'OPEN SUNDAYS!', 'LIQUIDATION!'];
  function hash(str) { let h = 0x811c9dc5; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); } return h >>> 0; }
  const pickFrom = (arr, h, salt) => arr[((h ^ Math.imul(salt, 2654435761)) >>> 0) % arr.length];
  const phone = (h) => '555-' + String(1000 + ((h >>> 0) % 9000));

  // One ad line for row slot n at half-hour bucket t (epoch seconds / 1800). Kind rotates with the row and the half hour.
  function line(n, t, premiumTitle, pass) {   // pass: which trip of the crawl this is; a fresh munge every time the row comes around
    const h = hash(n + '|' + t + '|' + (pass || 0));
    const pledge = window.Pledge && Pledge.enabled ? Pledge.bulletin(h) : null;   // the operator's pledge line, one bulletin in bulletinShare
    const share = pledge ? (Pledge.cfg.bulletinShare || 4) : 3;
    const kind = (n + t + (pass || 0)) % share;
    if (pledge && kind === share - 1) return pledge;
    if (kind === 0 && premiumTitle) return 'ORDER NOW ON PAY-PER-VIEW: ' + premiumTitle.toUpperCase() + ' · CALL ' + phone(h);
    if (kind === 1) return 'LOST DOG: "' + pickFrom(DOGS, h, 3) + '" · REWARD · ' + phone(h >>> 3);
    const owner = pickFrom(OWNERS, h, 5), goods = pickFrom(GOODS, h, 7), kind2 = pickFrom(KINDS, h, 11), deal = pickFrom(DEALS, h, 13);
    return deal + ' ' + owner.toUpperCase() + "'S " + goods.toUpperCase() + ' ' + kind2.toUpperCase() + ' · ' + phone(h >>> 5);
  }
  window.Bulletins = { line };
})();
