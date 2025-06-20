import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  HomeIcon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon,
  KeyIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  ChevronDownIcon,
  LanguageIcon
} from '@heroicons/react/24/outline';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  
  const navigation = [
    { name: t('dashboard'), href: '/dashboard', icon: HomeIcon },
    { name: t('consents'), href: '/dashboard/consents', icon: ShieldCheckIcon },
    { name: t('auditLogs'), href: '/dashboard/audit-logs', icon: ClipboardDocumentListIcon },
    { name: t('dataAccess'), href: '/dashboard/data-access', icon: KeyIcon },
    { name: t('profile'), href: '/dashboard/profile', icon: UserCircleIcon },
  ];
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'മലയാളം' }
  ];
  
  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setLanguageMenuOpen(false);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 flex md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div 
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-in-out duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setSidebarOpen(false)}
        ></div>
        
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition ease-in-out duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">{t('closeSidebar')}</span>
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          
          <div className="p-4 flex items-center">
            <img 
              src="/logo.svg" 
              alt="TrustVault Logo" 
              className="h-8 w-auto logo"
            />
            <span className="ml-3 text-xl font-bold text-blue-600">TrustVault</span>
          </div>
          
          <div className="mt-5 flex-1 h-0 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                  >
                    <item.icon
                      className={`mr-4 h-6 w-6 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-2 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
            >
              <ArrowLeftOnRectangleIcon className="mr-4 h-6 w-6 text-gray-400" aria-hidden="true" />
              {t('signOut')}
            </button>
          </div>
        </div>
        
        <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="px-4 py-6 flex items-center">
            <img 
              src="/logo.svg" 
              alt="TrustVault Logo" 
              className="h-8 w-auto logo"
            />
            <span className="ml-3 text-xl font-bold text-blue-600">TrustVault</span>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
            >
              <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
              {t('signOut')}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        {/* Top navigation bar */}
        <div className="sticky top-0 z-10 bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <span className="sr-only">{t('openSidebar')}</span>
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex-shrink-0 flex items-center md:hidden">
                  <img 
                    src="/logo.svg" 
                    alt="TrustVault Logo" 
                    className="h-8 w-auto logo"
                  />
                  <span className="ml-2 text-lg font-semibold text-blue-600">TrustVault</span>
                </div>
              </div>
              
              <div className="ml-4 flex items-center md:ml-6">
                {/* Language selector */}
                <div className="ml-3 relative">
                  <div>
                    <button
                      type="button"
                      className="flex max-w-xs items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                    >
                      <span className="sr-only">{t('changeLanguage')}</span>
                      <LanguageIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                    </button>
                  </div>
                  
                  {languageMenuOpen && (
                    <div 
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                      {languages.map((language) => (
                        <button
                          key={language.code}
                          onClick={() => changeLanguage(language.code)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {language.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Notification dropdown */}
                <div className="ml-3 relative">
                  <div>
                    <button
                      type="button"
                      className="flex max-w-xs items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => setNotificationOpen(!notificationOpen)}
                    >
                      <span className="sr-only">{t('viewNotifications')}</span>
                      <BellIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                    </button>
                  </div>
                  
                  {notificationOpen && (
                    <div 
                      className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                      <div className="px-4 py-2 border-b">
                        <h3 className="text-sm font-medium text-gray-700">{t('notifications')}</h3>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        <div className="px-4 py-2 border-b text-sm text-gray-700">
                          <p className="font-medium">{t('dataAccessed')}</p>
                          <p className="text-gray-500">{t('dataAccessedDetails')}</p>
                          <p className="text-xs text-gray-400 mt-1">2 {t('hoursAgo')}</p>
                        </div>
                        <div className="px-4 py-2 border-b text-sm text-gray-700">
                          <p className="font-medium">{t('consentExpiring')}</p>
                          <p className="text-gray-500">{t('consentExpiringDetails')}</p>
                          <p className="text-xs text-gray-400 mt-1">{t('yesterday')}</p>
                        </div>
                      </div>
                      <div className="px-4 py-2">
                        <button className="text-sm text-blue-600 hover:text-blue-800">
                          {t('viewAllNotifications')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Profile dropdown */}
                <div className="ml-3 relative">
                  <div>
                    <button
                      type="button"
                      className="flex max-w-xs items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                    >
                      <span className="sr-only">{t('openUserMenu')}</span>
                      <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                        {user?.name?.[0] || user?.email?.[0] || 'U'}
                      </div>
                      <span className="ml-2 hidden md:block">{user?.name || user?.email}</span>
                      <ChevronDownIcon className="ml-1 h-4 w-4 text-gray-400 hidden md:block" aria-hidden="true" />
                    </button>
                  </div>
                  
                  {userMenuOpen && (
                    <div 
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                      <Link
                        to="/dashboard/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        {t('yourProfile')}
                      </Link>
                      <Link
                        to="/dashboard/consents"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        {t('yourConsents')}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {t('signOut')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
