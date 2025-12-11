import type { ReactNode } from 'react';
import { Header } from './Header';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <main className="container">
        {children}
      </main>
    </>
  );
}
