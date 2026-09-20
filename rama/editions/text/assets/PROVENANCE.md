# CP/M Text Opening-Arc Asset Provenance

## Mechanical storage boot cue

Status: **production-approved for the bounded CP/M opening arc**

- Runtime file: `cpm-storage-chatter.wav`
- Rosetta source: `rosetta/audio/boot/text-cpm_storage-chatter.wav`
- Source and runtime SHA-256: `76d90820139271f9d4af164e4f672d4dc385fdae9883a855a9e490b6736b2e2f`
- Format: PCM WAV, 16-bit mono, 44.1 kHz, 1.149773 seconds
- Original status: prototype audio staged for review
- Promotion authority: 2026-08-20 CP/M + Illustrated opening-arc production milestone
- Asset id: `text.boot.cpm-storage-chatter`
- Prepared scene: `machine_boot` (session-owned registry identity)

The runtime bytes are unchanged. Production approval is limited to the edition-owned, skippable
boot ritual. The cue is invoked twice without looping: once for the cold-start disk read and once
when CP/M loads the `RAMA` transient program. Playback failure falls back to silence. The cue does
not advance a turn, write a save, add a transcript record, or reveal story information. It does not
authorize a Text soundtrack or command sounds.
