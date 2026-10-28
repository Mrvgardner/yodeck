// Author-controlled content for the kitchen signage feed.
//
// IMPORTANT: nothing in this file should fabricate people, events, or
// announcements. Birthdays / anniversaries / holidays / who's-out come from
// BambooHR (live), and field notes come from switchcommerce.team (live).
// If a feed fails, the kitchen TV simply shows fewer cards — never made-up
// placeholders.
//
// What lives here:
//   - youtubeFeeds: a curated list of SFW video IDs (verified at runtime)
//   - quotes:       brand-approved one-liners that aren't tied to specific
//                   people or events

// Curated YouTube embeds — safe-for-work, embeddable, low-attention-grab.
// Each card is validated at runtime via /api/youtube-check (server-side
// oEmbed). Videos that aren't currently embeddable — owner-disabled embeds,
// removed, processing, age-restricted — are skipped automatically.
//
// Format: { kind: 'youtube', videoId: 'XXXXXXXXXXX', title: 'Description' }
export const youtubeFeeds = [
  { kind: 'youtube', videoId: 'SUXPnIEpbn4', title: 'Panda Cam · Chengdu Panda Base' },
  { kind: 'youtube', videoId: 'B4-L2nfGcuE', title: 'Big Bear Bald Eagle Nest · Live' },
  { kind: 'youtube', videoId: 'Zl_gKWFrgpA', title: 'Live Webcams Around the World' },
  { kind: 'youtube', videoId: '92IaqdAkYO0', title: 'Zelda: Breath of the Wild · Chill Stream' },
]

// "Thought" cards — a deliberate mix of formats (remixed proverbs, small
// office truths, genuinely useful nudges, payments pride, shower thoughts)
// so they don't all read the same. SFW for a workplace kitchen. Refresh
// the set every couple of months so regulars keep reading.
export const quotes = [
  // Proverbs, slightly remixed
  { kind: 'quote', text: "Rome wasn't built in a day. It also didn't have a sprint review.",                                  attribution: "Project history" },
  { kind: 'quote', text: "A watched pot never boils. A watched progress bar goes backwards.",                                 attribution: "Applied physics" },
  { kind: 'quote', text: "Many hands make light work. Many cooks make a group chat.",                                         attribution: "Kitchen dynamics" },
  { kind: 'quote', text: "An apple a day keeps the doctor away. A donut a day keeps the team around.",                        attribution: "Morale research" },
  { kind: 'quote', text: "Don't put all your eggs in one basket. Put them in the fridge. Label them.",                        attribution: "Facilities, gently" },
  { kind: 'quote', text: "Actions speak louder than words. Keyboards speak louder than both.",                                attribution: "Open-office acoustics" },
  { kind: 'quote', text: "Slow and steady wins the race. Fast and steady wins the parking spot.",                             attribution: "Morning observations" },
  { kind: 'quote', text: "Measure twice, cut once. Proofread twice, send once.",                                              attribution: "Email wisdom" },
  { kind: 'quote', text: "Fortune favors the bold. Lunch favors the early.",                                                  attribution: "Cafeteria economics" },
  { kind: 'quote', text: "Knowledge is power. Knowing where the good pens are is a superpower.",                              attribution: "Supply closet lore" },

  // Small truths
  { kind: 'quote', text: "The meeting is always in the room you just walked past.",                                           attribution: "Office geography" },
  { kind: 'quote', text: "Every office has one chair that squeaks. You are sitting in it.",                                   attribution: "Furniture facts" },
  { kind: 'quote', text: "No one has ever replaced the paper towel roll. It just happens.",                                   attribution: "Kitchen mysteries" },
  { kind: 'quote', text: "The coffee is always strongest on the day you needed it weakest.",                                  attribution: "Brew theory" },
  { kind: 'quote', text: "A clean desk is a sign that the drawers are full.",                                                 attribution: "Organizational science" },
  { kind: 'quote', text: "The fastest way to find a lost file is to ask someone for help.",                                   attribution: "Murphy's IT law" },
  { kind: 'quote', text: "You will remember the thing you forgot the moment you sit down.",                                   attribution: "Memory management" },
  { kind: 'quote', text: "The quietest person in the room has the best snacks in their desk.",                                attribution: "Field research" },
  { kind: 'quote', text: "Every 'quick question' is a 30-minute question in disguise.",                                       attribution: "Calendar truth" },
  { kind: 'quote', text: "Your best idea of the day will arrive in the shower or the parking lot.",                           attribution: "Creativity studies" },
  { kind: 'quote', text: "If it's in the fridge with no name, it belongs to the fridge now.",                                 attribution: "Kitchen bylaws" },
  { kind: 'quote', text: "The microwave beeps louder when it's your turn.",                                                   attribution: "Acoustic engineering" },

  // Actually useful
  { kind: 'quote', text: "Drink some water. Your coffee is not a substitute. Sorry.",                                         attribution: "Wellness desk" },
  { kind: 'quote', text: "Stand up and stretch. Your chair will still be here.",                                              attribution: "Ergonomics team" },
  { kind: 'quote', text: "Say thanks to someone today. It's free and the ROI is great.",                                      attribution: "Culture club" },
  { kind: 'quote', text: "Take the stairs once. Brag about it all day.",                                                      attribution: "Fitness challenge" },
  { kind: 'quote', text: "Ask the new person how they're settling in. Remember being new?",                                   attribution: "Team building" },
  { kind: 'quote', text: "Leave the kitchen better than you found it. Or at least the same.",                                 attribution: "House rules" },
  { kind: 'quote', text: "Celebrate small wins. Big wins are just a lot of small wins in a trench coat.",                     attribution: "Momentum theory" },
  { kind: 'quote', text: "Step outside for five minutes. The sun is still on.",                                               attribution: "Daylight division" },

  // Customers & commerce
  { kind: 'quote', text: "Somewhere right now, a terminal just said 'Approved.' That's us.",                                  attribution: "Switch Commerce" },
  { kind: 'quote', text: "Every swipe, dip and tap is someone's coffee, groceries or gas. Respect the transaction.",          attribution: "Payments philosophy" },
  { kind: 'quote', text: "Uptime is a love language.",                                                                        attribution: "Ops team" },
  { kind: 'quote', text: "The best payment experience is the one nobody notices.",                                            attribution: "Product principle" },
  { kind: 'quote', text: "Cash is king. Uptime is the kingdom.",                                                              attribution: "ATM proverb" },
  { kind: 'quote', text: "A happy merchant tells a friend. An unhappy one tells the internet.",                               attribution: "Customer success" },

  // Shower thoughts
  { kind: 'quote', text: "A 'to-do list' is just a list of things you haven't done yet, written neatly.",                     attribution: "Philosophy hour" },
  { kind: 'quote', text: "Your keyboard has seen things. Clean it.",                                                          attribution: "Hygiene report" },
  { kind: 'quote', text: "'Per my last email' is the corporate equivalent of a dramatic sigh.",                               attribution: "Linguistics dept." },
  { kind: 'quote', text: "Somebody once decided Wednesday should be called 'hump day' and we all just agreed.",               attribution: "Cultural studies" },
  { kind: 'quote', text: "The 'snooze' button is a negotiation you always lose.",                                             attribution: "Sleep science" },
  { kind: 'quote', text: "Coffee is just bean soup that believes in you.",                                                    attribution: "Culinary insight" },
  { kind: 'quote', text: "Weekends are just two days of pretending we won't check email.",                                    attribution: "Honest calendar" },
  { kind: 'quote', text: "Lunch is the only meeting nobody wants to cancel.",                                                 attribution: "Scheduling truth" },
  { kind: 'quote', text: "Texas weather: four seasons, one afternoon.",                                                       attribution: "Irving forecast" },
  { kind: 'quote', text: "The office plant has outlasted three reorgs. Respect.",                                             attribution: "Botany dept." },
]

// Iconic SFW movie & TV quotes. Curated for a workplace kitchen — no
// profanity, no controversial scenes, just lines people will recognize
// and grin at. Add freely.
//
// Format: { kind: 'movie', text, character, source, year? }
export const movieQuotes = [
  // Comedy
  { kind: 'movie', text: "Bueller? … Bueller?",                                                 character: "Economics Teacher",     source: "Ferris Bueller's Day Off",                  year: 1986 },
  { kind: 'movie', text: "Life moves pretty fast. If you don't stop and look around once in a while, you could miss it.", character: "Ferris Bueller",        source: "Ferris Bueller's Day Off",                  year: 1986 },
  { kind: 'movie', text: "I'm kind of a big deal.",                                             character: "Ron Burgundy",          source: "Anchorman",                                 year: 2004 },
  { kind: 'movie', text: "Stay classy, San Diego.",                                             character: "Ron Burgundy",          source: "Anchorman",                                 year: 2004 },
  { kind: 'movie', text: "I love lamp.",                                                        character: "Brick Tamland",         source: "Anchorman",                                 year: 2004 },
  { kind: 'movie', text: "I'm in a glass case of emotion!",                                     character: "Ron Burgundy",          source: "Anchorman",                                 year: 2004 },
  { kind: 'movie', text: "Son of a nutcracker!",                                                character: "Buddy",                 source: "Elf",                                       year: 2003 },
  { kind: 'movie', text: "You sit on a throne of lies.",                                        character: "Buddy",                 source: "Elf",                                       year: 2003 },
  { kind: 'movie', text: "Cotton-headed ninny muggins.",                                        character: "Buddy",                 source: "Elf",                                       year: 2003 },
  { kind: 'movie', text: "If you can dodge a wrench, you can dodge a ball.",                    character: "Patches O'Houlihan",    source: "Dodgeball",                                 year: 2004 },
  { kind: 'movie', text: "Shake and bake!",                                                     character: "Cal Naughton Jr.",      source: "Talladega Nights",                          year: 2006 },
  { kind: 'movie', text: "If you ain't first, you're last.",                                    character: "Reese Bobby",           source: "Talladega Nights",                          year: 2006 },
  { kind: 'movie', text: "Be excellent to each other.",                                         character: "Bill & Ted",            source: "Bill & Ted's Excellent Adventure",          year: 1989 },
  { kind: 'movie', text: "Strange things are afoot at the Circle K.",                           character: "Ted",                   source: "Bill & Ted's Excellent Adventure",          year: 1989 },
  { kind: 'movie', text: "We're not worthy!",                                                   character: "Wayne & Garth",         source: "Wayne's World",                             year: 1992 },
  { kind: 'movie', text: "Party on, Garth.",                                                    character: "Wayne Campbell",        source: "Wayne's World",                             year: 1992 },
  { kind: 'movie', text: "Alright, alright, alright.",                                          character: "Wooderson",             source: "Dazed and Confused",                        year: 1993 },
  { kind: 'movie', text: "Snap out of it!",                                                     character: "Loretta Castorini",     source: "Moonstruck",                                year: 1987 },
  { kind: 'movie', text: "Plastics.",                                                           character: "Mr. McGuire",           source: "The Graduate",                              year: 1967 },
  { kind: 'movie', text: "Gentlemen, you can't fight in here! This is the War Room!",           character: "President Muffley",     source: "Dr. Strangelove",                           year: 1964 },
  { kind: 'movie', text: "Hey, you guys!",                                                      character: "Sloth",                 source: "The Goonies",                               year: 1985 },
  { kind: 'movie', text: "Goonies never say die!",                                              character: "Mikey",                 source: "The Goonies",                               year: 1985 },
  { kind: 'movie', text: "Wilson!",                                                             character: "Chuck Noland",          source: "Cast Away",                                 year: 2000 },
  { kind: 'movie', text: "This is heavy.",                                                      character: "Marty McFly",           source: "Back to the Future",                        year: 1985 },

  // Animation
  { kind: 'movie', text: "Ogres are like onions.",                                              character: "Shrek",                 source: "Shrek",                                     year: 2001 },
  { kind: 'movie', text: "That'll do, pig. That'll do.",                                        character: "Farmer Hoggett",        source: "Babe",                                      year: 1995 },
  { kind: 'movie', text: "Ohana means family. Family means nobody gets left behind or forgotten.", character: "Lilo",                  source: "Lilo & Stitch",                             year: 2002 },
  { kind: 'movie', text: "Fish are friends, not food.",                                         character: "Bruce",                 source: "Finding Nemo",                              year: 2003 },
  { kind: 'movie', text: "P. Sherman, 42 Wallaby Way, Sydney.",                                 character: "Dory",                  source: "Finding Nemo",                              year: 2003 },
  { kind: 'movie', text: "Mine? Mine? Mine?",                                                   character: "The Seagulls",          source: "Finding Nemo",                              year: 2003 },
  { kind: 'movie', text: "I am speed.",                                                         character: "Lightning McQueen",     source: "Cars",                                      year: 2006 },
  { kind: 'movie', text: "Ka-chow!",                                                            character: "Lightning McQueen",     source: "Cars",                                      year: 2006 },
  { kind: 'movie', text: "Reach for the sky!",                                                  character: "Woody",                 source: "Toy Story",                                 year: 1995 },
  { kind: 'movie', text: "There's a snake in my boot!",                                         character: "Woody",                 source: "Toy Story",                                 year: 1995 },
  { kind: 'movie', text: "The claw is our master.",                                             character: "The Aliens",            source: "Toy Story",                                 year: 1995 },
  { kind: 'movie', text: "You are a sad, strange little man, and you have my pity.",            character: "Buzz Lightyear",        source: "Toy Story",                                 year: 1995 },
  { kind: 'movie', text: "It's called a hustle, sweetheart.",                                   character: "Finnick",               source: "Zootopia",                                  year: 2016 },
  { kind: 'movie', text: "Where's my super suit?",                                              character: "Frozone",               source: "The Incredibles",                           year: 2004 },
  { kind: 'movie', text: "No capes!",                                                           character: "Edna Mode",             source: "The Incredibles",                           year: 2004 },
  { kind: 'movie', text: "I was hiding under your porch because I love you.",                   character: "Dug",                   source: "Up",                                        year: 2009 },
  { kind: 'movie', text: "Anyone can cook.",                                                    character: "Gusteau",               source: "Ratatouille",                               year: 2007 },

  // Sci-fi / fantasy / superhero
  { kind: 'movie', text: "Never tell me the odds!",                                             character: "Han Solo",              source: "The Empire Strikes Back",                   year: 1980 },
  { kind: 'movie', text: "Laugh it up, fuzzball.",                                              character: "Han Solo",              source: "The Empire Strikes Back",                   year: 1980 },
  { kind: 'movie', text: "Size matters not.",                                                   character: "Yoda",                  source: "The Empire Strikes Back",                   year: 1980 },
  { kind: 'movie', text: "It's a trap!",                                                        character: "Admiral Ackbar",        source: "Return of the Jedi",                        year: 1983 },
  { kind: 'movie', text: "The Force is strong with this one.",                                  character: "Darth Vader",           source: "Star Wars",                                 year: 1977 },
  { kind: 'movie', text: "Hello there!",                                                        character: "Obi-Wan Kenobi",        source: "Revenge of the Sith",                       year: 2005 },
  { kind: 'movie', text: "This is where the fun begins.",                                       character: "Anakin Skywalker",      source: "Revenge of the Sith",                       year: 2005 },
  { kind: 'movie', text: "Chewie, we're home.",                                                 character: "Han Solo",              source: "The Force Awakens",                         year: 2015 },
  { kind: 'movie', text: "This is the way.",                                                    character: "Din Djarin",            source: "The Mandalorian",                           year: 2019 },
  { kind: 'movie', text: "I have spoken.",                                                      character: "Kuiil",                 source: "The Mandalorian",                           year: 2019 },
  { kind: 'movie', text: "Fly, you fools!",                                                     character: "Gandalf",               source: "The Fellowship of the Ring",                year: 2001 },
  { kind: 'movie', text: "Even the smallest person can change the course of the future.",       character: "Galadriel",             source: "The Fellowship of the Ring",                year: 2001 },
  { kind: 'movie', text: "I can do this all day.",                                              character: "Steve Rogers",          source: "Captain America: The First Avenger",        year: 2011 },
  { kind: 'movie', text: "We have a Hulk.",                                                     character: "Tony Stark",            source: "The Avengers",                              year: 2012 },
  { kind: 'movie', text: "That's my secret, Captain. I'm always angry.",                        character: "Bruce Banner",          source: "The Avengers",                              year: 2012 },
  { kind: 'movie', text: "We are Groot.",                                                       character: "Groot",                 source: "Guardians of the Galaxy",                   year: 2014 },
  { kind: 'movie', text: "Clever girl.",                                                        character: "Robert Muldoon",        source: "Jurassic Park",                             year: 1993 },
  { kind: 'movie', text: "Spared no expense.",                                                  character: "John Hammond",          source: "Jurassic Park",                             year: 1993 },
  { kind: 'movie', text: "I know kung fu.",                                                     character: "Neo",                   source: "The Matrix",                                year: 1999 },
  { kind: 'movie', text: "Welcome to the real world.",                                          character: "Morpheus",              source: "The Matrix",                                year: 1999 },
  { kind: 'movie', text: "I'm sorry, Dave. I'm afraid I can't do that.",                        character: "HAL 9000",              source: "2001: A Space Odyssey",                     year: 1968 },
  { kind: 'movie', text: "Shall we play a game?",                                               character: "Joshua",                source: "WarGames",                                  year: 1983 },
  { kind: 'movie', text: "I solemnly swear that I am up to no good.",                           character: "Harry Potter",          source: "Harry Potter and the Prisoner of Azkaban",  year: 2004 },
  { kind: 'movie', text: "Mischief managed.",                                                   character: "Harry Potter",          source: "Harry Potter and the Prisoner of Azkaban",  year: 2004 },
  { kind: 'movie', text: "Dobby is free.",                                                      character: "Dobby",                 source: "Harry Potter and the Chamber of Secrets",   year: 2002 },
  { kind: 'movie', text: "Space: the final frontier.",                                          character: "Captain Kirk",          source: "Star Trek",                                 year: 1966 },
  { kind: 'movie', text: "Fascinating.",                                                        character: "Spock",                 source: "Star Trek",                                 year: 1966 },
  { kind: 'movie', text: "I'm a doctor, not a bricklayer.",                                     character: "Dr. McCoy",             source: "Star Trek",                                 year: 1967 },
  { kind: 'movie', text: "Allons-y!",                                                           character: "The Doctor",            source: "Doctor Who",                                year: 2005 },

  // Classics
  { kind: 'movie', text: "Fasten your seatbelts. It's going to be a bumpy night.",              character: "Margo Channing",        source: "All About Eve",                             year: 1950 },
  { kind: 'movie', text: "All right, Mr. DeMille, I'm ready for my close-up.",                  character: "Norma Desmond",         source: "Sunset Boulevard",                          year: 1950 },
  { kind: 'movie', text: "The stuff that dreams are made of.",                                  character: "Sam Spade",             source: "The Maltese Falcon",                        year: 1941 },
  { kind: 'movie', text: "Rosebud.",                                                            character: "Charles Foster Kane",   source: "Citizen Kane",                              year: 1941 },
  { kind: 'movie', text: "I'll get you, my pretty, and your little dog too!",                   character: "The Wicked Witch",      source: "The Wizard of Oz",                          year: 1939 },
  { kind: 'movie', text: "I'm walking here!",                                                   character: "Ratso Rizzo",           source: "Midnight Cowboy",                           year: 1969 },
  { kind: 'movie', text: "Just when I thought I was out, they pull me back in.",                character: "Michael Corleone",      source: "The Godfather Part III",                    year: 1990 },
  { kind: 'movie', text: "Failure is not an option.",                                           character: "Gene Kranz",            source: "Apollo 13",                                 year: 1995 },
  { kind: 'movie', text: "I'm not a smart man, but I know what love is.",                       character: "Forrest Gump",          source: "Forrest Gump",                              year: 1994 },
  { kind: 'movie', text: "Talk to me, Goose.",                                                  character: "Maverick",              source: "Top Gun",                                   year: 1986 },
  { kind: 'movie', text: "You is kind. You is smart. You is important.",                        character: "Aibileen Clark",        source: "The Help",                                  year: 2011 },

  // TV
  { kind: 'movie', text: "Cool cool cool cool cool.",                                           character: "Jake Peralta",          source: "Brooklyn Nine-Nine",                        year: 2013 },
  { kind: 'movie', text: "Noice.",                                                              character: "Jake Peralta",          source: "Brooklyn Nine-Nine",                        year: 2013 },
  { kind: 'movie', text: "Bingpot!",                                                            character: "Jake Peralta",          source: "Brooklyn Nine-Nine",                        year: 2013 },
  { kind: 'movie', text: "I'm not superstitious, but I am a little stitious.",                  character: "Michael Scott",         source: "The Office",                                year: 2005 },
  { kind: 'movie', text: "Would I rather be feared or loved? Easy. Both.",                      character: "Michael Scott",         source: "The Office",                                year: 2005 },
  { kind: 'movie', text: "Sometimes I'll start a sentence and I don't even know where it's going.", character: "Michael Scott",         source: "The Office",                                year: 2005 },
  { kind: 'movie', text: "Literally.",                                                          character: "Chris Traeger",         source: "Parks and Recreation",                      year: 2009 },
  { kind: 'movie', text: "Clear eyes, full hearts, can't lose.",                                character: "Coach Taylor",          source: "Friday Night Lights",                       year: 2006 },
  { kind: 'movie', text: "Be a goldfish.",                                                      character: "Ted Lasso",             source: "Ted Lasso",                                 year: 2020 },
  { kind: 'movie', text: "How rude!",                                                           character: "Stephanie Tanner",      source: "Full House",                                year: 1987 },
  { kind: 'movie', text: "Have mercy!",                                                         character: "Uncle Jesse",           source: "Full House",                                year: 1987 },
  { kind: 'movie', text: "Sit on it.",                                                          character: "Fonzie",                source: "Happy Days",                                year: 1974 },
  { kind: 'movie', text: "Lucy, you got some 'splainin' to do!",                                character: "Ricky Ricardo",         source: "I Love Lucy",                               year: 1951 },
  { kind: 'movie', text: "Not that there's anything wrong with that!",                          character: "Jerry Seinfeld",        source: "Seinfeld",                                  year: 1989 },
  { kind: 'movie', text: "Hello, Newman.",                                                      character: "Jerry Seinfeld",        source: "Seinfeld",                                  year: 1989 },
  { kind: 'movie', text: "Joey doesn't share food!",                                            character: "Joey Tribbiani",        source: "Friends",                                   year: 1994 },
  { kind: 'movie', text: "Unagi.",                                                              character: "Ross Geller",           source: "Friends",                                   year: 1994 },
  { kind: 'movie', text: "Challenge accepted.",                                                 character: "Barney Stinson",        source: "How I Met Your Mother",                     year: 2005 },
  { kind: 'movie', text: "I've made a huge mistake.",                                           character: "Gob Bluth",             source: "Arrested Development",                      year: 2003 },
  { kind: 'movie', text: "There's always money in the banana stand.",                           character: "George Bluth Sr.",      source: "Arrested Development",                      year: 2003 },
]
