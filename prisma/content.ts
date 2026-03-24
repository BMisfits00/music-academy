// Contenido de lecciones y desafíos para los 9 módulos.
// Redactado de forma original para evitar problemas de derechos de autor.
// Basado en teoría musical universal.

export interface LessonData {
  title: string;
  content: string; // HTML
  order: number;
}

export interface ChallengeData {
  question: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "PRACTICAL";
  options: string[];
  correctAnswer: string; // índice como string ("0", "1", etc.)
  explanation: string;
  order: number;
}

export interface ModuleContent {
  lessons: LessonData[];
  challenges: ChallengeData[];
}

// Clave: coincide con el sufijo del ID estático del módulo (ej: "level-1-mod-1")
export const MODULE_CONTENT: Record<string, ModuleContent> = {

  // ══════════════════════════════════════════════════════
  // NIVEL 1 — PRINCIPIANTE
  // ══════════════════════════════════════════════════════

  "level-1-mod-1": {
    lessons: [
      {
        order: 1,
        title: "El pentagrama y las claves",
        content: `
<h2>El pentagrama</h2>
<p>El <strong>pentagrama</strong> es el sistema formado por 5 líneas horizontales paralelas y 4 espacios entre ellas, en el cual se escribe la música. Las líneas y espacios se numeran de abajo hacia arriba.</p>
<ul>
  <li><strong>Líneas:</strong> 1ª (inferior) → 5ª (superior)</li>
  <li><strong>Espacios:</strong> 1º (entre líneas 1 y 2) → 4º (entre líneas 4 y 5)</li>
</ul>
<p>Las notas también pueden ubicarse por encima o por debajo del pentagrama mediante <strong>líneas adicionales</strong>.</p>

<h2>La clave de Sol</h2>
<p>La <strong>clave de Sol</strong> se coloca al inicio del pentagrama y su bucle rodea la <strong>2ª línea</strong>, que es donde se ubica la nota Sol. A partir de esa referencia se deducen todas las demás notas.</p>
<p>Se usa para: guitarra, piano (mano derecha), violín, flauta y voces agudas.</p>

<h2>La clave de Fa</h2>
<p>La <strong>clave de Fa</strong> indica que la nota Fa se ubica en la <strong>4ª línea</strong>. Se usa para instrumentos y voces graves.</p>
<p>Se usa para: bajo, contrabajo, cello, trombón y mano izquierda del piano.</p>
        `.trim(),
      },
      {
        order: 2,
        title: "Figuras rítmicas, silencios y el compás",
        content: `
<h2>Las figuras rítmicas</h2>
<p>Las <strong>figuras rítmicas</strong> determinan la duración de cada sonido. Cada figura tiene su <strong>silencio</strong> equivalente, que indica ausencia de sonido por la misma duración.</p>
<ul>
  <li><strong>Redonda</strong> — 4 tiempos</li>
  <li><strong>Blanca</strong> — 2 tiempos</li>
  <li><strong>Negra</strong> — 1 tiempo (unidad de pulso)</li>
  <li><strong>Corchea</strong> — ½ tiempo</li>
  <li><strong>Semicorchea</strong> — ¼ tiempo</li>
</ul>
<p>Cada figura vale exactamente la mitad de la anterior: 2 blancas = 1 redonda, 2 negras = 1 blanca, etc.</p>

<h2>El compás</h2>
<p>El <strong>compás</strong> organiza el tiempo en grupos regulares de pulsos. Las <strong>barras de compás</strong> dividen el pentagrama en estos grupos.</p>
<p>La <strong>indicación de compás</strong> aparece al inicio como dos números apilados:</p>
<ul>
  <li><strong>Número superior:</strong> cantidad de tiempos por compás</li>
  <li><strong>Número inferior:</strong> qué figura vale 1 tiempo (4 = negra, 2 = blanca, 8 = corchea)</li>
</ul>
<blockquote>Ejemplo: en <strong>4/4</strong> hay 4 tiempos por compás y la negra vale 1 tiempo. Es el compás más utilizado en música popular.</blockquote>
        `.trim(),
      },
    ],
    challenges: [
      {
        order: 1,
        question: "¿Cuántas líneas tiene el pentagrama?",
        type: "MULTIPLE_CHOICE",
        options: ["3 líneas", "4 líneas", "5 líneas", "6 líneas"],
        correctAnswer: "2",
        explanation: "El pentagrama está formado por exactamente 5 líneas horizontales y 4 espacios entre ellas.",
      },
      {
        order: 2,
        question: "La clave de Sol indica que la nota Sol se ubica en la...",
        type: "MULTIPLE_CHOICE",
        options: ["1ª línea", "2ª línea", "3ª línea", "4ª línea"],
        correctAnswer: "1",
        explanation: "El bucle de la clave de Sol rodea la 2ª línea del pentagrama, fijando ahí la posición de la nota Sol.",
      },
      {
        order: 3,
        question: "¿Cuántos tiempos dura una blanca?",
        type: "MULTIPLE_CHOICE",
        options: ["1 tiempo", "2 tiempos", "3 tiempos", "4 tiempos"],
        correctAnswer: "1",
        explanation: "La blanca dura 2 tiempos. Equivale a 2 negras o a la mitad de una redonda.",
      },
      {
        order: 4,
        question: "¿Cuántos tiempos dura una redonda?",
        type: "MULTIPLE_CHOICE",
        options: ["1 tiempo", "2 tiempos", "3 tiempos", "4 tiempos"],
        correctAnswer: "3",
        explanation: "La redonda es la figura de mayor duración básica: vale 4 tiempos.",
      },
      {
        order: 5,
        question: "La clave de Fa se usa principalmente para instrumentos graves como el bajo y el contrabajo.",
        type: "TRUE_FALSE",
        options: ["Verdadero", "Falso"],
        correctAnswer: "0",
        explanation: "Correcto. La clave de Fa es la clave de los instrumentos y voces graves.",
      },
      {
        order: 6,
        question: "En un compás de 4/4, el número inferior (4) indica que...",
        type: "MULTIPLE_CHOICE",
        options: [
          "Hay 4 compases en la pieza",
          "La negra vale 1 tiempo",
          "Hay 4 instrumentos",
          "El tempo es rápido",
        ],
        correctAnswer: "1",
        explanation: "El número inferior en la indicación de compás indica qué figura vale 1 tiempo. El 4 corresponde a la negra.",
      },
      {
        order: 7,
        question: "Una corchea dura el doble que una negra.",
        type: "TRUE_FALSE",
        options: ["Verdadero", "Falso"],
        correctAnswer: "1",
        explanation: "Falso. La corchea dura la mitad de una negra (½ tiempo), no el doble.",
      },
    ],
  },

  "level-1-mod-2": {
    lessons: [
      {
        order: 1,
        title: "Pulso, acento y tempo",
        content: `
<h2>El pulso</h2>
<p>El <strong>pulso</strong> es el latido regular y constante de la música. Es la unidad básica de tiempo que percibimos cuando escuchamos una canción y empezamos a mover el pie o a aplaudir.</p>
<p>El pulso no siempre se escucha explícitamente, pero siempre está presente como referencia interna.</p>

<h2>El acento</h2>
<p>Dentro de cada compás, algunos pulsos tienen más peso o energía que otros. A esto se le llama <strong>acento</strong>.</p>
<ul>
  <li>En un compás de <strong>4/4</strong>: los tiempos 1 y 3 son fuertes, el 2 y el 4 son débiles.</li>
  <li>En un compás de <strong>3/4</strong>: el tiempo 1 es fuerte, el 2 y 3 son débiles.</li>
  <li>En un compás de <strong>2/4</strong>: el tiempo 1 es fuerte, el 2 es débil.</li>
</ul>
<p>El primer tiempo de cada compás siempre es el más acentuado.</p>

<h2>El tempo</h2>
<p>El <strong>tempo</strong> indica la velocidad del pulso, medida en <strong>BPM</strong> (beats per minute / pulsos por minuto).</p>
<ul>
  <li><strong>Lento:</strong> 40–66 BPM (Largo, Adagio)</li>
  <li><strong>Moderado:</strong> 66–120 BPM (Andante, Moderato)</li>
  <li><strong>Rápido:</strong> 120–200 BPM (Allegro, Presto)</li>
</ul>
<p>El <strong>metrónomo</strong> es la herramienta que marca el pulso a un tempo fijo. Usarlo es fundamental para desarrollar precisión rítmica.</p>
        `.trim(),
      },
      {
        order: 2,
        title: "Subdivisión binaria y ternaria",
        content: `
<h2>¿Qué es la subdivisión?</h2>
<p>La <strong>subdivisión</strong> es la división interna del pulso en partes iguales. Cada negra (1 pulso) se puede dividir en partes más pequeñas.</p>

<h2>Subdivisión binaria</h2>
<p>Cuando el pulso se divide en <strong>2 partes iguales</strong>, hablamos de subdivisión binaria. Cada negra se divide en 2 corcheas.</p>
<p>Es la subdivisión más común en música popular, rock, cumbia, etc.</p>
<blockquote>Negra = 2 corcheas = 4 semicorcheas</blockquote>

<h2>Subdivisión ternaria</h2>
<p>Cuando el pulso se divide en <strong>3 partes iguales</strong>, hablamos de subdivisión ternaria. Cada negra se divide en 3 corcheas de tresillo.</p>
<p>Es característica del jazz, blues, shuffle y estilos como el swing.</p>
<blockquote>Negra = 3 corcheas de tresillo</blockquote>

<h2>El tresillo</h2>
<p>El <strong>tresillo</strong> es un grupo de 3 notas que se tocan en el tiempo que normalmente ocuparían 2. Se indica con el número 3 sobre las notas.</p>
<p>Cambiar entre subdivisión binaria y ternaria es una habilidad clave para cualquier músico.</p>
        `.trim(),
      },
    ],
    challenges: [
      {
        order: 1,
        question: "¿Qué es el pulso en música?",
        type: "MULTIPLE_CHOICE",
        options: [
          "La velocidad a la que toca el instrumento",
          "El latido regular y constante de la música",
          "La nota más fuerte de un compás",
          "La cantidad de instrumentos en una canción",
        ],
        correctAnswer: "1",
        explanation: "El pulso es la unidad básica de tiempo, el latido regular que percibimos en la música.",
      },
      {
        order: 2,
        question: "En un compás de 4/4, ¿cuál es el tiempo más acentuado?",
        type: "MULTIPLE_CHOICE",
        options: ["El tiempo 2", "El tiempo 3", "El tiempo 4", "El tiempo 1"],
        correctAnswer: "3",
        explanation: "El primer tiempo de cada compás siempre es el más acentuado (fuerte).",
      },
      {
        order: 3,
        question: "El BPM mide la velocidad del pulso en pulsos por minuto.",
        type: "TRUE_FALSE",
        options: ["Verdadero", "Falso"],
        correctAnswer: "0",
        explanation: "Correcto. BPM significa Beats Per Minute (pulsos por minuto) y define el tempo.",
      },
      {
        order: 4,
        question: "En la subdivisión binaria, cada pulso se divide en...",
        type: "MULTIPLE_CHOICE",
        options: ["1 parte", "2 partes iguales", "3 partes iguales", "4 partes iguales"],
        correctAnswer: "1",
        explanation: "La subdivisión binaria divide cada pulso en 2 partes iguales (negra = 2 corcheas).",
      },
      {
        order: 5,
        question: "El tresillo divide el pulso en 3 partes iguales.",
        type: "TRUE_FALSE",
        options: ["Verdadero", "Falso"],
        correctAnswer: "0",
        explanation: "Correcto. El tresillo permite subdivisión ternaria: 3 notas en el espacio de 2.",
      },
      {
        order: 6,
        question: "¿Cuál de estos estilos usa típicamente subdivisión ternaria (swing)?",
        type: "MULTIPLE_CHOICE",
        options: ["Marcha militar", "Jazz y blues", "Cumbia", "Bossa nova"],
        correctAnswer: "1",
        explanation: "El jazz y el blues se caracterizan por el swing, que usa subdivisión ternaria.",
      },
    ],
  },

  "level-1-mod-3": {
    lessons: [
      {
        order: 1,
        title: "Las notas en el pentagrama y las alteraciones",
        content: `
<h2>Los nombres de las notas</h2>
<p>En la tradición musical occidental se usan <strong>7 notas naturales</strong>: Do, Re, Mi, Fa, Sol, La, Si. Estas se repiten en distintas <strong>octavas</strong> (registros agudos o graves).</p>
<p>En clave de Sol, leyendo de abajo hacia arriba en el pentagrama:</p>
<ul>
  <li><strong>Líneas:</strong> Mi – Sol – Si – Re – Fa (truco: Mi Sube Si Re Fácil)</li>
  <li><strong>Espacios:</strong> Fa – La – Do – Mi</li>
</ul>

<h2>Las alteraciones</h2>
<p>Las <strong>alteraciones</strong> modifican la altura de una nota en medio tono:</p>
<ul>
  <li><strong>Sostenido (#):</strong> sube la nota medio tono. Ej: Do# es medio tono más agudo que Do.</li>
  <li><strong>Bemol (b):</strong> baja la nota medio tono. Ej: Sib es medio tono más grave que Si.</li>
  <li><strong>Becuadro (♮):</strong> cancela cualquier alteración anterior y devuelve la nota a su estado natural.</li>
</ul>
<p>Las alteraciones son válidas durante todo el compás a partir de donde aparecen, a menos que se cancelen con un becuadro.</p>
        `.trim(),
      },
      {
        order: 2,
        title: "La tonalidad de Do Mayor",
        content: `
<h2>¿Qué es una tonalidad?</h2>
<p>La <strong>tonalidad</strong> es el centro gravitacional de la música: una nota y una escala que sirven de "hogar". La mayoría de las canciones están en una tonalidad específica.</p>

<h2>La escala de Do Mayor</h2>
<p>La escala de <strong>Do Mayor</strong> es la más sencilla porque usa únicamente las 7 notas naturales, sin sostenidos ni bemoles:</p>
<blockquote>Do – Re – Mi – Fa – Sol – La – Si – Do</blockquote>
<p>Su construcción sigue un patrón de <strong>tonos (T) y semitonos (S)</strong>:</p>
<blockquote>T – T – S – T – T – T – S</blockquote>
<ul>
  <li>Entre Mi y Fa hay un semitono natural.</li>
  <li>Entre Si y Do hay un semitono natural.</li>
  <li>Todos los demás intervalos son tonos.</li>
</ul>

<h2>¿Por qué empezar por Do Mayor?</h2>
<p>Do Mayor es la escala de referencia para entender todas las demás. Una vez que comprendés su patrón (T-T-S-T-T-T-S), podés construir una escala mayor desde cualquier nota.</p>
        `.trim(),
      },
    ],
    challenges: [
      {
        order: 1,
        question: "¿Cuántas notas naturales existen en la música occidental?",
        type: "MULTIPLE_CHOICE",
        options: ["5 notas", "6 notas", "7 notas", "12 notas"],
        correctAnswer: "2",
        explanation: "Las 7 notas naturales son: Do, Re, Mi, Fa, Sol, La, Si.",
      },
      {
        order: 2,
        question: "Un sostenido (#) baja la nota medio tono.",
        type: "TRUE_FALSE",
        options: ["Verdadero", "Falso"],
        correctAnswer: "1",
        explanation: "Falso. El sostenido SUBE la nota medio tono. El bemol es el que baja.",
      },
      {
        order: 3,
        question: "¿Qué hace el becuadro (♮) sobre una nota?",
        type: "MULTIPLE_CHOICE",
        options: [
          "La sube un tono",
          "La baja medio tono",
          "Cancela cualquier alteración previa",
          "La hace más fuerte",
        ],
        correctAnswer: "2",
        explanation: "El becuadro anula sostenidos y bemoles, devolviendo la nota a su estado natural.",
      },
      {
        order: 4,
        question: "La escala de Do Mayor no tiene sostenidos ni bemoles.",
        type: "TRUE_FALSE",
        options: ["Verdadero", "Falso"],
        correctAnswer: "0",
        explanation: "Correcto. Do Mayor usa únicamente las 7 notas naturales sin alteraciones.",
      },
      {
        order: 5,
        question: "¿Entre qué par de notas hay un semitono natural en la escala de Do Mayor?",
        type: "MULTIPLE_CHOICE",
        options: ["Do y Re", "Re y Mi", "Mi y Fa", "Sol y La"],
        correctAnswer: "2",
        explanation: "En la escala mayor los semitonos naturales están entre Mi-Fa y entre Si-Do.",
      },
      {
        order: 6,
        question: "El patrón de tonos y semitonos de la escala mayor es: T-T-S-T-T-T-S.",
        type: "TRUE_FALSE",
        options: ["Verdadero", "Falso"],
        correctAnswer: "0",
        explanation: "Correcto. Ese patrón define a cualquier escala mayor, independientemente de la nota de inicio.",
      },
      {
        order: 7,
        question: "¿Cuál es el 'centro gravitacional' de una tonalidad?",
        type: "MULTIPLE_CHOICE",
        options: [
          "La nota más aguda de la escala",
          "La nota y escala que funcionan como 'hogar' de la música",
          "El instrumento principal",
          "El tempo de la canción",
        ],
        correctAnswer: "1",
        explanation: "La tonalidad define el centro tonal: la nota y escala alrededor de las cuales gira la música.",
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // NIVEL 2 — INTERMEDIO
  // ══════════════════════════════════════════════════════

  "level-2-mod-1": {
    lessons: [
      {
        order: 1,
        title: "Intervalos: definición y clasificación",
        content: `
<h2>¿Qué es un intervalo?</h2>
<p>Un <strong>intervalo</strong> es la distancia entre dos notas. Se mide contando desde la nota inferior hasta la superior (inclusive), usando los nombres de las notas.</p>
<p>Pueden ser <strong>melódicos</strong> (notas consecutivas) o <strong>armónicos</strong> (notas simultáneas).</p>

<h2>Tipos de intervalos</h2>
<ul>
  <li><strong>2ª (segunda):</strong> Do → Re (1 tono)</li>
  <li><strong>3ª (tercera):</strong> Do → Mi (2 tonos)</li>
  <li><strong>4ª (cuarta):</strong> Do → Fa (2½ tonos)</li>
  <li><strong>5ª (quinta):</strong> Do → Sol (3½ tonos)</li>
  <li><strong>6ª (sexta):</strong> Do → La (4½ tonos)</li>
  <li><strong>7ª (séptima):</strong> Do → Si (5½ tonos)</li>
  <li><strong>8ª (octava):</strong> Do → Do (6 tonos) — la misma nota en registro diferente</li>
</ul>

<h2>Calidad de los intervalos</h2>
<p>Además del número, los intervalos tienen una <strong>calidad</strong>:</p>
<ul>
  <li><strong>Mayor (M):</strong> 2ª, 3ª, 6ª, 7ª de la escala mayor.</li>
  <li><strong>Justo (J):</strong> 4ª, 5ª y 8ª. Son los más estables.</li>
  <li><strong>Menor (m):</strong> Un semitono menos que el Mayor.</li>
  <li><strong>Disminuido (dis):</strong> Un semitono menos que el Justo o Menor.</li>
  <li><strong>Aumentado (aum):</strong> Un semitono más que el Mayor o Justo.</li>
</ul>
        `.trim(),
      },
      {
        order: 2,
        title: "La escala mayor y el círculo de quintas",
        content: `
<h2>Construcción de la escala mayor</h2>
<p>Cualquier escala mayor se construye aplicando el patrón <strong>T-T-S-T-T-T-S</strong> desde la nota elegida como tónica.</p>
<p>Ejemplo: escala de <strong>Sol Mayor</strong>:</p>
<blockquote>Sol – La – Si – Do – Re – Mi – Fa# – Sol</blockquote>
<p>El Fa# es necesario para mantener el patrón correcto de tonos y semitonos.</p>

<h2>El círculo de quintas</h2>
<p>El <strong>círculo de quintas</strong> organiza las 12 tonalidades mayores en forma circular, donde cada tonalidad está a una 5ª justa de la siguiente.</p>
<ul>
  <li>Moviéndose hacia la derecha se agrega un sostenido por tonalidad.</li>
  <li>Moviéndose hacia la izquierda se agrega un bemol por tonalidad.</li>
</ul>
<p>Orden de sostenidos: <strong>Fa – Do – Sol – Re – La – Mi – Si</strong></p>
<p>Orden de bemoles: <strong>Si – Mi – La – Re – Sol – Do – Fa</strong></p>
<blockquote>Truco: Do no tiene alteraciones, Sol tiene 1#, Re tiene 2#, Fa tiene 1b, Sib tiene 2b, etc.</blockquote>
        `.trim(),
      },
    ],
    challenges: [
      {
        order: 1,
        question: "¿Cómo se mide un intervalo?",
        type: "MULTIPLE_CHOICE",
        options: [
          "Contando los semitonos entre dos notas",
          "Contando las notas desde la inferior a la superior inclusive",
          "Comparando el volumen de dos notas",
          "Midiendo la duración de las notas",
        ],
        correctAnswer: "1",
        explanation: "El número del intervalo se obtiene contando las notas involucradas, incluyendo las dos extremas.",
      },
      {
        order: 2,
        question: "Los intervalos de 4ª, 5ª y 8ª se clasifican como intervalos...",
        type: "MULTIPLE_CHOICE",
        options: ["Mayores", "Menores", "Justos", "Aumentados"],
        correctAnswer: "2",
        explanation: "4ª, 5ª y 8ª son intervalos Justos por su carácter estable y consonante.",
      },
      {
        order: 3,
        question: "La escala de Sol Mayor tiene un Fa sostenido (#).",
        type: "TRUE_FALSE",
        options: ["Verdadero", "Falso"],
        correctAnswer: "0",
        explanation: "Correcto. Para mantener el patrón T-T-S-T-T-T-S desde Sol, el 7º grado (Fa) debe subir un semitono.",
      },
      {
        order: 4,
        question: "Un intervalo menor es un semitono MÁS que el intervalo mayor equivalente.",
        type: "TRUE_FALSE",
        options: ["Verdadero", "Falso"],
        correctAnswer: "1",
        explanation: "Falso. Un intervalo menor es un semitono MENOS que el mayor (no más).",
      },
      {
        order: 5,
        question: "En el círculo de quintas, ¿qué sucede al moverse hacia la derecha?",
        type: "MULTIPLE_CHOICE",
        options: [
          "Se agrega un bemol a la tonalidad",
          "Se agrega un sostenido a la tonalidad",
          "La tonalidad se vuelve menor",
          "El tempo aumenta",
        ],
        correctAnswer: "1",
        explanation: "Cada paso hacia la derecha en el círculo de quintas agrega un sostenido a la armadura.",
      },
      {
        order: 6,
        question: "¿Cuántos sostenidos tiene la tonalidad de Re Mayor?",
        type: "MULTIPLE_CHOICE",
        options: ["1 sostenido", "2 sostenidos", "3 sostenidos", "4 sostenidos"],
        correctAnswer: "1",
        explanation: "Re Mayor tiene 2 sostenidos: Fa# y Do#. Siguiendo el orden Do(0#) → Sol(1#) → Re(2#).",
      },
      {
        order: 7,
        question: "¿Cuál es el intervalo entre Do y Sol?",
        type: "MULTIPLE_CHOICE",
        options: ["3ª justa", "4ª justa", "5ª justa", "6ª mayor"],
        correctAnswer: "2",
        explanation: "De Do a Sol: Do(1)-Re(2)-Mi(3)-Fa(4)-Sol(5) → es una 5ª justa.",
      },
    ],
  },

  "level-2-mod-2": {
    lessons: [
      {
        order: 1,
        title: "Compases compuestos: 6/8, 9/8 y 12/8",
        content: `
<h2>Compases simples vs. compuestos</h2>
<p>En los <strong>compases simples</strong> (2/4, 3/4, 4/4) cada tiempo se subdivide en 2 partes iguales.</p>
<p>En los <strong>compases compuestos</strong> cada tiempo se subdivide en 3 partes iguales. El número inferior suele ser 8 (la corchea).</p>

<h2>El 6/8</h2>
<p>Tiene 6 corcheas por compás, agrupadas en <strong>2 tiempos de 3 corcheas</strong> cada uno. Se siente como un compás de 2 tiempos con subdivisión ternaria.</p>
<p>Se usa mucho en: tarantela, barcarola, baladas lentas, música celta.</p>

<h2>El 9/8 y el 12/8</h2>
<ul>
  <li><strong>9/8:</strong> 9 corcheas → 3 tiempos de 3 corcheas. Sensación de vals con subdivisión ternaria.</li>
  <li><strong>12/8:</strong> 12 corcheas → 4 tiempos de 3 corcheas. Muy usado en blues lento y baladas.</li>
</ul>
<blockquote>Clave práctica: en un compás compuesto, dividí el número de arriba por 3 para saber cuántos tiempos hay.</blockquote>
        `.trim(),
      },
      {
        order: 2,
        title: "Ligaduras, puntillos y síncopa",
        content: `
<h2>La ligadura de prolongación</h2>
<p>La <strong>ligadura de prolongación</strong> une dos notas de la misma altura con una curva. La segunda nota no se ataca, sino que se prolonga la duración de la primera.</p>
<p>Permite crear duraciones que no existen como figura única. Ej: una negra ligada a una corchea = 1½ tiempos.</p>

<h2>El puntillo</h2>
<p>Un <strong>puntillo</strong> (punto colocado a la derecha de una figura) aumenta su duración en la mitad de su valor original.</p>
<ul>
  <li>Negra con puntillo = 1 + ½ = 1½ tiempos</li>
  <li>Blanca con puntillo = 2 + 1 = 3 tiempos</li>
  <li>Corchea con puntillo = ½ + ¼ = ¾ tiempos</li>
</ul>

<h2>La síncopa</h2>
<p>La <strong>síncopa</strong> es el desplazamiento del acento a un tiempo débil o a la parte débil de un tiempo. Crea una sensación de tensión y movimiento.</p>
<p>Es un recurso fundamental en: funk, salsa, jazz, reggae y gran parte de la música latina.</p>
<blockquote>Ejemplo: en 4/4, atacar en el "y" del tiempo 2 (entre el 2 y el 3) crea una síncopa.</blockquote>
        `.trim(),
      },
    ],
    challenges: [
      {
        order: 1,
        question: "En un compás compuesto, cada tiempo se subdivide en...",
        type: "MULTIPLE_CHOICE",
        options: ["2 partes iguales", "3 partes iguales", "4 partes iguales", "6 partes iguales"],
        correctAnswer: "1",
        explanation: "La característica de los compases compuestos es la subdivisión ternaria (de a 3).",
      },
      {
        order: 2,
        question: "¿Cuántos tiempos reales tiene un compás de 6/8?",
        type: "MULTIPLE_CHOICE",
        options: ["6 tiempos", "3 tiempos", "2 tiempos", "4 tiempos"],
        correctAnswer: "2",
        explanation: "En 6/8 hay 6 corcheas agrupadas en 2 tiempos de 3 corcheas. Se siente como un compás de 2.",
      },
      {
        order: 3,
        question: "Una negra con puntillo dura 1½ tiempos.",
        type: "TRUE_FALSE",
        options: ["Verdadero", "Falso"],
        correctAnswer: "0",
        explanation: "Correcto. El puntillo agrega la mitad del valor: negra (1) + ½ = 1½ tiempos.",
      },
      {
        order: 4,
        question: "La ligadura de prolongación une dos notas haciendo que la segunda se...",
        type: "MULTIPLE_CHOICE",
        options: [
          "Toque más fuerte",
          "No se ataque y prolongue la primera",
          "Toque más suave",
          "Se repita dos veces",
        ],
        correctAnswer: "1",
        explanation: "La ligadura prolonga la duración de la primera nota; la segunda no se articula.",
      },
      {
        order: 5,
        question: "La síncopa coloca el acento en un tiempo fuerte del compás.",
        type: "TRUE_FALSE",
        options: ["Verdadero", "Falso"],
        correctAnswer: "1",
        explanation: "Falso. La síncopa desplaza el acento a un tiempo débil o a la parte débil de un tiempo.",
      },
      {
        order: 6,
        question: "¿En qué géneros es especialmente común la síncopa?",
        type: "MULTIPLE_CHOICE",
        options: [
          "Marcha y vals",
          "Funk, salsa y jazz",
          "Música clásica barroca",
          "Himnos y marchas militares",
        ],
        correctAnswer: "1",
        explanation: "La síncopa es característica del funk, salsa, jazz, reggae y música latina en general.",
      },
    ],
  },

  "level-2-mod-3": {
    lessons: [
      {
        order: 1,
        title: "Las triadas: construcción y tipos",
        content: `
<h2>¿Qué es una triada?</h2>
<p>Una <strong>triada</strong> es el acorde más básico: 3 notas apiladas en intervalos de tercera. Las notas se llaman:</p>
<ul>
  <li><strong>Fundamental:</strong> la nota base que da nombre al acorde.</li>
  <li><strong>Tercera:</strong> a una 3ª de la fundamental.</li>
  <li><strong>Quinta:</strong> a una 5ª de la fundamental.</li>
</ul>

<h2>Tipos de triadas</h2>
<p>El tipo de triada depende de si las terceras son mayores (M = 2 tonos) o menores (m = 1½ tonos):</p>
<ul>
  <li><strong>Mayor:</strong> 3ª Mayor + 3ª Menor. Ej: Do – Mi – Sol. Sonido alegre, brillante.</li>
  <li><strong>Menor:</strong> 3ª Menor + 3ª Mayor. Ej: Do – Mib – Sol. Sonido triste, oscuro.</li>
  <li><strong>Disminuida:</strong> 3ª Menor + 3ª Menor. Ej: Do – Mib – Solb. Sonido tenso, inestable.</li>
  <li><strong>Aumentada:</strong> 3ª Mayor + 3ª Mayor. Ej: Do – Mi – Sol#. Sonido ambiguo, suspendido.</li>
</ul>
        `.trim(),
      },
      {
        order: 2,
        title: "El cifrado americano",
        content: `
<h2>¿Qué es el cifrado americano?</h2>
<p>El <strong>cifrado americano</strong> (también llamado cifrado anglosajón) representa los acordes con letras del alfabeto inglés en lugar de nombres en español.</p>

<h2>Equivalencias</h2>
<ul>
  <li><strong>C</strong> = Do &nbsp;|&nbsp; <strong>D</strong> = Re &nbsp;|&nbsp; <strong>E</strong> = Mi</li>
  <li><strong>F</strong> = Fa &nbsp;|&nbsp; <strong>G</strong> = Sol &nbsp;|&nbsp; <strong>A</strong> = La &nbsp;|&nbsp; <strong>B</strong> = Si</li>
</ul>

<h2>Cómo leer un cifrado</h2>
<ul>
  <li><strong>C</strong> → Do Mayor</li>
  <li><strong>Cm</strong> (o Cmin) → Do menor</li>
  <li><strong>Cdim</strong> (o C°) → Do disminuido</li>
  <li><strong>Caug</strong> (o C+) → Do aumentado</li>
  <li><strong>C7</strong> → Do con séptima menor (dominante)</li>
  <li><strong>Cmaj7</strong> → Do con séptima mayor</li>
</ul>
<blockquote>La letra sola siempre indica acorde Mayor. La "m" minúscula indica menor.</blockquote>

<h2>¿Para qué sirve?</h2>
<p>El cifrado americano se usa en partituras de jazz, pop, rock, y en la guitarra y el piano populares. Es el sistema estándar en la mayoría de los libros y plataformas de música actuales.</p>
        `.trim(),
      },
    ],
    challenges: [
      {
        order: 1,
        question: "¿Cuántas notas tiene una triada?",
        type: "MULTIPLE_CHOICE",
        options: ["2 notas", "3 notas", "4 notas", "5 notas"],
        correctAnswer: "1",
        explanation: "Una triada está formada exactamente por 3 notas: fundamental, tercera y quinta.",
      },
      {
        order: 2,
        question: "Una triada Mayor se forma con...",
        type: "MULTIPLE_CHOICE",
        options: [
          "3ª Menor + 3ª Mayor",
          "3ª Mayor + 3ª Mayor",
          "3ª Mayor + 3ª Menor",
          "3ª Menor + 3ª Menor",
        ],
        correctAnswer: "2",
        explanation: "Mayor = 3ª Mayor (2T) + 3ª Menor (1½T). Ej: Do-Mi-Sol.",
      },
      {
        order: 3,
        question: "En cifrado americano, la letra 'G' representa la nota...",
        type: "MULTIPLE_CHOICE",
        options: ["La", "Si", "Sol", "Fa"],
        correctAnswer: "2",
        explanation: "G = Sol en el sistema anglosajón. C=Do, D=Re, E=Mi, F=Fa, G=Sol, A=La, B=Si.",
      },
      {
        order: 4,
        question: "En cifrado americano, 'Am' representa...",
        type: "MULTIPLE_CHOICE",
        options: ["La Mayor", "La menor", "La aumentado", "La disminuido"],
        correctAnswer: "1",
        explanation: "La letra sola = Mayor. La 'm' minúscula indica acorde menor. Am = La menor.",
      },
      {
        order: 5,
        question: "La triada disminuida tiene un sonido estable y agradable.",
        type: "TRUE_FALSE",
        options: ["Verdadero", "Falso"],
        correctAnswer: "1",
        explanation: "Falso. La triada disminuida (3ªm + 3ªm) tiene un sonido tenso e inestable.",
      },
      {
        order: 6,
        question: "¿Cuál es la triada formada por Do – Mib – Sol?",
        type: "MULTIPLE_CHOICE",
        options: ["Do Mayor", "Do menor", "Do disminuido", "Do aumentado"],
        correctAnswer: "1",
        explanation: "Do–Mib (3ª menor) + Mib–Sol (3ª mayor) = estructura de triada menor.",
      },
      {
        order: 7,
        question: "El cifrado americano es el sistema estándar en música popular, jazz y rock.",
        type: "TRUE_FALSE",
        options: ["Verdadero", "Falso"],
        correctAnswer: "0",
        explanation: "Correcto. Es el sistema más usado a nivel mundial en géneros populares.",
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // NIVEL 3 — AVANZADO
  // ══════════════════════════════════════════════════════

  "level-3-mod-1": {
    lessons: [
      {
        order: 1,
        title: "Grados de la escala y sus funciones",
        content: `
<h2>Los 7 grados de la escala</h2>
<p>Cada nota de la escala mayor se llama <strong>grado</strong> y se representa con números romanos. Sobre cada grado se construye un acorde usando exclusivamente las notas de la escala.</p>
<p>En Do Mayor:</p>
<ul>
  <li><strong>I</strong> → C Mayor (tónica)</li>
  <li><strong>II</strong> → D menor (subdominante)</li>
  <li><strong>III</strong> → E menor (tónica)</li>
  <li><strong>IV</strong> → F Mayor (subdominante)</li>
  <li><strong>V</strong> → G Mayor (dominante)</li>
  <li><strong>VI</strong> → A menor (tónica relativa)</li>
  <li><strong>VII</strong> → B disminuido (dominante)</li>
</ul>

<h2>Las tres funciones armónicas</h2>
<ul>
  <li><strong>Tónica (T):</strong> sensación de reposo y llegada. Grados I, III, VI.</li>
  <li><strong>Subdominante (SD):</strong> sensación de movimiento hacia afuera. Grados II, IV.</li>
  <li><strong>Dominante (D):</strong> tensión que quiere resolver en la tónica. Grados V, VII.</li>
</ul>
<p>El movimiento armónico básico sigue el ciclo: <strong>T → SD → D → T</strong>.</p>
        `.trim(),
      },
      {
        order: 2,
        title: "Progresiones típicas y acordes de 4 sonidos",
        content: `
<h2>Progresiones más usadas</h2>
<p>Una <strong>progresión</strong> es una secuencia de acordes. Las más comunes en música popular son:</p>
<ul>
  <li><strong>II – V – I:</strong> la progresión fundamental del jazz. Ej en C: Dm7 – G7 – Cmaj7.</li>
  <li><strong>I – VI – II – V:</strong> base de miles de canciones de los 50s/60s.</li>
  <li><strong>I – IV – V – I:</strong> la progresión más simple y usada en blues y rock.</li>
  <li><strong>I – V – VI – IV:</strong> usada en pop contemporáneo (ej: "Let It Be", "No Woman No Cry").</li>
</ul>

<h2>Acordes de 4 sonidos</h2>
<p>Se construyen agregando una <strong>séptima</strong> a la triada:</p>
<ul>
  <li><strong>Maj7</strong> (mayor con 7ª mayor): suave, estable. Ej: Cmaj7 = C-E-G-B.</li>
  <li><strong>m7</strong> (menor con 7ª menor): suave, melancólico. Ej: Dm7 = D-F-A-C.</li>
  <li><strong>7</strong> (dominante, mayor con 7ª menor): tenso, quiere resolver. Ej: G7 = G-B-D-F.</li>
  <li><strong>m7b5</strong> (semidisminuido): tenso, oscuro. Ej: Bm7b5 = B-D-F-A.</li>
</ul>
        `.trim(),
      },
    ],
    challenges: [
      {
        order: 1,
        question: "¿Cuál es la función armónica del grado V (dominante)?",
        type: "MULTIPLE_CHOICE",
        options: [
          "Sensación de reposo total",
          "Movimiento hacia afuera de la tónica",
          "Tensión que quiere resolver en la tónica",
          "Es el acorde más oscuro de la escala",
        ],
        correctAnswer: "2",
        explanation: "El dominante (V) genera tensión que naturalmente resuelve en la tónica (I).",
      },
      {
        order: 2,
        question: "En Do Mayor, ¿qué tipo de acorde es el grado II (Re)?",
        type: "MULTIPLE_CHOICE",
        options: ["Mayor", "Menor", "Disminuido", "Aumentado"],
        correctAnswer: "1",
        explanation: "El grado II en cualquier escala mayor es siempre un acorde menor.",
      },
      {
        order: 3,
        question: "La progresión II-V-I es fundamental en el jazz.",
        type: "TRUE_FALSE",
        options: ["Verdadero", "Falso"],
        correctAnswer: "0",
        explanation: "Correcto. El II-V-I es la progresión más característica del lenguaje jazzístico.",
      },
      {
        order: 4,
        question: "El acorde de dominante con séptima (ej: G7) se caracteriza por...",
        type: "MULTIPLE_CHOICE",
        options: [
          "Ser el más estable de la tonalidad",
          "Generar tensión que busca resolver en la tónica",
          "Usarse solo en música triste",
          "Ser igual al acorde mayor",
        ],
        correctAnswer: "1",
        explanation: "El acorde de dominante (7) tiene una 7ª menor que crea tensión armónica.",
      },
      {
        order: 5,
        question: "¿Cuántas notas tiene un acorde Maj7?",
        type: "MULTIPLE_CHOICE",
        options: ["2 notas", "3 notas", "4 notas", "5 notas"],
        correctAnswer: "2",
        explanation: "Los acordes con séptima (7, Maj7, m7, etc.) tienen 4 notas: fundamental, 3ª, 5ª y 7ª.",
      },
      {
        order: 6,
        question: "El ciclo de funciones armónicas básico es: Tónica → Subdominante → Dominante → Tónica.",
        type: "TRUE_FALSE",
        options: ["Verdadero", "Falso"],
        correctAnswer: "0",
        explanation: "Correcto. Ese es el ciclo funcional armónico fundamental: T → SD → D → T.",
      },
      {
        order: 7,
        question: "En la progresión I-V-VI-IV en Do Mayor, ¿cuáles son los acordes?",
        type: "MULTIPLE_CHOICE",
        options: [
          "C – G – Am – F",
          "C – F – G – Am",
          "Am – F – C – G",
          "C – Dm – Em – F",
        ],
        correctAnswer: "0",
        explanation: "I=C, V=G, VI=Am, IV=F. Es una de las progresiones más usadas en pop contemporáneo.",
      },
    ],
  },

  "level-3-mod-2": {
    lessons: [
      {
        order: 1,
        title: "Los modos de la escala mayor",
        content: `
<h2>¿Qué son los modos?</h2>
<p>Los <strong>modos</strong> se obtienen empezando la escala mayor desde cada uno de sus 7 grados. Cada modo tiene un carácter sonoro diferente.</p>

<h2>Los 7 modos (en Do Mayor)</h2>
<ul>
  <li><strong>Jónico</strong> (I): Do-Re-Mi-Fa-Sol-La-Si. Es la escala mayor estándar. Alegre, brillante.</li>
  <li><strong>Dórico</strong> (II): Re-Mi-Fa-Sol-La-Si-Do. Menor con 6ª mayor. Usado en jazz, funk, rock.</li>
  <li><strong>Frigio</strong> (III): Mi-Fa-Sol-La-Si-Do-Re. Menor con 2ª menor. Flamenco, metal.</li>
  <li><strong>Lidio</strong> (IV): Fa-Sol-La-Si-Do-Re-Mi. Mayor con 4ª aumentada. Místico, onírico.</li>
  <li><strong>Mixolidio</strong> (V): Sol-La-Si-Do-Re-Mi-Fa. Mayor con 7ª menor. Blues, rock, dominante.</li>
  <li><strong>Eólico</strong> (VI): La-Si-Do-Re-Mi-Fa-Sol. La escala menor natural. Oscuro, melancólico.</li>
  <li><strong>Locrio</strong> (VII): Si-Do-Re-Mi-Fa-Sol-La. Disminuido. Muy inestable, poco usado.</li>
</ul>
        `.trim(),
      },
      {
        order: 2,
        title: "Escala pentatónica y escala de blues",
        content: `
<h2>La escala pentatónica mayor</h2>
<p>Tiene <strong>5 notas</strong> (penta = 5). Se obtiene quitando la 4ª y la 7ª a la escala mayor.</p>
<blockquote>Do pentatónica mayor: Do – Re – Mi – Sol – La</blockquote>
<p>Es la escala más universal del mundo: aparece en música folk, pop, rock y en tradiciones musicales de todos los continentes.</p>

<h2>La escala pentatónica menor</h2>
<p>Se obtiene quitando la 2ª y la 6ª a la escala menor natural.</p>
<blockquote>La pentatónica menor: La – Do – Re – Mi – Sol</blockquote>
<p>Es la base del rock, blues y gran parte del metal. Suena bien sobre casi cualquier progresión menor.</p>

<h2>La escala de blues</h2>
<p>Se forma agregando la <strong>5ª disminuida</strong> (blue note) a la pentatónica menor:</p>
<blockquote>La blues: La – Do – Re – Mib – Mi – Sol</blockquote>
<p>La "blue note" (Mib en este caso) es la nota característica que da el sonido tenso y expresivo del blues. Es uno de los recursos expresivos más poderosos de la música popular occidental.</p>
        `.trim(),
      },
    ],
    challenges: [
      {
        order: 1,
        question: "¿Cómo se obtienen los modos de la escala mayor?",
        type: "MULTIPLE_CHOICE",
        options: [
          "Cambiando el tempo de la escala",
          "Empezando la misma escala desde cada uno de sus grados",
          "Agregando notas nuevas a la escala mayor",
          "Tocando la escala mayor al revés",
        ],
        correctAnswer: "1",
        explanation: "Los modos se generan tomando la misma escala mayor pero iniciándola desde un grado distinto.",
      },
      {
        order: 2,
        question: "El modo Mixolidio es igual a la escala mayor pero con la 7ª...",
        type: "MULTIPLE_CHOICE",
        options: ["Mayor", "Menor", "Aumentada", "Disminuida"],
        correctAnswer: "1",
        explanation: "Mixolidio = escala mayor con 7ª menor. Es el modo del dominante y muy usado en blues y rock.",
      },
      {
        order: 3,
        question: "La escala pentatónica tiene 5 notas.",
        type: "TRUE_FALSE",
        options: ["Verdadero", "Falso"],
        correctAnswer: "0",
        explanation: "Correcto. 'Penta' significa 5. La pentatónica omite la 4ª y la 7ª de la escala mayor.",
      },
      {
        order: 4,
        question: "La escala de blues se forma agregando una nota a la pentatónica...",
        type: "MULTIPLE_CHOICE",
        options: ["Mayor", "Menor", "Disminuida (blue note)", "Jónica"],
        correctAnswer: "2",
        explanation: "La 'blue note' es la 5ª disminuida agregada a la pentatónica menor, creando la escala de blues.",
      },
      {
        order: 5,
        question: "El modo Eólico es lo mismo que la escala menor natural.",
        type: "TRUE_FALSE",
        options: ["Verdadero", "Falso"],
        correctAnswer: "0",
        explanation: "Correcto. El modo Eólico (VI grado) coincide exactamente con la escala menor natural.",
      },
      {
        order: 6,
        question: "¿Qué modo se caracteriza por tener una 2ª menor y es típico del flamenco?",
        type: "MULTIPLE_CHOICE",
        options: ["Dórico", "Lidio", "Frigio", "Locrio"],
        correctAnswer: "2",
        explanation: "El modo Frigio tiene una 2ª menor que le da su sonido oscuro y es muy usado en flamenco y metal.",
      },
    ],
  },

  "level-3-mod-3": {
    lessons: [
      {
        order: 1,
        title: "Forma de una canción y la frase musical",
        content: `
<h2>Partes de una canción</h2>
<p>La mayoría de las canciones populares sigue una <strong>forma estándar</strong> compuesta por secciones con funciones distintas:</p>
<ul>
  <li><strong>Introducción (Intro):</strong> establece el ambiente. Suele usar la progresión principal.</li>
  <li><strong>Verso (Verse):</strong> narra la historia. La melodía varía pero la progresión se repite.</li>
  <li><strong>Pre-estribillo (Pre-chorus):</strong> opcional, genera expectativa antes del estribillo.</li>
  <li><strong>Estribillo (Chorus):</strong> el punto más emotivo. Se repite varias veces con la misma letra y melodía.</li>
  <li><strong>Puente (Bridge):</strong> contrasta con el resto, aporta variedad antes del último estribillo.</li>
  <li><strong>Coda / Outro:</strong> cierre de la canción.</li>
</ul>
<p>Una forma típica es: <strong>Intro – Verso – Estribillo – Verso – Estribillo – Puente – Estribillo – Outro</strong>.</p>

<h2>La frase musical</h2>
<p>Una <strong>frase musical</strong> es una unidad melódica con sentido completo, comparable a una oración en el lenguaje hablado. Suele tener 4 u 8 compases.</p>
<ul>
  <li><strong>Pregunta (antecedente):</strong> frase que genera expectativa, termina en tensión.</li>
  <li><strong>Respuesta (consecuente):</strong> frase que resuelve la tensión, termina en reposo.</li>
</ul>
        `.trim(),
      },
      {
        order: 2,
        title: "Análisis armónico y nociones de composición",
        content: `
<h2>¿Qué es el análisis armónico?</h2>
<p>El <strong>análisis armónico</strong> consiste en identificar los grados y funciones de los acordes de una canción dentro de su tonalidad.</p>
<p>Pasos básicos:</p>
<ol>
  <li>Identificar la tonalidad (observar la armadura o la progresión).</li>
  <li>Asignar números romanos a cada acorde según su grado.</li>
  <li>Identificar las funciones: Tónica, Subdominante, Dominante.</li>
</ol>
<blockquote>Ejemplo: "La Bamba" en Do Mayor → I (C) – IV (F) – V (G). Es una progresión tónica → subdominante → dominante.</blockquote>

<h2>Nociones de composición</h2>
<p>Para componer una melodía efectiva sobre una armonía:</p>
<ul>
  <li><strong>Notas de acorde:</strong> las más estables (fundamental, 3ª, 5ª). Funcionan en cualquier parte del compás.</li>
  <li><strong>Notas de tensión:</strong> las que no pertenecen al acorde pero pertenecen a la escala. Generan interés pero piden resolución.</li>
  <li><strong>Movimiento:</strong> alternar saltos (intervalos grandes) con grados conjuntos (notas vecinas) para crear variedad.</li>
  <li><strong>Ritmo melódico:</strong> variar los valores rítmicos evita la monotonía.</li>
</ul>
        `.trim(),
      },
    ],
    challenges: [
      {
        order: 1,
        question: "¿Cuál es la sección de una canción que se repite con la misma letra y melodía y es el punto más emotivo?",
        type: "MULTIPLE_CHOICE",
        options: ["Verso", "Intro", "Estribillo", "Puente"],
        correctAnswer: "2",
        explanation: "El estribillo (chorus) es la sección más memorable y emotiva, que se repite múltiples veces.",
      },
      {
        order: 2,
        question: "Una frase musical típica tiene entre 4 y 8 compases.",
        type: "TRUE_FALSE",
        options: ["Verdadero", "Falso"],
        correctAnswer: "0",
        explanation: "Correcto. La frase musical, como unidad melódica con sentido, suele medir 4 u 8 compases.",
      },
      {
        order: 3,
        question: "En una frase musical, la 'pregunta' (antecedente) termina en...",
        type: "MULTIPLE_CHOICE",
        options: [
          "Reposo total en la tónica",
          "Tensión, generando expectativa",
          "Un acorde disminuido",
          "El tempo más rápido",
        ],
        correctAnswer: "1",
        explanation: "El antecedente genera expectativa terminando en tensión. El consecuente resuelve esa tensión.",
      },
      {
        order: 4,
        question: "El análisis armónico asigna números romanos a los acordes según su grado en la tonalidad.",
        type: "TRUE_FALSE",
        options: ["Verdadero", "Falso"],
        correctAnswer: "0",
        explanation: "Correcto. Los números romanos representan los grados y permiten analizar la función de cada acorde.",
      },
      {
        order: 5,
        question: "¿Cuál es la función del puente (bridge) en una canción?",
        type: "MULTIPLE_CHOICE",
        options: [
          "Repetir el estribillo más fuerte",
          "Aportar contraste y variedad antes del último estribillo",
          "Presentar el tema principal por primera vez",
          "Marcar el final de la canción",
        ],
        correctAnswer: "1",
        explanation: "El puente contrasta con el resto de la canción, renovando el interés antes de la repetición final.",
      },
      {
        order: 6,
        question: "En composición, las notas de acorde (fundamental, 3ª, 5ª) son las más estables melódicamente.",
        type: "TRUE_FALSE",
        options: ["Verdadero", "Falso"],
        correctAnswer: "0",
        explanation: "Correcto. Las notas del acorde funcionan en cualquier parte del compás sin generar tensión.",
      },
    ],
  },
};
