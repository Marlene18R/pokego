import { Stack, useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

export default function Details() {
  const params = useLocalSearchParams<{
    name?: string;
    type?: string;
    image?: string;
    color?: string;
  }>();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Detalles" }} />

      <View
        style={[styles.card, { backgroundColor: params.color || "#F2F2F2" }]}
      >
        <Text style={styles.name}>
          {params.name || "No se seleccionó ningún Pokémon"}
        </Text>

        {params.type ? <Text style={styles.tag}>{params.type}</Text> : null}

        {params.image ? (
          <Image
            source={{ uri: params.image }}
            style={styles.image}
            resizeMode="contain"
            accessibilityLabel={params.name}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    alignItems: "center",
    padding: 24,
    borderRadius: 20,
  },
  name: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  tag: {
    fontSize: 22,
    fontWeight: "bold",
    color: "gray",
    textAlign: "center",
  },
  image: {
    width: "100%",
    maxWidth: 240,
    height: 240,
    marginTop: 16,
  },
});
