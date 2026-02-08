import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import { isMovieSaved, removeMovie, saveMovie } from "@/services/storage";
import useFetch from "@/services/use-fetch";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const Details = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isSaved, setIsSaved] = useState(false);

  const {
    data: movie,
    loading,
    error,
  } = useFetch(() => fetchMovieDetails(id as string));

  useEffect(() => {
    checkIfSaved();
  }, [id]);

  const checkIfSaved = async () => {
    const saved = await isMovieSaved(Number(id));
    setIsSaved(saved);
  };

  const toggleSave = async () => {
    if (isSaved) {
      await removeMovie(Number(id));
      setIsSaved(false);
    } else {
      if (movie) {
        const savedMovie: Movie = {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path ?? "",
          vote_average: movie.vote_average,
          release_date: movie.release_date,
          overview: movie.overview ?? "",
          backdrop_path: movie.backdrop_path ?? "",
          genre_ids: movie.genres?.map((g) => g.id) || [],
          original_language: movie.original_language,
          original_title: movie.original_title,
          popularity: movie.popularity,
          video: movie.video,
          vote_count: movie.vote_count,
          adult: movie.adult,
        };
        await saveMovie(savedMovie);
        setIsSaved(true);
      }
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-primary items-center justify-center">
        <ActivityIndicator size="large" color="#ab8bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-primary items-center justify-center">
        <Text className="text-white">Error loading movie details</Text>
        <TouchableOpacity
          onPress={router.back}
          className="mt-4 bg-accent px-4 py-2 rounded-lg"
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className="w-full h-[550px]"
            resizeMode="stretch"
          />
          <LinearGradient
            colors={["transparent", "#030014"]}
            start={{ x: 0.5, y: 0.7 }}
            end={{ x: 0.5, y: 1 }}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              zIndex: 10,
            }}
          />

          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-12 left-5 z-20 size-10 items-center justify-center rounded-full bg-dark-200/50"
          >
            <Image source={icons.arrow} className="size-5" tintColor="white" />
          </TouchableOpacity>
        </View>
        <View className="flex-col items-start justify-center mt-5 px-5">
          <View className="flex-row items-center justify-between w-full">
            <Text className="text-white font-bold text-xl flex-1 mr-2">
              {movie?.title}
            </Text>
            <TouchableOpacity onPress={toggleSave}>
              <Image
                source={icons.save}
                className="size-6"
                tintColor={isSaved ? "#AB8BFF" : "#ffffff"}
              />
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {movie?.release_date?.split("-")[0]} •
            </Text>
            <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
          </View>
          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />

            <Text className="text-white font-bold text-sm">
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>

            <Text className="text-light-200 text-sm">
              ({movie?.vote_count} votes)
            </Text>
          </View>

          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo
            label="Genres"
            value={movie?.genres?.map((g: any) => g.name).join(" • ") || "N/A"}
          />

          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={`$${(movie?.budget ?? 0) / 1_000_000} million`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${Math.round(
                (movie?.revenue ?? 0) / 1_000_000,
              )} million`}
            />
          </View>

          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies
                ?.map((c: any) => c.name)
                .join(" • ") || "N/A"
            }
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        onPress={() => router.back()}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Details;
