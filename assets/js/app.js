let isGame = false
let questions = []
let time = 120
let countdown
let score = 0

const stateChngBtns = toggle => {
  $('#stateMsg').text(toggle ? 'Finish' : 'Start')
  $('#stateChng').css('background', toggle ? 'rgb(173, 5, 5)' : 'rgb(35, 35, 35)')
  $('#timer').css('display', toggle ? 'inline' : 'none')
  $('.card').css('display', toggle ? 'none' : 'block')
  $('#questions').css('display', 'block')
}
const startGame = _ => {
  stateChngBtns(isGame)
  countdown = setInterval(() => {
    time--
    console.log(time)
    if (time) {
      $('#time').html(time)
    } else {
      endGame()
    }
  }, 1000)
}
const endGame = _ => {
  stateChngBtns(isGame)
  clearInterval(countdown)
  time = 120
  $('#time').html(time)
  $('.rightAns').each((i, elem) => {
    $(elem).css('display', 'block')
  })
  questions.forEach(q => q.chosenAnswer === q.correct_answer ? score++ : null)
  $('.card-title').text(`Your Score : ${score}`)
}

$('#stateChng').on('click', e => {
  isGame = !isGame
  isGame ? startGame() : endGame()
})

$.ajax('https://opentdb.com/api.php?amount=15')
  .then(({ results }) => {
    questions = results
    questions.forEach((q, i) => {
      // add right answer to array
      q.incorrect_answers.push(q.correct_answer)
      // shuffle answers array
      q.incorrect_answers.sort((a, b) => ~~(Math.random() * 50) - 25)
      let qElem = $('<div>')
      qElem.addClass('row')
      qElem.html(q.question)
      q.incorrect_answers.forEach(answer => {
        let ansElem = $('<p>')
        ansElem.html(`<label>
          <input class="radios" name="${i}" type="radio" data-value="${answer}" />
          <span>${answer}</span>
        </label>
        `)
        qElem.append(ansElem)
      })
      let hiddenAnswer = $('<p>')
      hiddenAnswer.addClass('rightAns')
      hiddenAnswer.text(q.correct_answer)
      qElem.append(hiddenAnswer)
      $('#questions').append(qElem)
    })
  })
  .catch(e => console.error(e))

$(document).on('click', '.radios', e => {
  let index = parseInt(e.target.name)
  questions[index].chosenAnswer = e.target.dataset.value
})
