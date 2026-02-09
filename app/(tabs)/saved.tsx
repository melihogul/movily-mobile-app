import MovieCard from "@/components/movie-card";
import { getSavedMovies } from "@/services/storage";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PAGE_SIZE = 12;

const Saved = () => {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [displayedMovies, setDisplayedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadSavedMovies();
    }, []),
  );

  const loadSavedMovies = async () => {
    setIsLoading(true);
    const movies = await getSavedMovies();
    setAllMovies(movies);
    setDisplayedMovies(movies.slice(0, PAGE_SIZE));
    setIsLoading(false);
  };

  const handleLoadMore = () => {
    if (displayedMovies.length < allMovies.length && !isFetchingMore) {
      setIsFetchingMore(true);
      // Simulate small delay for "infinite scroll" feel
      setTimeout(() => {
        const nextBatch = allMovies.slice(
          displayedMovies.length,
          displayedMovies.length + PAGE_SIZE,
        );
        setDisplayedMovies((prev) => [...prev, ...nextBatch]);
        setIsFetchingMore(false);
      }, 500);
    }
  };

  return (
    <View className="flex-1 bg-primary">
      <SafeAreaView className="flex-1 px-5" edges={["top"]}>
        <Text className="text-2xl font-bold text-white mt-5 mb-5">
          Saved Movies
        </Text>

        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#ab8bff" />
          </View>
        ) : allMovies.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-light-200 text-lg">No saved movies yet.</Text>
          </View>
        ) : (
          <FlatList
            data={displayedMovies}
            renderItem={({ item }) => <MovieCard {...item} />}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            numColumns={3}
            columnWrapperStyle={{
              justifyContent: "flex-start",
              gap: 20,
              paddingRight: 5,
              marginBottom: 20,
            }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isFetchingMore ? (
                <ActivityIndicator
                  size="small"
                  color="#ab8bff"
                  className="py-5"
                />
              ) : null
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
};

export default Saved;
