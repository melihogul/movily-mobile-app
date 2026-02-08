import MovieCard from "@/components/movie-card";
import { images } from "@/constants/images";
import { getWatchedMovies } from "@/services/storage";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Watched = () => {
  const [watchedMovies, setWatchedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadWatchedMovies();
    }, []),
  );

  const loadWatchedMovies = async () => {
    setIsLoading(true);
    const movies = await getWatchedMovies();
    setWatchedMovies(movies);
    setIsLoading(false);
  };

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full h-full z-0" />
      <SafeAreaView className="flex-1 px-5" edges={["top"]}>
        <Text className="text-2xl font-bold text-white mt-5 mb-5">
          Watched Movies
        </Text>

        {isLoading ? (
          <Text className="text-white text-center mt-10">Loading...</Text>
        ) : watchedMovies.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-light-200 text-lg">
              No watched movies yet.
            </Text>
          </View>
        ) : (
          <FlatList
            data={watchedMovies}
            renderItem={({ item }) => <MovieCard {...item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={{
              justifyContent: "flex-start",
              gap: 20,
              paddingRight: 5,
              marginBottom: 20,
            }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

export default Watched;
