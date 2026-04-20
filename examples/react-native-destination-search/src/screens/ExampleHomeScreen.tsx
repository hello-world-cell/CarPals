import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { DestinationSearchBar } from '../components/DestinationSearchBar';
import type { Destination } from '../types/destination';

/** Wire tokens from Expo extra / env — never commit real secrets */
const ONEMAP_TOKEN = process.env.EXPO_PUBLIC_ONEMAP_TOKEN ?? '';
const GOOGLE_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_KEY ?? '';

export function ExampleHomeScreen() {
  const [destination, setDestination] = useState<Destination | null>(null);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Where to?</Text>
        <Text style={styles.sub}>Singapore search (OneMap + optional Google)</Text>
      </View>

      <DestinationSearchBar
        onemapToken={ONEMAP_TOKEN || undefined}
        googleApiKey={GOOGLE_KEY || undefined}
        provider={
          ONEMAP_TOKEN && GOOGLE_KEY
            ? 'onemap_then_google'
            : ONEMAP_TOKEN
              ? 'onemap'
              : 'google'
        }
        onDestinationChange={setDestination}
      />

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Dynamic selection</Text>
        <Text style={styles.cardBody}>
          {destination
            ? `${destination.title}\n${destination.latitude ?? '—'}, ${destination.longitude ?? '—'}`
            : 'Pick a suggestion from the list.'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  title: { fontSize: 22, fontWeight: '700', color: '#0D1B3E' },
  sub: { fontSize: 13, color: '#9CA3AF', marginTop: 4 },
  card: {
    margin: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F4F6F8',
  },
  cardLabel: { fontSize: 12, fontWeight: '600', color: '#9CA3AF', marginBottom: 8 },
  cardBody: { fontSize: 15, color: '#0D1B3E', lineHeight: 22 },
});
