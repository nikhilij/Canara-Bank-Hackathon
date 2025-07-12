import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const AuthLayout = () => {
  const { t, i18n } = useTranslation();
  const [languageMenuOpen, setLanguageMenuOpen] = React.useState(false);
  
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
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img className="h-12 w-auto logo" src="/logo.svg" alt="TrustVault" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          TrustVault
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {t('privacyByDesignDataSharing')}
        </p>
      </div>
      
      {/* Language selector */}
      <div className="absolute top-4 right-4">
        <div className="relative">
          <button
            type="button"
            className="flex items-center rounded-full bg-white bg-opacity-80 p-2 text-gray-700 hover:bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
          >
            <LanguageIcon className="h-5 w-5" aria-hidden="true" />
            <span className="ml-2 text-sm">{languages.find(l => l.code === i18n.language)?.name || 'English'}</span>
          </button>
          
          {languageMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md mt-8">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-200">
          <Outlet />
        </div>
      </div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md mt-6">
        <div className="px-4 text-center text-sm text-gray-600">
          <p className="mt-2">
            <GlobeAltIcon className="h-4 w-4 inline mr-1" />
            {t('hackathonProject')}
          </p>
          <p className="mt-2">
            &copy; {new Date().getFullYear()} TrustVault - {t('allRightsReserved')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
