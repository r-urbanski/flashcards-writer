import styles from './scss/App.module.scss'

import jsonCards from './json/flashcards.json'
import { useEffect, useState } from 'react'

export default function App() {
   const [userInput, setUserInput] = useState('')

   const [remainingWords, setRemainingWords] = useState(jsonCards)

   const [card, setCard] = useState({})

   const [inputColor, setInputColor] = useState(styles.normal)
   const [translation, setTranslation] = useState('Tłumaczenie')
   
   useEffect(() => {
      const cards = [...remainingWords]
      const cardsIdArray = cards.map(card => {
         return { id: crypto.randomUUID(), ...card }
      })

      setRemainingWords(cardsIdArray)
   }, [])

   useEffect(() => {
      if(remainingWords.length === 0) {
         setCard({ id: 0, original: 'Gratulacje'})
         setUserInput('Ukończyłeś wszystkie fiszki!')
         setTranslation()
         return
      }
      
      setCard(remainingWords[Math.floor(Math.random() * remainingWords.length)])
   }, [remainingWords])

   const germanLetters = ['ä', 'ö', 'ü', 'ß', 'Ä', 'Ö', 'Ü', 'ẞ']

   function handleValidation(val, trn, id) {
      setTranslation(trn)
      if(val.trim() !== trn) {
         setInputColor(styles.error)
         return
      }

      setInputColor(styles.success)
      setTimeout(() => {
         setUserInput('')
         setInputColor(styles.normal)
         setTranslation('Tłumaczenie')
         setRemainingWords(() => {
            const tempWords = [...remainingWords].filter(word => word.id !== id)
            return [...tempWords]
         })
      }, 500);
   }

   function handleLetter(letter) {
      setUserInput(userInput + letter)
   }

   function showTranslation(trn, trnText) {
      if(trnText === 'Tłumaczenie') setTranslation(trn)
      else setTranslation('Tłumaczenie')
   }

   return (
      <main className={styles.card}>
         <h3>{`Pozostałe fiszki: ${remainingWords.length}`}</h3>
         <h1>{card.original}</h1>
         <input 
            id={card.id} 
            className={inputColor} 
            type='text' value={userInput} 
            onChange={e => setUserInput(e.target.value)} 
            onKeyDown={e => { 
               if(e.code === 'Enter') handleValidation(userInput, card.translation, card.id) 
               for(let i = 0; i < germanLetters.length; i++) {
                  if(e.code === `Numpad${i+1}`) {
                     e.preventDefault()
                     setUserInput(userInput + germanLetters[i])
                  }
               }
            }}   
         />
         <a onClick={() => showTranslation(card.translation, translation)}>{translation}</a>
         <ol>
            {germanLetters.map(letter => {
               return (
                  <li onClick={() => handleLetter(letter)}>{letter}</li>
                  )
               })}
               <small>Numpad</small>
         </ol>
         <button onClick={() => handleValidation(userInput, card.translation, card.id)} type='button'>Sprawdź</button>
      </main>
   )
}