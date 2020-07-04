import games from "./reducers/GamesReducer";

export const addGame = (game) => ({
  type: "ADD_GAME",
  payload: game,
});

export const loadGames = (games) => ({
  type: "LOAD_GAMES_FROM_SERVER",
  payload: games,
});

export const toggleIsLoadingGames = (bool) => ({
  type: "TOGGLE_IS_LOADING_GAMES",
  payload: bool,
});

export const deleteGame = (game) => ({
  type: "DELETE_GAME",
  payload: game,
});

export const updateGameImage = (game) => ({
  type: "UPDATE_GAME_IMAGE",
  payload: game,
});

export const markGameAsCompleted = (game) => ({
  type: "MARK_GAME_AS_COMPLETED",
  payload: game,
});

export const markGameAsUnplayed = (game) => ({
  type: "MARK_GAME_AS_UNPLAYED",
  payload: game,
});

export const markGameAsPlatinum = (game) => ({
  type: "MARK_GAME_AS_PLATINUM",
  payload: game,
});

export const markGameAsNotPlatinum = (game) => ({
  type: "MARK_GAME_AS_NOT_PLATINUM",
  payload: game,
});

export const signOut = () => ({
  type: "SIGN_OUT",
});
