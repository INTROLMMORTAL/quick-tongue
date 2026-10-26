// Содержание курса. Чтобы добавить юнит, скопируй любой объект ниже и измени данные.
// sentences: gap — слово для задания «вставь пропущенное», alt — 3 заведомо неверных варианта.
const UNITS = [
  {
    id: "u1",
    emoji: "👋",
    title: "Привет!",
    desc: "Приветствия, знакомство, имя",
    words: [
      { en: "hello", ru: "привет", emoji: "👋" },
      { en: "goodbye", ru: "до свидания", emoji: "🖐️" },
      { en: "yes", ru: "да", emoji: "✅" },
      { en: "no", ru: "нет", emoji: "❌" },
      { en: "please", ru: "пожалуйста", emoji: "🙂" },
      { en: "thank you", ru: "спасибо", emoji: "🙏" },
      { en: "sorry", ru: "извините", emoji: "😔" },
      { en: "name", ru: "имя", emoji: "🏷️" },
      { en: "my", ru: "мой, моя", emoji: "👈" },
      { en: "your", ru: "твой, ваш", emoji: "👉" }
    ],
    dialogue: [
      { who: "Alex", en: "Hello!", ru: "Привет!" },
      { who: "Kate", en: "Hi! What is your name?", ru: "Привет! Как тебя зовут?" },
      { who: "Alex", en: "My name is Alex. And you?", ru: "Меня зовут Алекс. А тебя?" },
      { who: "Kate", en: "My name is Kate. Nice to meet you.", ru: "Меня зовут Кейт. Приятно познакомиться." },
      { who: "Alex", en: "Nice to meet you, too.", ru: "Мне тоже приятно." },
      { who: "Kate", en: "Goodbye, Alex!", ru: "До свидания, Алекс!" }
    ],
    grammar: {
      title: "Как назвать своё имя",
      html: `
        <p>В английском предложении почти всегда нужен глагол. В русском можно сказать «Меня зовут Алекс», а в английском говорят так:</p>
        <div class="gbox"><b>My name is Alex.</b><br>дословно: «Моё имя есть Алекс»</div>
        <table class="gt">
          <tr><th>English</th><th>Русский</th></tr>
          <tr><td><b>my</b> name</td><td>моё имя</td></tr>
          <tr><td><b>your</b> name</td><td>твоё / ваше имя</td></tr>
        </table>
        <p>Вопрос: <b>What is your name?</b> Ответ: <b>My name is …</b></p>
        <p class="tip">💡 <b>Hello</b> подходит всегда, <b>Hi</b> звучит проще и дружелюбнее. <b>Please</b> и <b>thank you</b> в английском говорят намного чаще, чем в русском: это норма вежливости.</p>`
    },
    sentences: [
      { en: "Hello, my name is Alex.", ru: "Привет, меня зовут Алекс.", gap: "name", alt: ["yes", "please", "sorry"] },
      { en: "What is your name?", ru: "Как тебя зовут?", gap: "your", alt: ["please", "sorry", "goodbye"] },
      { en: "Thank you, goodbye.", ru: "Спасибо, до свидания." },
      { en: "Yes, please.", ru: "Да, пожалуйста." },
      { en: "Sorry, no.", ru: "Извините, нет." },
      { en: "Nice to meet you.", ru: "Приятно познакомиться.", gap: "meet", alt: ["name", "goodbye", "sorry"] }
    ]
  },
  {
    id: "u2",
    emoji: "🙋",
    title: "Я и ты",
    desc: "Глагол to be: I am, you are, he is",
    words: [
      { en: "student", ru: "студент", emoji: "🎓" },
      { en: "teacher", ru: "учитель", emoji: "👩‍🏫" },
      { en: "friend", ru: "друг", emoji: "🤝" },
      { en: "man", ru: "мужчина", emoji: "👨" },
      { en: "woman", ru: "женщина", emoji: "👩" },
      { en: "from", ru: "из, от", emoji: "📍" },
      { en: "country", ru: "страна", emoji: "🌍" },
      { en: "happy", ru: "счастливый", emoji: "😀" },
      { en: "tired", ru: "уставший", emoji: "🥱" },
      { en: "not", ru: "не", emoji: "🚫" }
    ],
    dialogue: [
      { who: "Alex", en: "Where are you from?", ru: "Откуда ты?" },
      { who: "Kate", en: "I am from Poland. And you?", ru: "Я из Польши. А ты?" },
      { who: "Alex", en: "I am from Ukraine.", ru: "Я из Украины." },
      { who: "Kate", en: "Are you a student?", ru: "Ты студент?" },
      { who: "Alex", en: "No, I am not. I am a teacher.", ru: "Нет. Я учитель." },
      { who: "Kate", en: "Nice! I am a student. I am happy!", ru: "Здорово! А я студентка. Я счастлива!" }
    ],
    grammar: {
      title: "Глагол to be: быть",
      html: `
        <p>В русском мы говорим «Я студент» без глагола. В английском глагол <b>to be</b> обязателен:</p>
        <table class="gt">
          <tr><th>Кто</th><th>Форма</th><th>Пример</th></tr>
          <tr><td>I</td><td><b>am</b></td><td>I am a student.</td></tr>
          <tr><td>you</td><td><b>are</b></td><td>You are my friend.</td></tr>
          <tr><td>he / she / it</td><td><b>is</b></td><td>She is a teacher.</td></tr>
          <tr><td>we / they</td><td><b>are</b></td><td>They are happy.</td></tr>
        </table>
        <p><b>Вопрос:</b> глагол выходит вперёд: <b>Are you</b> a student?</p>
        <p><b>Отрицание:</b> добавляем not: I am <b>not</b> tired.</p>
        <p class="tip">💡 Перед названием профессии нужен артикль <b>a</b>: I am <b>a</b> teacher. Подробнее об артиклях будет в следующем юните.</p>`
    },
    sentences: [
      { en: "I am a student.", ru: "Я студент.", gap: "am", alt: ["is", "are", "be"] },
      { en: "She is a teacher.", ru: "Она учитель.", gap: "is", alt: ["am", "are", "be"] },
      { en: "You are my friend.", ru: "Ты мой друг.", gap: "are", alt: ["am", "is", "be"] },
      { en: "He is from Poland.", ru: "Он из Польши." },
      { en: "Are you a student?", ru: "Ты студент?", gap: "Are", alt: ["Am", "Is", "Do"] },
      { en: "I am not tired.", ru: "Я не устал.", gap: "not", alt: ["no", "are", "is"] }
    ]
  },
  {
    id: "u3",
    emoji: "📱",
    title: "Вещи вокруг",
    desc: "This is a…, артикли a/an, цвета",
    words: [
      { en: "cat", ru: "кот, кошка", emoji: "🐱" },
      { en: "dog", ru: "собака", emoji: "🐶" },
      { en: "book", ru: "книга", emoji: "📘" },
      { en: "phone", ru: "телефон", emoji: "📱" },
      { en: "car", ru: "машина", emoji: "🚗" },
      { en: "red", ru: "красный", emoji: "🔴" },
      { en: "blue", ru: "синий, голубой", emoji: "🔵" },
      { en: "orange", ru: "оранжевый", emoji: "🟠" },
      { en: "big", ru: "большой", emoji: "🐘" },
      { en: "small", ru: "маленький", emoji: "🐭" }
    ],
    dialogue: [
      { who: "Kate", en: "What is this?", ru: "Что это?" },
      { who: "Alex", en: "This is a phone.", ru: "Это телефон." },
      { who: "Kate", en: "Is it your phone?", ru: "Это твой телефон?" },
      { who: "Alex", en: "Yes, it is. It is blue.", ru: "Да. Он синий." },
      { who: "Kate", en: "And what is that?", ru: "А что это там вдалеке?" },
      { who: "Alex", en: "That is a big red car!", ru: "Это большая красная машина!" }
    ],
    grammar: {
      title: "This / that и артикли a / an",
      html: `
        <p><b>This</b> — это (рядом, близко). <b>That</b> — то (далеко).</p>
        <div class="gbox"><b>This</b> is a phone. (у меня в руке)<br><b>That</b> is a car. (на улице)</div>
        <p>В английском перед исчисляемым предметом ставят артикль:</p>
        <table class="gt">
          <tr><th>Артикль</th><th>Когда</th><th>Пример</th></tr>
          <tr><td><b>a</b></td><td>слово начинается с согласного звука</td><td>a dog, a book</td></tr>
          <tr><td><b>an</b></td><td>слово начинается с гласного звука</td><td>an orange car, an apple</td></tr>
        </table>
        <p><b>Прилагательное стоит перед существительным</b> и не меняется по родам: a big red car (большая красная машина).</p>
        <p class="tip">💡 Смотри на звук, а не на букву: <b>an</b> hour (h не читается), но <b>a</b> university (читается «ю»).</p>`
    },
    sentences: [
      { en: "This is a phone.", ru: "Это телефон.", gap: "a", alt: ["an", "are", "am"] },
      { en: "That is a big car.", ru: "Вон та машина большая.", gap: "is", alt: ["am", "are", "have"] },
      { en: "My dog is big.", ru: "Моя собака большая." },
      { en: "It is an orange car.", ru: "Это оранжевая машина.", gap: "an", alt: ["a", "am", "is"] },
      { en: "What is this?", ru: "Что это?" },
      { en: "Is it your phone?", ru: "Это твой телефон?", gap: "Is", alt: ["Am", "Are", "Do"] }
    ]
  },
  {
    id: "u4",
    emoji: "☕",
    title: "Я хочу и люблю",
    desc: "I have, I like, I want; еда; don't",
    words: [
      { en: "apple", ru: "яблоко", emoji: "🍎" },
      { en: "water", ru: "вода", emoji: "💧" },
      { en: "coffee", ru: "кофе", emoji: "☕" },
      { en: "bread", ru: "хлеб", emoji: "🍞" },
      { en: "pizza", ru: "пицца", emoji: "🍕" },
      { en: "have", ru: "иметь, у меня есть", emoji: "🤲" },
      { en: "like", ru: "любить, нравиться", emoji: "❤️" },
      { en: "want", ru: "хотеть", emoji: "🙌" },
      { en: "eat", ru: "есть (кушать)", emoji: "🍽️" },
      { en: "drink", ru: "пить", emoji: "🥤" }
    ],
    dialogue: [
      { who: "Waiter", en: "Hello! What do you want?", ru: "Здравствуйте! Что вы хотите?" },
      { who: "Alex", en: "I want a coffee, please.", ru: "Я хочу кофе, пожалуйста." },
      { who: "Waiter", en: "Do you want bread?", ru: "Хотите хлеб?" },
      { who: "Alex", en: "No, thank you. I don't like bread.", ru: "Нет, спасибо. Я не люблю хлеб." },
      { who: "Alex", en: "But I like pizza!", ru: "Зато я люблю пиццу!" },
      { who: "Waiter", en: "Sorry, we have an apple and water.", ru: "Извините, у нас есть яблоко и вода." }
    ],
    grammar: {
      title: "I have / I like / I want",
      html: `
        <p>Три самых нужных глагола. После них сразу идёт то, что мы имеем, любим или хотим:</p>
        <div class="gbox"><b>I have</b> water. — У меня есть вода.<br><b>I like</b> pizza. — Я люблю пиццу.<br><b>I want</b> a coffee. — Я хочу кофе.</div>
        <p><b>Отрицание</b>: добавляем <b>don't</b> (do not) перед глаголом:</p>
        <div class="gbox">I <b>don't</b> like bread.<br>I <b>don't</b> want coffee.</div>
        <p><b>Вопрос</b>: начинаем со слова <b>Do</b>:</p>
        <div class="gbox"><b>Do</b> you like coffee? — Yes, I do. / No, I don't.</div>
        <p class="tip">💡 Когда говорим о еде вообще, артикль не нужен: I like pizza, а не «I like a pizza». Артикль нужен, когда речь об одной конкретной штуке: I want <b>a</b> coffee.</p>`
    },
    sentences: [
      { en: "I want a coffee, please.", ru: "Я хочу кофе, пожалуйста." },
      { en: "I like pizza.", ru: "Я люблю пиццу." },
      { en: "I don't like bread.", ru: "Я не люблю хлеб.", gap: "don't", alt: ["doesn't", "not", "no"] },
      { en: "Do you like coffee?", ru: "Ты любишь кофе?", gap: "Do", alt: ["Are", "Is", "Am"] },
      { en: "I have water.", ru: "У меня есть вода.", gap: "have", alt: ["am", "is", "are"] },
      { en: "I drink water and eat bread.", ru: "Я пью воду и ем хлеб." }
    ]
  },
  {
    id: "u5",
    emoji: "🎮",
    title: "Мой день",
    desc: "Present Simple: I play, he plays",
    words: [
      { en: "play", ru: "играть", emoji: "🎮" },
      { en: "work", ru: "работать, работа", emoji: "💼" },
      { en: "sleep", ru: "спать", emoji: "😴" },
      { en: "game", ru: "игра", emoji: "🕹️" },
      { en: "music", ru: "музыка", emoji: "🎵" },
      { en: "watch", ru: "смотреть", emoji: "👀" },
      { en: "morning", ru: "утро", emoji: "🌅" },
      { en: "night", ru: "ночь", emoji: "🌙" },
      { en: "every day", ru: "каждый день", emoji: "📅" },
      { en: "wake up", ru: "просыпаться", emoji: "⏰" }
    ],
    dialogue: [
      { who: "Kate", en: "What do you do every day?", ru: "Что ты делаешь каждый день?" },
      { who: "Alex", en: "I wake up early and I work in the morning.", ru: "Я рано просыпаюсь и работаю по утрам." },
      { who: "Alex", en: "At night I play games.", ru: "Ночью я играю в игры." },
      { who: "Kate", en: "Do you sleep at night?", ru: "А ты спишь ночью?" },
      { who: "Alex", en: "Yes, I do. But my brother plays games all night!", ru: "Да. А вот мой брат играет в игры всю ночь!" },
      { who: "Kate", en: "He doesn't sleep?", ru: "Он не спит?" }
    ],
    grammar: {
      title: "Present Simple: что я делаю регулярно",
      html: `
        <p>Это время для привычек и регулярных действий: что делаю каждый день, люблю, работаю.</p>
        <table class="gt">
          <tr><th>Кто</th><th>Глагол</th><th>Пример</th></tr>
          <tr><td>I / you / we / they</td><td>play</td><td>I play games.</td></tr>
          <tr><td>he / she / it</td><td>play<b>s</b></td><td>He play<b>s</b> games.</td></tr>
        </table>
        <p>Главное правило: у <b>he / she / it</b> к глаголу добавляется <b>-s</b> (watch → watch<b>es</b>).</p>
        <p><b>Отрицание</b>: I <b>don't</b> work. / He <b>doesn't</b> work. После doesn't глагол возвращается без -s.</p>
        <p><b>Вопрос</b>: <b>Do</b> you play? / <b>Does</b> he play? После does тоже без -s.</p>
        <p class="tip">💡 Самая частая ошибка русскоговорящих: «He don't like» и «Does he plays?». Запомни: <b>-s живёт только в утверждении</b>, а в отрицании и вопросе его забирает does.</p>`
    },
    sentences: [
      { en: "I play games every day.", ru: "Я играю в игры каждый день." },
      { en: "He plays games at night.", ru: "Он играет в игры ночью.", gap: "plays", alt: ["play", "playing", "to play"] },
      { en: "She works in the morning.", ru: "Она работает утром.", gap: "works", alt: ["work", "working", "to work"] },
      { en: "I sleep at night.", ru: "Я сплю ночью." },
      { en: "Does he like music?", ru: "Он любит музыку?", gap: "Does", alt: ["Do", "Is", "Are"] },
      { en: "He doesn't work at night.", ru: "Он не работает по ночам.", gap: "doesn't", alt: ["don't", "isn't", "not"] }
    ]
  }
];
