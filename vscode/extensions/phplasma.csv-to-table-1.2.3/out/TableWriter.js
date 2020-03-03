"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CsvColumn_1 = require("./CsvColumn");
const CsvRecord_1 = require("./CsvRecord");
/**
 * Class resposible for rendering a provided list of CsvRecord's into an ASCII table
 */
class TableWriter {
    /**
     * Return a formatted text table
     * @param records Records to be formatted
     */
    getFormattedTable(records, upperCaseHeader) {
        // Get column lengths
        const columnLengths = this.getColumnLengths(records);
        // Build separator record
        const separatorRecord = this.buildSeparatorRecord(columnLengths);
        const separatorRecordLine = this.getFormattedRecord(separatorRecord, columnLengths, false, false);
        // Build table
        let result = '';
        // Write records
        for (var i = 0; i < records.length; i++) {
            const record = records[i];
            // Skip empty records
            if (record.getColumns().length === 0) {
                continue;
            }
            // Build formatted record
            const upperCaseRecordValue = upperCaseHeader && i === 0;
            const formattedRecord = this.getFormattedRecord(record, columnLengths, true, upperCaseRecordValue);
            // Write Record Separator
            result += separatorRecordLine + "\r\n";
            // Write Record
            result += formattedRecord + "\r\n";
        }
        // Write final ending formatting record
        result += separatorRecordLine + "\r\n";
        // Return result
        return result;
    }
    /**
     * Returns a CsvRecord that is suitable as a row separator
     * @param columnLengths Column length map
     */
    buildSeparatorRecord(columnLengths) {
        const record = new CsvRecord_1.default();
        for (var i = 0; i < columnLengths.length; i++) {
            const colLength = columnLengths[i] + 2;
            const value = this.getRepeatedChar('-', colLength);
            record.addColumn(new CsvColumn_1.default(value));
        }
        return record;
    }
    /**
     * Repeat the provided character N times
     * @param char The character to repeat
     * @param repeat Number of occurrances
     */
    getRepeatedChar(char, repeat) {
        if (repeat <= 0) {
            return '';
        }
        return char.repeat(repeat);
    }
    /**
     * Return a string representation of the provided Record
     * @param record The record to be formatted
     * @param columnLengths Column length map
     * @param useValuePadding Whether we are using value padding
     */
    getFormattedRecord(record, columnLengths, useValuePadding, upperCaseValue) {
        const columns = record.getColumns();
        const ValuePadding = useValuePadding ? ' ' : '';
        const ColumnSeparator = '|';
        let result = '';
        // Iterate columns
        for (var i = 0; i < columns.length; i++) {
            // Get column
            const column = columns[i];
            let value = column.getValue();
            const maxLen = columnLengths[i] + ValuePadding.length + ColumnSeparator.length;
            // Upper-case transform this value?
            if (upperCaseValue) {
                value = value.toUpperCase();
            }
            // Calculate left and right padding
            const rightPaddingLength = maxLen - (ValuePadding.length * 2) - value.length;
            // Start with column separator?
            if (i === 0) {
                result += ColumnSeparator;
            }
            // Write left padding
            result += ValuePadding;
            // Write value
            result += value;
            // Write right padding
            result += this.getRepeatedChar(' ', rightPaddingLength);
            // End with separator
            result += ValuePadding;
            // End with column separator
            result += ColumnSeparator;
        }
        return result;
    }
    /**
     * Calculate the maximum column lengths based on the provided Record set
     * @param records Record data to analyze
     */
    getColumnLengths(records) {
        // Calculate column lengths
        let columnLengths = [];
        for (var i = 0; i < records.length; i++) {
            const record = records[i];
            const columns = record.getColumns();
            for (var colIndex = 0; colIndex < columns.length; colIndex++) {
                const len = columns[colIndex].getValue().length;
                if (columnLengths[colIndex] === undefined || len > columnLengths[colIndex]) {
                    columnLengths[colIndex] = len;
                }
            }
        }
        return columnLengths;
    }
}
exports.default = TableWriter;
//# sourceMappingURL=TableWriter.js.map