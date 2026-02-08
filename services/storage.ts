import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "saved_movies";
const WATCHED_STORAGE_KEY = "watched_movies";

export const getSavedMovies = async (): Promise<Movie[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Error reading saved movies:", e);
    return [];
  }
};

export const saveMovie = async (movie: Movie): Promise<void> => {
  try {
    const savedMovies = await getSavedMovies();
    if (!savedMovies.some((m) => m.id === movie.id)) {
      const updatedMovies = [movie, ...savedMovies];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMovies));
      // Also remove from watched if it was there
      await removeWatchedMovie(movie.id);
    }
  } catch (e) {
    console.error("Error saving movie:", e);
  }
};

export const removeMovie = async (movieId: number): Promise<void> => {
  try {
    const savedMovies = await getSavedMovies();
    const updatedMovies = savedMovies.filter((m) => m.id !== movieId);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMovies));
  } catch (e) {
    console.error("Error removing movie:", e);
  }
};

export const isMovieSaved = async (movieId: number): Promise<boolean> => {
  try {
    const savedMovies = await getSavedMovies();
    return savedMovies.some((m) => m.id === movieId);
  } catch (e) {
    console.error("Error checking if movie is saved:", e);
    return false;
  }
};

export const getWatchedMovies = async (): Promise<Movie[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(WATCHED_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Error reading watched movies:", e);
    return [];
  }
};

export const saveWatchedMovie = async (movie: Movie): Promise<void> => {
  try {
    const watchedMovies = await getWatchedMovies();
    if (!watchedMovies.some((m) => m.id === movie.id)) {
      const updatedMovies = [movie, ...watchedMovies];
      await AsyncStorage.setItem(
        WATCHED_STORAGE_KEY,
        JSON.stringify(updatedMovies),
      );
      // Also remove from saved if it was there
      await removeMovie(movie.id);
    }
  } catch (e) {
    console.error("Error saving watched movie:", e);
  }
};

export const removeWatchedMovie = async (movieId: number): Promise<void> => {
  try {
    const watchedMovies = await getWatchedMovies();
    const updatedMovies = watchedMovies.filter((m) => m.id !== movieId);
    await AsyncStorage.setItem(
      WATCHED_STORAGE_KEY,
      JSON.stringify(updatedMovies),
    );
  } catch (e) {
    console.error("Error removing watched movie:", e);
  }
};

export const isMovieWatched = async (movieId: number): Promise<boolean> => {
  try {
    const watchedMovies = await getWatchedMovies();
    return watchedMovies.some((m) => m.id === movieId);
  } catch (e) {
    console.error("Error checking if movie is watched:", e);
    return false;
  }
};
