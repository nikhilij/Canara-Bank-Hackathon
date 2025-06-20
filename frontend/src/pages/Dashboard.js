import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import consentService from '../services/consentService';
import { useAuth } from '../contexts/AuthContext';
import { 
  ShieldCheckIcon, 
  ClipboardDocumentListIcon,
  KeyIcon,
  ChartBarIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeConsents: 0,
    revokedConsents: 0,
    expiredConsents: 0,
    totalDataAccesses: 0,
    lastAccessTime: null
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch consents for the user
        const consentsData = await consentService.getUserConsents();
        
        // Count active, revoked, and expired consents
        const activeConsents = consentsData.filter(c => c.status === 'GRANTED').length;
        const revokedConsents = consentsData.filter(c => c.status === 'REVOKED').length;
        const expiredConsents = consentsData.filter(c => c.status === 'EXPIRED').length;
        
        // You would typically get these from an API call in a real app
        const totalDataAccesses = 24;
        const lastAccessTime = new Date();
        lastAccessTime.setHours(lastAccessTime.getHours() - 2);
        
        setStats({
          activeConsents,
          revokedConsents,
          expiredConsents,
          totalDataAccesses,
          lastAccessTime
        });
        
        // Sample recent activity - in a real app, this would come from an API
        setRecentActivity([
          {
            id: 1,
            type: 'data_access',
            description: t('dataAccessedByOrg', { org: 'FinTech Partners' }),
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
          },
          {
            id: 2,
            type: 'consent_expire',
            description: t('consentExpiringForOrg', { org: 'Analytics Inc.' }),
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
          },
          {
            id: 3,
            type: 'consent_granted',
            description: t('consentGrantedToOrg', { org: 'Investment Partners Ltd.' }),
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) // 3 days ago
          }
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [t]);
  
  const getActivityIcon = (type) => {
    switch(type) {
      case 'data_access':
        return <KeyIcon className="h-5 w-5 text-amber-500" />;
      case 'consent_expire':
        return <BellAlertIcon className="h-5 w-5 text-red-500" />;
      case 'consent_granted':
        return <ShieldCheckIcon className="h-5 w-5 text-green-500" />;
      default:
        return <ClipboardDocumentListIcon className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) {
      return Math.floor(interval) + ' ' + t('yearsAgo');
    }
    
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + ' ' + t('monthsAgo');
    }
    
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + ' ' + t('daysAgo');
    }
    
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + ' ' + t('hoursAgo');
    }
    
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + ' ' + t('minutesAgo');
    }
    
    return Math.floor(seconds) + ' ' + t('secondsAgo');
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{t('welcomeMessage', { name: user?.name || t('user') })}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {t('dashboardDescription')}
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="dashboard-card">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <ShieldCheckIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500 truncate">{t('activeConsents')}</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{stats.activeConsents}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/dashboard/consents"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              {t('viewAll')}
            </Link>
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-amber-100 rounded-md p-3">
              <KeyIcon className="h-6 w-6 text-amber-600" aria-hidden="true" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500 truncate">{t('dataAccesses')}</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalDataAccesses}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/dashboard/data-access"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              {t('viewDetails')}
            </Link>
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
              <ChartBarIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500 truncate">{t('consentHealth')}</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">
                {stats.activeConsents > 0 ? 
                  Math.round((stats.activeConsents / (stats.activeConsents + stats.revokedConsents + stats.expiredConsents)) * 100) + '%' : 
                  '0%'}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/dashboard/consents"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              {t('manageConsents')}
            </Link>
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
              <ClipboardDocumentListIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500 truncate">{t('expiredConsents')}</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{stats.expiredConsents}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/dashboard/consents"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              {t('reviewConsents')}
            </Link>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">{t('recentActivity')}</h2>
        <div className="mt-3 bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {recentActivity.map((activity) => (
              <li key={activity.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="text-sm text-gray-900">
                        {activity.description}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {formatTimeAgo(activity.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">{t('quickActions')}</h2>
        <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Link 
            to="/dashboard/consents" 
            className="dashboard-card hover:border-blue-500 border border-transparent flex items-center"
          >
            <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
            <span className="ml-3 font-medium text-gray-900">{t('manageConsents')}</span>
          </Link>
          
          <Link 
            to="/dashboard/audit-logs" 
            className="dashboard-card hover:border-blue-500 border border-transparent flex items-center"
          >
            <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
            <span className="ml-3 font-medium text-gray-900">{t('viewAuditLogs')}</span>
          </Link>
          
          <Link 
            to="/dashboard/profile" 
            className="dashboard-card hover:border-blue-500 border border-transparent flex items-center"
          >
            <KeyIcon className="h-6 w-6 text-blue-600" />
            <span className="ml-3 font-medium text-gray-900">{t('updateProfile')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
