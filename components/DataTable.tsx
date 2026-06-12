import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { LoadingRing } from '@/components/LoadingRing';
import { useColors } from '@/hooks/useColors';

export interface DataTableColumn<T> {
  key: string;
  label: string;
  width?: number;
  flex?: number;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  render?: (row: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T> {
  title?: string;
  subtitle?: string;
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string;
  emptyMessage?: string;
  loading?: boolean;
  onRowPress?: (row: T, index: number) => void;
  showRowChevron?: boolean;
  compact?: boolean;
  fitWidth?: boolean;
  titleColor?: string;
  headerBgColor?: string;
  headerTextColor?: string;
  rowBgColorEven?: string;
  rowBgColorOdd?: string;
  borderColor?: string;
  outerBorderColor?: string;
  titleBgGradient?: string[];
  headerBgGradient?: string[];
  backgroundColor?: string;
  textColor?: string;
  stickyFirstColumn?: boolean;
}

export function DataTable<T>({
  title,
  subtitle,
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No data',
  loading,
  onRowPress,
  showRowChevron,
  compact = false,
  fitWidth = false,
  titleColor,
  headerBgColor,
  headerTextColor,
  rowBgColorEven,
  rowBgColorOdd,
  borderColor,
  outerBorderColor,
  titleBgGradient,
  headerBgGradient,
  backgroundColor,
  textColor,
  stickyFirstColumn = false,
}: DataTableProps<T>) {
  const c = useColors();

  const [rowHeights, setRowHeights] = React.useState<{ [key: string]: number }>({});

  React.useEffect(() => {
    setRowHeights({});
  }, [data, columns, compact, stickyFirstColumn]);

  const cellAlign = (align?: 'left' | 'center' | 'right'): TextStyle['textAlign'] => {
    if (align === 'center') return 'center';
    if (align === 'right') return 'right';
    return 'left';
  };

  const renderCell = (row: T, col: DataTableColumn<T>, index: number) => {
    const content = col.render ? col.render(row, index) : null;
    if (typeof content === 'string' || typeof content === 'number') {
      return (
        <Text
          style={[styles.cellText, { color: textColor || c.foreground, textAlign: cellAlign(col.align) }]}
          numberOfLines={2}
        >
          {content}
        </Text>
      );
    }
    return content ?? <Text style={[styles.cellText, { color: textColor || c.mutedForeground }]}>—</Text>;
  };

  const colStyle = (col: DataTableColumn<T>): ViewStyle => {
    if (fitWidth) {
      return { flex: col.flex ?? 1, minWidth: col.minWidth ?? 56 };
    }
    return {
      width: col.width,
      flex: col.width ? undefined : col.flex ?? 1,
      minWidth: col.minWidth ?? col.width ?? 64,
    };
  };

  const tableBody = (
    <View style={fitWidth ? styles.fitTable : undefined}>
      {/* Header row */}
      {headerBgGradient ? (
        <LinearGradient
          colors={headerBgGradient as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.headRow,
            compact && styles.headRowCompact,
            { borderBottomColor: borderColor || c.border },
          ]}
        >
          {columns.map(col => (
            <View
              key={col.key}
              style={[styles.headCell, compact && styles.headCellCompact, colStyle(col)]}
            >
              <Text
                style={[
                  styles.headText,
                  compact && styles.headTextCompact,
                  { color: headerTextColor || c.mutedForeground, textAlign: cellAlign(col.align) },
                ]}
                numberOfLines={1}
              >
                {col.label}
              </Text>
            </View>
          ))}
          {showRowChevron ? <View style={styles.chevronCol} /> : null}
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.headRow,
            compact && styles.headRowCompact,
            { backgroundColor: headerBgColor || c.surfaceAlt, borderBottomColor: borderColor || c.border },
          ]}
        >
          {columns.map(col => (
            <View
              key={col.key}
              style={[styles.headCell, compact && styles.headCellCompact, colStyle(col)]}
            >
              <Text
                style={[
                  styles.headText,
                  compact && styles.headTextCompact,
                  { color: headerTextColor || c.mutedForeground, textAlign: cellAlign(col.align) },
                ]}
                numberOfLines={1}
              >
                {col.label}
              </Text>
            </View>
          ))}
          {showRowChevron ? <View style={styles.chevronCol} /> : null}
        </View>
      )}

      {/* Body rows */}
      {data.map((row, rowIndex) => {
        const key = keyExtractor(row, rowIndex);
        const isLast = rowIndex === data.length - 1;
        const RowWrap = onRowPress ? TouchableOpacity : View;
        const rowProps = onRowPress
          ? { onPress: () => onRowPress(row, rowIndex), activeOpacity: 0.72 }
          : {};

        const defaultRowBg = rowIndex % 2 === 1 ? c.surfaceAlt + '66' : c.card;
        const customRowBg = rowIndex % 2 === 1 
          ? (rowBgColorOdd || defaultRowBg) 
          : (rowBgColorEven || defaultRowBg);

        return (
          <RowWrap
            key={key}
            style={[
              styles.bodyRow,
              compact && styles.bodyRowCompact,
              {
                backgroundColor: customRowBg,
                borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
                borderBottomColor: borderColor || c.hairline,
              },
            ]}
            {...(rowProps as any)}
          >
            {columns.map(col => (
              <View
                key={col.key}
                style={[styles.bodyCell, compact && styles.bodyCellCompact, colStyle(col)]}
              >
                {renderCell(row, col, rowIndex)}
              </View>
            ))}
            {showRowChevron ? (
              <View style={styles.chevronCol}>
                <View style={[styles.chevronWrap, { backgroundColor: c.surfaceAlt }]}>
                  <Feather name="chevron-right" size={13} color={c.mutedForeground} />
                </View>
              </View>
            ) : null}
          </RowWrap>
        );
      })}
    </View>
  );

  const leftColStyle = (col: DataTableColumn<T>): ViewStyle => {
    const w = col.minWidth ?? col.width ?? 80;
    return {
      width: w,
      minWidth: w,
    };
  };

  const firstCol = columns[0];
  const otherCols = columns.slice(1);

  const leftTableHeaderContent = firstCol ? (
    <View style={[styles.headCell, compact && styles.headCellCompact, leftColStyle(firstCol)]}>
      <Text
        style={[
          styles.headText,
          compact && styles.headTextCompact,
          { color: headerTextColor || c.mutedForeground, textAlign: cellAlign(firstCol.align) },
        ]}
        numberOfLines={1}
      >
        {firstCol.label}
      </Text>
    </View>
  ) : null;

  const leftTableHeader = firstCol ? (
    headerBgGradient ? (
      <LinearGradient
        onLayout={e => {
          const h = e.nativeEvent.layout.height;
          setRowHeights(prev => {
            const prevH = prev.header || 0;
            if (h > prevH + 2) {
              return { ...prev, header: h };
            }
            return prev;
          });
        }}
        colors={headerBgGradient as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.headRow,
          compact && styles.headRowCompact,
          {
            borderBottomColor: borderColor || c.border,
            paddingHorizontal: 0,
            height: rowHeights.header || undefined,
          }
        ]}
      >
        {leftTableHeaderContent}
      </LinearGradient>
    ) : (
      <View
        onLayout={e => {
          const h = e.nativeEvent.layout.height;
          setRowHeights(prev => {
            const prevH = prev.header || 0;
            if (h > prevH + 2) {
              return { ...prev, header: h };
            }
            return prev;
          });
        }}
        style={[
          styles.headRow,
          compact && styles.headRowCompact,
          {
            backgroundColor: headerBgColor || c.surfaceAlt,
            borderBottomColor: borderColor || c.border,
            paddingHorizontal: 0,
            height: rowHeights.header || undefined,
          }
        ]}
      >
        {leftTableHeaderContent}
      </View>
    )
  ) : null;

  const leftTable = firstCol ? (
    <View style={{ zIndex: 2, backgroundColor: backgroundColor || c.card }}>
      {/* Header cell for first column */}
      {leftTableHeader}

      {/* Body cells for first column */}
      {data.map((row, rowIndex) => {
        const key = keyExtractor(row, rowIndex);
        const isLast = rowIndex === data.length - 1;
        const RowWrap = onRowPress ? TouchableOpacity : View;
        const rowProps = onRowPress ? { onPress: () => onRowPress(row, rowIndex), activeOpacity: 0.72 } : {};
        const defaultRowBg = rowIndex % 2 === 1 ? c.surfaceAlt + '66' : c.card;
        const customRowBg = rowIndex % 2 === 1 ? (rowBgColorOdd || defaultRowBg) : (rowBgColorEven || defaultRowBg);
        
        return (
          <RowWrap
            key={key}
            onLayout={e => {
              const h = e.nativeEvent.layout.height;
              setRowHeights(prev => {
                const k = String(rowIndex);
                const prevH = prev[k] || 0;
                if (h > prevH + 2) {
                  return { ...prev, [k]: h };
                }
                return prev;
              });
            }}
            style={[
              styles.bodyRow,
              compact && styles.bodyRowCompact,
              {
                backgroundColor: customRowBg,
                borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
                borderBottomColor: borderColor || c.hairline,
                paddingHorizontal: 0,
                height: rowHeights[String(rowIndex)] || undefined,
              },
            ]}
            {...(rowProps as any)}
          >
            <View style={[styles.bodyCell, compact && styles.bodyCellCompact, leftColStyle(firstCol)]}>
              {renderCell(row, firstCol, rowIndex)}
            </View>
          </RowWrap>
        );
      })}
    </View>
  ) : null;

  const rightTableBody = (
    <View style={{ minWidth: '100%' }}>
      {/* Header row for remaining columns */}
      {headerBgGradient ? (
        <LinearGradient
          onLayout={e => {
            const h = e.nativeEvent.layout.height;
            setRowHeights(prev => {
              const prevH = prev.header || 0;
              if (h > prevH + 2) {
                return { ...prev, header: h };
              }
              return prev;
            });
          }}
          colors={headerBgGradient as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.headRow,
            compact && styles.headRowCompact,
            {
              borderBottomColor: borderColor || c.border,
              paddingLeft: 0,
              height: rowHeights.header || undefined,
            },
          ]}
        >
          {otherCols.map(col => (
            <View
              key={col.key}
              style={[styles.headCell, compact && styles.headCellCompact, colStyle(col)]}
            >
              <Text
                style={[
                  styles.headText,
                  compact && styles.headTextCompact,
                  { color: headerTextColor || c.mutedForeground, textAlign: cellAlign(col.align) },
                ]}
                numberOfLines={1}
              >
                {col.label}
              </Text>
            </View>
          ))}
          {showRowChevron ? <View style={styles.chevronCol} /> : null}
        </LinearGradient>
      ) : (
        <View
          onLayout={e => {
            const h = e.nativeEvent.layout.height;
            setRowHeights(prev => {
              const prevH = prev.header || 0;
              if (h > prevH + 2) {
                return { ...prev, header: h };
              }
              return prev;
            });
          }}
          style={[
            styles.headRow,
            compact && styles.headRowCompact,
            {
              backgroundColor: headerBgColor || c.surfaceAlt,
              borderBottomColor: borderColor || c.border,
              paddingLeft: 0,
              height: rowHeights.header || undefined,
            },
          ]}
        >
          {otherCols.map(col => (
            <View
              key={col.key}
              style={[styles.headCell, compact && styles.headCellCompact, colStyle(col)]}
            >
              <Text
                style={[
                  styles.headText,
                  compact && styles.headTextCompact,
                  { color: headerTextColor || c.mutedForeground, textAlign: cellAlign(col.align) },
                ]}
                numberOfLines={1}
              >
                {col.label}
              </Text>
            </View>
          ))}
          {showRowChevron ? <View style={styles.chevronCol} /> : null}
        </View>
      )}

      {/* Body rows for remaining columns */}
      {data.map((row, rowIndex) => {
        const key = keyExtractor(row, rowIndex);
        const isLast = rowIndex === data.length - 1;
        const RowWrap = onRowPress ? TouchableOpacity : View;
        const rowProps = onRowPress ? { onPress: () => onRowPress(row, rowIndex), activeOpacity: 0.72 } : {};
        const defaultRowBg = rowIndex % 2 === 1 ? c.surfaceAlt + '66' : c.card;
        const customRowBg = rowIndex % 2 === 1 ? (rowBgColorOdd || defaultRowBg) : (rowBgColorEven || defaultRowBg);

        return (
          <RowWrap
            key={key}
            onLayout={e => {
              const h = e.nativeEvent.layout.height;
              setRowHeights(prev => {
                const k = String(rowIndex);
                const prevH = prev[k] || 0;
                if (h > prevH + 2) {
                  return { ...prev, [k]: h };
                }
                return prev;
              });
            }}
            style={[
              styles.bodyRow,
              compact && styles.bodyRowCompact,
              {
                backgroundColor: customRowBg,
                borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
                borderBottomColor: borderColor || c.hairline,
                paddingLeft: 0,
                height: rowHeights[String(rowIndex)] || undefined,
              },
            ]}
            {...(rowProps as any)}
          >
            {otherCols.map(col => (
              <View
                key={col.key}
                style={[styles.bodyCell, compact && styles.bodyCellCompact, colStyle(col)]}
              >
                {renderCell(row, col, rowIndex)}
              </View>
            ))}
            {showRowChevron ? (
              <View style={styles.chevronCol}>
                <View style={[styles.chevronWrap, { backgroundColor: c.surfaceAlt }]}>
                  <Feather name="chevron-right" size={13} color={c.mutedForeground} />
                </View>
              </View>
            ) : null}
          </RowWrap>
        );
      })}
    </View>
  );

  const stickyTable = (
    <View style={{ flexDirection: 'row' }}>
      {leftTable}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {rightTableBody}
      </ScrollView>
    </View>
  );

  return (
    <View style={[styles.wrap, { backgroundColor: backgroundColor || c.card, borderColor: outerBorderColor || c.border }]}>
      {title ? (
        titleBgGradient ? (
          <LinearGradient
            colors={titleBgGradient as [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.headerBlock,
              compact && styles.headerBlockCompact,
              { borderBottomColor: borderColor || c.hairline },
            ]}
          >
            <Text style={[styles.title, compact && styles.titleCompact, { color: titleColor || c.foreground }]}>
              {title}
            </Text>
            {subtitle ? (
              <Text
                style={[
                  styles.subtitle,
                  compact && styles.subtitleCompact,
                  { color: titleColor ? titleColor + 'cc' : c.mutedForeground },
                ]}
              >
                {subtitle}
              </Text>
            ) : null}
          </LinearGradient>
        ) : (
          <View
            style={[
              styles.headerBlock,
              compact && styles.headerBlockCompact,
              { borderBottomColor: borderColor || c.hairline },
            ]}
          >
            <Text style={[styles.title, compact && styles.titleCompact, { color: titleColor || c.foreground }]}>
              {title}
            </Text>
            {subtitle ? (
              <Text
                style={[
                  styles.subtitle,
                  compact && styles.subtitleCompact,
                  { color: c.mutedForeground },
                ]}
              >
                {subtitle}
              </Text>
            ) : null}
          </View>
        )
      ) : null}

      {loading ? (
        <View style={styles.loadingBox}>
          <LoadingRing size="md" color={c.primary} dual />
          <Text style={[styles.loadingText, { color: textColor || c.mutedForeground }]}>Loading data…</Text>
        </View>
      ) : data.length === 0 ? (
        <View style={styles.emptyBox}>
          <View style={[styles.emptyIcon, { backgroundColor: c.surfaceAlt }]}>
            <Feather name="inbox" size={20} color={textColor || c.mutedForeground} />
          </View>
          <Text style={[styles.emptyText, { color: textColor || c.mutedForeground }]}>{emptyMessage}</Text>
        </View>
      ) : fitWidth ? (
        tableBody
      ) : stickyFirstColumn ? (
        stickyTable
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tableBody}
        </ScrollView>
      )}
    </View>
  );
}

/** Two-column key / value summary table. */
export interface KeyValueTableProps extends Omit<DataTableProps<any>, 'columns' | 'data' | 'keyExtractor' | 'emptyMessage'> {
  rows: { label: string; value: string }[];
}

export function KeyValueTable({
  title,
  subtitle,
  rows,
  loading,
  compact,
  titleColor,
  headerBgColor,
  headerTextColor,
  rowBgColorEven,
  rowBgColorOdd,
  borderColor,
  outerBorderColor,
  titleBgGradient,
  headerBgGradient,
  backgroundColor,
}: KeyValueTableProps) {
  return (
    <DataTable
      title={title}
      subtitle={subtitle}
      columns={[
        { key: 'label', label: 'Metric', flex: 1.2, render: r => r.label },
        { key: 'value', label: 'Value', flex: 1, align: 'right', render: r => r.value },
      ]}
      data={rows}
      keyExtractor={(r, i) => `${r.label}-${i}`}
      emptyMessage="No summary data"
      loading={loading}
      compact={compact}
      fitWidth
      titleColor={titleColor}
      headerBgColor={headerBgColor}
      headerTextColor={headerTextColor}
      rowBgColorEven={rowBgColorEven}
      rowBgColorOdd={rowBgColorOdd}
      borderColor={borderColor}
      outerBorderColor={outerBorderColor}
      titleBgGradient={titleBgGradient}
      headerBgGradient={headerBgGradient}
      backgroundColor={backgroundColor}
    />
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  fitTable: {
    width: '100%',
  },
  headerBlock: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    gap: 3,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerBlockCompact: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 6,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.1,
  },
  titleCompact: {
    fontSize: 13,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    lineHeight: 17,
  },
  subtitleCompact: {
    fontSize: 11,
    lineHeight: 15,
  },
  loadingBox: {
    paddingVertical: 36,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  emptyBox: {
    paddingVertical: 32,
    alignItems: 'center',
    gap: 10,
  },
  emptyIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  headRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  headRowCompact: {
    paddingVertical: 7,
    paddingHorizontal: 4,
  },
  headCell: {
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  headCellCompact: {
    paddingHorizontal: 7,
  },
  headText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headTextCompact: {
    fontSize: 9,
    letterSpacing: 0.3,
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 6,
    minHeight: 46,
  },
  bodyRowCompact: {
    paddingVertical: 7,
    paddingHorizontal: 4,
    minHeight: 36,
  },
  bodyCell: {
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  bodyCellCompact: {
    paddingHorizontal: 7,
  },
  cellText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    lineHeight: 16,
  },
  chevronCol: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronWrap: {
    width: 24,
    height: 24,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
