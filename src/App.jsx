import styles from './scss/App.module.scss'
import jsonCards from './json/flashcards.json'
import jsonCardsReverse from './json/flashcards-reverse.json'

import { useEffect, useState, useRef } from 'react'

export default function App() {
    const [userInput, setUserInput] = useState('')
    const [germanToPol, setGermanToPol] = useState(false)

    const [remainingWords, setRemainingWords] = useState(jsonCards)

    const [card, setCard] = useState({})

    const [inputColor, setInputColor] = useState(styles.normal)
    const [translation, setTranslation] = useState('Tłumaczenie')

    const useFocus = () => {
        const htmlElRef = useRef(null)
        const setFocus = () => {
            htmlElRef.current && htmlElRef.current.focus()
        }

        return [htmlElRef, setFocus]
    }

    const changeLang = () => {
        if (germanToPol) {
            setGermanToPol(false)
            setRemainingWords(jsonCards)
        } else if (!germanToPol) {
            setGermanToPol(true)
            setRemainingWords(jsonCardsReverse)
        }
    }

    const [inputRef, setInputFocus] = useFocus()

    useEffect(() => {
        const cards = [...remainingWords]
        let i = 0
        const cardsIdArray = cards.map(card => {
            i++
            return { id: i, ...card }
        })

        setRemainingWords(cardsIdArray)
    }, [germanToPol])

    useEffect(() => {
        console.log(remainingWords)
        if (remainingWords.length === 0) {
            setCard({ id: 0, original: 'Gratulacje' })
            setUserInput('Ukończyłeś wszystkie fiszki!')
            setTranslation()
            return
        }

        setCard(remainingWords[Math.floor(Math.random() * remainingWords.length)])
    }, [remainingWords])

    const germanLetters = ['ä', 'ö', 'ü', 'ß', 'Ä', 'Ö', 'Ü', 'ẞ']

    function handleValidation(val, trn, id) {
        setTranslation(trn)
        if (val.trim() !== trn) {
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
        }, 500)
        setInputFocus()
    }

    function handleLetter(letter) {
        setUserInput(userInput + letter)
    }

    function showTranslation(trn, trnText) {
        if (trnText === 'Tłumaczenie') setTranslation(trn)
        else setTranslation('Tłumaczenie')
    }

    return (
        <main className={styles.card}>
            <h3>{`Pozostałe fiszki: ${remainingWords.length}`}</h3>
            <h1>{card.original}</h1>
            <input
                id={card.id}
                className={inputColor}
                type='text'
                ref={inputRef}
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                onKeyDown={e => {
                    if (e.code === 'Enter') handleValidation(userInput, card.translation, card.id)
                    for (let i = 0; i < germanLetters.length; i++) {
                        if (e.code === `Numpad${i + 1}`) {
                            e.preventDefault()
                            setUserInput(userInput + germanLetters[i])
                        }
                    }
                }}
            />
            <a onClick={() => showTranslation(card.translation, translation)}>{translation}</a>
            <ol>
                {germanLetters.map((letter, index) => {
                    return (
                        <li key={index} onClick={() => handleLetter(letter)}>
                            {letter}
                        </li>
                    )
                })}
                <small>Numpad or Click</small>
            </ol>
            <button onClick={() => handleValidation(userInput, card.translation, card.id)} type='button'>
                Sprawdź
            </button>
            <footer>fishki 🐟</footer>
            <button className={styles.change} type='button' onClick={changeLang}>
                {germanToPol ? 'Niemiecki > Polski' : 'Polski > Niemiecki'}
            </button>
            {/* <h1>Referat o rybach</h1> */}
            {/*<p>
                Karp, jako gatunek, powstał na drodze naturalnej poliploidyzacji na przełomie trzeciorzędu i czwartorzędu w okolicach Morza Kaspijskiego i
                wschodniej Anatolii[4]. Forma dzika (sazan[3]) występowała pierwotnie w Europie południowo-wschodniej i Azji zachodniej w zlewiskach mórz
                Egejskiego, Czarnego, Kaspijskiego i Aralskiego. Najwcześniej karp został udomowiony w Chinach (V w p.n.e.). Już z roku 350 p.n.e. pochodzą
                pierwsze wzmianki o karpiu w Europie. Znajdujemy je u Arystotelesa. O karpiu pisze też Pliniusz Starszy (23-79 n.e.) w swojej Historii
                Naturalnej. W Europie była to pierwsza ryba hodowana w sztucznych stawach, zakładanych przy klasztorach. Od VII do XII wieku nastąpił szybki
                rozwój rybactwa w majątkach klasztornych Belgii, Francji, Niemiec i na Bałkanach. Jest jedną z najważniejszych ryb hodowlanych.
            </p>
            */}
        </main>
    )
}
