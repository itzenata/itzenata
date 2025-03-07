'use client';

import { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

interface DateFilterProps {
  dateFilter: 'mois' | 'trimestre' | 'année' | 'personnalisé';
  setDateFilter: (
    value: 'mois' | 'trimestre' | 'année' | 'personnalisé'
  ) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  selectedQuarter: number;
  setSelectedQuarter: (quarter: number) => void;
  customStartDate: string | null;
  setCustomStartDate: (date: string | null) => void;
  customEndDate: string | null;
  setCustomEndDate: (date: string | null) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({
  dateFilter,
  setDateFilter,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  selectedQuarter,
  setSelectedQuarter,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate
}) => {
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  return (
    <div className="flex items-center gap-4">
      {/* Date Range Filter */}
      <select
        className="border rounded-lg px-4 py-2"
        value={dateFilter}
        onChange={(e) =>
          setDateFilter(
            e.target.value as 'mois' | 'trimestre' | 'année' | 'personnalisé'
          )
        }
      >
        <option value="mois">Mois</option>
        <option value="trimestre">Trimestre</option>
        <option value="année">Année</option>
        <option value="personnalisé">Personnalisé</option>
      </select>

      {/* Month Selection */}
      {dateFilter === 'mois' && (
        <select
          className="border rounded-lg px-4 py-2"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => i).map((month) => (
            <option key={month} value={month}>
              {new Date(0, month).toLocaleString('fr', { month: 'long' })}
            </option>
          ))}
        </select>
      )}

      {/* Quarter Selection */}
      {dateFilter === 'trimestre' && (
        <select
          className="border rounded-lg px-4 py-2"
          value={selectedQuarter}
          onChange={(e) => setSelectedQuarter(Number(e.target.value))}
        >
          {[1, 2, 3, 4].map((quarter) => (
            <option key={quarter} value={quarter - 1}>
              Trimestre {quarter}
            </option>
          ))}
        </select>
      )}

      {/* Custom Date Range Selection */}
      {dateFilter === 'personnalisé' && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            className="border rounded-lg px-2 py-1"
            value={customStartDate || ''}
            onChange={(e) => setCustomStartDate(e.target.value)}
          />
          <span>à</span>
          <input
            type="date"
            className="border rounded-lg px-2 py-1"
            value={customEndDate || ''}
            onChange={(e) => setCustomEndDate(e.target.value)}
          />
        </div>
      )}

      {/* Year Selection */}
      <div className="relative">
        <button
          className="btn-secondary flex items-center gap-2 px-4 py-2"
          onClick={() => setShowYearDropdown(!showYearDropdown)}
        >
          <Calendar className="w-4 h-4" /> {selectedYear}
          <ChevronDown className="w-4 h-4" />
        </button>
        {showYearDropdown && (
          <div className="absolute left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
            {[2022, 2023, 2024, 2025].map((year) => (
              <button
                key={year}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setSelectedYear(year);
                  setShowYearDropdown(false);
                }}
              >
                {year}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DateFilter;
