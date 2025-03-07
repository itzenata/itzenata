'use client';

import { useEffect, useState } from 'react';
import { fetchTiers, modifyTier, removeTier } from 'services/TiersService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

export default function AccountTiers() {
  const [tiers, setTiers] = useState<any[]>([]);

  useEffect(() => {
    fetchTiers().then(setTiers);
  }, []);

  const handleDelete = async (id: number) => {
    await removeTier(id);
    setTiers((prev) => prev.filter((tier) => tier.id !== id));
  };

  return (
    <Card className="w-full shadow-md rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Liste des Tiers</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Libellé</TableHead>
              <TableHead>Classe</TableHead>
              <TableHead>Compte Collectif</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tiers.length > 0 ? (
              tiers.map((tier) => (
                <TableRow key={tier.id}>
                  <TableCell>{tier.id}</TableCell>
                  <TableCell>{tier.code}</TableCell>
                  <TableCell>{tier.libelle}</TableCell>
                  <TableCell>{tier.class}</TableCell>
                  <TableCell>{tier.compteCollectif || 'N/A'}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleDelete(tier.id)}
                      variant="destructive"
                    >
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-gray-500 py-4"
                >
                  Aucun tiers trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
