#!/usr/bin/env python3
"""Nightly dead-video sweep. Asks YouTube's public oEmbed endpoint about every video in the catalog and drops the ones
that are gone (404), private (403), or have embedding disabled (401). Network trouble keeps a video: unknown is not dead.

  python3 tools/sweep.py data/catalog.json

Rewrites the file only when something was dropped. Prints a summary. In GitHub Actions it also sets a `dropped` output.
"""
import datetime, json, os, sys, time, urllib.error, urllib.request
from concurrent.futures import ThreadPoolExecutor

def probe(vid):
    url = 'https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=%s&format=json' % vid
    for attempt in range(3):
        try:
            with urllib.request.urlopen(url, timeout=20):
                return vid, 'ok'
        except urllib.error.HTTPError as e:
            if e.code in (401, 403, 404): return vid, 'dead:%d' % e.code
            if e.code == 429: time.sleep(5 * (attempt + 1)); continue
            return vid, 'unknown:%d' % e.code
        except Exception:
            time.sleep(2)
    return vid, 'unknown'

def main():
    path = sys.argv[1] if len(sys.argv) > 1 else 'data/catalog.json'
    cat = json.load(open(path))
    ids = sorted({it['id'] for pool in cat['pools'].values() for it in pool})
    with ThreadPoolExecutor(max_workers=6) as ex:
        status = dict(ex.map(probe, ids))
    dead = {v for v, s in status.items() if s.startswith('dead')}
    blockp = os.path.join(os.path.dirname(path), 'unembeddable.json')
    if os.path.exists(blockp): dead |= set(json.load(open(blockp)).keys())   # ids a real player refused; see tools/embed_check.js
    unknown = sum(1 for s in status.values() if s.startswith('unknown'))
    dropped = []
    for name, items in cat['pools'].items():
        dropped += [(name, it['id'], it['t'], status[it['id']]) for it in items if it['id'] in dead]
        cat['pools'][name] = [it for it in items if it['id'] not in dead]
    print('checked %d videos: %d dead, %d unknown (kept)' % (len(ids), len(dead), unknown))
    for name, vid, t, st in dropped: print('  - [%s] %s %s  %s' % (name, vid, st, t[:60]))
    if dropped:
        cat['swept'] = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
        json.dump(cat, open(path, 'w'), separators=(',', ':'), ensure_ascii=False)
        print('wrote %s' % path)
    if os.environ.get('GITHUB_OUTPUT'):
        with open(os.environ['GITHUB_OUTPUT'], 'a') as f: f.write('dropped=%d\n' % len(dropped))

if __name__ == '__main__':
    main()
