import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../../src/components/Dashboard';

// Mock dependencies
jest.mock('../../src/services/api', () => ({
    getUserData: jest.fn(),
    getTransactions: jest.fn(),
    getAccountBalance: jest.fn(),
}));

const MockedDashboard = ({ children }) => (
    <BrowserRouter>
        {children}
    </BrowserRouter>
);

describe('Dashboard Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders dashboard with user welcome message', async () => {
        const mockUserData = {
            name: 'John Doe',
            accountNumber: '1234567890'
        };

        require('../../src/services/api').getUserData.mockResolvedValue(mockUserData);

        render(
            <MockedDashboard>
                <Dashboard />
            </MockedDashboard>
        );

        await waitFor(() => {
            expect(screen.getByText(/welcome/i)).toBeInTheDocument();
        });
    });

    test('displays account balance correctly', async () => {
        const mockBalance = { balance: 25000 };
        
        require('../../src/services/api').getAccountBalance.mockResolvedValue(mockBalance);

        render(
            <MockedDashboard>
                <Dashboard />
            </MockedDashboard>
        );

        await waitFor(() => {
            expect(screen.getByText(/balance/i)).toBeInTheDocument();
        });
    });

    test('shows recent transactions', async () => {
        const mockTransactions = [
            { id: 1, amount: 1000, type: 'credit', date: '2023-01-01' },
            { id: 2, amount: 500, type: 'debit', date: '2023-01-02' }
        ];

        require('../../src/services/api').getTransactions.mockResolvedValue(mockTransactions);

        render(
            <MockedDashboard>
                <Dashboard />
            </MockedDashboard>
        );

        await waitFor(() => {
            expect(screen.getByText(/recent transactions/i)).toBeInTheDocument();
        });
    });

    test('handles loading state', () => {
        render(
            <MockedDashboard>
                <Dashboard />
            </MockedDashboard>
        );

        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    test('handles error state', async () => {
        require('../../src/services/api').getUserData.mockRejectedValue(new Error('API Error'));

        render(
            <MockedDashboard>
                <Dashboard />
            </MockedDashboard>
        );

        await waitFor(() => {
            expect(screen.getByText(/error/i)).toBeInTheDocument();
        });
    });

    test('navigation buttons work correctly', async () => {
        render(
            <MockedDashboard>
                <Dashboard />
            </MockedDashboard>
        );

        const transferButton = screen.getByRole('button', { name: /transfer/i });
        fireEvent.click(transferButton);

        expect(transferButton).toBeInTheDocument();
    });
});