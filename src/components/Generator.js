import axios from 'axios';
import {
    Box,
    Button,
    Container,
    Flex,
    FormControl,
    FormLabel,
    FormHelperText,
    Image,
    Input,
    InputGroup,
    InputLeftElement,
    Link,
    SimpleGrid,
    Text,
} from '@chakra-ui/react';
import { saveAs } from 'file-saver';
import { createRef, useState } from 'react';
import bhimLogo from '../images/bhim.svg';
import logo from '../images/logo.png';
import upiLogo from '../images/upi.svg';

function Generator() {
    const [isBusy, setBusy] = useState(false);
    const [merchant, setMerchant] = useState('');
    const [vpa, setVpa] = useState('');
    const [amount, setAmount] = useState('');
    const [notes, setNotes] = useState('');

    const paymentUrlParams = [
        'cu=INR',
        `pa=${vpa || 'example@upi'}`,
    ];
    if (amount) paymentUrlParams.push(`am=${amount}`);
    if (notes) paymentUrlParams.push(`tn=${notes}`);
    const paymentUrl = 'upi://pay?' + paymentUrlParams.join('&');

    const qrCodeUrlParams = [
        'format=png',
        'margin=50',
        'size=1000x1000',
        'data=' + encodeURIComponent(paymentUrl),
    ];
    const qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?' + qrCodeUrlParams.join('&');

    const ref = createRef();

    const submitForm = async (e) => {
        e.preventDefault();
        setBusy(true);
        const image = await axios.get(qrCodeUrl, { responseType: 'blob' })
            .then(({ data }) => data);
        setBusy(false);
        saveAs(image, 'upiqr.png');
    };

    return (
        <Container maxWidth="960px">
            <Box my={10}>
                <Flex
                    flexDirection="column"
                    gap={10}
                >
                    <Flex
                        alignItems="center"
                        gap={5}
                    >
                        <Image
                            alt="UPIQR.me"
                            src={logo}
                            sx={{ maxWidth: '4em' }}
                        />
                        <Flex flexDirection="column">
                            <Text fontSize="1.5em" fontWeight="bold">UPIQR.me</Text>
                            <Text>Create and download QR codes for UPI payments online.</Text>
                        </Flex>
                    </Flex>
                    <SimpleGrid
                        columns={{ lg: 2  }}
                        spacing={10}
                    >
                        <Flex
                            as="form"
                            flexDirection="column"
                            gap={5}
                            onSubmit={submitForm}
                        >
                            <FormControl>
                                <FormLabel>Merchant name</FormLabel>
                                <Input
                                    defaultValue={merchant}
                                    onChange={(e) => setMerchant(e.target.value)}
                                    type="text"
                                />
                                <FormHelperText>Enter your business name e.g., Syncloud Softech Inc.</FormHelperText>
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>UPI ID or VPA</FormLabel>
                                <Input
                                    defaultValue={vpa}
                                    onChange={(e) => setVpa(e.target.value)}
                                    required
                                    type="text"
                                />
                                <FormHelperText>Enter your virtual payment address e.g., handle@upi etc.</FormHelperText>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Preset amount</FormLabel>
                                <InputGroup>
                                    <InputLeftElement
                                        pointerEvents='none'
                                        color='gray.300'
                                        fontSize='1.25em'
                                        children='₹'
                                    />
                                    <Input
                                        defaultValue={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </InputGroup>
                                <FormHelperText>Enter any amount you want to collect with this QR code.</FormHelperText>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Notes</FormLabel>
                                <Input
                                    defaultValue={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                                <FormHelperText>Enter any reference notes for payments with this QR code.</FormHelperText>
                            </FormControl>
                            <SimpleGrid
                                columns={{ md: 2  }}
                                spacing={5}
                            >
                                <Button
                                    colorScheme="blue"
                                    isDisabled={isBusy}
                                    isLoading={isBusy}
                                    loadingText="Downloading..."
                                    type="submit"
                                >
                                    Download poster
                                </Button>
                                <Button
                                    colorScheme="gray"
                                    isDisabled={isBusy}
                                    isLoading={isBusy}
                                    loadingText="Downloading..."
                                    type="submit"
                                >
                                    Download QR Code
                                </Button>
                            </SimpleGrid>
                        </Flex>
                        <Box
                            borderRadius="lg"
                            borderWidth="1px"
                            ref={ref}
                            shadow="md"
                            p={10}
                        >
                            <Flex
                                alignItems="center"
                                flexDirection="column"
                                gap={5}
                            >
                                <Text
                                    color="gray"
                                    fontSize="1.5em"
                                    fontWeight="bold"
                                    textAlign="center"
                                    textTransform="uppercase"
                                >
                                    {merchant || 'Business name'}
                                </Text>
                                <Image
                                    src={qrCodeUrl}
                                    sx={{ maxHeight: '15em' }}
                                />
                                <Link
                                    color="text"
                                    fontSize="1.25em"
                                    href={paymentUrl}
                                    sx={{ textDecoration: 'none' }}
                                >
                                    {vpa || 'example@upi'}
                                </Link>
                                <Text
                                    color="gray"
                                    fontSize="1.25em"
                                    fontWeight="bold"
                                >
                                    Scan to pay with any UPI app
                                </Text>
                                <Flex
                                    alignItems="center"
                                    sx={{ gap: 3 }}
                                >
                                    <Image
                                        src={bhimLogo}
                                        sx={{ height: '2em' }}
                                    />
                                    <Image
                                        src={upiLogo}
                                        sx={{ height: '2em' }}
                                    />
                                </Flex>
                            </Flex>
                        </Box>
                    </SimpleGrid>
                </Flex>
            </Box>
        </Container>
    );
}

export default Generator;
