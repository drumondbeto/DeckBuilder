import axios from 'axios';
import cheerio from 'cheerio';
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

// var allCombos = []
// var possibleCombos = []
// var combosInfo = []
class Combo {
  name: string
  cardRarity: number
  comboCards: string[]
  power?: number
} 

async function getAllCombos() {
  try{
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const table = $('table');
    const rows: Combo[] = [];

    table.find('tr').each((i, elem) => {
      const cells: any[] = [];
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

        let combo : Combo = {
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

function getAllPossibleCombos(allCombos: Combo[]): Combo[] {
  let possibleCombos: Combo[] = []
  for (var combo of allCombos){
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
  possibleCombos = possibleCombos.sort((a,b) => b[3] - a[3])
  return possibleCombos
}

async function getCardInfo(cardName) {
  try {
    let cardUrl = generalCardUrl + encodeURIComponent(cardName)
    const response = await axios.get(cardUrl);
    const html = response.data;
    const $ = cheerio.load(html);
    const table = $('table');
    const rows: any[] = [];

    table.find('tr').each((i, elem) => {
      const cells: any[] = [];
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

async function getCombosPower(possibleCombos: Combo[]): Promise<Combo[]>{
  for (const combo of possibleCombos) {
    const cardInfo = await getCardInfo(combo.name)
    if (cardInfo != null && cardInfo.length >= 3 && cardInfo[2].length >= 3){
      const cardPower = cardInfo[2][2]
      combo.power = cardPower
    }
  }
  return possibleCombos
}

function filterRepeatedCombos(possibleCombos: Combo[]): Combo[] {
  let filteredList = []

  return filteredList
}

async function main(){
  let allCombos: Combo[] = await getAllCombos()
  let possibleCombos: Combo[] = getAllPossibleCombos(allCombos)
  possibleCombos = filterRepeatedCombos(possibleCombos)
  possibleCombos = await getCombosPower(possibleCombos)
  console.log(possibleCombos)  
}

main()
