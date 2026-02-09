import MovieCard from "@/components/movie-card";
import TrendingCard from "@/components/trending-card";
import { icons } from "@/constants/icons";
import { fetchMovies } from "@/services/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["movies"],
    queryFn: ({ pageParam = 1 }) => fetchMovies({ query: "", page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      // TMDB returns empty results or matches if no more pages
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const movies = data?.pages.flat() || [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderHeader = () => (
    <View className="px-5 mt-5">
      <Image source={icons.logo} className="w-12 h-10 mb-5 mx-auto" />

      {isLoading ? (
        <ActivityIndicator
          size={"large"}
          color={"#ab8bff"}
          className="mt-10 self-center"
        />
      ) : isError ? (
        <Text className="text-white text-center mt-5">
          Error: {error?.message}
        </Text>
      ) : (
        <>
          <Text className="text-lg text-white font-bold mt-5 mb-3">
            Trending Movies
          </Text>
          <FlatList
            data={movies?.slice(0, 9)}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="w-4" />}
            renderItem={({ item, index }) => (
              <TrendingCard movie={item} index={index} />
            )}
            keyExtractor={(item) => `trending-${item.id}`}
            className="mt-2"
          />
          <Text className="text-lg text-white font-bold mt-5 mb-3">
            Latest Movies
          </Text>
        </>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-primary">
      <SafeAreaView className="flex-1" edges={["top"]}>
        <FlatList
          data={movies}
          renderItem={({ item }) => <MovieCard {...item} />}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: "flex-start",
            gap: 20,
            paddingHorizontal: 20,
            marginBottom: 15,
          }}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator
                size="small"
                color="#ab8bff"
                className="py-5"
              />
            ) : null
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
        />
      </SafeAreaView>
    </View>
  );
}
