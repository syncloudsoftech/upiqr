import { extendTheme, ChakraProvider } from '@chakra-ui/react';
import Generator from './components/Generator';

const colors = {
    primary: {
        "50": "#FFF1E5",
        "100": "#FFD7B8",
        "200": "#FFBD8A",
        "300": "#FFA35C",
        "400": "#FF892E",
        "500": "#FF6F00",
        "600": "#CC5900",
        "700": "#994300",
        "800": "#662C00",
        "900": "#331600"
    },
    secondary: {
        "50": "#E5FFEF",
        "100": "#B8FFD3",
        "200": "#8AFFB7",
        "300": "#5CFF9B",
        "400": "#2EFF7F",
        "500": "#00FF63",
        "600": "#00CC50",
        "700": "#00993C",
        "800": "#006628",
        "900": "#003314",
    },
}

function App() {
    return (
        <ChakraProvider theme={extendTheme({ colors })}>
            <Generator />
        </ChakraProvider>
    );
}

export default App;
