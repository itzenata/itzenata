import React, { useEffect, useState } from 'react';
import {
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  ComposedChart,
  AreaChart,
  Line,
  Bar,
  Pie,
  Scatter,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { fetchFinancialData } from 'services/AccountService'; // Replace with your real service

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const FinancialDashboard: React.FC = () => {
  const [financialData, setFinancialData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const data = await fetchFinancialData(); // Fetch all financial data
        setFinancialData(data);
      } catch (err) {
        setError('Failed to fetch financial data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-xl font-bold">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-xl font-bold text-red-600">{error}</h1>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Tableau de Bord Financier Complet
      </h1>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Revenus et Profits Mensuels
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={financialData.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Revenue" stroke="#8884d8" />
              <Line type="monotone" dataKey="Costs" stroke="#82ca9d" />
              <Line type="monotone" dataKey="Profit" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Types de Transactions par Journal
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={financialData.journalTransactionTypes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Comptant" stackId="a" fill="#8884d8" />
              <Bar dataKey="Crédit" stackId="a" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Rentabilité par Journal
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={financialData.profitabilityByJournal}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {financialData.profitabilityByJournal.map((index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Flux de Trésorerie Hebdomadaire
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={financialData.cashFlow}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="Entrees"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="Sorties"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Complexité des Transactions
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name="Volume" />
              <YAxis type="number" dataKey="y" name="Valeur" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter
                name="Transactions"
                data={financialData.transactionScatter}
                fill="#8884d8"
              >
                {financialData.transactionScatter.map((index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Comparaison de Croissance
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={financialData.periodicGrowth}>
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Croissance" barSize={20} fill="#8884d8" />
              <Line type="monotone" dataKey="Objectif" stroke="#ff7300" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;
