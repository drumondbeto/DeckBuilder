const axios = require('axios');
const cheerio = require('cheerio');
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
  'Magic',
  'Magic',
  'Magic',
  'Metal',
  'Metal',
  'Metal',
  'Poison',
  'Poison',
  'Poison',
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
  'Sword',
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
  'Wolf',
  'Wolf',
  'Wolf'
]

// var allCombos = []
// var possibleCombos = []
// var combosInfo = []
class Combo {
  name
  cardRarity
  comboCards
  power
} 

async function getAllCombos() {
  try{
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const table = $('table');
    const rows = [];

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
          name: cells[2],
          cardRarity: cells[3],
          comboCards: [cells[0], cells[1]]
        }

        rows.push(combo);
      }
    });
    // allCombos = rows
    return rows
  }
  catch{
    console.error
    return []
  }
}

function getAllPossibleCombos(allCombos) {
  let possibleCombos = []
  for (var combo of allCombos){
    let isPossible = false
    if (myDeck.includes(combo.comboCards[0]) && myDeck.includes(combo.comboCards[1])) {
      if (combo.comboCards[0] == combo.comboCards[1]){
        const count = myDeck.filter(card => card == combo.comboCards[0]).length
        if (count >= 2){
          isPossible = true
        } 
      }
      else {
        isPossible = true
      }
    }
    if (isPossible) {
      let possibleRepeated = possibleCombos.filter(c => c.name == combo.name)
      if (possibleRepeated.length > 0) {
        let repeatedFound = possibleRepeated.includes(r => 
          (r.comboCards[0] == combo.comboCards[0] && r.comboCards[1] == combo.comboCards[1]) 
          || (r.comboCards[0] == combo.comboCards[1] && r.comboCards[1] == combo.comboCards[0]))

        if (repeatedFound) {
          continue
        }
      }
      possibleCombos.push(combo)
    }
  }
  possibleCombos = possibleCombos.sort((a,b) => b.cardRarity - a.cardRarity)
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

async function getCombosPower(possibleCombos){
  let finalFormsAndPower = []
  for (const combo of possibleCombos){
    let exists = finalFormsAndPower.find(ff => ff[0] == combo.name)
    if (exists == null){
      finalFormsAndPower.push([combo.name])
    }
  }
  for (let i = 0; i < finalFormsAndPower.length; i++) {
    const cardInfo = await getCardInfo(finalFormsAndPower[i][0])
    if (cardInfo != null && cardInfo.length >= 3 && cardInfo[2].length >= 3){
      const cardPower = cardInfo[2][2]
      finalFormsAndPower[i].push(cardPower)
      console.log("Getting FinalForm Power: ", i+1, "/", finalFormsAndPower.length)
    }
  }
  for (let i = 0; i < possibleCombos.length; i++){
    const finalForm = finalFormsAndPower.find(ff => ff[0] == possibleCombos[i].name)
    const power = parseInt(finalForm[1])
    possibleCombos[i].power = power
    
    console.log("Setting possibleCombos Power: ", i+1, "/", possibleCombos.length)
  }
  possibleCombos.sort((a, b) => b.power - a.power)
  return possibleCombos
}

function getBestDeck(finalForms) {
  // Mapeamento de cartas para seu poder total.
  const powerMap = new Map();

  for (const form of finalForms) {
      // Atualiza o poder de cada carta baseado nas "Final Forms" que pode formar.
      for (const card of [form.comboCards[0], form.comboCards[1]]) {
          powerMap.set(card, (powerMap.get(card) || 0) + (form.power * form.cardRarity));
      }
  }

  // Ordena as cartas pelo poder.
  myDeck.sort((card1, card2) => (powerMap.get(card2) || 0) - (powerMap.get(card1) || 0));

  // Constrói o deck pegando as 30 cartas mais poderosas.
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
  possibleCombos.sort((a, b) => b.power - a.power)
  const deck = [];
  for (const combo of possibleCombos) {
    for (const card of combo.comboCards) {
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

async function main(){
  let allCombos = await getAllCombos()
  let possibleCombos = getAllPossibleCombos(allCombos)
  possibleCombos = await getCombosPower(possibleCombos)
  let bestDeck = getBestDeck(possibleCombos)
  let beskDeckByMe = getBestDeckByMe(possibleCombos)
  console.log("Best Deck:\n", bestDeck)
  console.log("\nBest Deck by me:\n", beskDeckByMe)
}

main()
