# 1994 Early Access Asset Provenance

Status: **bounded Early Access horizontal-slice assets; not final full-edition production art**

## Launch title screen

- Runtime file: `launch-screen.png`
- Production source: `rosetta/art/production/early-access/era-1994-title-screen.png`
- Source/runtime SHA-256: `712aa7c442db16aeb768d27b9c85769c19e807eba5c4a0ee574b83bf744e21ab`
- Tool: OpenAI built-in image generation
- Prompt record: `rosetta/art/prompts/four-era-early-access.md`
- Approval: production-quality asset for the bounded Early Access launch moment only
- Post-process: centered crop of the generated 1536×1024 image to a 1364×1023 4:3 frame

This title background communicates the 1994 software-release experience. It is not a canonical
scene and carries no room, puzzle, or state information.

## Alpha Airlock plate

- Runtime file: `alpha-airlock.png`
- Production source: `rosetta/art/production/early-access/era-1994-alpha-airlock.png`
- Source/runtime SHA-256: `0f0fdfbe2c8d0dfb2d71e3af4f33fe673f21c12b7b7a27634d7924f2f3777eec`
- Tool: OpenAI built-in image generation
- Prompt record: `rosetta/art/prompts/four-era-early-access.md`
- Approval: production-quality asset for the bounded Alpha Airlock scene only
- Canonical scene mapping: `alpha_airlock_first_arrival`

Every other location deliberately uses canonical Text presentation. The asset does not introduce
walk paths, hotspots, puzzle information, or room-specific story logic. The launch and Alpha files
are intentionally distinct production assets.

## Boot audio

- Runtime file: `era-1994-boot.wav`
- Rosetta source: `rosetta/audio/boot/era-1994_floppy-fm.wav`
- Source/runtime SHA-256: `95541b219e3adce5902bf883328fd99f948ff1ed9b09a07aff2fccbb287889da`
- Status: prototype audio promoted only for the skippable Early Access boot ritual

2026-09-11–12 launch revision: the same audio bytes play once on power-on and stop on skip or
completion of the 3.6-second presentation. They remain **prototype audio staged for review**,
not newly validated or production-approved. `launch-screen.png`, Alpha Airlock and all room art
are unchanged. The lavish new physical box painting is not used by the running edition.

No asset authorizes broad 1994 production or a point-and-click system.

## Act I chronological production batch — dawn through shaft

Status: **production-approved**

Approval authority: user approval on 2026-08-27. Files were generated with OpenAI built-in image
generation and promoted byte-for-byte into Rosetta production storage and this runtime directory.

| Canonical scene | Runtime file | Generation id | Dimensions | SHA-256 |
|---|---|---|---|---|
| `raman_dawn` | `raman-dawn.png` | `exec-5e8a7ab5-65f0-4f64-bf43-93c8a2d453d0` | 1586 × 992 | `c8167f9c721f968c02b0a9e6af43e34753bc7fd4881686d44ec8c21e1bbdd4c6` |
| `new_york_waterfront` | `new-york-waterfront.png` | `exec-cd5361e5-3901-42d1-bb5e-2af35b76fc2c` | 1448 × 1086 | `bb769a4b61412229b56e3036c6873ec0ea8603733aee7788d4100a01ae4d8c2f` |
| `octahedron_plaza` | `octahedron-plaza.png` | `exec-4bdffc53-824a-48f0-9d59-c763039007a2` | 1448 × 1086 | `6d4c4f859f2e5b8c18bfc6bd114dbe0fccaa7199d7f3d1caf354c45ae6279fab` |
| `latticed_way_shaft` | `latticed-way-shaft.png` | `exec-14dfc160-5134-4449-9486-cf12049b101e` | 1448 × 1086 | `301b8e39c1d4472ffce76935476f5d732d5ea9570982b2478dcd66009040f50a` |

The final Octahedron Plaza file is a surgical image edit of original generation
`exec-851af7f8-8b71-48b7-872a-f588ae12c0c7`; the edit removed model-invented street-level openings
and preserved the composition, palette, figures, reflections, and central octahedron. The superseded
candidate remains in Codex generated-image storage and is not a production asset.

The wider Raman Dawn output is deliberately retained and uses the renderer's existing
aspect-preserving contain fit. Rosetta sources use the same filenames under
`rosetta/art/production/era-1994/`; prompt records use `<scene-slug>__era-1994.md`.

## Pit and Lair chronological production batch

Status: **production-approved; First Shelter prepared registry-only**

| Canonical scene | Runtime file | Generation id | Dimensions | SHA-256 |
|---|---|---|---|---|
| `the_pit_stranded` | `the-pit-stranded.png` | `exec-b089e563-41e9-45d7-9666-df4c1341f298` | 1448 × 1086 | `91c3847059763b8ab22a1237c385bac1a223760b6e11dd5678089092b5fd3b78` |
| `lair_first_shelter` | `lair-first-shelter.png` | `exec-c7363db7-5da7-4945-842b-b75baaecc23f` | 1448 × 1086 | `7953ef623b3d527e26419d12e8287b456953fd49da1a7710f704fd4c1e315d50` |
| `lair_family_home` | `lair-family-home.png` | `exec-f532e2b1-7766-4dd6-b0ca-09622236c90e` | 1448 × 1086 | `11bd834e1b3103ef7842b279a75d4e183352bb86a08f2020176f99b67205d537` |

All three use OpenAI built-in image generation and byte-identical Rosetta/runtime copies. The final
Family Home plate is a surgical edit of original generation
`exec-afc72a0a-f248-4611-8233-1a8059fb5bb2`: only the innermost repeated red/orange wall band was
changed to green. The superseded image was not promoted. First Shelter remains registry-only and
unmapped.

## Act II Sirius, Avian, and Node arrival production batch

Status: **production-approved**

| Canonical scene | Runtime file | Generation id | Dimensions | SHA-256 |
|---|---|---|---|---|
| `atrium_sirius_revealed` | `atrium-sirius.png` | `exec-8c6bdc6f-fd19-4667-bd20-f72a0622ecec` | 1448 × 1086 | `d0ace59d442851bc8f5561b535b42ecb5420a0cab4e171919854d5318f1c8c11` |
| `avian_vertical` | `avian-vertical.png` | `exec-3b520659-457e-415a-b0a4-811fbc6a876d` | 1448 × 1086 | `ca9fea4531870732dc2a955ce840ab34fe2b483456953ba443b2750e9fa5db79` |
| `node_arrival_hangar` | `node-arrival-hangar.png` | `exec-69061dcb-92bb-4255-ad63-a408f49c519b` | 1448 × 1086 | `ff940b50b606aaeac49c3ab47567cb35b5c8ce9ee50c69088f9e3b0e241c0895` |

The first 1994 Avian generation, `exec-2530db8e-a150-4951-996d-97e3bedb4703`, was rejected for
medieval tower geometry, visible lanterns, and terrestrial gulls. It was never promoted. The final
corrective edit removes those contradictions and restores the approved artificial vertical and
alien glider language. Rosetta and runtime copies of all three final files are byte-identical.

## Act II Node interiors production batch

Status: **production-approved**

OpenAI built-in image generation produced the Hall and Observation candidates. The Design Atelier
candidate received one bounded truth-corrective edit because the initial miniature looked fully
constructed rather than awaiting its first charter decision. Each retained file was copied
byte-for-byte into Rosetta production staging and this runtime directory.

| Canonical scene | Runtime file | Final generation id | Dimensions | SHA-256 |
|---|---|---|---|---|
| `node_hall_eagle` | `node-hall-eagle.png` | `exec-ad5bdca5-5f80-4b49-ab41-0663e4506e7a` | 1448 × 1086 | `2328fa21326c249e02013b92f92fb23c25066aec1fecfe07cb5fe93d71406989` |
| `node_observation_sirius` | `node-observation.png` | `exec-d0f8e396-6091-4f24-94e9-a1ba5c3f0a56` | 1448 × 1086 | `0c4299d55bfd9554e11adc2b1723ee2133b711d93fc6100fc195b60656e506cf` |
| `design_atelier_new_eden` | `design-atelier.png` | `exec-ef923b25-7d32-487f-aa79-42b3a895a835` | 1448 × 1086 | `784543762a84ed8f370871c8588eb9aa446c7b642da1378c4b04ec34f073831a` |

The rejected Design Atelier original is retained only in the generation archive as
`exec-3858923e-6ba8-4854-8549-6cf68c1239fc` with SHA-256
`09dd82bba1ed110f6742264efc11bc100eefbe217e46ca64c2f02c06c53659d2`.
Every renderer mapping consumes canonical scene identity only and falls back to Text.

## Act III through Postlude five-scene candidate batch

Status: **production-approved**

| Canonical scene | Runtime file | Generation id | Dimensions | SHA-256 |
|---|---|---|---|---|
| `new_eden_plaza` | `new-eden-plaza.png` | `exec-2b8c83d0-dc06-4e55-8e51-36a97bb1824b` | 1448 × 1086 | `547c9c35db1195960a5313a468acbb3c167cc82eec008d3101046581fd6b273c` |
| `eden_clinic_ward` | `eden-clinic-ward.png` | `exec-21086b94-1c1a-488e-bec6-598a1ceb56c5` | 1448 × 1086 | `72870f22bf3f1fd29059d0ad2f0919f0c8689e0cc0291c4372adc8cf637e3d4f` |
| `assembly_hall_election_eve` | `assembly-hall-election-eve.png` | `exec-8ecc5065-abe2-40c3-9683-2e6d31233655` | 1448 × 1086 | `464e6476878ebd523907bc0c7db41a4d3d05d78c8521e8793852a7c14a9ab043` |
| `lair_sanctuary_octospiders` | `lair-sanctuary-octospiders.png` | `exec-4b48fb7c-f80b-4e9a-9339-6c3d69f6d6ea` | 1448 × 1086 | `bc9854128e20abe81bd5dd675e486ef367aa5bbf893df0bf2241a12e1c4d5aae` |
| `threshold_of_light` | `threshold-of-light.png` | `exec-6073d290-ff14-4b2e-a32a-10e8bf4c9393` | 1448 × 1086 | `dbe70cf3db10d7c9200e7bd261fd20a6beba2dc20de2c040f98e848d13e18468` |

The Clinic final is a surgical correction of rejected generation
`exec-1d509b8c-56a1-43c7-ae22-3da28b078915`, which had seven rather than eight patients. The final
keeps twelve beds and fills only the designated fourth back-row bed. All mappings fall back to Text.

## Act I Essential coverage backfill

Status: **production-approved**

| Canonical scene | Runtime file | Generation id | Dimensions | SHA-256 |
|---|---|---|---|---|
| `descent_to_central_plain` | `descent-central-plain.png` | `exec-d3969136-007f-41cf-b53d-bfdd07a05f82` | 1449 × 1086 | `777462d42427b5c5ca19e28e0b93585a2db1ab39d0bce7da6f7865623569281d` |
| `camp_alpha_survey_assignment` | `camp-alpha-survey.png` | `exec-8c89cd91-9c83-41ec-a2bc-680ebb7b9967` | 1448 × 1086 | `3a145dec780317251372e298dd3e2b6dc50bf72b8b8dcc4ec983cc2079e160d9` |
| `biot_procession_first_encounter` | `biot-procession.png` | `exec-4748e6d4-8703-4e72-b060-231a48228308` | 1448 × 1086 | `7d891dc7ee2e601380d78f322632f581de2dd2db05278309ae71935eda6194ce` |
| `borzov_medical_emergency` | `borzov-emergency.png` | `exec-9cdf4304-8abb-49b7-ab4c-3cd965ceecc6` | 1448 × 1086 | `f83ed205dd6032050e3e592c9b329ae2346118c50343d805663db0f3a05927b2` |
| `cylindrical_sea_first_reveal` | `cylindrical-sea.png` | `exec-810e0c8d-6653-4934-89fc-489f2d6a6b75` | 1449 × 1086 | `8d8898b649623622a83569fbb8289db47d9cd0bbf2b6bd81ae5bab0c7a27516b` |

All five use OpenAI built-in image generation and byte-identical Rosetta/runtime copies. The Sea
plate used the approved 1994 Rosetta reference as an era-style and atmosphere reference only. Each
mapping consumes canonical scene identity and preserves Text fallback.

## First Desirable scene batch

Status: **production-approved**

Approval authority: user approval on 2026-08-29. All files use OpenAI built-in image generation and
byte-identical Rosetta/runtime copies.

| Canonical scene | Runtime file | Final generation id | Dimensions | SHA-256 |
|---|---|---|---|---|
| `london_sealed_city` | `london-sealed-city.png` | `exec-32f7b2d7-578d-412f-b1e9-f335a4753cb0` | 1448 × 1086 | `afd659fa09ac225b2a2052b360ffbf3037ef9808ecdbf766441ea93f4bc8546c` |
| `pit_falstaff_contact` | `pit-falstaff-contact.png` | `exec-a918416a-961e-4168-9a50-f23c7d31ab11` | 1448 × 1086 | `ee2504075660ff35e18f4d0f49a885baeb71295ce0e4f21f7cf2bfea2689e0d2` |
| `camp_alpha_ruins` | `camp-alpha-ruins.png` | `exec-1ac8baf2-d477-4f1e-8f0e-7aacd2d91e3b` | 1448 × 1086 | `8d2524efcab158a3dd8150d0c01abafc7d914c04b552eb105f856629933b23f9` |
| `beta_shore_skiff_return` | `beta-shore-skiff-return.png` | `exec-17a8450e-f066-432b-9422-836de5a82202` | 1448 × 1086 | `373fd366688dd887853a87dd001e2f215653ae41d1d47df27c0f5dfd72343b4d` |
| `tailors_room` | `tailors-room.png` | `exec-76cf7ef8-c732-4547-9288-bfc61d002b2e` | 1448 × 1086 | `6d1f0cd1690746a95c4c11f64c22f701274f5fc509dbc062c25cb5ad80b5d9fa` |

London was regenerated after a tiled-seam rejection; Pit contact was regenerated to place Falstaff
on the lowest hold; Tailor's Room corrected Nicole's age. Superseded candidates remain outside
production. All mappings use derived canonical identities and preserve Text fallback.

## Second Desirable scene batch

Status: **production-approved**

Approval authority: user approval on 2026-08-29. All files use OpenAI built-in image generation and
byte-identical Rosetta/runtime copies.

| Canonical scene | Runtime file | Final generation id | Dimensions | SHA-256 |
|---|---|---|---|---|
| `node_family_quarters` | `node-family-quarters.png` | `exec-fdb83a7e-1d63-49eb-be91-7fe569004466` | 1449 × 1086 | `c57d3285e21421d01032b251b8649be425498d230e0b6bfa812845cf5c3fc7b5` |
| `wakefield_house` | `wakefield-house.png` | `exec-dad0a5a2-2228-413d-a7ac-60d71154b070` | 1448 × 1086 | `3b23ee6d95dbe9c680e1ca9d810b60c3f103334747a47ea081e8c0071ac5f8a8` |
| `vegas_floor` | `vegas-floor.png` | `exec-ce13891e-d52b-4a47-af71-c6b8ce9361fa` | 1448 × 1086 | `1dd838bb3fe820c1808953fe3a838d934efff93c4b4f077f8b357d67a3ef2a0f` |
| `eden_clinic_recovered` | `eden-clinic-recovered.png` | `exec-71504ccf-29a9-4d35-b289-5db8064d8750` | 1448 × 1086 | `37b43cbff1fd2e992ba2e1176cae2de69cdf0dd3ec60d238fc900f9dc35ddd85` |
| `assembly_hall_trial` | `assembly-hall-trial.png` | `exec-9d946392-6f24-48e3-bdc0-972d936b32bf` | 1448 × 1086 | `092f462964764d21950d3219c1aa93e801cb6bbec4424ce262c7c5aa353eabaf` |

Vegas was regenerated to make New Eden's curved artificial habitat unmistakable. The Clinic is a
targeted correction of `exec-33a5512b-f22b-478d-9b74-262cab3a38c7`, replacing its ordered color
indicators with three identical inactive squares. The trial uses election-eve art only for room and
era continuity and reveals neither statement nor verdict. All mappings consume derived canonical
identities and preserve Text fallback.

## Final Desirable scene batch

Status: **production-approved**

Approval authority: user approval on 2026-08-29. All files use OpenAI built-in image generation or
editing and byte-identical Rosetta/runtime copies.

| Canonical scene | Runtime file | Final generation id | Dimensions | SHA-256 |
|---|---|---|---|---|
| `katie_lost_vertical` | `katie-lost-vertical.png` | `exec-84cce032-d4c3-47eb-b18f-8dfc690307b3` | 1448 × 1086 | `c1ca75ca5956cb720add2ffb82dd1792d1e26e5e027d4cde7bd544c770b1d858` |
| `node_farewell` | `node-farewell.png` | `exec-150a77cb-bc9e-4cad-a9e1-23e12f8d376d` | 1448 × 1086 | `87e5faeec9bff6371ccfa8b3588bb1b17f82e3f2f23df0460450dc31721aad8c` |
| `gatehouse_rescue_katie` | `gatehouse-rescue-katie.png` | `exec-dc31368d-041d-407f-8d59-2740ca43757a` | 1448 × 1086 | `c0b61d59dfa84f1e3b2a5bfe969643f287a6f24d9d4e1783c5377092972eb1dd` |
| `gatehouse_rescue_siblings` | `gatehouse-rescue-siblings.png` | `exec-0dad9635-9e44-4207-a553-a02901cbc25d` | 1448 × 1086 | `587a6fb2230045f30623d7e1a3a9e1bb19120366913c2e2ec5f53bdbbd51ee17` |

Farewell generation `exec-e9afe6dc-0f51-4c73-9aab-a254c5209d07` was rejected for reversing Nicole
and Simone across the threshold. Katie's gatehouse final surgically removes the duplicate scarf
from `exec-bff2975d-1c71-4a36-bb78-86df8ec74feb`. Each gatehouse plate contains only its canonical
rescuer branch and neither shows the route out or ending.

## Full-Coverage Batch 1

Status: **production-approved**

Approval authority: user approval on 2026-08-30. OpenAI built-in image generation or editing
produced every file; Rosetta production and runtime copies are byte-identical.

| Canonical scene | Runtime file | Final generation id | Dimensions | SHA-256 |
|---|---|---|---|---|
| `medical_hut_quiet` | `medical-hut-quiet.png` | `exec-c2294565-2ded-4c06-a83e-622bf7c2b2ea` | 1448 × 1086 | `60cd8db268e647c8cc4bd5445841327457ab6ef21e846c4f802d2041561660e1` |
| `london_factory_reveal` | `london-factory-reveal.png` | `exec-e7751aa1-a15e-4b67-9469-9ffd2a08bef3` | 1448 × 1086 | `5d223001fb050b4a3e733010d38efa487465a16be12a19d05a5363013f33aac3` |
| `resolution_crossing` | `resolution-crossing.png` | `exec-d412ed53-27b4-4eb3-a7a2-f8acfb83fb81` | 1448 × 1086 | `7ed32953b33bfaf4517fccb77512901ad9d3a7fd13c8ec166a62655fe926c17f` |
| `new_york_narrow_ways` | `new-york-narrow-ways.png` | `exec-eb1b506e-6780-49ad-ade2-593662064cd5` | 1448 × 1086 | `80c3f02707e600fcef2010b33e90084bb1b8eb8edf9cef879f64cf60a4a4d9f8` |
| `rama_course_change` | `rama-course-change.png` | `exec-2c4c2b63-30a1-4213-b640-0b1580df61b0` | 1448 × 1086 | `9759c69985b0b4c1d01a55657b919c0cea7258790aa5a566119fabf2867735f6` |

The London final corrects original generation `exec-4caa1c72-d027-4d35-8bab-b9b5512e88b0`.
The four output-derived scenes persist for one presentation frame only; Text fallback remains intact.

## Full-Coverage Batch 2

Status: **production-approved**

Approval authority: user approval on 2026-08-30. OpenAI built-in image generation or editing
produced every file; Rosetta production and runtime copies are byte-identical.

| Canonical scene | Runtime file | Final generation id | Dimensions | SHA-256 |
|---|---|---|---|---|
| `alpha_stairway_climb` | `alpha-stairway-climb.png` | `exec-9b9c3bda-73df-4794-ab36-d4092300fbf4` | 1448 × 1086 | `aaea7c716fb36f1da5e897ccd7872d10e3e126fafac7e333c2d587edb3ec2762` |
| `central_plain_first_footing` | `central-plain-first-footing.png` | `exec-dd7056db-5b83-4b17-9250-18256565212d` | 1448 × 1086 | `c58c375c7347e9719a5de3c8f261f16dca2b5cf4e6fb807b58b2f147f1c35c0a` |
| `act_ii_voyage_years` | `act-ii-voyage-years.png` | `exec-47eb7856-de0b-468b-abce-f7b12c389bf5` | 1448 × 1086 | `0679aefae7bd1c8bd4a01a33bb8e74f045cdcc19abb8f793270bc569d64617e4` |
| `node_dock_family_revisit` | `node-dock-family-revisit.png` | `exec-c8dfc98f-d543-453e-8770-d4ffffc0cfd3` | 1448 × 1086 | `ba86861d05b95b46ec3da0f7dda67c9d2763483510d58831821a061e04d3b2a2` |
| `new_eden_gatehouse` | `new-eden-gatehouse.png` | `exec-d356085e-e517-4809-b168-b03420ff5477` | 1449 × 1086 | `9fb6148e6bae16debdfce607b37a7ab6754df6379f050eaf2b7ef273cb0b4056` |

The five mappings are derived presentation identities only. First arrival/farewell/rescue branches
retain priority, the save envelope is unchanged, and unavailable assets continue to fall back to Text.
The Node plate is a 4:3 extension; the Gatehouse final restores the closed curved habitat after a rejected blue-sky reframe.

## Final Full-Coverage Batch

Status: **production-approved**

Approval authority: user approval on 2026-08-31. OpenAI built-in image generation or editing
produced every file; Rosetta production and runtime copies are byte-identical.

| Canonical scene | Runtime file | Final generation id | Dimensions | SHA-256 |
|---|---|---|---|---|
| `service_dark` | `service-dark.png` | `exec-324bddaa-530e-49ac-8d2d-805cdb2028f4` | 1448 × 1086 | `77d880453bd95a11671a839c02122f1afbfddc64419af9977fcd2a12957489fe` |
| `twilight_in_the_lair` | `twilight-in-the-lair.png` | `exec-c775b104-f3b5-4dd2-abbf-7d7b5f1f6744` | 1448 × 1086 | `c2be554caa08e433e5400c6f917d22ed168c0d9925e0f355f1733987b9861086` |
| `postlude_inventory` | `postlude-inventory.png` | `exec-3993ab4d-7a82-4e70-9bba-29e551240814` | 1448 × 1086 | `77d270f96d2da7d646e037d8b8a25147d28905c5b78c5ba5312b79ec91998776` |

Service Dark is a narrowly state-derived escape location. Twilight and Postlude Inventory are
bounded output-derived beats that take precedence for one presentation frame only. The Postlude
finals supersede their initial generations: Falstaff is unmistakably mechanical, Richard remains
inside the enclosed banded lair, and only Nicole owns the scarf. Canonical Text fallback and the
schema-v2 save envelope remain unchanged.

## Act I continuity variants — 2026-09-16/17

Status: **production-approved** by the user on 2026-09-17 when approving the VGA Act I wrap.

Five same-era reference edits made using OpenAI's built-in image tool, one generation each.
Donor images are preserved. Runtime and Rosetta production copies are byte-identical to the
final generations. Approval comes from the user's review, not the production directory name.

| Context identity | Runtime file | SHA-256 |
|---|---|---|
| `biot_track_empty` | `biot-track-empty.png` | `b5d62d776dbeef6817da8749a3857a0d2bfdc15125570ca7b2fb4147d97184cd` |
| `medical_hut_recovery` | `medical-hut-recovery.png` | `edda611ce598a9e51b0edfa8fead390d52babf948a08f047887d21ff4e1dab09` |
| `camp_alpha_storm_damage` | `camp-alpha-storm-damage.png` | `7c47a4cbce31adf3e7d950e297911e2f651a7c3aa17929e67dec86ef376a5e6d` |
| `pit_rescue_cable` | `pit-rescue-cable.png` | `7d883796931ab2e1611ad54c6a503e129baf5242844f7152e10f6731f0a38f03` |
| `new_york_waterfront_withdrawal` | `new-york-withdrawal.png` | `a5661ba894ed6c6e972bef746ae1c1c62f4b8bc3054d7bf6c39c086402db46ba` |

All five outputs are 1448 × 1086. No post-generation image editing or asset overwrites.
Exact prompts, generation ids, source paths, donor hashes and canonical mappings:
[manifest](../../../assets/era-1994-act-one-continuity.json) and
[prompts](../../../../rosetta/art/prompts/era-1994-act-one-continuity.md).
Other Act I views reuse existing VGA assets; the previously unmapped First Shelter asset is now
used during the atomic closing sequence. No later-act artwork is added or changed.
