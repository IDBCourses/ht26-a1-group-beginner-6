/*
 * IDB Programming: A1 Modelling — a musical instrument
 *
 * All of the code for your instrument goes in this file. It's split into sections:
 *   settings — the "fixed" parts of your program
 *   state    — the parts of your program that change over time
 *   sound    — the Tone.js instruments and effects
 *   update   — updates the state every 100ms, if necessary
 *   use      — applies the state to make sound every 100ms, if necessary
 *   controls — what happens when a key goes down or comes up
 *   setup    — starts everything
 *
 * There is no loop in this assignment. Nothing happens until the player presses
 * a key, and every key event follows the same two steps:
 *   1. update: change the state, based on which key it was
 *   2. use:    make sound from the state
 *
 * Tone.js documentation: https://tonejs.github.io/docs/15.1.22/
 */

// ---------- Settings ----------
// Settings variables should contain all of the "fixed" parts of your programs
 // we used a variable that holds an object to map the keys to the notes
const notes= {
   d : "E2",
   f : "A2",
   g : "D3",
   h : "G3"
}
// ---------- State ----------
// State variables are the parts of your program that change over time.
// For example: which octave you're playing in, or whether a drone is on.

// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
//author: at2799
const reverb = new Tone.Reverb(2).toDestination();// 2 s of delay in the echo
const synth = new Tone.PolySynth(Tone.FMSynth).connect(reverb);

synth.set({
  harmonicity: 3.01,
  modulationIndex: 10,
  oscillator: { type: "sine" },
  envelope: {
    attack: 0.01,
    decay: 1,
    sustain: 0.1,
    release: 1,
  },
  modulation: { type: "square" },
  modulationEnvelope: {
    attack: 0.01,
    decay: 0.5,
    sustain: 0.1,
    release: 0.5,
  },
  volume: -10,
});
// ---------- Update ----------
// Update the state. This is called every 100ms.
function update() {
  // Example: replace this with your own instrument.

  setTimeout(update, 100); // call update() again in 100 milliseconds
}

// ---------- Use ----------
// Use the state to make sound. This is called every 100ms.

function playNote(key) {
  const note = notes[key];

  //author: at2799
  // Add a new string object into our active list  where we add the properties of the note
  activeStrings.push({
    key: key,
    baseNote: note,
    currentNote: note,
    fret: 0,
    fretKeys: new Set(),// create a new set/ list  for the fretkeys
    lastSwipe: Date.now(),
  });

  synth.triggerAttack(note);

  console.log("Playing:", key.toUpperCase(), "Fret: 0");
}
// ---------- Controls (Event Handlers) ----------
// Runs every time a key goes down.
function keyDown(event) {
  const key = event.key.toLowerCase();
  // Escape stops every note immediately
 if (key === "escape") {
    synth.releaseAll();
    activeStrings = [];
    heldKeys = [];

    console.log("All notes stopped");
    return;
  }


  // Holding a key down sends keydown again and again. Only react to the first one.
  let isHeld = false;
  for (let i = 0; i < heldKeys.length; i++) {
    if (heldKeys[i] === key) {// check if we are holding the key to prevent repeat
      isHeld = true;
      break;
    }
  }
  if (isHeld) return;// if held ignore it
   // Add key to our held list
  heldKeys.push(key);

  // Check if this key is already playing in activeStrings using a simple loop
  let isAlreadyPlaying = false;
  for (let i = 0; i < activeStrings.length; i++) {// it tracks the current notes that are playing or ringing
    if (activeStrings[i].key === key) {
      isAlreadyPlaying = true;
      break;
    }
  }

  // Start a guitar note if D, F, G or H is pressed
  if (notes[key] && !isAlreadyPlaying) {// checks if the key is pressed and if the note is not already playing
    Tone.start();
    playNote(key);
  }
}








// Runs every time a key comes up.
function keyUp(event) {
  console.log("Key up:", event.key);

  // Example: replace this with your own instrument.
  if (event.key === exampleKey) {
    synth.triggerRelease(exampleNote, Tone.now());
  }
}

// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  update(); // start the update loop
  use(); // start the use loop

  // Put your event listener code here
  window.addEventListener("keydown", keyDown);
  window.addEventListener("keyup", keyUp);
}

setup(); // Always remember to call setup()!
