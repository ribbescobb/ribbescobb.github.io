"use strict";

(function installPackageCopy(global){
  function record(title,art,sections){
    return Object.freeze({
      title,
      art,
      sections:Object.freeze(sections.map(section=>Object.freeze({
        heading:section.heading||"",
        paragraphs:Object.freeze(section.paragraphs||[]),
        items:Object.freeze(section.items||[])
      })))
    });
  }

  const copy={
    "text:front":record(
      "CP/M Text Edition — front",
      "A restrained monochrome engraving frames Rama's impossible cylindrical interior.",
      [
        {heading:"Front-cover text",paragraphs:[
          "FICTION ARCHAEOLOGY SOFTWARE",
          "CP/M 2.2 · 64K · 5¼-INCH DISK",
          "RAMA",
          "AN INTERACTIVE NOVEL",
          "A COMPUTER NOVEL OF EXPLORATION AND DECISION",
          "EXPLORE · EXAMINE · QUESTION · DECIDE",
          "CP/M 2.2 · 64K · CAT. NO. FA-8101"
        ]}
      ]
    ),
    "text:back":record(
      "CP/M Text Edition — back",
      "A monochrome cylinder engraving and a green-phosphor transcript sit above a three-column instruction and feature layout.",
      [
        {heading:"CRT transcript",paragraphs:[
          "> LOOK",
          "ALPHA AIRLOCK — NORTHERN HUB",
          "A chamber the size of a chapel, cut into the axis of a world. Gravity here at the hub is barely a rumor.",
          "Exits: down."
        ]},
        {heading:"Enter an impossible world",paragraphs:[
          "A second Rama has entered the Solar System. It is an artificial cylinder fifty kilometers long: silent, ancient, and awake.",
          "You are Nicole des Jardins, physician and life-sciences officer of the Newton expedition. Cross the Alpha Airlock. Descend to the Central Plain. Examine strange machines, question your companions, and decide what humanity will carry home.",
          "RAMA is explored in prose. The screen supplies the words; your imagination supplies the world.",
          "Every location is described in careful detail, from human camps to the black Cylindrical Sea."
        ]},
        {heading:"Type what Nicole should do",paragraphs:[
          "RAMA understands short commands in ordinary English. Move by direction, inspect your surroundings, speak with other explorers, handle objects, and consult your inventory."
        ],items:["LOOK","EXAMINE STAIRWAY","TALK TO RICHARD","INVENTORY","DOWN","SAVE"]},
        {heading:"Command support",paragraphs:[
          "The program describes each result and remembers your decisions. SAVE records your voyage; LOAD returns you to it later. No special controller is required — only the keyboard and your curiosity.",
          "THINK reviews Nicole's goals. HINT offers direction without changing the score — because there is none."
        ]},
        {heading:"The voyage remembers",paragraphs:[
          "Discoveries and decisions alter the expedition. Events continue as Nicole explores. Some questions have more than one answer; some journeys have more than one ending.",
          "No reflexes. No score. The machine supplies the text. You supply the judgment.",
          "Play for a few discoveries at a time, then return to the same voyage when you are ready to continue."
        ],items:[
          "Complete parser-driven adventure",
          "Rich descriptions and characters",
          "Story puzzles and multiple paths",
          "Save and resume at any time",
          "Four possible conclusions",
          "No graphics required"
        ]},
        {heading:"System requirements",paragraphs:[
          "CP/M 2.2 · 64K RAM",
          "ONE 5¼-INCH DISK DRIVE",
          "MONOCHROME DISPLAY · KEYBOARD"
        ]},
        {heading:"Product information",paragraphs:[
          "FICTION ARCHAEOLOGY SOFTWARE",
          "RAMA ADVENTURE SYSTEM",
          "CATALOG FA-8101 · © 1982",
          "A COMPLETE INTERACTIVE NOVEL FOR ONE PLAYER",
          "PROGRAM DISK · SAVE AND RESUME · COMMAND REFERENCE ON SCREEN",
          "DESIGNED FOR DELIBERATE EXPLORATION",
          "NOT REFLEX PLAY",
          "FICTION ARCHAEOLOGY SOFTWARE · CATALOG FA-8101 · PRINTED IN U.S.A."
        ]}
      ]
    ),
    "illustrated:front":record(
      "Illustrated Adventure Edition — front",
      "A colorful painted view of Rama's interior is presented inside an early home-computer software package.",
      [
        {heading:"Front-cover text",paragraphs:[
          "APPLE II · COMMODORE 64",
          "RAMA",
          "NOW WITH COMPUTER ILLUSTRATIONS",
          "ILLUSTRATED ADVENTURE EDITION",
          "48K · COLOR DISPLAY · DISK"
        ]}
      ]
    ),
    "illustrated:back":record(
      "Illustrated Adventure Edition — back",
      "Sparse line-art game views and product copy occupy a cream, red, black, and yellow early-adventure package.",
      [
        {heading:"Now Rama can be seen",paragraphs:[
          "A NEW DIMENSION IN COMPUTER ADVENTURE",
          "The complete RAMA interactive novel returns with sparse computer illustrations illuminating decisive moments of discovery. The pictures suggest; you still build the world.",
          "Question companions, examine alien machines, solve puzzles and carry one voyage between editions."
        ]},
        {heading:"Features",items:[
          "Parser and prose remain primary",
          "Three illustrated opening-arc moments",
          "Period machine sound",
          "Save, resume and continue your voyage"
        ]},
        {heading:"The computer shows a fragment",paragraphs:[
          "Each picture uses the limited visual language of an early illustrated adventure. Unpictured locations continue in text."
        ]},
        {heading:"Illustrated scenes",items:[
          "ALPHA AIRLOCK",
          "CYLINDRICAL SEA",
          "BIOT PROCESSION"
        ]},
        {heading:"Machine catalog",items:[
          "Silent machines cross the plain",
          "Seen once; never repeated",
          "Story state chooses the moment",
          "No new action is introduced"
        ]},
        {heading:"System and catalog",paragraphs:[
          "APPLE II / COMMODORE 64",
          "48K · COLOR · DISK",
          "FICTION ARCHAEOLOGY",
          "FA-8502 · © 2026",
          "ONE WORLD · TWO COLORS · YOUR IMAGINATION"
        ]}
      ]
    ),
    "era-1989:front":record(
      "1989 Adventure System — front",
      "A tiny Nicole faces an elegant alien presence beneath the impossible upward-curving world of Rama in a premium late-1980s painted composition.",
      [
        {heading:"Front-cover text",paragraphs:[
          "IBM PC & COMPATIBLES",
          "RAMA",
          "THE WORLD INSIDE THE MACHINE",
          "NEW!",
          "16-COLOR EGA GRAPHICS",
          "1989 ADVENTURE SYSTEM",
          "A COMPLETE GRAPHICAL PARSER ADVENTURE",
          "ADLIB · PC SPEAKER · KEYBOARD"
        ]}
      ]
    ),
    "era-1989:back":record(
      "1989 Adventure System — back",
      "A blue-and-parchment box presents three actual EGA game scenes: the Biot Procession, Raman Dawn, and Octospider Sanctuary. A centered EGA medallion accompanies Fiction Archaeology's own printed name.",
      [
        {heading:"RAMA",paragraphs:[
          "THE WORLD INSIDE THE MACHINE",
          "1989 ADVENTURE SYSTEM"
        ]},
        {heading:"The greatest mystery is alive.",paragraphs:[
          "An artificial world fifty kilometers long has entered the Solar System.",
          "As Nicole des Jardins, cross its silent plains, follow impossible machines, and face intelligences no human has ever known.",
          "Every discovery asks more of you. Every decision leaves its mark."
        ]},
        {heading:"Three scenes from the EGA Edition",items:[
          "BIOT PROCESSION",
          "RAMAN DAWN",
          "OCTOSPIDER SANCTUARY"
        ]},
        {heading:"Command the expedition",paragraphs:[
          "Type ordinary English. Examine the world.",
          "Question companions. Solve its puzzles.",
          "Your curiosity supplies the next move."
        ]},
        {heading:"The voyage remembers",paragraphs:[
          "Your choices shape the journey.",
          "Save whenever you need to stop.",
          "Return to the voyage you left behind."
        ]},
        {heading:"System requirements",paragraphs:[
          "IBM PC & COMPATIBLES · DOS 3.2+ · 512K · EGA/VGA",
          "5.25-INCH OR 3.5-INCH DISK · ADLIB / PC SPEAKER"
        ]},
        {heading:"Package seal and imprint",paragraphs:[
          "NEW!",
          "16-COLOR EGA GRAPHICS",
          "A COMPLETE GRAPHICAL PARSER ADVENTURE",
          "FICTION ARCHAEOLOGY",
          "THE FICTION IS THE CONSTANT. THE MACHINE IS THE VARIABLE.",
          "FA-8903 · © 2026 · PRIVATE FAN PROJECT"
        ]}
      ]
    ),
    "era-1994:front":record(
      "VGA Adventure Edition — front",
      "A painted first-contact tableau: tiny Nicole meets an alien intelligence beneath the curving interior of Rama and an immense luminous structure. Ornate blue-and-gold printing carries a sweeping dimensional title. This is interpretive package art, not a game scene.",
      [
        {heading:"Front-cover text",paragraphs:[
          "RAMA",
          "ENTER THE CYLINDER",
          "IBM PC COMPATIBLE",
          "VGA ADVENTURE EDITION",
          "256 COLOR VGA",
          "FICTION ARCHAEOLOGY"
        ]}
      ]
    ),
    "era-1994:back":record(
      "VGA Adventure Edition — back",
      "The blue-and-gold painted masthead crowns a bright cream back with generous sales lettering, a centered VGA banner and three actual VGA scene reproductions.",
      [
        {heading:"Enter the cylinder",paragraphs:[
          "IBM PC COMPATIBLE · RAMA · ENTER THE CYLINDER",
          "THE UNIVERSE HAS OTHER IDEAS.",
          "A sea climbs into the sky. Cities hang above your head.",
          "And somewhere in this world, something is waiting to meet you.",
          "As Nicole des Jardins, explore the vast machine called Rama.",
          "Listen to its inhabitants. Discover what it means to be human."
        ]},
        {heading:"256 COLOR VGA",paragraphs:[
          "A NEW DEPTH OF DISCOVERY"
        ]},
        {heading:"Featured scenes",items:[
          "RAMAN DAWN",
          "OCTOSPIDER SANCTUARY",
          "THE NODE OBSERVATORY",
          "THREE SCENES FROM THE VGA EDITION"
        ]},
        {heading:"An adventure of ideas",paragraphs:[
          "Explore in ordinary English.",
          "Question. Examine. Solve. Decide.",
          "The next discovery belongs to you."
        ]},
        {heading:"Your voyage continues",paragraphs:[
          "Save your place whenever you wish.",
          "Return on this machine — or another.",
          "The world remembers your choices."
        ]},
        {heading:"System and catalog",paragraphs:[
          "THE 1994 MACHINE",
          "MS-DOS 5.0+ · 4MB RAM · VGA · HARD DISK · KEYBOARD",
          "ADLIB / SOUND BLASTER · A GRAPHICAL PARSER ADVENTURE",
          "FICTION ARCHAEOLOGY",
          "FA-9404 · © 2026 · PRIVATE NONCOMMERCIAL FAN PROJECT"
        ]}
      ]
    )
  };

  global.RamaPackageCopy=Object.freeze(copy);
})(globalThis);
