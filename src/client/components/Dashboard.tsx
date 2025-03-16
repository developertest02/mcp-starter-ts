import React, { useState } from 'react';
import {
    Box,
    Container,
    Heading,
    VStack,
    Input,
    Button,
    Text,
    useToast,
    Card,
    CardHeader,
    CardBody,
    SimpleGrid,
} from '@chakra-ui/react';

interface ToolResponse {
    content: Array<{ type: string; text: string }>;
}

export const Dashboard: React.FC = () => {
    const [echoInput, setEchoInput] = useState('');
    const [addInputA, setAddInputA] = useState('');
    const [addInputB, setAddInputB] = useState('');
    const [bigdogsInput, setBigdogsInput] = useState('');
    const [results, setResults] = useState<Record<string, string>>({});
    const toast = useToast();

    const callMcpTool = async (tool: string, params: any) => {
        try {
            const response = await fetch(`/api/mcp/${tool}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });
            const data: ToolResponse = await response.json();
            return data.content[0]?.text || 'No response';
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to call MCP tool',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return 'Error occurred';
        }
    };

    const handleEcho = async () => {
        const result = await callMcpTool('echo', { random_string: echoInput });
        setResults(prev => ({ ...prev, echo: result }));
    };

    const handleAdd = async () => {
        const result = await callMcpTool('add', {
            a: Number(addInputA),
            b: Number(addInputB),
        });
        setResults(prev => ({ ...prev, add: result }));
    };

    const handleBigdogs = async () => {
        const result = await callMcpTool('getmy-bigdogs', { snarf: bigdogsInput });
        setResults(prev => ({ ...prev, bigdogs: result }));
    };

    return (
        <Container maxW="container.xl" py={8}>
            <Heading mb={8} textAlign="center">MCP Tools Dashboard</Heading>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {/* Echo Widget */}
                <Card>
                    <CardHeader>
                        <Heading size="md">Echo Tool</Heading>
                    </CardHeader>
                    <CardBody>
                        <VStack spacing={4}>
                            <Input
                                placeholder="Enter text to echo"
                                value={echoInput}
                                onChange={(e) => setEchoInput(e.target.value)}
                            />
                            <Button colorScheme="blue" onClick={handleEcho}>
                                Echo
                            </Button>
                            {results.echo && (
                                <Text>Result: {results.echo}</Text>
                            )}
                        </VStack>
                    </CardBody>
                </Card>

                {/* Add Widget */}
                <Card>
                    <CardHeader>
                        <Heading size="md">Add Tool</Heading>
                    </CardHeader>
                    <CardBody>
                        <VStack spacing={4}>
                            <Input
                                placeholder="Enter first number"
                                value={addInputA}
                                onChange={(e) => setAddInputA(e.target.value)}
                                type="number"
                            />
                            <Input
                                placeholder="Enter second number"
                                value={addInputB}
                                onChange={(e) => setAddInputB(e.target.value)}
                                type="number"
                            />
                            <Button colorScheme="green" onClick={handleAdd}>
                                Add Numbers
                            </Button>
                            {results.add && (
                                <Text>Result: {results.add}</Text>
                            )}
                        </VStack>
                    </CardBody>
                </Card>

                {/* Bigdogs Widget */}
                <Card>
                    <CardHeader>
                        <Heading size="md">Getmy-bigdogs Tool</Heading>
                    </CardHeader>
                    <CardBody>
                        <VStack spacing={4}>
                            <Input
                                placeholder="Enter code to review"
                                value={bigdogsInput}
                                onChange={(e) => setBigdogsInput(e.target.value)}
                            />
                            <Button colorScheme="purple" onClick={handleBigdogs}>
                                Review Code
                            </Button>
                            {results.bigdogs && (
                                <Text>Result: {results.bigdogs}</Text>
                            )}
                        </VStack>
                    </CardBody>
                </Card>
            </SimpleGrid>
        </Container>
    );
}; 