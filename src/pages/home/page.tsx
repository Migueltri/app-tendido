'use client';

import React, { useState, useEffect } from "react";
import { Calendar, ChevronRight, ArrowRight } from 'lucide-react';

interface BaseArticle {
  id: number | string;
  title: string;
  plaza?: string;
  date: string;
  category?: string;
  toreros?: string[];
  ganaderia?: string;
  resultado?: string[];
  torerosRaw?: string;
  image: string;
  imageCaption?: string;
  video?: string;
  resumen?: string;
  detalles?: string;
  fullContent?: string;
  excerpt?: string;
  footerImage1?: string;
  footerImage1Caption?: string;
  footerImage2?: string;
  footerImage2Caption?: string;
  footerImage3?: string;
  footerImage3Caption?: string;
  footerImage4?: string;
  footerImage4Caption?: string;
  footerImage5?: string;
  footerImage5Caption?: string;
  footerImage6?: string;
  footerImage6Caption?: string;
  footerImage7?: string;
  footerImage7Caption?: string;	  
  footerImage8?: string;
  footerImage8Caption?: string;
  boldContent?: boolean;
  author?: string;
  authorLogo?: string;
  showAuthorHeader?: boolean;
  authorId?: string;
  rawDate?: string;
  slug?: string;
}

type NewsItem = BaseArticle;
type OpinionArticle = BaseArticle;
type Chronicle = BaseArticle;

const featuredNews: NewsItem[] = [
	{ 
    id: 1009,
    title: `El escritor Rubén Amón ensalza la dimensión taurina de El Puerto en la presentación de “Morante, punto y aparte”`,
	image: "/images/WhatsApp Image 2026-02-15 at 19.13.43.jpg",
    category: "Actualidad",
    date: "16 de Febrero de 2026",
	excerpt: "El teniente de alcalde de Gran Ciudad, Javier Bello, ha acompañado  a la Academia de Bellas Artes Santa Cecilia en un acto que refuerza la agenda cultural de la ciudad y pone en valor la figura de Morante",
	plaza: "Plaza Mayor de Ciudad Rodrigo",
	fullContent: `El Auditorio Municipal Monasterio San Miguel, de El Puerto de Santa Maria, ha acogido la presentación de “Morante, punto y aparte”, la última obra del periodista y escritor Rubén Amón, en un acto organizado por la Academia de Bellas Artes Santa Cecilia que contó con la presencia del teniente de alcalde de Gran Ciudad, Javier Bello.

El autor compartió mesa con el presidente de la Academia, Luis Garrido, y el periodista Paco Reyero, en una cita que congregó a numerosos aficionados y amantes de la cultura. Javier Bello felicitó a la entidad por la organización de una actividad que “contribuye a enriquecer la programación cultural de la ciudad y a proyectar la relevancia de El Puerto en el ámbito taurino”. Asimismo, agradeció a Rubén Amón su presencia dentro de la gira de presentación del libro, reforzando así su vínculo con la Academia, a la que ya visitó el pasado verano con motivo de su libro “Tenemos que hablar”.

En su intervención, el periodista definió a Morante de la Puebla como probablemente el mejor torero de todos los tiempos y, sin duda, el mejor que él ha visto, destacando que su tauromaquia trasciende lo estrictamente técnico para convertirse en una experiencia estética y emocional única. “Cuando termina de torear, el público queda exhausto por el punto de referencia que crea; su expresión artística es descomunal”, afirmó.

Amón evocó también uno de los momentos que vivió el pasado año en la plaza portuense, cuando, acompañado por su hijo, presenció una faena de Morante mientras sonaba el pasodoble “Concha flamenca”, hasta el punto de preguntarle a su hijo por qué no se quedaban “a vivir para siempre en ese instante”. Para Amón, la plaza de toros de El Puerto “forma parte de las grandes escalas de una temporada y de una vida”, asegurando que, junto a Sevilla y Madrid, es el lugar donde ha sido más feliz como aficionado.

Editado por Espasa, el libro combina crónica periodística y ensayo para retratar a Morante como mucho más que un torero: “un acontecimiento, una categoría en sí mismo, una religión civil y un icono cultural de primer orden”. Amón subrayó que la conversión del diestro en fenómeno de masas e icono transversal ha coincidido con la que el escritor considera su temporada más arrebatadora, la de 2025.

Durante el coloquio, el periodista defendió que Morante “se echa la feria a la espalda en el momento más delicado” y que para el diestro el toreo es también “un camino de salvación”, capaz de abrir nuevas sendas en la tauromaquia contemporánea.

El Puerto avanza porque con actos como este continúa consolidando una programación cultural diversa y de calidad, estrechamente vinculada a su identidad y a tradiciones que forman parte de su historia y proyección cultural.`,
	author: "Manolo Herrera",
    authorLogo: "/images/manoloherrera.jpg",
    showAuthorHeader: true
   }
];

const latestNews: NewsItem[] = [
	{ 
    id: 235,
    title: `Sábado en el Carnaval del Toro de Ciudad Rodrigo`,
	image: "/images/ciud.jpg",
    category: "Crónicas",
    date: "15 de Febrero de 2026",
	excerpt: "Cuatro orejas y varios novillos aplaudidos en el arrastre en una tarde marcada por el viento, la huella taurina y el debut con entrega de Moisés Fraile.",
	plaza: "Plaza Mayor de Ciudad Rodrigo",
    ganaderia: "Novillos de las ganaderías de Talavante y un eral de El Pilar.",
	torerosRaw: `Diego Urdiales: una oreja.
Alejandro Talavante: ovación.
Pablo Aguado: una oreja
El Mene: una oreja.
Moisés Fraile: ovación.`,
	fullContent: `En este sábado de carnaval, Ciudad Rodrigo vivió una tarde con una novillada de Talavante sensacional, ofreciendo cada uno de ellos un juego más que notable, bravos, con empuje en el caballo y una condición que creció a medida que avanzaba el festejo. El broche final lo puso un eral de El Pilar para el debutante Moisés Fraile.

Abrió plaza **Diego Urdiales**, toreando un novillo fijo en el capote que le permitió dibujar algunos lances estimables a pesar del aire. Empujó con fuerza en el tercio de varas y confirmo su nobleza ante el vendaval, pues el viento dejaba al descubierto al matador constantemente, pero el astado no hizo por él. No fue fácil el trasteo, el novillo apenas dejaba que Urdiales se colocara, yendo siempre detrás de la muleta sin apenas frenar. El riojano bridó su novillo al fallecido la noche anterior en la capea nocturna, añadiendo emoción a una faena de mérito y exposición. Mató de manera efectiva y paseó una oreja. El novillo por su parte fue aplaudido en el arrastre.

**Alejandro Talavante** sorteó un novillo con mayor transmisión que el primero, dejando ver su buen aire con el capote y con un quite por chicuelinas con ajuste y compás. Inició la faena de muleta a pies quietos, ligando tandas con muletazos encadenados y templados, aprovechando que el viento parecía haber disminuido un poco para mostrarse más versátil y asentado. La estocada, un poco contraria, pareció suficiente, pero el novillo se levantó y el espada extremeño se vio obligado al descabello. La demora hizo que los tendidos se enfriarán y todo se quedó en una ovación. De nuevo, el animal fue aplaudido en el arrastre.

**Pablo Aguado** dejó la faena de mayor sabor y torería. Brindó al cirujano de la plaza, Enrique Crespo, y arrancó con una tanda sensacional que marcó el tono de lo que vendría después: toreo con la yema de los dedos, de forma muy natural, despacio y con una gran pureza estética, creando una imagen de las que llegan y se quedan en los aficionados. Un pinchazo precedió a una estocada ligeramente tendida. En el trance se cortó en un dedo y tuvo que pasar por enfermería, donde recibió dos puntos de sutura. Cortó una oreja de ley.

**El Mene** se encontró con el novillo más completo del encierro, brindando a Talavante y planteando una faena de ligazón y entrega, exprimiendo la calidad del astado, dejando varios muletazos hilvanados con sentido y mando. Tras un pinchazo, dejó la mejor estocada de la tarde, recibiendo una oreja. El novillo fue aplaudido en el arrastre.

Cerró el debutante **Moisés Fraile** ante un eral de El Pilar, de su propia casa. Saludó con un quite por gaoneras muy ajustado y comenzó su faena a pies quietos, con decisión, aunque sufrió una fuerte voltereta. No obstante, eso no hizo que mermara su entrega. Su labor, llena de ganas y personalidad, conectó con el público, dejando pases muy buenos, especialmente con la mano izquierda. La espada emborronó lo que podía haber sido un gran premio: estocada enhebrada, varios pinchazos y hasta tres descabellos.`,
    author: "Nerea F.Elena",
    authorLogo: "/images/nere.jpg",
    showAuthorHeader: true
   },
	{ 
    id: 236,
    title: `La Asociación Andaluza de Escuelas Taurinas “Pedro Romero” celebra en Camas su Asamblea General con una ambiciosa mirada al futuro`,
    image: "/images/np.jpg",
    category: "Actualidad",
    date: "14 de Febrero de 2026",
	fullContent: `**Camas** volvió a convertirse en epicentro de la formación taurina andaluza. Hoy, sábado 14 de febrero, la **Asociación Andaluza de Escuelas Taurinas “Pedro Romero”** celebró su **Asamblea General Ordinaria y Extraordinaria** en el **Salón de Actos del Excmo. Ayuntamiento de Camas**, sede habitual de este importante encuentro anual.

La sesión fue abierta por el presidente de la Asociación, **D. Eduardo Ordóñez**, quien dio la bienvenida a los asistentes e inauguró una jornada marcada por el consenso, el balance positivo y la proyección de futuro. A continuación, **D. Francisco Acedo**, representante de la **Escuela Taurina de Camas** y anfitrión del acto, saludó a los presentes y procedió al pase de lista: **un total de 27 escuelas** estuvieron representadas de manera presencial, mientras que las de **Linares, Antequera, Ronda** y **Huelva** delegaron su voto, alcanzándose así la cifra total de **31 Escuelas Asociadas.**

**Asamblea General Ordinaria**

El primer punto del orden del día fue la lectura y aprobación del acta de la última asamblea, a cargo del secretario **D. Juan Repullo**, siendo aprobada por unanimidad por todas las escuelas participantes.

Seguidamente, el presidente **Eduardo Ordóñez** presentó el informe de gestión correspondiente al Proyecto 2025. Se trató de “un resumen muy amplio y detallado con todo tipo de acciones sobre el curso anterior”, destacando que “todos los objetivos se cumplieron con Canal Sur, con una media de audiencia del 13,80 % de share, así como con la Junta de Andalucía y el programa previsto en su totalidad”. Durante la exposición se subrayó que la **Temporada 2025** quedó marcada como una de las más memorables para la **Asociación**, estructurada en tres grandes circuitos: el **31º Ciclo de Novilladas Sin Picadores Canal Sur TV**, el **27º Ciclo de Becerradas** y el **26º Encuentro Andaluz de Escuelas Taurinas**.

Asimismo, se puso de relieve que el **Proyecto de Fomento de la Cultura Taurina de Andalucía 2025**, que contó con **Borja Jiménez** como padrino de lujo, se saldó con un cumplimiento sobresaliente de los objetivos marcados. La **A.A.E.T. “Pedro Romero”** volvió a consolidar su reputación como principal referente formativo de la tauromaquia en **España**, culminando un año de intensa actividad con un **reconocimiento internacional** que vino a confirmar el peso de su labor en la promoción de nuevos valores y en la defensa de la cultura taurina andaluza. En este sentido, se recordó el galardón recibido en la **VI Bienal Internacional de la Tauromaquia, organizada por la Asociación Tauromundo en colaboración con la Fundación Cultura Taurina de Jerez de la Frontera**, entregado el pasado 25 de octubre en el **Alcázar de Jerez**.

Igualmente, se destacó el compromiso con la juventud demostrado por **Andrés Roca Rey**, padrino del **Proyecto de Fomento de la Cultura Taurina de Andalucía 2024**, quien “reafirmó su compromiso con la juventud con un gesto de gran calado: la donación de más de 30.000 euros destinados a las Escuelas Taurinas de Andalucía”.

El segundo punto abordó el balance de cuentas del ejercicio 2025, presentado por el tesorero **D. Rafael Osorio**. A continuación, **D. Juan Rojas**, vicetesorero, expuso el **Proyecto 2026**, que contempla una temporada de gran envergadura: “El **28º Ciclo de Becerradas** contará con una becerrada más que el año anterior, celebrándose la gran final en **Lucena** el próximo 5 de septiembre. El **32º Ciclo de Novilladas Sin Picadores Canal Sur TV** incluirá 12 festejos, con 10 novilladas televisadas y 2 pruebas de selección en el campo, teniendo su gran final en **Villacarrillo** el sábado 29 de agosto, localidad que volverá a acoger esta cita como en temporadas precedentes”.

“El proyecto incorpora además un festejo televisado para los “mejores andaluces”, que se celebrará en **Arroyomolinos de León** el domingo 19 de septiembre, así como la celebración del **27º Encuentro Andaluz de Escuelas Taurinas** en dos sedes: **Los Barrios** (3 y 4 de octubre) y **Ubrique** (24 y 25 de octubre), con la retransmisión televisiva de un festejo en cada sede. En total, serán **14 los festejos inicialmente televisados**, sin descartar la inclusión de alguno más a lo largo del curso 2026. La **presentación oficial** de la temporada tendrá lugar el próximo viernes **20 de marzo** en la **Real Maestranza de Caballería de Sevilla**.”

El presupuesto para 2026 fue aprobado posteriormente por la Asamblea, así como los puntos relativos al pago de cuotas y nuevas propuestas presentadas por **Francisco Acedo**, vocal de la Junta Directiva.

Uno de los momentos destacados -gran ovación de bienvenida- de la jornada fue la presentación oficial de la **Escuela Taurina Costa del Sol**, aprobada previamente por la Junta Directiva. El presidente **Eduardo Ordóñez** dio la bienvenida a esta nueva incorporación, que estará presidida por **Francisco José Porras Becerra** y contará con el maestro **Fernando Cámara Castro** como coordinador de toreo, teniendo su sede oficial en la **Plaza de Toros de Estepona.**

**Asamblea General Extraordinaria**

En sesión extraordinaria, el jurista y abogado **Juan Miguel Cabral** presentó la propuesta de modificación de los Estatutos, señalando que “se han modificado varios artículos para una nueva adaptación a los tiempos actuales y modernizar los Estatutos con la realidad vigente”. Tras el turno de ruegos y preguntas, se anunció la concesión de reconocimientos a **Rafael Osorio** y **José Manuel Cabrera**, que serán entregados en el acto oficial de presentación de la temporada 2026.

La jornada se cerró en la localidad natal del **“Faraón de Camas”** con un almuerzo de hermandad, en el que se vivió una inolvidable convivencia entre todas las escuelas asistentes. Finalmente, la **A.A.E.T. “Pedro Romero”** quiso agradecer públicamente al **Excmo. Ayuntamiento de Camas** su colaboración y la cesión de sus magníficas instalaciones para la celebración de estas Asambleas.`,
	author: "Manolo Herrera",
    authorLogo: "/images/manoloherrera.jpg",
    showAuthorHeader: true
   },
	{ 
    id: 237,
    title: `El Bolsín Taurino “Sueño de Luces” abre la temporada 2026 en Finca Valtaja`,
    image: "/images/bolsin.jpg",
    category: "Actualidad",
    date: "14 de Febrero de 2026",
	fullContent: `La **Finca Valtaja** acogerá el próximo 1 de marzo, a las 11:30 horas, el **Bolsín Taurino "Sueño de Luces"**, cita que inaugura la temporada 2026 y que reunirá a destacados alumnos de distintas escuelas taurinas.

En el cartel figuran **Izan Alonso (Escuela Taurina de Guadalajara), Angelito (Escuela de Huesca), Juan Morales (Escuela El Yiyo de Madrid) y Curro de Belén (Escuela de Albacete). Actuará fuera de concurso Celso Ortega (Escuela La Gallosina de El Puerto de Santa María).** Las reses pertenecerán a la ganadería **Tauro Valtaja.**

Organizado por la Escuela Taurina de Guadalajara y la Federación Taurina de Guadalajara, el bolsín se consolida como plataforma de promoción para jóvenes promesas del toreo.`,
	author: "Manolo Herrera",
    authorLogo: "/images/manoloherrera.jpg",
    showAuthorHeader: true
   },
	{ 
    id: 238,
    title: `JTS rendirá homenaje a El Juli bajo el lema “El Juli, figura y referente de una época”`,
    image: "/images/homen.jpg",
    category: "Actualidad",
    date: "14 de Febrero de 2026",
	excerpt: "La asociación Juventud Taurina de Salamanca celebrará el próximo jueves 19 de febrero un acto de reconocimiento a El Juli, una de las grandes figuras del toreo contemporáneo. El encuentro tendrá lugar a las 20:30 en el Teatro Liceo de Salamanca y será de entrada libre hasta completar aforo.",
	fullContent: `Bajo el título “El Juli, figura y referente de una época”, la Juventud Taurina de Salamanca (JTS) dedicará una velada especial a repasar la trayectoria, el legado y la influencia del diestro madrileño en la tauromaquia moderna. La figura de Julián López “El Juli”, protagonista indiscutible de las últimas décadas, será analizada desde distintas perspectivas, poniendo en valor su aportación técnica, su capacidad de liderazgo en el escalafón y su condición de espejo para varias generaciones de aficionados y toreros.
El acto contará con la participación de la periodista Elena Salamanca, que acompañará el desarrollo del homenaje en una conversación estructurada en torno a los hitos más relevantes de su carrera y a su impacto en la evolución del toreo del siglo XXI.
La entrada será libre hasta completar aforo, y además, el homenaje podrá seguirse en directo a través de la retransmisión en streaming que la asociación realizará mediante Facebook, facilitando así el acceso a aficionados que no pueden acudir presencialmente.
Con iniciativas como esta y su actividad continua en el mundo del toro, la Juventud Taurina de Salamanca (JTS) se consolida como uno de los colectivos juveniles más activos del panorama taurino nacional. La asociación no solo organiza homenajes y actos culturales, sino que también organiza y coordina viajes a corridas de toros para sus socios, mantiene su propio abono en la Plaza de Toros de la Glorieta y desarrolla actividades que acercan a las nuevas generaciones a la Fiesta, proyectando una imagen dinámica y comprometida de la afición joven.`,
	author: "Iris Rodríguez",
    authorLogo: "/images/iris.jpg",
    showAuthorHeader: true
   },
	{ 
    id: 239,
    title: `Tragedia en el Carnaval del Toro: fallece un vecino de 67 años tras ser corneado en la capea nocturna.`,
    image: "/images/falleci.jpg",
    category: "Actualidad",
    date: "14 de Febrero de 2026",
	imageCaption: "Imagen de El Español",
	excerpt: "El suceso se produjo horas después del tradicional Campanazo que había dado comienzo oficial a las fiestas.",
	fullContent: `Un varón de 67 años, conocido en el ambiente taurino mirobrigense como “Taquio”, perdió la vida en la madrugada de este sábado 14 de febrero en la Plaza Mayor de Ciudad Rodrigo, convertida en coso taurino con motivo del Carnaval del Toro. El suceso tuvo lugar durante la primera capea nocturna, apenas horas después del tradicional Campanazo que abrió oficialmente las fiestas. 
El trágico episodio se produjo en torno a la 1:16 horas. Según las informaciones recabadas, el hombre arrancó a correr tratando de escapar del toro, perteneciente a la ganadería extremeña de Antonio López Gibaja. Sin embargo, el astado logró alcanzarlo.
En primera instancia lo prendió por la espalda. Tras el impacto, el aficionado cayó al suelo y, ya inerme, fue nuevamente herido por el animal, que le infirió una cornada en el pecho de consecuencias fatales.
El equipo médico del festejo, encabezado por el doctor Enrique Crespo, intervino con inmediatez, pero nada pudo hacerse por salvar la vida del vecino mirobrigense, cuya herida torácica resultó letal.
La víctima era un rostro conocido en el ámbito taurino local y miembro de una peña, un aficionado habitual de los festejos del Carnaval. 
Se trata del primer fallecimiento por asta de toro en estas fiestas en cuarenta años, un dato que marca con luto una celebración de profundo arraigo en la comarca.
La conmoción se dejó sentir desde primeras horas de la mañana. Antes del inicio del tradicional Toro del Antruejo, el fallecido fue recordado en la zona de Los Pinos, en un homenaje encabezado por el alcalde de Ciudad Rodrigo, Marcos Iglesias, y el teniente de alcalde, Ramón Sastre, y acompañado por multitud de vecinos y aficionados. En el acto se trasladó el apoyo y el acompañamiento en el dolor a familiares y allegados, concluyendo con una cerrada y sentida ovación. 
Asimismo, y según lo previsto por la organización del Carnaval del Toro, la programación continuará con normalidad pese al trágico suceso. No obstante, está previsto que antes del festival anunciado para la tarde de este sábado se celebre un nuevo acto de homenaje en la plaza de toros, en memoria del aficionado fallecido.
Desde Portal Tendido Digital transmitimos nuestras más sentidas condolencias a los familiares, amigos y allegados al fallecido, sumándonos al dolor de la familia taurina mirobrigense en estos momentos de profunda tristeza.`,
	author: "Iris Rodríguez",
    authorLogo: "/images/iris.jpg",
    showAuthorHeader: true
   },
	{ 
    id: 240,
    title: `Morante de la Puebla estará anunciado en la Feria de Jerez`,
    image: "/images/jere.jpg",
    category: "Actualidad",
    date: "14 de Febrero de 2026",
	excerpt: "El diestro cigarrero suma una tarde más en su temporada de “regreso”.",
	fullContent: `La temporada 2026 de Morante de la Puebla continúa tomando forma y ya tiene una nueva parada confirmada. El torero sevillano hará también el paseíllo en la plaza de toros de Jerez de la Frontera durante la próxima Feria del Caballo, sumando así este compromiso a su ya anunciada presencia en Sevilla.

El acuerdo con la empresa Matilla, gestora del coso jerezano, pone fin a la espera que mantenía en suspenso la confección definitiva de los carteles, pendientes de la decisión del diestro. Salvo cambios de última hora, Morante actuará una única tarde en el ruedo jerezano, escenario donde el pasado año dejó una de las actuaciones más recordadas de la temporada al cortar un rabo a un toro de Álvaro Núñez.

La cita tiene además un significado especial para la afición local, al tratarse de la primera Feria del Caballo que vivirá la ciudad sin Rafael de Paula, figura emblemática del barrio de Santiago y torero profundamente admirado por Morante.

Antes de su paso por Jerez, el cigarrero tiene confirmadas cuatro actuaciones en la plaza sevillana, donde abrirá temporada el Domingo de Resurrección, comparecerá dos tardes en la Feria de Abril y volverá a hacer el paseíllo en la corrida del Corpus. Por ahora queda libre la fecha de la Feria de San Miguel, lo que mantiene abierta la posibilidad de una nueva presencia en el coso hispalense.

La presencia de Morante en cada plaza se vive como un acontecimiento, ya que todo apunta a que su temporada volverá a desarrollarse con un número limitado de actuaciones, lo que incrementa la expectación en torno a cada anuncio oficial.`,
    author: "Antonio Tortosa",
    authorLogo: "/images/anto.jpg",
    showAuthorHeader: true
   },
	{ 
    id: 241,
    title: `Roqueta de Mar, ya tiene cartel para su festival`,
    image: "/images/roque.jpg",
    category: "Actualidad",
    date: "14 de Febrero de 2026",
	fullContent: `El empresario y matador de toros **José Gabriel Olivencia,** ha dado a conocer el tradicional festival taurino con colaboración benéfica a distintas asociaciones, que se celebrará el próximo sábado 11 de abril a las 17:00 horas en la plaza de toros de **Roquetas de Mar.**

El festival consolidado como una de las citas más destacadas del calendario taurino en la provincia de **Almería.**

Se lidiarán reses de la ganadería **Fuente Ymbro,** para el rejoneador **Sebastián Fernández** y los matadores de toros **Diego Urdiales, David Fandila «El Fandi», Manuel Escribano y Tomás Rufo,** la novillera **Olga Casado** y el novillero sin picadores **Blas Márquez.**`,
	author: "Manolo Herrera",
    authorLogo: "/images/manoloherrera.jpg",
    showAuthorHeader: true
   },
	{ 
    id: 242,
    title: `Ramón Valencia y Toño Matilla rompen el frente común empresarial y concurrirán al concurso de la Plaza de Toros Zaragoza`,
    image: "/images/empres.jpg",
    category: "Actualidad",
    date: "13 de Febrero de 2026",
	fullContent: `Los empresarios taurinos **Ramón Valencia y Toño Matilla** presentarán finalmente sus respectivas ofertas al concurso de la Plaza de Toros de Zaragoza, según ha adelantado el periodista **Vicente Zabala de la Serna.**

Este movimiento se produce apenas unas horas después de que se alcanzara un acuerdo en el seno de ANOET en relación con el pliego de condiciones que regirá la adjudicación del coso zaragozano.

Hasta ese momento, todo apuntaba a la posibilidad de un plante conjunto por parte del sector, en respaldo al recurso presentado por Rafael García Garrido en nombre de Nautalia, después de que la patronal empresarial calificara de “inaceptable” el citado pliego, al considerar excesivo el incremento del canon y la obligatoriedad de programar la Feria del Pilar en la capital aragonesa.

Sin embargo, y de acuerdo con la información del citado periodista, tanto Ramón Valencia —tras perder la gestión de la Plaza de Toros de la Real Maestranza de Caballería de Sevilla— como Toño Matilla han decidido desmarcarse de ese supuesto pacto sectorial y concurrir al concurso de Zaragoza por separado.`,
	author: "Eduardo Elvira",
    authorLogo: "/images/edu4.jpg",
    showAuthorHeader: true
   },
	{ 
    id: 243,
    title: `El Ayuntamiento reúne a los aficionados taurinos en el primer gran acto del marco “Sevilla, ciudad taurina”`,
    image: "/images/sevi.jpg",
    category: "Actualidad",
    date: "13 de Febrero de 2026",
	excerpt: "<p>El Salón Colón ha acogido este jueves 12 de febrero el primer encuentro del programa “Sevilla, ciudad taurina”, un nuevo foro para el desarrollo de la cultura taurina a través de exposiciones, conferencias y debates",
	fullContent: `El delegado de Fiestas Mayores del Ayuntamiento de Sevilla, Manuel Alés, ha presidido hoy el I Encuentro de Aficionados Taurinos de Sevilla, celebrado en el marco de la programación de “Sevilla, ciudad taurina”, una iniciativa que nace con el objetivo de reforzar el papel de la afición y fomentar el diálogo en torno al presente y el futuro de la tauromaquia en la ciudad.
El Salón Colón acogió este foro de debate en el que, desde los escaños, los integrantes de las peñas han debatido sobre el pasado, presente y futuro de la fiesta con Sevilla como eje vertebrador.
En esta primera cita han participado personalidades y tertulias del toreo como Tertulia Los 13, Círculo Pablo Aguado, Tertulia El Porvenir, Círculo Taurino de Sevilla, Tertulia Puerta Carmona, y Tertulia Taurina Universitaria, Juan Ortega, Pineda , Peña Eduardo Dávila y tertulia los 40, entre otros.
Durante su intervención, Alés ha subrayado el carácter “histórico” de este encuentro, al tratarse de la primera vez que se realiza.`,
	author: "Manolo Herrera",
    authorLogo: "/images/manoloherrera.jpg",
    showAuthorHeader: true
   }
];

const chronicles: Chronicle[] = [
    { 
    id: 4995,
    title: `Sábado en el Carnaval del Toro de Ciudad Rodrigo`,
	image: "/images/ciud.jpg",
    category: "Crónicas",
    date: "15 de Febrero de 2026",
	excerpt: "Cuatro orejas y varios novillos aplaudidos en el arrastre en una tarde marcada por el viento, la huella taurina y el debut con entrega de Moisés Fraile.",
	plaza: "Plaza Mayor de Ciudad Rodrigo",
    ganaderia: "Novillos de las ganaderías de Talavante y un eral de El Pilar.",
	author: "Nerea F.Elena",
    authorLogo: "/images/nere.jpg",
    showAuthorHeader: true
   }
];

const entrevistas: NewsItem[] = [
   	{ 
    id: 499,
    title: `“El toreo es una forma de ser, de estar y de vivir” - Entrevista a José Garrido`,
    image: "/images/cron1.jpg",
    category: "Entrevistas",
    date: "25 de Enero de 2026",
	imageCaption: "Fotos de Vanesa Santos",
    author: "Eduardo Elvira",
    authorLogo: "/images/edu4.jpg",
    showAuthorHeader: true
   }
];


const Home: React.FC = () => {
    // 1. Estado para almacenar las noticias combinadas (estáticas + dinámicas)
    const [combinedNews, setCombinedNews] = useState<NewsItem[]>(latestNews);

    // 2. useEffect para cargar el db.json y mezclarlo
    useEffect(() => {
        const fetchNews = async () => {
            try {
                // Intentar cargar db.json (noticias subidas desde el CMS)
                const response = await fetch('/data/db.json');
                if (response.ok) {
                    const data = await response.json();
                    if (data.articles && Array.isArray(data.articles)) {
                        // Mapear artículos del CMS al formato de la web
                        const cmsNews: NewsItem[] = data.articles
                            .filter((a: any) => a.isPublished) // Solo publicadas
                            .map((a: any) => ({
                                id: a.id,
                                title: a.title,
                                image: a.imageUrl,
                                category: a.category,
                                date: new Date(a.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
                                excerpt: a.summary,
                                fullContent: a.content,
                                author: "Redacción", // Podrías buscar el nombre del autor si tienes la lista
                                showAuthorHeader: true
                            }));

                        // Fusionar: CMS primero (más nuevas), luego las hardcodeadas
                        setCombinedNews([...cmsNews, ...latestNews]);
                    }
                }
            } catch (error) {
                console.error("Error cargando noticias del CMS:", error);
            }
        };

        fetchNews();
    }, []);

    return (
        <div className="bg-white text-gray-800 font-sans min-h-screen">
             {/* Navbar header */}
             <div className="bg-brand-dark text-white p-4 sticky top-0 z-50 shadow-md">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <img src="/images/tendidodigitallogosimple.png" alt="Logo" className="h-8 w-auto bg-white rounded-full p-0.5" />
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight">TENDIDO<span className="text-red-500">DIGITAL</span></h1>
                    </div>
                    <span className="text-[10px] md:text-xs font-mono opacity-70 bg-white/10 px-2 py-1 rounded">PREVISUALIZACIÓN WEB</span>
                </div>
             </div>
             
             {/* Hero Section */}
             {featuredNews.map((news) => (
               <div key={news.id} className="relative w-full h-[50vh] md:h-[60vh] bg-black group overflow-hidden">
                    <div className="absolute inset-0">
                         <img 
                            src={news.image} 
                            alt={news.title} 
                            className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700" 
                         />
                         <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 bg-gradient-to-t from-black via-black/60 to-transparent">
                             <div className="max-w-6xl mx-auto animate-fade-in-up">
                                 <span className="bg-red-600 text-white px-3 py-1 rounded text-xs md:text-sm font-bold uppercase tracking-wider mb-3 inline-block shadow-sm">
                                    {news.category}
                                 </span>
                                 <h2 className="text-2xl md:text-4xl lg:text-5xl text-white font-bold mt-2 mb-4 leading-tight drop-shadow-md">
                                    {news.title}
                                 </h2>
                                 <p className="text-gray-200 text-sm md:text-lg max-w-2xl line-clamp-2 md:line-clamp-3 drop-shadow-sm">
                                    {news.excerpt}
                                 </p>
                             </div>
                         </div>
                    </div>
               </div>
             ))}

             <div className="max-w-6xl mx-auto px-4 py-8 md:py-16 space-y-16">
                 
                 {/* Latest News Grid */}
                 <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-8 w-1 bg-red-600 rounded-full"></div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Últimas Noticias</h2>
                    </div>
                    
                    {/* USAMOS combinedNews EN LUGAR DE latestNews PARA MOSTRAR LAS DEL CMS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {combinedNews.slice(0, 9).map(news => (
                            <div key={news.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
                                <div className="h-48 overflow-hidden relative">
                                    <img 
                                        src={news.image} 
                                        alt={news.title} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/800x600?text=Sin+Imagen'} 
                                    />
                                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide shadow-sm">
                                        {news.category}
                                    </span>
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                                        <Calendar size={14}/> {news.date}
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-3 leading-snug group-hover:text-red-600 transition-colors line-clamp-3">
                                        {news.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                                        {news.excerpt || (news.fullContent ? news.fullContent.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...' : '')}
                                    </p>
                                    <div className="flex items-center gap-2 pt-4 border-t border-gray-50 mt-auto">
                                        <img src={news.authorLogo || "/images/tendidodigitallogosimple.png"} alt={news.author} className="w-6 h-6 rounded-full object-cover" />
                                        <span className="text-xs font-medium text-gray-500">{news.author}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                 </section>

                 {/* Chronicles Section */}
                 <section className="bg-gray-50 -mx-4 px-4 py-12 md:py-16 md:rounded-3xl">
                     <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-1 bg-orange-500 rounded-full"></div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Crónicas</h2>
                        </div>
                        <button className="text-orange-600 font-bold text-sm hover:text-orange-700 transition-colors flex items-center gap-1">Ver todas <ChevronRight size={16}/></button>
                     </div>
                     
                     <div className="space-y-6">
                        {chronicles.slice(0, 3).map(news => (
                             <div key={news.id} className="flex flex-col md:flex-row bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 group">
                                 <div className="md:w-2/5 h-64 md:h-auto relative overflow-hidden">
                                     <img 
                                        src={news.image} 
                                        alt={news.title} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                     />
                                     <span className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded text-xs font-bold uppercase shadow-sm">Crónica</span>
                                 </div>
                                 <div className="p-6 md:w-3/5 flex flex-col justify-center">
                                     <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-gray-500 font-medium uppercase tracking-wide">
                                         {news.plaza && <span className="flex items-center gap-1"><span className="text-orange-400">●</span> {news.plaza}</span>}
                                         <span className="hidden md:inline text-gray-300">|</span>
                                         <span>{news.date}</span>
                                     </div>
                                     <h3 className="font-bold text-xl md:text-2xl text-gray-900 mb-3 leading-tight group-hover:text-orange-600 transition-colors">
                                        {news.title}
                                     </h3>
                                     <p className="text-gray-600 text-base line-clamp-3 mb-4 leading-relaxed">
                                        {news.excerpt}
                                     </p>
                                     <div className="text-sm font-semibold text-orange-600 flex items-center gap-1 mt-auto">
                                        Leer crónica completa <ArrowRight size={14}/>
                                     </div>
                                 </div>
                             </div>
                        ))}
                     </div>
                 </section>
                 
                 {/* Interviews Grid */}
                 <section>
                     <div className="flex items-center gap-3 mb-8">
                        <div className="h-8 w-1 bg-green-600 rounded-full"></div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Entrevistas</h2>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {entrevistas.map(news => (
                             <div key={news.id} className="relative h-80 md:h-96 rounded-2xl overflow-hidden group cursor-pointer shadow-md">
                                 <img 
                                    src={news.image} 
                                    alt={news.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                 />
                                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                                 <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                                     <span className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold uppercase mb-3 inline-block shadow-sm">
                                        Entrevista
                                     </span>
                                     <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-2 drop-shadow-md">
                                        {news.title}
                                     </h3>
                                     <div className="h-1 w-12 bg-green-500 rounded-full mt-4 group-hover:w-20 transition-all duration-300"></div>
                                 </div>
                             </div>
                        ))}
                     </div>
                 </section>
             </div>

             {/* Footer */}
             <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold tracking-tight mb-4">TENDIDO<span className="text-red-500">DIGITAL</span></h2>
                    <p className="text-gray-400 text-sm max-w-md mx-auto mb-8">
                        El portal de referencia para la actualidad taurina. Noticias, crónicas, entrevistas y opinión con la máxima calidad y rigor periodístico.
                    </p>
                    <div className="flex justify-center gap-6 text-sm text-gray-500 uppercase tracking-wider font-medium">
                        <span className="hover:text-white cursor-pointer transition-colors">Aviso Legal</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Privacidad</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Contacto</span>
                    </div>
                    <div className="mt-8 text-xs text-gray-600">
                        &copy; 2026 Tendido Digital. Todos los derechos reservados.
                    </div>
                </div>
             </footer>
        </div>
    );
};

export default Home;