import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { MobileCartBar } from './MobileCartBar';
import { CartDrawer } from '../cart/CartDrawer';
import { AuthModal } from '../auth/AuthModal';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface-warm text-obsidian pb-16 md:pb-0 overflow-x-hidden">
      <Header />
      <main className="flex-1 min-w-0 w-full">
        <Outlet />
      </main>
      <Footer />
      <MobileCartBar />
      <MobileNav />
      <CartDrawer />
      <AuthModal />
    </div>
  );
};
