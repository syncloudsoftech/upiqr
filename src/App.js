import { extendTheme, ChakraProvider } from '@chakra-ui/react';
import Generator from './components/Generator';

const theme = extendTheme({
    colors: {
        brand: {
            100: "#f7fafc",
            // ...
            900: "#1a202c",
        },
    },
})

function App() {
    return (
        <ChakraProvider theme={theme}>
            <Generator />
        </ChakraProvider>
    );
}

export default App;
