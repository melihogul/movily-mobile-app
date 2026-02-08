import MovieCard from "@/components/movie-card";
import SearchBar from "@/components/search-bar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["search-movies", debouncedQuery],
    queryFn: ({ pageParam = 1 }) =>
      fetchMovies({ query: debouncedQuery, page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!debouncedQuery.trim(),
  });

  const movies = data?.pages.flat() || [];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0 h-full"
        resizeMode="cover"
      />

      <SafeAreaView className="flex-1" edges={["top"]}>
        <FlatList
          data={movies}
          renderItem={({ item }) => <MovieCard {...item} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: "flex-start",
            gap: 20,
            paddingHorizontal: 20,
            marginBottom: 15,
          }}
          contentContainerStyle={{ paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <View className="px-5">
              <View className="w-full flex-row justify-center mt-10 items-center">
                <Image source={icons.logo} className="w-12 h-10" />
              </View>

              <View className="my-10">
                <SearchBar
                  placeholder="Search for a movie"
                  value={searchQuery}
                  onChangeText={(text: string) => setSearchQuery(text)}
                />
              </View>

              {isLoading && (
                <ActivityIndicator
                  size={"large"}
                  color={"#ab8bff"}
                  className="my-3"
                />
              )}

              {isError && (
                <Text className="text-red-500 px-5 my-3">
                  Error: {(error as Error)?.message}
                </Text>
              )}

              {!isLoading &&
                !isError &&
                debouncedQuery.trim() &&
                movies?.length > 0 && (
                  <Text className="text-xl text-white font-bold mb-5">
                    Search results for{" "}
                    <Text className="text-accent">{debouncedQuery}</Text>
                  </Text>
                )}
            </View>
          }
          ListEmptyComponent={
            !isLoading && !isError ? (
              <View className="mt-10 px-5">
                <Text className="text-center text-light-200">
                  {debouncedQuery.trim()
                    ? "No movies found."
                    : "Search for a movie to get started!"}
                </Text>
              </View>
            ) : null
          }
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
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </View>
  );
};

export default Search;
