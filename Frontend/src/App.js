import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';

import HomePage from './pages/public/HomePage';
import PostDetailPage from './pages/public/PostDetailPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

import AuthorDashboard from './pages/author/AuthorDashboard';
import CreatePost from './pages/author/CreatePost';
import EditPost from './pages/author/EditPost';
import MyPosts from './pages/author/MyPosts';

import AdminDashboard from './pages/admin/AdminDashboard';
import PendingPosts from './pages/admin/PendingPosts';
import ManageCategories from './pages/admin/ManageCategories';
import ManageComments from './pages/admin/ManageComments';
import ManageUsers from './pages/admin/ManageUsers';

import './App.css';

function Layout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/post/:id" element={<PostDetailPage />} />
            <Route path="/blogs" element={<HomePage />} />
            <Route path="/categories" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              path="/author"
              element={
                <RoleRoute allowedRoles={['author', 'admin']}>
                  <AuthorDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/author/posts"
              element={
                <RoleRoute allowedRoles={['author', 'admin']}>
                  <MyPosts />
                </RoleRoute>
              }
            />
            <Route
              path="/author/post/create"
              element={
                <RoleRoute allowedRoles={['author', 'admin']}>
                  <CreatePost />
                </RoleRoute>
              }
            />
            <Route
              path="/author/post/:id/edit"
              element={
                <RoleRoute allowedRoles={['author', 'admin']}>
                  <EditPost />
                </RoleRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <RoleRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/admin/pending"
              element={
                <RoleRoute allowedRoles={['admin']}>
                  <PendingPosts />
                </RoleRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <RoleRoute allowedRoles={['admin']}>
                  <ManageCategories />
                </RoleRoute>
              }
            />
            <Route
              path="/admin/comments"
              element={
                <RoleRoute allowedRoles={['admin']}>
                  <ManageComments />
                </RoleRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <RoleRoute allowedRoles={['admin']}>
                  <ManageUsers />
                </RoleRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
