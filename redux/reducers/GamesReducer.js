const initialState = {
  games: [],
  gamesPlaying: [],
  gamesCompleted: [],
  isLoadingGames: true,
  image: null,
};

const games = (state = initialState, action) => {
  switch (action.type) {
    case "LOAD_GAMES_FROM_SERVER":
      return {
        ...state,
        games: action.payload,
        gamesPlaying: action.payload.filter((game) => !game.completed),
        gamesCompleted: action.payload.filter((game) => game.completed),
      };
    case "ADD_GAME":
      return {
        ...state,
        games: [action.payload, ...state.games],
        gamesPlaying: [action.payload, ...state.gamesPlaying],
      };
    case "MARK_GAME_AS_COMPLETED":
      return {
        ...state,
        games: state.games.map((game) => {
          if (game.name == action.payload.name) {
            return { ...game, completed: true };
          }
          return game;
        }),
        gamesCompleted: [...state.gamesCompleted, action.payload],
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
            return { ...game, completed: false };
          }
          return game;
        }),
        gamesCompleted: state.gamesCompleted.filter(
          (game) => game.name !== action.payload.name
        ),
        gamesPlaying: [...state.gamesPlaying, action.payload],
      };
    case "DELETE_GAME":
      return {
        games: state.games.filter((game) => game.name != action.payload.name),
        gamesCompleted: state.gamesCompleted.filter(
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
        gamesCompleted: state.gamesCompleted.map((game) => {
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
