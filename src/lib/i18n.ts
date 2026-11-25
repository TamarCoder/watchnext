export type Language = 'en' | 'ka';
export const LANGUAGES: Language[] = ['en', 'ka'];

/** The `language` parameter TMDB expects for each app language. */
export const TMDB_LANGUAGE: Record<Language, string> = { en: 'en-US', ka: 'ka-GE' };

const en = {
  'tab.movies': 'Movies',
  'tab.tv': 'TV Shows',
  'tab.search': 'Search',
  'tab.library': 'My List',

  'list.trending': 'Trending this week',
  'list.popular': 'Popular',
  'list.top_rated': 'All-time best',
  'list.now_playing': 'Now in cinemas',
  'list.upcoming': 'Coming soon',
  'list.on_the_air': 'On the air',
  'list.airing_today': 'Airing today',

  'home.top10': 'Top 10 this week',
  'home.genres': 'Browse by genre',
  'home.people': 'Popular people',
  'home.moreInfo': 'More info',
  'common.seeAll': 'See all',
  'common.readMore': 'Read more',
  'common.showLess': 'Show less',
  'common.tryAgain': 'Try again',
  'common.noPoster': 'No poster',

  'details.directedBy': 'Directed by',
  'details.trailer': 'Trailer',
  'details.overview': 'Overview',
  'details.noOverview': 'No overview available.',
  'details.cast': 'Cast',
  'details.reviews': 'Reviews ({count})',
  'details.similarMovies': 'Similar movies',
  'details.similarShows': 'Similar shows',
  'details.whereToWatch': 'Where to watch ({region})',
  'details.justWatch': 'Streaming data by JustWatch',
  'details.myRating': 'My rating',
  'details.seasons': '{count} seasons',
  'details.season': '1 season',

  'status.want': 'Want to watch',
  'status.watching': 'Watching',
  'status.watched': 'Watched',
  'status.remove': 'Remove',

  'library.title': 'My List',
  'library.count': '{count} titles',
  'library.emptyTitle': 'Nothing here yet',
  'library.emptyMessage': 'Open any movie or show and pick a status to add it here.',
  'library.browse': 'Browse movies',

  'person.born': 'Born {value}',
  'person.knownFor': 'Known for ({count})',

  'genre.popular': 'Popular',
  'genre.topRated': 'Top rated',
  'genre.newest': 'Newest',
  'genre.emptyTitle': 'Nothing here',
  'genre.emptyMessage': 'No titles match this genre yet.',

  'search.placeholder': 'Movies, shows, people',
  'search.all': 'All',
  'search.people': 'People',
  'search.idleTitle': 'Search everything',
  'search.idleMessage': 'Movies, TV shows and people — type at least two letters.',
  'search.emptyTitle': 'No results',
  'search.emptyMessage': 'Nothing matches “{term}” here. Try another word or filter.',

  'error.missing-token.title': 'API token missing',
  'error.missing-token.message': 'Add EXPO_PUBLIC_TMDB_TOKEN to your .env file and restart the app.',
  'error.unauthorized.title': 'Access denied',
  'error.unauthorized.message': 'Your TMDB token is not valid. Check it and try again.',
  'error.not-found.title': 'Not found',
  'error.not-found.message': 'This title may have been removed from TMDB.',
  'error.network.title': 'You are offline',
  'error.network.message': 'Check your internet connection and try again.',
  'error.server.title': 'Something went wrong',
  'error.server.message': 'TMDB is not responding right now. Please try again soon.',
} as const;

export type TranslationKey = keyof typeof en;

const ka: Record<TranslationKey, string> = {
  'tab.movies': 'ფილმები',
  'tab.tv': 'სერიალები',
  'tab.search': 'ძებნა',
  'tab.library': 'ჩემი სია',

  'list.trending': 'კვირის ტრენდები',
  'list.popular': 'პოპულარული',
  'list.top_rated': 'ყველა დროის საუკეთესო',
  'list.now_playing': 'ახლა კინოთეატრებში',
  'list.upcoming': 'მალე',
  'list.on_the_air': 'ეთერში',
  'list.airing_today': 'დღეს ეთერში',

  'home.top10': 'კვირის Top 10',
  'home.genres': 'ჟანრები',
  'home.people': 'პოპულარული ადამიანები',
  'home.moreInfo': 'დაწვრილებით',
  'common.seeAll': 'ყველა',
  'common.readMore': 'მეტის ნახვა',
  'common.showLess': 'ნაკლები',
  'common.tryAgain': 'თავიდან ცდა',
  'common.noPoster': 'პოსტერი არ არის',

  'details.directedBy': 'რეჟისორი:',
  'details.trailer': 'ტრეილერი',
  'details.overview': 'აღწერა',
  'details.noOverview': 'აღწერა არ არის.',
  'details.cast': 'მსახიობები',
  'details.reviews': 'რეცენზიები ({count})',
  'details.similarMovies': 'მსგავსი ფილმები',
  'details.similarShows': 'მსგავსი სერიალები',
  'details.whereToWatch': 'სად ვუყურო ({region})',
  'details.justWatch': 'სტრიმინგის მონაცემები: JustWatch',
  'details.myRating': 'ჩემი შეფასება',
  'details.seasons': '{count} სეზონი',
  'details.season': '1 სეზონი',

  'status.want': 'მინდა ვნახო',
  'status.watching': 'ვუყურებ',
  'status.watched': 'ვნახე',
  'status.remove': 'წაშლა',

  'library.title': 'ჩემი სია',
  'library.count': '{count} სათაური',
  'library.emptyTitle': 'აქ ჯერ არაფერია',
  'library.emptyMessage': 'გახსენი ნებისმიერი ფილმი ან სერიალი და აირჩიე სტატუსი.',
  'library.browse': 'ფილმების ნახვა',

  'person.born': 'დაიბადა: {value}',
  'person.knownFor': 'ცნობილია ({count})',

  'genre.popular': 'პოპულარული',
  'genre.topRated': 'საუკეთესო',
  'genre.newest': 'ახალი',
  'genre.emptyTitle': 'აქ არაფერია',
  'genre.emptyMessage': 'ამ ჟანრში ჯერ არაფერი მოიძებნა.',

  'search.placeholder': 'ფილმები, სერიალები, ადამიანები',
  'search.all': 'ყველა',
  'search.people': 'ადამიანები',
  'search.idleTitle': 'მოძებნე ყველაფერი',
  'search.idleMessage': 'ფილმები, სერიალები და ადამიანები — ჩაწერე მინიმუმ ორი ასო.',
  'search.emptyTitle': 'ვერაფერი მოიძებნა',
  'search.emptyMessage': '„{term}“ აქ ვერ მოიძებნა. სცადე სხვა სიტყვა ან ფილტრი.',

  'error.missing-token.title': 'API token არ არის',
  'error.missing-token.message': 'დაამატე EXPO_PUBLIC_TMDB_TOKEN .env ფაილში და გადატვირთე აპი.',
  'error.unauthorized.title': 'წვდომა უარყოფილია',
  'error.unauthorized.message': 'TMDB token არასწორია. შეამოწმე და სცადე თავიდან.',
  'error.not-found.title': 'ვერ მოიძებნა',
  'error.not-found.message': 'შესაძლოა, ეს სათაური TMDB-დან წაშლილია.',
  'error.network.title': 'ინტერნეტი არ არის',
  'error.network.message': 'შეამოწმე ინტერნეტ კავშირი და სცადე თავიდან.',
  'error.server.title': 'რაღაც შეცდომა მოხდა',
  'error.server.message': 'TMDB ახლა არ პასუხობს. სცადე ცოტა ხანში.',
};

const DICTIONARIES: Record<Language, Record<TranslationKey, string>> = { en, ka };

export function translate(lang: Language, key: TranslationKey, vars: Record<string, string | number> = {}) {
  const text = DICTIONARIES[lang][key] ?? en[key];
  return text.replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? `{${name}}`));
}

export function pickLanguage(deviceCode: string | null | undefined): Language {
  return deviceCode === 'ka' ? 'ka' : 'en';
}
