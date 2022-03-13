import {
  Box,
  Button,
  ButtonGroup,
  chakra,
  Flex,
  IconButton,
  Input,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  StatUpArrow,
  VStack,
} from '@chakra-ui/react'

function App() {
  return (
    <Flex
      position='relative'
      flexDirection='column'
      bgColor='blue.200'
      bgImage='https://images.unsplash.com/photo-1647117181799-0ac3e50a548a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
      bgPos='bottom'
      h='100vh'
      w='100vw'
    >
      <Box position='absolute' left={0} top={0} h='100%' w='100%'></Box>
      <chakra.form
        maxW='sm'
        p={4}
        borderRadius='lg'
        m={4}
        bgColor='white'
        shadow='base'
      >
        <VStack spacing={4}>
          <Input type='text' placeholder='Origin' />
          <Input type='text' placeholder='Destination' />
          <ButtonGroup>
            <Button colorScheme='pink' type='submit'>
              Calculate Route
            </Button>
            <Button>Clear</Button>
          </ButtonGroup>
        </VStack>
        <Stat mt={4}>
          <StatLabel>Distance:</StatLabel>
          <StatLabel>Duration:</StatLabel>
        </Stat>
      </chakra.form>
    </Flex>
  )
}

export default App
