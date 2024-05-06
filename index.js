const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const url = 'https://lil-alchemist.fandom.com/wiki/Card_Combinations/All_Combinations';
const generalCardUrl = 'https://lil-alchemist.fandom.com/wiki/'

const myDeck = [
  'Angel',
  'Angel',
  'Angel',
  'Ash',
  'Ash',
  'Ash',
  'Bat',
  'Bat',
  'Bat',
  'Chinchilla',
  'Chinchilla',
  'Chinchilla',
  'Cursed',
  'Death',
  'Death',
  'Death',
  'Demon',
  'Demon',
  'Demon',
  'Dragon',
  'Dragon',
  'Dragon',
  'Earth',
  'Earth',
  'Earth',
  'Elf',
  'Elf',
  'Elf',
  'Fairy',
  'Fairy',
  'Fairy',
  'Fire',
  'Fire',
  'Fire',
  'Golem',
  'Golem',
  'Golem',
  'Hammer',
  'Hammer',
  'Hammer',
  'Holy Water',
  'Holy Water',
  'Holy Water',
  'Horse',
  'Horse',
  'Horse',
  'Human',
  'Human',
  'Human',
  'Knight',
  'Knight',
  'Knight',
  'Knowledge',
  'Leader',
  'Magic',
  'Magic',
  'Magic',
  'Metal',
  'Metal',
  'Metal',
  'Pocket Pet',
  'Poison',
  'Poison',
  'Poison',
  'Prehistoric',
  'Prehistoric',
  'Radiation',
  'Radiation',
  'Radiation',
  'Rainbow',
  'Rainbow',
  'Rainbow',
  'Snake',
  'Snake',
  'Snake',
  'Sun',
  'Sun',
  'Sun',
  'Superhero',
  'Superhero',
  'Superhero',
  'Sword',
  'Toy',
  'Tree',
  'Tree',
  'Tree',
  'Trident',
  'Trident',
  'Trident',
  'Undead',
  'Undead',
  'Undead',
  'Vampire',
  'Vampire',
  'Vampire',
  'Villain',
  'Void',
  'Void',
  'Void',
  'Water',
  'Water',
  'Water',
  'Water Serpent',
  'Water Serpent',
  'Water Serpent',
  'Werewolf',
  'Werewolf',
  'Werewolf',
  'Wing',
  'Wing',
  'Wing',
  'Wizard',
  'Wizard',
  'Wolf',
  'Wolf',
  'Wolf'
]



var allCombos = []
var possibleCombos = []
// var combosInfo = []

let finalFormsAndPower = []
var PowerToGet = 0
var PowerGetted = 0

class Combo {
  Name
  Card1
  Card2
  Power
  Attack
  Defense
  Rarity
  // CardInfo
}

class CardInfo {
  Name
  Power
  Attack
  Defense
  Rarity
}

async function getAllCombos() {
  try{
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const table = $('table');
    const rows = [];

    
    // const teste = await axios.get('https://www.facebook.com/AssesproRJ');
    // const html2 = teste.data;
    // const $$ = cheerio.load(html2)
    // const table2 = $$('table')

    table.find('tr').each((i, elem) => {
      const cells = [];
      $(elem).find('td').each((j, cellElem) => {
        cells.push($(cellElem).text());
      });

      if (cells.length == 4){
        switch (cells[3]) {
          case 'Diamond\n':
            cells[3] = 4
            break;
  
          case 'Gold\n':
            cells[3] = 3
            break;
  
          case 'Silver\n':
            cells[3] = 2
            break;
            
          case 'Bronze\n':
            cells[3] = 1
            break;
  
          default:
            break;
        }

        let combo = {
          Name: cells[2],
          Rarity: cells[3],
          Card1: cells[0],
          Card2: cells[1]
        }

        rows.push(combo);
      }
    });
    allCombos = rows
    return rows
  }
  catch (ex){
    console.error
    return []
  }
}

function getAllPossibleCombos(combos, deck = null) {
  // let possibleCombos = []

  if (deck == null){
    deck = myDeck
  }

  for (var combo of combos){
    let isPossible = false
    if (deck.includes(combo.Card1) && deck.includes(combo.Card2)) {
      if (combo.Card1 == combo.Card2){
        const count = deck.filter(card => card == combo.Card1).length
        if (count >= 2){
          isPossible = true
        } 
      }
      else {
        isPossible = true
      }
    }
    if (isPossible) {
      let possibleRepeatedList = possibleCombos.filter(c => c.Name == combo.Name)

      let repeatedFound = false

      for (const r of possibleRepeatedList){
        if (r.Card1 == combo.Card2 && r.Card2 == combo.Card1) {
          repeatedFound = true
        }
      }
      if (repeatedFound) {
        continue
      }
      possibleCombos.push(combo)
    }
  }
  possibleCombos = possibleCombos.sort((a,b) => b.Power - a.Power)
  return possibleCombos
}

async function getCardInfo(cardName) {
  try {
    let cardUrl = generalCardUrl + encodeURIComponent(cardName)
    const response = await axios.get(cardUrl);
    const html = response.data;
    const $ = cheerio.load(html);
    const table = $('table');
    const rows = [];

    table.find('tr').each((i, elem) => {
      const cells = [];
      $(elem).find('td').each((j, cellElem) => {
        cells.push($(cellElem).text());
      });    
      rows.push(cells);
    });
    return rows
  }    
  catch {
    console.error;
    return null
  }
  
}

function setCardsPower() {
  for (let i = 0; i < finalFormsAndPower.length; i++) {
    try {
      let cardUrl = generalCardUrl + encodeURIComponent(finalFormsAndPower[i][0])
      axios.get(cardUrl).subscribe(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const table = $('table');
        const rows = [];
    
        table.find('tr').each((i, elem) => {
          const cells = [];
          $(elem).find('td').each((j, cellElem) => {
            cells.push($(cellElem).text());
          });    
          rows.push(cells);
        });
        if (rows != null && rows.length >= 3 && rows[2].length >= 3){
          const cardPower = rows[2][2]
          finalFormsAndPower[i].push(cardPower)
          PowerGetted = PowerGetted++
          console.log("Getting FinalForm Power: ", PowerGetted, "/", finalFormsAndPower.length)
        }
      });
    }    
    catch {
      console.error;
      return null
    }
  }
}

async function getCombosPower(possibleCombos){
  // let finalFormsAndPower = []
  for (const combo of possibleCombos){
    let exists = finalFormsAndPower.find(ff => ff[0] == combo.Name)
    if (exists == null){
      finalFormsAndPower.push([combo.Name])
    }
  }
  
  PowerToGet = finalFormsAndPower.length

  // setCardsPower()
  for (let i = 0; i < finalFormsAndPower.length; i++) {
    const CardInfo = await getCardInfo(finalFormsAndPower[i][0])
    if (CardInfo != null && CardInfo.length >= 3 && CardInfo[2].length >= 3){
      const cardPower = CardInfo[2][2]
      finalFormsAndPower[i].push(CardInfo)
      if (i > 0) {
        process.stdout.write("\r\x1b[K");
      }
      console.log("Getting FinalForm Power: ", i+1, "/", finalFormsAndPower.length)
    }
  }

  console.log("Finishing...")

  // while(PowerGetted < PowerToGet){

  // }

  for (let i = 0; i < possibleCombos.length; i++){
    const finalForm = finalFormsAndPower.find(ff => ff[0] == possibleCombos[i].Name)
    const CardInfo = finalForm[1]
    // possibleCombos[i].CardInfo = CardInfo
    if (CardInfo != null && CardInfo.length >= 3 && CardInfo[2].length >= 3){
      possibleCombos[i].Attack = Number(CardInfo[2][0])
      possibleCombos[i].Defense = Number(CardInfo[2][1])
      possibleCombos[i].Power = Number(CardInfo[2][2])
    }
  }
  possibleCombos.sort((a, b) => b.Power - a.Power)
  return possibleCombos
}

function getBestDefensiveDeck(finalForms) {
  const PowerMap = new Map();
  for (const form of finalForms) {
      for (const card of [form.Card1, form.Card2]) {
          PowerMap.set(card, (PowerMap.get(card) || 0) + (form.Defense * form.Rarity));
      }
  }

  myDeck.sort((Card1, Card2) => (PowerMap.get(Card2) || 0) - (PowerMap.get(Card1) || 0));

  const deck = [];
  const cardCount = new Map();
  for (const card of myDeck) {
      if (deck.length === 30) break;

      const count = (cardCount.get(card) || 0) + 1;
      if (count <= 3) {
          deck.push(card);
          cardCount.set(card, count);
      }
  }
  // deck.sort()
  return deck;
}

function getBestDeck(finalForms) {
  const DefenseMap = new Map();

  for (const form of finalForms) {
      for (const card of [form.Card1, form.Card2]) {
        DefenseMap.set(card, (DefenseMap.get(card) || 0) + (form.Power * form.Rarity));
      }
  }

  myDeck.sort((Card1, Card2) => (DefenseMap.get(Card2) || 0) - (DefenseMap.get(Card1) || 0));

  const deck = [];
  const cardCount = new Map();
  for (const card of myDeck) {
      if (deck.length === 30) break;

      const count = (cardCount.get(card) || 0) + 1;
      if (count <= 3) {
          deck.push(card);
          cardCount.set(card, count);
      }
  }
  deck.sort()
  return deck;
}

function getBestDeckByMe(possibleCombos) {
  possibleCombos.sort((a, b) => (b.Power * b.Rarity) - (a.Power * a.Rarity))
  const deck = [];
  for (const combo of possibleCombos) {
    for (const card of [combo.Card1, combo.Card2]) {
      if (deck.length === 30) break;
      const count = deck.filter(c => c == card).length
      const existentCards = myDeck.filter(c => c == card).length

      if (count < existentCards) {
          deck.push(card);
      }
    }
  }
  deck.sort()
  return deck
}

function getBestDefensiveDeckByMe(possibleCombos) {
  possibleCombos.sort((a, b) => (b.Defense * b.Rarity) - (a.Defense * a.Rarity))
  const deck = [];
  for (const combo of possibleCombos) {
    for (const card of [combo.Card1, combo.Card2]) {
      if (deck.length === 30) break;
      const count = deck.filter(c => c == card).length
      const existentCards = myDeck.filter(c => c == card).length

      if (count < existentCards) {
          deck.push(card);
      }
    }
  }
  deck.sort()
  return deck
}

function exportXlsx() {
  let worksheet = XLSX.utils.json_to_sheet(allCombos);
  let workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "All Combos");
  
  let possibleCombosWS = XLSX.utils.json_to_sheet(possibleCombos)
  XLSX.utils.book_append_sheet(workbook, possibleCombosWS, "Possible Combos");

  const myDeckArray = [
    myDeck
  ]

  let myCardsWS = XLSX.utils.aoa_to_sheet(myDeckArray)
  XLSX.utils.book_append_sheet(workbook, myCardsWS, "MyCards");


  const resultsDir = path.join(__dirname, './Results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  const date = new Date().toISOString();
  const safeDate = date
    .replace(/-/g, '') // Remove todos os hífens
    .replace(/T/g, '_') // Substitui 'T' por '_'
    .replace(/:/g, '') // Remove todos os dois pontos
    .replace(/\./g, '') // Remove todos os pontos
    .replace(/Z/g, ''); // Remove o 'Z'

  const filename = `DeckBuilder_Result_${safeDate}.xlsx`;

  XLSX.writeFile(workbook, `./Results/${filename}`);

  // const date = new Date().toISOString();
  // const filename = path.join(resultsDir, `${date} - DeckBuilder Result.xlsx`);
  // XLSX.writeFile(workbook, filename);
  
}

async function main(){
  let allCombos = await getAllCombos()
  let possibleCombos = getAllPossibleCombos(allCombos)
  possibleCombos = await getCombosPower(possibleCombos)

  let bestDeck = getBestDeck(possibleCombos)
  // let bestDeck = getBestDefensiveDeck(possibleCombos)
  // console.log("Best Deck:\n", bestDeck)
  console.log("Best Deck:\n")
  for (const card of bestDeck) {
    console.log(card)
  }
  // let gptBestDeckCombos = getAllPossibleCombos(possibleCombos, bestDeck)
  // gptBestDeckCombos.sort((a, b) => (b.Defense * b.Rarity) - (a.Defense * a.Rarity))
  // // console.log("Best Deck combos: ", gptBestDeckCombos)
  // console.log("Best Deck combos: ")
  // for (const combo of gptBestDeckCombos) {
  //   console.log(combo)
  // }

  // exportXlsx()

  let beskDeckByMe = getBestDeckByMe(possibleCombos)
  // console.log("\nBest Deck by me:\n", beskDeckByMe)
  console.log("Best Deck by me:\n")
  for (const card of beskDeckByMe) {
    console.log(card)
  }
  // let beskDeckByMeCombos = getAllPossibleCombos(possibleCombos, beskDeckByMe)
  // beskDeckByMeCombos.sort((a, b) => b.Power - a.Power)
  // console.log("\nBest Deck by me combos:\n", beskDeckByMeCombos)
  // console.log("\nBest Deck by me combos:")
  // for (const combo of beskDeckByMeCombos) {
  //   console.log(combo)
  // }
  console.log("Finished.")
}

main()
