<template>
  <section class="app">
    <h1 role="heading">Шифр Уитсона или Шифр двойного квадрата</h1>
    <h2>Выберите два квадрата</h2>
    <section class="app__squares">
      <square
        v-for="(square, i) in squares"
        :key="i"
        :square="square"
        class="app__square"
        :class="{ 'is-selected': firstSquareIndex === i || secondSquareIndex === i }"
        @click.native="selectSquare(i)"
      />
    </section>
    <h2>Выбранные квадраты</h2>
    <section class="app__selected-squares">
      <div class="app__selected-square-container">
        <square
          v-if="firstSquare"
          :square="firstSquare"
          :selections="firstSquareSelections"
          class="app__selected-square"
        />
      </div>
      <div class="app__selected-square-container">
        <square
          v-if="secondSquare"
          :square="secondSquare"
          :selections="secondSquareSelections"
          class="app__selected-square"
        />
      </div>
    </section>
    <h2>Редакторы</h2>
    <section class="app__editors">
      <div>
        <h3>Зашифровка</h3>
        <form class="app__editor">
        <textarea
          v-model="decodedText"
          class="app__text-editor"
          :disabled="isDisabled"
        />
          <button
            type="button"
            class="app__editor-button"
            @click="stopEncoding"
          >
            Стоп
          </button>
          <button
            type="button"
            class="app__editor-button"
            :disabled="isDisabled"
            @click="encode"
          >
            Запустить шифрование
          </button>
        </form>
      </div>
      <div>
        <h3>Расшифровка</h3>
        <form class="app__editor">
        <textarea
          v-model="encodedText"
          class="app__text-editor"
          :disabled="isDisabled"
        />
          <button
            type="button"
            class="app__editor-button"
            @click="stopDecoding"
          >
            Стоп
          </button>
          <button
            type="button"
            class="app__editor-button"
            :disabled="isDisabled"
            @click="decode"
          >
            Запустить расшифровывание
          </button>
        </form>
      </div>
    </section>
  </section>
</template>

<script>
  import Square from '~/components/Square'
  import { randomInteger } from '~/utils/random'

  export default {
    components: { Square },
    data () {
      return {
        squares: [],
        firstSquareIndex: null,
        firstSquareSelections: {},

        secondSquareIndex: null,
        secondSquareSelections: {},

        timer: null,

        isEncoding: false,
        decodedText: null,

        isDecoding: false,
        encodedText: null,
      }
    },
    mounted () {
      for (let i = 0; i < this.numberOfSquares; i++) {
        const square = this.getRandomSquare(this.characters)
        this.squares.push(square)
      }
      this.firstSquareIndex = randomInteger(0, this.squares.length)
      this.secondSquareIndex = this.firstSquareIndex
      while (this.secondSquareIndex === this.firstSquareIndex) {
        this.secondSquareIndex = randomInteger(0, this.squares.length)
      }
    },
    computed: {
      basicCharacters () {
        return [
          'А',
          'Б',
          'В',
          'Г',
          'Д',
          'Е',
          'Ё',
          'Ж',
          'З',
          'И',
          'Й',
          'К',
          'Л',
          'М',
          'Н',
          'О',
          'П',
          'Р',
          'С',
          'Т',
          'У',
          'Ф',
          'Х',
          'Ц',
          'Ч',
          'Ш',
          'Щ',
          'Ъ',
          'Ы',
          'Ь',
          'Э',
          'Ю',
          'Я',
          '.',
          ',',
          ' ',
        ]
      },
      additionalCharacters () {
        return ['-', ':', '?', '!', ';', '(', ')', '/', '+', '%']
      },
      characters () {
        const result = this.basicCharacters.slice()
        let i = 0
        while (!Number.isInteger(Math.sqrt(result.length))) {
          if (i < this.basicCharacters.length) {
            result.push(this.additionalCharacters[i])
          }
          else {
            throw new TypeError(
              'нельзя построить квадрат, слишком много символов',
            )
          }
        }
        return result

      },
      numberOfSquares () {
        return 6
      },
      firstSquare () {
        return this.firstSquareIndex < this.squares.length
          ? this.squares[this.firstSquareIndex]
          : []
      },
      firstSquareMap () {
        return this.getSquareMap(this.firstSquare)
      },
      secondSquare () {
        return this.secondSquareIndex < this.squares.length
          ? this.squares[this.secondSquareIndex]
          : []
      },
      secondSquareMap () {
        return this.getSquareMap(this.secondSquare)
      },
      isDisabled () {
        return !Number.isInteger(this.firstSquareIndex) ||
          !Number.isInteger(this.secondSquareIndex) ||
          this.isEncoding ||
          this.isDecoding
      },
      time () {return 2000},
      adjacentClass () {
        return 'is-adjacent'
      },
      selectedClass () {
        return 'is-selected'
      },
    },
    methods: {
      getRandomCharacters (characters) {
        const result = characters.slice()
        const min = result.length * 4
        const permutations = randomInteger(min, min * 4)
        for (let i = 0; i < permutations; i++) {
          let x = randomInteger(0, result.length)
          let y = randomInteger(0, result.length)
          if (x !== y) {
            [result[x], result[y]] = [result[y], result[x]]
          }
        }
        return result
      },
      getRandomSquare (characters) {
        const size = Math.sqrt(characters.length)
        if (!Number.isInteger(size)) {
          throw new TypeError(
            'нельзя построить квадрат, слишком много символов',
          )
        }
        const randomCharacters = this.getRandomCharacters(characters)
        const result = []
        for (let i = 0; i < size; i++) {
          let start = i * size
          result.push(randomCharacters.slice(start, start + size))
        }
        return result
      },
      getSquareMap (square) {
        const result = {}
        for (let i = 0; i < square.length; i++) {
          for (let j = 0; j < square[i].length; j++) {
            result[square[i][j]] = { i, j }
          }
        }
        return result
      },
      selectSquare (index) {
        if (!(index < this.squares.length)) {
          return false
        }
        if (index === this.firstSquareIndex) {
          this.firstSquareIndex = null
        }
        else if (index === this.secondSquareIndex) {
          this.secondSquareIndex = null
        }
        else if (!Number.isInteger(this.firstSquareIndex)) {
          this.firstSquareIndex = index
        }
        else if (!Number.isInteger(this.secondSquareIndex)) {
          this.secondSquareIndex = index
        }
        return false
      },
      getParseText (text) {
        if (typeof text !== 'string' || text.length === 0) {
          return null
        }
        if (text.length % 2 !== 0) {
          text += text[0]
        }
        return text.toUpperCase()
      },
      run (i, text, output) {
        this.firstSquareSelections = {}
        this.secondSquareSelections = {}
        if (i < text.length) {
          this.$set(this.firstSquareSelections, text[i], [this.selectedClass])
          const ii = i + 1
          this.$set(this.secondSquareSelections, text[ii], [this.selectedClass])

          const first = this.firstSquareMap[text[i]]
          const second = this.secondSquareMap[text[ii]]

          let isNewArray = true
          let firstCharacter, secondCharacter
          if (first.i === second.i) {
            firstCharacter = this.firstSquare[first.i][second.j]
            secondCharacter = this.secondSquare[second.i][first.j]
            if (first.j === second.j) {
              isNewArray = false
            }
          }
          else {
            firstCharacter = this.firstSquare[second.i][first.j]
            secondCharacter = this.secondSquare[first.i][second.j]
          }

          if (isNewArray) {
            this.$set(this.firstSquareSelections,
              firstCharacter,
              [this.adjacentClass])
            this.$set(this.secondSquareSelections,
              secondCharacter,
              [this.adjacentClass])
          }
          else {
            this.firstSquareSelections[text[i]].push(this.adjacentClass)
            this.secondSquareSelections[text[ii]].push(this.adjacentClass)
          }

          this[output] += firstCharacter + secondCharacter

          this.timer = setTimeout(this.run, this.time, i + 2, text, output)
        }
        else {
          this.isEncoding = false
          this.isDecoding = false
        }
      },
      stop () {
        clearTimeout(this.timer)
        this.firstSquareSelections = {}
        this.secondSquareSelections = {}
        this.isEncoding = false
        this.isDecoding = false
      },
      encode () {
        const text = this.getParseText(this.decodedText)
        if (!text) {
          return false
        }
        this.isEncoding = true
        this.encodedText = ''

        this.run(0, text, 'encodedText')
      },
      stopEncoding () {
        this.stop()
      },
      decode () {
        const text = this.getParseText(this.encodedText)
        if (!text) {
          return false
        }
        this.isDecoding = true
        this.decodedText = ''

        this.run(0, text, 'decodedText')
      },
      stopDecoding () {
        this.stop()
      },
    },
  }
</script>

<style lang="postcss" rel="stylesheet">

  h1, h2, h3 {
    text-align: center;
  }

  h1 {
    margin-top: 21px;
    margin-bottom: 21px;
    text-decoration: underline;
  }

  h2 {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  h3 {
    margin-top: 7px;
    margin-bottom: 7px;
  }

  .app > section {
    padding: 10px;
    display: flex;
    justify-content: center;
  }

  .app__square {
    margin: 10px;
    cursor: pointer;
    background-color: orange;
  }

  .app__square.is-selected {
    box-shadow: 0 0 7px #000;
  }

  .app__selected-square-container {
    display: flex;
    justify-content: center;
    min-width: 40%;
    margin: 10px;
  }

  .app__selected-square {
    background-color: lightgreen;
  }

  .app__editor {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 400px;
    margin: 10px;
  }

  textarea {
    margin: 0;
    padding: 0;
  }

  .app__text-editor {
    height: 50px;
    width: inherit;
    resize: none;
  }

  .app__editor-button {
    margin-top: 11px;
    width: 40%;
  }

  .square__cell.is-selected {
    background-color: orange;
  }

  @keyframes blink {
    50% {
      background-color: rgb(220, 64, 43);
    }
    51% {
      background-color: rgba(220, 64, 43, 0);
    }
    100% {
      background-color: rgba(220, 64, 43, 0);
    }
  }

  .square__cell.is-adjacent {
    animation: blink 0.5s linear infinite;
  }
</style>
