/* =====================================================================
   RAMA — a single-file parser interactive fiction
   Systems: state · world · parser · verbs · conversation · events ·
            hints · persistence · ui
   ===================================================================== */
"use strict";

/* ---------- output buffer (DOM-independent core) ---------- */
const BUF = [];
function out(t){ if(t==null||t==="") return; BUF.push({k:"p", t}); }
function val(v){ return typeof v==="function" ? v() : v; }
function outSys(t){ BUF.push({k:"sys", t}); }
function outAlert(t){ BUF.push({k:"alert", t}); }
function outTitle(t){ BUF.push({k:"room", t}); }
function outAct(num,name){ BUF.push({k:"act", num, name}); }
function outFin(t){ BUF.push({k:"fin", t}); }
