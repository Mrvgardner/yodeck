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

// "Motivational" quote cards — read straight, but the punchline is in the
// twist. SFW for a workplace kitchen. Edit/add freely.
export const quotes = [
  { kind: 'quote', text: "The early bird may get the worm, but the second mouse gets the cheese.",                          attribution: 'Wisdom of the snack drawer' },
  { kind: 'quote', text: "Hard work pays off in the future. Laziness pays off now.",                                        attribution: 'Time-tested truth' },
  { kind: 'quote', text: "If at first you don't succeed, skydiving is probably not for you.",                               attribution: 'Risk management' },
  { kind: 'quote', text: "Behind every great employee is a substantial amount of coffee.",                                  attribution: 'Office physics' },
  { kind: 'quote', text: "Believe you can, and you're halfway there. Believe you can't, and you can take a long lunch.",    attribution: 'Loophole logic' },
  { kind: 'quote', text: "Dreams don't work unless you do. Neither does the printer.",                                      attribution: 'Eternal truths' },
  { kind: 'quote', text: "I'm not arguing — I'm just explaining why I'm right.",                                            attribution: 'Inner monologue' },
  { kind: 'quote', text: "Don't watch the clock. Do what it does — keep going. Mostly in circles.",                         attribution: 'Time management' },
  { kind: 'quote', text: "The road to success is always under construction. So is the parking lot.",                        attribution: 'Facilities update' },
  { kind: 'quote', text: "Do something today that your future self will thank you for. Like a nap.",                        attribution: 'Wellness tip' },
  { kind: 'quote', text: "Success is 10% inspiration and 90% remembering your password.",                                   attribution: 'Modern proverb' },
  { kind: 'quote', text: "Be the reason someone smiles today. Be the reason they fake their availability tomorrow.",        attribution: 'Calendar wisdom' },
  { kind: 'quote', text: "Every accomplishment starts with the decision to try. Every failure starts with the decision to ship on a Friday.", attribution: 'Engineering wisdom' },
  { kind: 'quote', text: "You miss 100% of the meetings you decline. Worth it.",                                            attribution: 'Deep focus' },
  { kind: 'quote', text: "Always give 100%. Unless you're donating blood.",                                                  attribution: 'Hydration tip' },
  { kind: 'quote', text: "Strive for progress, not perfection. Especially in the breakroom microwave.",                      attribution: 'Kitchen rule' },
  { kind: 'quote', text: "There are no shortcuts to any place worth going. The kitchen, however, has three.",               attribution: 'Office geography' },
  { kind: 'quote', text: "When life gives you lemons, ask for the receipt.",                                                attribution: 'Consumer rights' },
  { kind: 'quote', text: "The best way to predict the future is to be on a really long meeting that delays it.",            attribution: 'Calendar physics' },
  { kind: 'quote', text: "If opportunity doesn't knock, it's probably waiting in the lobby with a clipboard.",              attribution: 'Reception desk wisdom' },
  { kind: 'quote', text: "Teamwork makes the dream work. Email makes the dream take six business days.",                    attribution: 'Async philosophy' },
  { kind: 'quote', text: "Don't be afraid to take big steps. Mostly toward the snack drawer.",                              attribution: 'Brave decisions' },
]

// Iconic SFW movie & TV quotes. Curated for a workplace kitchen — no
// profanity, no controversial scenes, just lines people will recognize
// and grin at. Add freely.
//
// Format: { kind: 'movie', text, character, source, year? }
export const movieQuotes = [
  // Sci-fi / fantasy
  { kind: 'movie', text: "May the Force be with you.",                                          character: 'Obi-Wan Kenobi',  source: 'Star Wars',                year: 1977 },
  { kind: 'movie', text: "I'll be back.",                                                       character: 'The Terminator',  source: 'The Terminator',           year: 1984 },
  { kind: 'movie', text: "Houston, we have a problem.",                                         character: 'Jim Lovell',      source: 'Apollo 13',                year: 1995 },
  { kind: 'movie', text: "There is no spoon.",                                                  character: 'The Boy',         source: 'The Matrix',               year: 1999 },
  { kind: 'movie', text: "Just keep swimming.",                                                 character: 'Dory',            source: 'Finding Nemo',             year: 2003 },
  { kind: 'movie', text: "To infinity… and beyond!",                                            character: 'Buzz Lightyear',  source: 'Toy Story',                year: 1995 },
  { kind: 'movie', text: "I am Groot.",                                                         character: 'Groot',           source: 'Guardians of the Galaxy',  year: 2014 },
  { kind: 'movie', text: "With great power comes great responsibility.",                        character: 'Uncle Ben',       source: 'Spider-Man',               year: 2002 },
  { kind: 'movie', text: "I am inevitable.",                                                    character: 'Thanos',          source: 'Avengers: Endgame',        year: 2019 },

  // Drama / classic
  { kind: 'movie', text: "Frankly, my dear, I don't give a damn.",                              character: 'Rhett Butler',    source: 'Gone with the Wind',       year: 1939 },
  { kind: 'movie', text: "Here's looking at you, kid.",                                         character: 'Rick Blaine',     source: 'Casablanca',               year: 1942 },
  { kind: 'movie', text: "I'm gonna make him an offer he can't refuse.",                        character: 'Don Corleone',    source: 'The Godfather',            year: 1972 },
  { kind: 'movie', text: "You can't handle the truth!",                                         character: 'Col. Jessep',     source: 'A Few Good Men',           year: 1992 },
  { kind: 'movie', text: "Life is like a box of chocolates. You never know what you're gonna get.", character: 'Forrest Gump', source: 'Forrest Gump',             year: 1994 },
  { kind: 'movie', text: "My precious.",                                                        character: 'Gollum',          source: 'The Lord of the Rings',    year: 2002 },
  { kind: 'movie', text: "Why so serious?",                                                     character: 'The Joker',       source: 'The Dark Knight',          year: 2008 },

  // Comedy
  { kind: 'movie', text: "I feel the need… the need for speed!",                                character: 'Maverick',        source: 'Top Gun',                  year: 1986 },
  { kind: 'movie', text: "Nobody puts Baby in a corner.",                                       character: 'Johnny Castle',   source: 'Dirty Dancing',            year: 1987 },
  { kind: 'movie', text: "Yippee-ki-yay.",                                                      character: 'John McClane',    source: 'Die Hard',                 year: 1988 },
  { kind: 'movie', text: "I'll have what she's having.",                                        character: 'Diner patron',    source: 'When Harry Met Sally',     year: 1989 },
  { kind: 'movie', text: "You're killin' me, Smalls.",                                          character: 'Ham Porter',      source: 'The Sandlot',              year: 1993 },
  { kind: 'movie', text: "Show me the money!",                                                  character: 'Rod Tidwell',     source: 'Jerry Maguire',            year: 1996 },
  { kind: 'movie', text: "I'm the king of the world!",                                          character: 'Jack Dawson',     source: 'Titanic',                  year: 1997 },
  { kind: 'movie', text: "It's not a tumor.",                                                   character: 'John Kimble',     source: 'Kindergarten Cop',         year: 1990 },

  // TV
  { kind: 'movie', text: "How you doin'?",                                                      character: 'Joey Tribbiani',  source: 'Friends',                  year: 1994 },
  { kind: 'movie', text: "That's what she said.",                                               character: 'Michael Scott',   source: 'The Office',               year: 2005 },
  { kind: 'movie', text: "Bazinga!",                                                            character: 'Sheldon Cooper',  source: 'The Big Bang Theory',      year: 2007 },
  { kind: 'movie', text: "Winter is coming.",                                                   character: 'Ned Stark',       source: 'Game of Thrones',          year: 2011 },
  { kind: 'movie', text: "Live long and prosper.",                                              character: 'Spock',           source: 'Star Trek',                year: 1966 },
  { kind: 'movie', text: "Did I do that?",                                                      character: 'Steve Urkel',     source: 'Family Matters',           year: 1989 },
  { kind: 'movie', text: "D'oh!",                                                               character: 'Homer Simpson',   source: 'The Simpsons',             year: 1989 },
  { kind: 'movie', text: "I'm not a regular mom. I'm a cool mom.",                              character: 'Mrs. George',     source: 'Mean Girls',               year: 2004 },
  { kind: 'movie', text: "Schwifty.",                                                           character: 'Rick Sanchez',    source: 'Rick and Morty',           year: 2013 },
  { kind: 'movie', text: "I'm just a girl, standing in front of a boy, asking him to love her.", character: 'Anna Scott',     source: 'Notting Hill',             year: 1999 },
  { kind: 'movie', text: "Make it so.",                                                         character: 'Capt. Picard',    source: 'Star Trek: TNG',           year: 1987 },
  { kind: 'movie', text: "These are not the droids you're looking for.",                        character: 'Obi-Wan Kenobi',  source: 'Star Wars',                year: 1977 },
]
