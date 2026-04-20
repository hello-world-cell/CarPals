import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { Destination } from '../types/destination';
import { useDestinationSearch, type UseDestinationSearchOptions } from '../hooks/useDestinationSearch';

type Props = UseDestinationSearchOptions & {
  placeholder?: string;
  onDestinationChange?: (destination: Destination | null) => void;
};

export function DestinationSearchBar({
  placeholder = 'Search address, postal code, building…',
  onDestinationChange,
  ...searchOptions
}: Props) {
  const {
    query,
    setQuery,
    suggestions,
    loading,
    error,
    selected,
    selectDestination,
    clearSelection,
  } = useDestinationSearch(searchOptions);

  const [focused, setFocused] = useState(false);
  const showDropdown = focused && (suggestions.length > 0 || loading || !!error);

  const onPick = useCallback(
    (item: Destination) => {
      selectDestination(item);
      onDestinationChange?.(item);
      Keyboard.dismiss();
      setFocused(false);
    },
    [onDestinationChange, selectDestination]
  );

  const onChangeText = useCallback(
    (text: string) => {
      if (selected && text !== selected.title) {
        clearSelection();
        onDestinationChange?.(null);
      }
      setQuery(text);
    },
    [clearSelection, onDestinationChange, selected, setQuery]
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.inputRow}>
        <TextInput
          value={query}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          onFocus={() => setFocused(true)}
          onBlur={() => {
            // Delay hide so row press still fires
            setTimeout(() => setFocused(false), 200);
          }}
        />
        {loading ? (
          <ActivityIndicator style={styles.spinner} color="#028090" />
        ) : null}
      </View>

      {selected ? (
        <Text style={styles.selectedHint} numberOfLines={2}>
          Selected · {selected.subtitle ?? `${selected.latitude ?? '—'}, ${selected.longitude ?? '—'}`}
        </Text>
      ) : null}

      {showDropdown ? (
        <View style={styles.dropdown} accessibilityRole="list">
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}
          {!error && !loading && suggestions.length === 0 && query.trim().length >= (searchOptions.minQueryLength ?? 2) ? (
            <Text style={styles.emptyText}>No results</Text>
          ) : null}
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            style={styles.list}
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
                onPress={() => onPick(item)}
              >
                <Text style={styles.rowTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                {item.subtitle ? (
                  <Text style={styles.rowSub} numberOfLines={2}>
                    {item.subtitle}
                  </Text>
                ) : null}
                <Text style={styles.rowMeta}>{item.source === 'onemap' ? 'OneMap' : 'Google Places'}</Text>
              </Pressable>
            )}
          />
        </View>
      ) : null}

    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 50,
    marginHorizontal: 16,
    marginTop: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F6F8',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0D1B3E',
  },
  spinner: { marginLeft: 8 },
  selectedHint: {
    marginTop: 8,
    fontSize: 12,
    color: '#028090',
    fontWeight: '500',
  },
  dropdown: {
    marginTop: 6,
    maxHeight: 280,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  list: { maxHeight: 260 },
  row: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F0F0F0',
  },
  rowPressed: { backgroundColor: '#F4F6F8' },
  rowTitle: { fontSize: 15, fontWeight: '600', color: '#0D1B3E' },
  rowSub: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  rowMeta: { fontSize: 11, color: '#9CA3AF', marginTop: 4 },
  errorText: { padding: 14, color: '#DC2626', fontSize: 14 },
  emptyText: { padding: 14, color: '#9CA3AF', fontSize: 14 },
});
