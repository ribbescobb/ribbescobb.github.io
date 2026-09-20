# 1989 Early Access Asset Provenance

Status: **bounded Early Access horizontal-slice assets; not final full-edition production art**

## Launch title screen

- Runtime file: `launch-screen.png`
- Production source: `rosetta/art/production/early-access/era-1989-title-screen.png`
- Source/runtime SHA-256: `1e1552ea82c2e35a9a764d7cb1d5efc15acfaf2d5da085c09cf1fd7bd1ae3b79`
- Tool: OpenAI built-in image generation
- Prompt record: `rosetta/art/prompts/four-era-early-access.md`
- Approval: production-quality asset for the bounded Early Access launch moment only
- Post-process: centered crop of the generated 1536×1024 image to a 1364×1023 4:3 frame

This title background communicates the 1989 software-release experience. It is not a canonical
scene and carries no room, puzzle, or state information.

## Alpha Airlock plate

- Runtime file: `alpha-airlock.png`
- Production source: `rosetta/art/production/early-access/era-1989-alpha-airlock.png`
- Source/runtime SHA-256: `b46d3e3dcf5d8541164e0bbabd2c538867756343bb98e79c2b86ab2f2a860ce7`
- Tool: OpenAI built-in image generation
- Prompt record: `rosetta/art/prompts/four-era-early-access.md`
- Approval: production-quality asset for the bounded Alpha Airlock scene only
- Canonical scene mapping: `alpha_airlock_first_arrival`

Every other location deliberately uses canonical Text presentation. The asset does not introduce
walk paths, hotspots, puzzle information, or room-specific story logic. The launch and Alpha files
are intentionally distinct production assets.

## Boot audio

- Runtime file: `era-1989-boot.wav`
- Rosetta source: `rosetta/audio/boot/era-1989_beep-disk.wav`
- Source/runtime SHA-256: `bd948849b8caf5d34e5cd8152ca6cf07f208d2fcc11967434fcd8987db7a1140`
- Status: prototype audio promoted only for the skippable Early Access boot ritual

The audio now accompanies a distinct DOS/EGA presentation: physical PC switch-on, bounded CRT flash,
`A:\>RAMA`, voyage-disk activity, palette read, and F-key program title. The binary did not change and
is still prototype audio staged for review, not validated.

No asset authorizes broad 1989 production.

## Act I chronological production batch — dawn through shaft

Status: **production-approved**

Approval authority: user approval on 2026-08-27. All files were generated with OpenAI built-in image
generation and promoted byte-for-byte into Rosetta production storage and this runtime directory.

| Canonical scene | Runtime file | Generation id | Dimensions | SHA-256 |
|---|---|---|---|---|
| `raman_dawn` | `raman-dawn.png` | `exec-11cb48cb-dcee-4d50-b206-7b6e585b8363` | 1586 × 992 | `17187a99fdc8bb5b9e9bed59d13f6abf568b1c1976d9c112b24f0072f247f396` |
| `new_york_waterfront` | `new-york-waterfront.png` | `exec-0cc8a2d4-2ce3-40a8-9a0e-f0d219100d4c` | 1586 × 992 | `b62a4a853e6fb30c3dc0be0a4203ec537a5a4bbcb9e7b0e1231ed93d2fb8c83c` |
| `octahedron_plaza` | `octahedron-plaza.png` | `exec-9f2f8d94-5412-47eb-b3d4-7e0bc56e7210` | 1448 × 1086 | `be6012f0a1416a1106ca4cc22184214c44834b55ebc824e1643ff2e80be731a3` |
| `latticed_way_shaft` | `latticed-way-shaft.png` | `exec-c91009ca-3c75-4ffb-b824-bf3be8a07cc8` | 1448 × 1086 | `f51f75b23259a3737ceb491f156fac220eabd28b027729014d882585e8ddf11f` |

The two wider native outputs are deliberately retained and use the renderer's existing
aspect-preserving contain fit. Rosetta sources use the same filenames under
`rosetta/art/production/era-1989/`; prompt records use `<scene-slug>__era-1989.md`.

## Pit and Lair chronological production batch

Status: **production-approved; First Shelter prepared registry-only**

| Canonical scene | Runtime file | Generation id | Dimensions | SHA-256 |
|---|---|---|---|---|
| `the_pit_stranded` | `the-pit-stranded.png` | `exec-519b3a20-8ac1-4fa8-86f0-4501f25e5919` | 1402 × 1122 | `9f24651cf49af35044a2b518cfd1a4a13ac84eff609c62f8ba5885e88856f872` |
| `lair_first_shelter` | `lair-first-shelter.png` | `exec-ad6d1475-570c-415b-b87c-a8581b0a3fb5` | 1448 × 1086 | `7484ccc33267b4237964b121716fc772fac6adc410990ec910420a48003dd9c9` |
| `lair_family_home` | `lair-family-home.png` | `exec-7e3b7e74-5bc9-4899-89c6-8480486c192d` | 1448 × 1086 | `8ec7020fa85f56b075283d230a2fc589703cab6b1d7dc62d5ca231c9d3f31466` |

All three use OpenAI built-in image generation and byte-identical Rosetta/runtime copies. The Pit
and Family Home are live identity mappings. First Shelter remains registry-only and unmapped.

## Act II Sirius, Avian, and Node arrival production batch

Status: **production-approved**

| Canonical scene | Runtime file | Generation id | Dimensions | SHA-256 |
|---|---|---|---|---|
| `atrium_sirius_revealed` | `atrium-sirius.png` | `exec-2e27cf42-c4ad-4d6f-a7c0-85a10cbab1fa` | 1448 × 1086 | `debd656b7747cb2018f3d985ee61a4a33d509d66f84d7bff599a0cd01051512a` |
| `avian_vertical` | `avian-vertical.png` | `exec-60eb1bcb-949b-4724-836a-8034038eb31d` | 1402 × 1122 | `18bd66354cf9415efb8e3aad983c6ed5ec8437267e191da5232ce4de1a961b0e` |
| `node_arrival_hangar` | `node-arrival-hangar.png` | `exec-89df4bd3-6e10-4269-b220-2f4478f1b6ca` | 1448 × 1086 | `b05a85f3a88386bbb979bd6b8ea86f79eb43f9167bb77b434c66fc5d32691954` |

All three use OpenAI built-in image generation and byte-identical Rosetta/runtime copies. Mapping
is limited to the three canonical scene identities and preserves canonical Text fallback.

## Act II Node interiors production batch

Status: **production-approved**

OpenAI built-in image generation produced all three candidates. Each final file was copied
byte-for-byte into Rosetta production staging and this runtime directory.

| Canonical scene | Runtime file | Generation id | Dimensions | SHA-256 |
|---|---|---|---|---|
| `node_hall_eagle` | `node-hall-eagle.png` | `exec-78f118d6-7d49-474a-88c7-82ab9bc23412` | 1448 × 1086 | `8ff661440095374175bfbdb386b946c2106ada050171b8ea6b208171de78c8b1` |
| `node_observation_sirius` | `node-observation.png` | `exec-6a0a601c-a956-4615-ae94-8513feec8ef3` | 1448 × 1086 | `abda9be0ff3a0af0e78ad6fd004f611fa8bd25c9cc064161fb9da5310f15c7eb` |
| `design_atelier_new_eden` | `design-atelier.png` | `exec-cc7bff27-1d78-4c83-b0e3-06eab4d5662b` | 1448 × 1086 | `263978de5530e6fba8ef1157221108307a710668471ff4ca8bb72410f6855e51` |

Every mapping consumes canonical scene identity only and falls back to Text if the identity or
binary is unavailable.

## Act III through Postlude five-scene candidate batch

Status: **production-approved**

| Canonical scene | Runtime file | Generation id | Dimensions | SHA-256 |
|---|---|---|---|---|
| `new_eden_plaza` | `new-eden-plaza.png` | `exec-dae2b894-125c-4d2b-bbc6-4b8e3037db1a` | 1448 × 1086 | `26910a90fbd4db22e7a1d510d372555233fba8a08ac6c41b757e06e333924b48` |
| `eden_clinic_ward` | `eden-clinic-ward.png` | `exec-03669c69-3cf8-4ddc-8703-968d0a22bcd7` | 1448 × 1086 | `aa7484582f6021fd4beb85e36ed70bd4483ab9c99abd7ab3f3f49324fe8ac1f6` |
| `assembly_hall_election_eve` | `assembly-hall-election-eve.png` | `exec-e327413a-1061-4690-bc7b-fa6f94a161bb` | 1448 × 1086 | `614bc95eed3ef8a378142401196d1e4fe82976bfe5713362374d97c5acea91ca` |
| `lair_sanctuary_octospiders` | `lair-sanctuary-octospiders.png` | `exec-7367341e-7145-4d28-b0bc-97d00837966c` | 1448 × 1086 | `9640609ea11d112bbbd1984a178822f6e0011c180ec31b8cf22af39cbb0f3dc6` |
| `threshold_of_light` | `threshold-of-light.png` | `exec-91a46112-c156-453a-bb6f-b4fd25df6f69` | 1448 × 1086 | `aaab96dc845cfb9710c27bdbc262b72edc149bd2a521174b7ef2d6bf6b41f780` |

The Clinic final is a surgical correction of rejected generation
`exec-2ae45d6d-6cd2-4611-984b-6dd675a6d9e4`, which had seven rather than eight patients. The final
keeps twelve beds and fills only the designated fourth back-row bed. All mappings fall back to Text.

## Act I Essential coverage backfill

Status: **production-approved**

| Canonical scene | Runtime file | Generation id | Dimensions | SHA-256 |
|---|---|---|---|---|
| `descent_to_central_plain` | `descent-central-plain.png` | `exec-c25809e4-4726-4a41-8d9a-177f4c5cddc6` | 1448 × 1086 | `5c4e6f61b9d2cd6b218bb9e2238001db75e06096f8f6b933d91f72fc280803ab` |
| `camp_alpha_survey_assignment` | `camp-alpha-survey.png` | `exec-889048a9-dadd-4725-8de2-6b76ffbba633` | 1448 × 1086 | `63c16636ecd0d55f6ae47305220b9639553492a06de6c00d4f7125116f9e4a68` |
| `biot_procession_first_encounter` | `biot-procession.png` | `exec-48104d39-8535-433f-9468-50cd91f46202` | 1448 × 1086 | `b7364656d9296e5d6d3d66a08b8e745b05846214962d41510941fa4a32778af9` |
| `borzov_medical_emergency` | `borzov-emergency.png` | `exec-b00e02bb-e082-4513-b63e-0ea8139bbfb7` | 1448 × 1086 | `8f672b97ea3031406a1ee01bf053f4ef588619990bfa1086eea0460d86086f61` |
| `cylindrical_sea_first_reveal` | `cylindrical-sea.png` | `exec-e3fd12d0-1007-4cc6-804c-1e4ed8a47780` | 1447 × 1087 | `2bc8188a4dd441faa354fa020f5505a649b878f79e63d09b38bcc59a37186809` |

All five use OpenAI built-in image generation and byte-identical Rosetta/runtime copies. The Sea
plate used the approved 1989 Rosetta reference as an era-style and atmosphere reference only. Each
mapping consumes canonical scene identity and preserves Text fallback.

## First Desirable scene batch

Status: **production-approved**

Approval authority: user approval on 2026-08-29. All files use OpenAI built-in image generation and
byte-identical Rosetta/runtime copies.

| Canonical scene | Runtime file | Final generation id | Dimensions | SHA-256 |
|---|---|---|---|---|
| `london_sealed_city` | `london-sealed-city.png` | `exec-801f8cac-0142-4ef0-958f-7ebee1eecc86` | 1448 × 1086 | `7fb269c0fcb0e215312a7da92302206fc8a38a84327b21fa0faeb55f70414434` |
| `pit_falstaff_contact` | `pit-falstaff-contact.png` | `exec-87c6f73a-535c-4474-aa0d-d4dcacb5cad5` | 1448 × 1086 | `ff36d30b9fef0ece35b0532a10b8f51b5f8ae0016a8499a36c7c67222876b55a` |
| `camp_alpha_ruins` | `camp-alpha-ruins.png` | `exec-4a0c2fd4-db49-4acf-98fe-de75c157dc1d` | 1448 × 1086 | `97e0d0e079b6a4b76aaad3e71a727a0e1b406c747c992ba349992949ab579138` |
| `beta_shore_skiff_return` | `beta-shore-skiff-return.png` | `exec-84257fb4-a907-480b-aeb1-05e03d9b7039` | 1448 × 1086 | `aff011d5a08a70586230d6a5c53c2ff2697ba2770aef3bea44910269fcdbfd1f` |
| `tailors_room` | `tailors-room.png` | `exec-8c462a67-26a1-40fe-8e60-73d4c2b4f821` | 1449 × 1086 | `03ac7f1d63326086de473aad9429c4ad852e0353e5d37cb613dbb477096dd90c` |

The Tailor's Room final removes accidental gallery furnishings from generation
`exec-5d5b5c52-94f3-4303-8fe0-dc3c51839711`. All five mappings use derived canonical identities
and preserve Text fallback.

## Second Desirable scene batch

Status: **production-approved**

Approval authority: user approval on 2026-08-29. The file uses OpenAI built-in image generation
and byte-identical Rosetta/runtime copies.

| Canonical scene | Runtime file | Final generation id | Dimensions | SHA-256 |
|---|---|---|---|---|
| `assembly_hall_trial` | `assembly-hall-trial.png` | `exec-9ed6b803-d6db-40ca-a9b7-0da9f5566521` | 1448 × 1086 | `8ce072d8b9c9861ded649f5dd176ba31696867f31d73a7358559d650e8a48a50` |

The election-eve plate supplied room and era continuity only; the trial is distinct production art.
It shows neither statement choice nor verdict. The mapping consumes derived canonical identity and
preserves Text fallback.

## Final Desirable scene batch

Status: **production-approved**

Approval authority: user approval on 2026-08-29. Both files use OpenAI built-in image generation
and byte-identical Rosetta/runtime copies.

| Canonical scene | Runtime file | Final generation id | Dimensions | SHA-256 |
|---|---|---|---|---|
| `katie_lost_vertical` | `katie-lost-vertical.png` | `exec-6c781398-2759-40c7-8fc4-85f231b71b0e` | 1448 × 1086 | `64de87c568725a86a67b18c4caa3a287b9171f275e241372c8e565cde55a79d5` |
| `node_farewell` | `node-farewell.png` | `exec-edfac0b0-93b8-4cac-9091-171375985b8a` | 1448 × 1086 | `a14d98e02b6b963e2b1cd569442140852fb20ebfabb2591570c7fa67009738ab` |

The ordinary Vertical and Node-arrival plates supplied spatial and era continuity only. Farewell
generation `exec-87a15902-8436-4176-8e67-78da3e32563f` was rejected for an incorrect mechanical
Eagle and oversized paper. The finals reveal neither Katie's rescue nor the drawing's content.

## Full-Coverage Batch 1

Status: **production-approved**

Approval authority: user approval on 2026-08-30. OpenAI built-in image generation produced all five
files; Rosetta production and runtime copies are byte-identical.

| Canonical scene | Runtime file | Final generation id | Dimensions | SHA-256 |
|---|---|---|---|---|
| `medical_hut_quiet` | `medical-hut-quiet.png` | `exec-01e61680-cb4e-4587-94ae-0b5cd6d33977` | 1448 × 1086 | `77cc5a5cdc3b6d2b01781bd71213fdc661fa5624196fb71d41247fd9343ca597` |
| `london_factory_reveal` | `london-factory-reveal.png` | `exec-7fbcac43-9896-4761-af83-6c1882920f8a` | 1448 × 1086 | `e675039d564c3f70504b19480651bc866de21b6c435c3d8c7f4971cc08ce5f1b` |
| `resolution_crossing` | `resolution-crossing.png` | `exec-3a5dbf4e-57e5-4a75-809a-d966bd9e401c` | 1448 × 1086 | `dbaf3e850b868b6c2a5fe7e90789f013d38a36176945486e542f08ba67dca7f4` |
| `new_york_narrow_ways` | `new-york-narrow-ways.png` | `exec-88fa8c57-7290-4df3-9000-897047b14624` | 1448 × 1086 | `864b19e228b6a0328f6fac36bfd62e1a6cbe3edf914fb057436cd579abe15cc0` |
| `rama_course_change` | `rama-course-change.png` | `exec-6e325b66-f6f3-44c1-bfef-ecc35db2cf08` | 1448 × 1086 | `571c3f29beda6486fcae8ab409e5ddf9c0ce07d59178a1515df9adf669de616f` |

The four output-derived scenes persist for one presentation frame only; canonical Text fallback
remains intact.

## Full-Coverage Batch 2

Status: **production-approved**

Approval authority: user approval on 2026-08-30. OpenAI built-in image generation or editing
produced every file; Rosetta production and runtime copies are byte-identical.

| Canonical scene | Runtime file | Final generation id | Dimensions | SHA-256 |
|---|---|---|---|---|
| `alpha_stairway_climb` | `alpha-stairway-climb.png` | `exec-8988eb7c-4ba9-494e-a614-1deb520c3291` | 1448 × 1086 | `35f8ab1caeb421684e30d019e5b364fce1e117919ce1c1691460f3f95490f293` |
| `central_plain_first_footing` | `central-plain-first-footing.png` | `exec-41359a50-0a0f-4929-86c7-03b4be5f7b64` | 1448 × 1086 | `d07bf0f5fab00008c98fdf4db39d03f80e2566aa068b5d0b951670d3e306186e` |
| `act_ii_voyage_years` | `act-ii-voyage-years.png` | `exec-f4103e04-9745-4a24-9cff-5faf9b42febe` | 1448 × 1086 | `fbbe9eaf1c030fcaf281e8589f9e7212ce112c14e8e03b4f2515582ff22f9a16` |
| `node_dock_family_revisit` | `node-dock-family-revisit.png` | `exec-e0ec0cb6-6c6b-4318-9018-f67910bd3a23` | 1448 × 1086 | `7dc3bc428810dc4db404eb5d6d684cc07d3b318b312d9e33a0bfaebd9c72f71e` |
| `new_eden_gatehouse` | `new-eden-gatehouse.png` | `exec-88a717fe-1519-404b-8c79-fcdefa1840bc` | 1448 × 1086 | `aea21372decfb0872f43d69afde108f00f1e3ce33f34fe69224d87d063a0a604` |

The five mappings are derived presentation identities only. First arrival/farewell/rescue branches
retain priority, the save envelope is unchanged, and unavailable assets continue to fall back to Text.
The Central Plain final removes star-like specks from the rejected original.

## Final Full-Coverage Batch

Status: **production-approved**

Approval authority: user approval on 2026-08-31. OpenAI built-in image generation or editing
produced every file; Rosetta production and runtime copies are byte-identical.

| Canonical scene | Runtime file | Final generation id | Dimensions | SHA-256 |
|---|---|---|---|---|
| `service_dark` | `service-dark.png` | `exec-c02f7fe6-cd65-4d01-b968-ccd60fdd31ca` | 1448 × 1086 | `d2cdc525aea603c5d1ff553e0d0e656b01982bf09d5a05a2171a9d0cc0ef75e1` |
| `twilight_in_the_lair` | `twilight-in-the-lair.png` | `exec-4e861d77-0e85-45e4-b16a-95920a0448f9` | 1448 × 1086 | `3a4c5d29588138efa8b61de6b4f2d81e0c7019b6769149dd00aea2af08f4c6db` |
| `postlude_inventory` | `postlude-inventory.png` | `exec-0932f2c2-0d79-4659-97e8-bf25a3a11dd8` | 1448 × 1086 | `d3be219af08d09c4bdaf6e05ce0a8e0003c1b83c55903fcba91a572257b287ce` |

Service Dark is a narrowly state-derived escape location. Twilight and Postlude Inventory are
bounded output-derived beats that take precedence for one presentation frame only. The Postlude
finals supersede their initial generations: Falstaff is unmistakably mechanical, Richard remains
inside the enclosed banded lair, and only Nicole owns the scarf. Canonical Text fallback and the
schema-v2 save envelope remain unchanged.

## Act I continuity variants — 2026-09-15/16

Status: **implemented candidates awaiting user review**, not production-approved.

Five same-era edits made with OpenAI's built-in image tool. Approved donor images are preserved.
Runtime files and `rosetta/art/production/era-1989/` copies are byte-identical to final generations.
The production directory is an archive location, not an approval state.

| Context identity | Runtime file | SHA-256 |
|---|---|---|
| `biot_track_empty` | `biot-track-empty.png` | `3fc9a4541bf97d222982f0127f89565fd1ebf977103d3525b0d5c34a52cff202` |
| `medical_hut_recovery` | `medical-hut-recovery.png` | `b7485526595cccf78d02a5a780cb4f103a307c19cd666fab19a45c6f50498de2` |
| `camp_alpha_storm_damage` | `camp-alpha-storm-damage.png` | `9e28483495df8c2ce1757f0ad45b3915c341e49d681f26d2d35867f634f79b3a` |
| `pit_rescue_cable` | `pit-rescue-cable.png` | `d72900d0b87d26a4d410b83128b873a8b135e4d65f00e4e0e166f60b6292ac91` |
| `new_york_waterfront_withdrawal` | `new-york-withdrawal.png` | `b342e61622b849cbad8cf6b245128d61dc343d0acb88c1a20737e44c3d7dc327` |

The camp's first candidate read too much like open sky. One targeted revision restored a curved
enclosing machine wall. No additional scene coverage was generated. Pit dimensions are 1402 × 1122;
the other four are 1448 × 1086. Whole-image fitting preserves every composition.

Exact prompts, final generation ids, source paths, donor hashes, revision input hash, and dimensions:
[manifest](../../../assets/era-1989-act-one-continuity.json),
[prompts](../../../../rosetta/art/prompts/era-1989-act-one-continuity.md).
All other Act I contexts reuse existing EGA assets, including both stair viewpoints and the
previously unmapped First Shelter image. No existing image was overwritten.
