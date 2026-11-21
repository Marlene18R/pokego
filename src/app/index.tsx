import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const pokeAPI = "https://pokeapi.co/api/v2/pokemon?limit=20";

const colorsByType: Record<string, string | undefined> = {
  bug: "#EDF4CD",
  dark: "#E6DCD5",
  dragon: "#E2D8FF",
  electric: "#FFF4B8",
  fairy: "#FFE1EF",
  fighting: "#F7D7D4",
  fire: "#FFE1CA",
  flying: "#EBE3FF",
  ghost: "#E8DDF2",
  grass: "#DDF3D3",
  ground: "#F5EACC",
  ice: "#DDF6F6",
  normal: "#EFEEE2",
  poison: "#F2DDF4",
  psychic: "#FFDDE8",
  rock: "#F0E8C7",
  steel: "#E5E8ED",
  water: "#DEEBFF",
};

type PokemonSummary = {
  name: string;
  url: string;
};

type PokemonType = {
  slot: number;
  type: {
    name: string;
    url: string;
  };
};

type Pokemon = {
  name: string;
  image: string | undefined;
  imageBack: string | undefined;
  type: PokemonType[];
};

type PokemonDetails = {
  sprites: {
    front_default: string | null;
    back_default: string | null;
  };
  types: PokemonType[];
};

async function fetchPokemons(): Promise<Pokemon[]> {
  const response = await fetch(pokeAPI);
  const data: { results: PokemonSummary[] } = await response.json();

  return Promise.all(
    data.results.map(async (pokemon) => {
      const res = await fetch(pokemon.url);
      const details: PokemonDetails = await res.json();

      return {
        name: pokemon.name,
        image: details.sprites.front_default ?? undefined,
        imageBack: details.sprites.back_default ?? undefined,
        type: details.types,
      };
    }),
  );
}

export default function Index() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  useEffect(() => {
    fetchPokemons().then(setPokemons).catch(console.error);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ gap: 16, padding: 16 }}>
        {pokemons.map((pokemon: Pokemon) => (
          <Link
            key={pokemon.name}
            href={{
              pathname: "/details",
              params: {
                name: pokemon.name,
                type: pokemon.type[0]?.type.name ?? "",
                image: pokemon.image ?? "",
                color:
                  colorsByType[pokemon.type[0]?.type.name ?? ""] ?? "#F2F2F2",
              },
            }}
            asChild
          >
            <Pressable
              accessibilityLabel={`Ver detalles de ${pokemon.name}`}
              style={{
                backgroundColor: colorsByType[pokemon.type[0]?.type.name ?? ""],
                padding: 16,
                borderRadius: 16,
              }}
            >
              <Text style={styles.name}>{pokemon.name}</Text>
              <Text style={styles.tag}>{pokemon.type[0]?.type.name}</Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={{ uri: pokemon.image }}
                  style={{ width: 100, height: 100 }}
                  accessible
                  accessibilityLabel={`${pokemon.name} de frente`}
                />
                <Image
                  source={{ uri: pokemon.imageBack }}
                  style={{ width: 100, height: 100 }}
                  accessible
                  accessibilityLabel={`${pokemon.name} de espaldas`}
                />
              </View>
            </Pressable>
          </Link>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: "center",
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  tag: {
    fontSize: 28,
    fontWeight: "bold",
    color: "gray",
    textAlign: "center",
  },
});
