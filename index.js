const axios = require('axios');
const cheerio = require('cheerio');
const url = 'https://lil-alchemist.fandom.com/wiki/Card_Combinations/All_Combinations';
const cardUrl = 'https://lil-alchemist.fandom.com/wiki/Dark_Angel'

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
  'Wizard',
  'Wolf',
  'Wolf',
  'Wolf'
]

var allCombos = []
var possibleCombos = []

class Combo {
  name
  cardRarity
  urlName
  comboCards
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
      rows.push(cells);
    });
    allCombos = rows
    return rows
  }
  catch{
    console.error
    return []
  }
}

function getAllPossibleCombos(combos, myDeck) { 
  // let possibleCombos = []   
  for (var combo of combos){
    if (combo.length == 4){
      switch (combo[3]) {
        case 'Diamond\n':
          combo[3] = 4
          break;

        case 'Gold\n':
          combo[3] = 3
          break;

        case 'Silver\n':
          combo[3] = 2
          break;
          
        case 'Bronze\n':
          combo[3] = 1
          break;

        default:
          continue
          break;
      }

      if (myDeck.includes(combo[0]) && myDeck.includes(combo[1])) {
        if (combo[0] == combo[1]){
          const count = myDeck.filter(card => card == combo[0]).length
          if (count >= 2){
            possibleCombos.push(combo)
          } 
        }
        else {
          possibleCombos.push(combo)
        }
      }
    }
  }
  possibleCombos = possibleCombos.sort((a,b) => b[3] - a[3])
  return possibleCombos
}

async function getCardInfo(cardName) {
  try {
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
  }
  
}

async function main(){
  const allCombos = await getAllCombos()
  const possibleCombos = getAllPossibleCombos(allCombos, myDeck)

  // let finalForms = []
  // for (const combo of possibleCombos){
  //   if (!finalForms.includes(combo[2])){
  //     finalForms.push(combo[2])
  //     console.log(combo[2])
  //   }
  // }
  
}

main()