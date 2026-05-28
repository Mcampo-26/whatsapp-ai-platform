// frontend/src/App.jsx
import React from 'react';
import { Navbar } from './components/layout/Navbar.jsx';
import { Sidebar } from './components/layout/Sidebar.jsx';
import { ChatDashboard } from './components/chat/ChatDashboard.jsx'; // <─── Única importación del módulo de chat

function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-100">
      {/* Barra de navegación superior */}
      <Navbar />
      
      <div className="flex flex-1">
        {/* Menú lateral izquierdo general */}
        <Sidebar />
        
        {/* Contenedor principal donde renderizamos el dashboard modular */}
        <main className="flex-1 p-6 bg-slate-100/50 dark:bg-slate-900/40 transition-colors duration-300 flex gap-6">
          <ChatDashboard />
        </main>
      </div>
    </div>
  );
}

export default App;