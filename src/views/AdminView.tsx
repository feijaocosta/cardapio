import { Routes, Route } from 'react-router-dom';
import { AdminView as AdminViewComponent } from '../../components/admin-view';
import { SettingsView } from '../../components/settings-view';
import { useState } from 'react';

export default function AdminView() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSettingsChange = () => {
    // Recarregar para respeitar novas configurações
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <main className="container mx-auto p-4">
      <Routes>
        <Route path="/" element={<AdminViewComponent refreshTrigger={refreshTrigger} />} />
        <Route path="/settings" element={<SettingsView onSettingsChange={handleSettingsChange} />} />
      </Routes>
    </main>
  );
}
