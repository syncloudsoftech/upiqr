import axios from 'axios';
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    FormHelperText,
    Heading,
    Image,
    Input,
    InputGroup,
    InputLeftElement,
    Link,
    SimpleGrid,
    Text,
} from '@chakra-ui/react';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { createRef, useState } from 'react';
import amazonPayLogo from '../images/amazon-pay.png';
import bhimLogo from '../images/bhim.png';
import googlePayLogo from '../images/google-pay.png';
import logo from '../images/logo.png';
import paytmLogo from '../images/paytm.png';
import phonePeLogo from '../images/phonepe.png';
import upiLogo from '../images/upi.png';

const defaultMerchant = 'Your Company';
const defaultVpa = 'example@upi';

function Generator() {
    const [isBusy, setBusy] = useState(false);
    const [merchant, setMerchant] = useState('');
    const [vpa, setVpa] = useState('');
    const [amount, setAmount] = useState('');
    const [notes, setNotes] = useState('');
    const [mode, setMode] = useState('');

    const paymentUrlParams = [
        `pa=${vpa || defaultVpa}`,
        'cu=INR',
    ];
    if (merchant) paymentUrlParams.push(`pn=${merchant}`);
    if (amount) paymentUrlParams.push(`am=${amount}`);
    if (notes) paymentUrlParams.push(`tn=${notes}`);
    const paymentUrl = 'upi://pay?' + paymentUrlParams.join('&');

    const qrCodeUrlParams = [
        'format=png',
        'size=1000x1000',
        'data=' + encodeURIComponent(paymentUrl),
    ];
    const qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?' + qrCodeUrlParams.join('&');

    const ref = createRef();

    const downloadPoster = async () => {
        setBusy(true);
        const canvas = await html2canvas(ref.current, { useCORS: true });
        const image = await new Promise((resolve) => canvas.toBlob((blob) => resolve(blob)));
        setBusy(false);
        saveAs(image, vpa + '-poster.png');
    };

    const downloadQrCode = async () => {
        setBusy(true);
        const image = await axios.get(qrCodeUrl, { responseType: 'blob' })
            .then(({ data }) => data);
        setBusy(false);
        saveAs(image, vpa + '-qr.png');
    };

    const submitForm = async (e) => {
        e.preventDefault();
        if (mode === 'qr') {
            await downloadQrCode()
        } else if (mode === 'poster') {
            await downloadPoster();
        }
    };

    return (
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
                    <Text>Create and download QR codes for UPI payments.</Text>
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
                        <FormHelperText>Enter your business name e.g., {defaultMerchant} (P) Ltd.</FormHelperText>
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>UPI ID or VPA</FormLabel>
                        <Input
                            defaultValue={vpa}
                            onChange={(e) => setVpa(e.target.value)}
                            required
                            type="text"
                        />
                        <FormHelperText>Enter your virtual payment address e.g., {defaultVpa} etc.</FormHelperText>
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
                            colorScheme="secondary"
                            bg="secondary.700"
                            isDisabled={isBusy}
                            isLoading={isBusy}
                            loadingText="Downloading..."
                            onClick={() => setMode('poster')}
                            type="submit"
                        >
                            Download poster
                        </Button>
                        <Button
                            colorScheme="gray"
                            isDisabled={isBusy}
                            isLoading={isBusy}
                            loadingText="Downloading..."
                            onClick={() => setMode('qr')}
                            type="submit"
                        >
                            Download QR code
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
                        gap={10}
                    >
                        <Heading
                            color="gray"
                            fontSize="xl"
                            textAlign="center"
                            textTransform="uppercase"
                        >
                            {merchant || defaultMerchant}
                        </Heading>
                        <Flex
                            alignItems="center"
                            flexDirection="column"
                        >
                            <Image
                                src={qrCodeUrl}
                                sx={{ maxHeight: '15em' }}
                            />
                            <Text>
                                {vpa || defaultVpa}
                            </Text>
                        </Flex>
                        <Text
                            fontSize="lg"
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
                        <Flex
                            alignItems="center"
                            sx={{ gap: 3 }}
                        >
                            <Image
                                src={paytmLogo}
                                height={['1em', null, '1.5em']}
                            />
                            <Image
                                src={phonePeLogo}
                                height={['1em', null, '1.5em']}
                            />
                            <Image
                                src={googlePayLogo}
                                height={['1em', null, '1.5em']}
                            />
                            <Image
                                src={amazonPayLogo}
                                height={['1em', null, '1.5em']}
                            />
                        </Flex>
                        <Text fontSize="sm">
                            Generated from <Link href="https://upiqr.me/">https://upiqr.me/</Link>
                        </Text>
                    </Flex>
                </Box>
            </SimpleGrid>
        </Flex>
    );
}

export default Generator;
