import React from 'react';
import AdminNavbar from './AdminNavbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Content from './Content';


export default function AdminLayout({ children }) {
  return (
    <>
      <AdminNavbar />
      <Sidebar />
      <div className="wrapper">
        <Content>
          {children}
        </Content>
      </div>
      <Footer />
    </>
  );
}
