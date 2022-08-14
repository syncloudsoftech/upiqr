import { Box, Container } from '@chakra-ui/react';
import Generator from '../components/Generator';

function HomePage() {
    return (
        <Container maxWidth="960px">
            <Box my={10}>
                <Generator />
            </Box>
        </Container>
    )
}

export default HomePage;
