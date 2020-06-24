const initialState = {
  games: [],
  gamesPlaying: [],
  gamesPlayer: [],
  isLoadingGames: true,
  image: null,
};

const games = (state = initialState, action) => {
  switch (action.type) {
    case "LOAD_GAMES_FROM_SERVER":
      return {
        ...state,
        games: action.payload,
        gamesPlaying: action.payload.filter((game) => !game.played),
        gamesPlayed: action.payload.filter((game) => games.played),
      };
    case "ADD_GAME":
      return {
        ...state,
        games: [action.payload, ...state.games],
        gamesPlaying: [action.payload, ...state.gamesPlaying],
      };
    case "MARK_GAME_AS_PLAYED":
      return {
        ...state,
        games: state.games.map((game) => {
          if (game.name == action.payload.name) {
            return { ...game, played: true };
          }
          return game;
        }),
        gamesPlayed: [...state.gamesPlayed, action.payload],
        gamesPlaying: state.gamesPlaying.filter(
          (game) => game.name !== action.payload.name
        ),
      };
    case "TOGGLE_IS_LOADING_GAMES":
      return {
        ...state,
        isLoadingGames: action.payload,
      };
    case "MARK_GAME_AS_UNPLAYED":
      return {
        ...state,
        games: state.games.map((game) => {
          if (game.name == action.payload.name) {
            return { ...game, read: false };
          }
          return game;
        }),
        gamesPlayed: state.gamesPlayed.filter(
          (game) => game.name !== action.payload.name
        ),
        gamesPlaying: [...state.gamesPlaying, action.payload],
      };
    case "DELETE_GAME":
      return {
        games: state.games.filter((game) => game.name != action.payload.name),
        gamesPlayed: state.gamesPlayed.filter(
          (game) => game.name != action.payload.name
        ),
        gamesPlaying: state.gamesPlaying.filter(
          (game) => game.name != action.payload.name
        ),
      };
    case "UPDATE_GAME_IMAGE":
      return {
        ...state,
        games: state.games.map((game) => {
          if (game.name == action.payload.name) {
            return { ...game, image: action.payload.uri };
          }
          return game;
        }),
        gamesPlaying: state.gamesPlaying.map((game) => {
          if (game.name == action.payload.name) {
            return { ...game, image: action.payload.uri };
          }
          return game;
        }),
        gamesPlayed: state.gamesPlayed.map((game) => {
          if (game.name == action.payload.name) {
            return { ...game, image: action.payload.uri };
          }
          return game;
        }),
      };
    default:
      return state;
  }
};

export default games;
bo;
