import React from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { Dashboard } from './components/Dashboard';

const theme = extendTheme({});

export const App: React.FC = () => {
    return (
        <ChakraProvider theme={theme}>
            <Dashboard />
        </ChakraProvider>
    );
}; 