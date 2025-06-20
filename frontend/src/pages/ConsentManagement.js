import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import consentService from '../services/consentService';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  ExclamationCircleIcon,
  EyeIcon,
  ShieldCheckIcon 
} from '@heroicons/react/24/outline';
import ConsentDetailsModal from '../components/ConsentDetailsModal';
import NewConsentModal from '../components/NewConsentModal';
import RevokeConsentModal from '../components/RevokeConsentModal';

const ConsentManagement = () => {
  const { t } = useTranslation();
  const [consents, setConsents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedConsent, setSelectedConsent] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isNewConsentModalOpen, setIsNewConsentModalOpen] = useState(false);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  
  useEffect(() => {
    fetchConsents();
  }, []);
  
  const fetchConsents = async () => {
    try {
      setLoading(true);
      const data = await consentService.getUserConsents();
      setConsents(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load consents');
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewDetails = (consent) => {
    setSelectedConsent(consent);
    setIsDetailsModalOpen(true);
  };
  
  const handleRevokeConsent = (consent) => {
    setSelectedConsent(consent);
    setIsRevokeModalOpen(true);
  };
  
  const handleConsentRevoked = async () => {
    await fetchConsents();
    setIsRevokeModalOpen(false);
  };
  
  const handleNewConsentCreated = async () => {
    await fetchConsents();
    setIsNewConsentModalOpen(false);
  };
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'GRANTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="mr-1 h-4 w-4" />
            {t('active')}
          </span>
        );
      case 'REVOKED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon className="mr-1 h-4 w-4" />
            {t('revoked')}
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <ClockIcon className="mr-1 h-4 w-4" />
            {t('expired')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ExclamationCircleIcon className="mr-1 h-4 w-4" />
            {t('unknown')}
          </span>
        );
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{t('consentManagement')}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {t('consentManagementDescription')}
          </p>
        </div>
        <button
          onClick={() => setIsNewConsentModalOpen(true)}
          className="btn-primary"
        >
          <ShieldCheckIcon className="mr-2 h-5 w-5 inline" />
          {t('grantNewConsent')}
        </button>
      </div>
      
      {/* Consent cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {consents.length === 0 ? (
          <div className="sm:col-span-3 py-12 flex flex-col items-center text-center">
            <ShieldCheckIcon className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">{t('noConsentsYet')}</h3>
            <p className="mt-1 text-sm text-gray-500">
              {t('noConsentsDescription')}
            </p>
            <button
              onClick={() => setIsNewConsentModalOpen(true)}
              className="mt-4 btn-primary"
            >
              {t('grantConsent')}
            </button>
          </div>
        ) : (
          consents.map((consent) => (
            <div key={consent.consentId} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {consent.dataRecipient}
                  </h3>
                  {getStatusBadge(consent.status)}
                </div>
                
                <div className="mt-3 text-sm text-gray-500">
                  <p><span className="font-medium">{t('dataCategory')}:</span> {consent.dataCategory}</p>
                  <p><span className="font-medium">{t('purpose')}:</span> {consent.purpose}</p>
                  <p><span className="font-medium">{t('expiryDate')}:</span> {new Date(consent.expiryDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200">
                <div className="flex justify-between">
                  <button
                    onClick={() => handleViewDetails(consent)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center"
                  >
                    <EyeIcon className="mr-1 h-4 w-4" />
                    {t('viewDetails')}
                  </button>
                  
                  {consent.status === 'GRANTED' && (
                    <button
                      onClick={() => handleRevokeConsent(consent)}
                      className="text-sm font-medium text-red-600 hover:text-red-500"
                    >
                      {t('revokeConsent')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Modals */}
      {selectedConsent && (
        <>
          <ConsentDetailsModal 
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            consent={selectedConsent}
          />
          
          <RevokeConsentModal
            isOpen={isRevokeModalOpen}
            onClose={() => setIsRevokeModalOpen(false)}
            onRevoke={handleConsentRevoked}
            consent={selectedConsent}
          />
        </>
      )}
      
      <NewConsentModal 
        isOpen={isNewConsentModalOpen}
        onClose={() => setIsNewConsentModalOpen(false)}
        onCreated={handleNewConsentCreated}
      />
    </div>
  );
};

export default ConsentManagement;
