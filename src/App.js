import {
  Box,
  Button,
  ButtonGroup,
  chakra,
  Flex,
  HStack,
  Input,
  Text,
} from '@chakra-ui/react'

function App() {
  return (
    <Flex
      position='relative'
      flexDirection='column'
      alignItems='center'
      bgImage='https://images.unsplash.com/photo-1647117181799-0ac3e50a548a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
      bgPos='bottom'
      h='100vh'
      w='100vw'
    >
      <Box position='absolute' left={0} top={0} h='100%' w='100%'></Box>
      <chakra.form
        p={4}
        borderRadius='lg'
        mt={4}
        bgColor='white'
        shadow='base'
        zIndex='modal'
      >
        <HStack spacing={4}>
          <Input type='text' placeholder='Origin' />
          <Input type='text' placeholder='Destination' />
          <ButtonGroup>
            <Button colorScheme='pink' type='submit'>
              Calculate Route
            </Button>
            <Button>Clear</Button>
          </ButtonGroup>
        </HStack>
        <HStack mt={4} justifyContent='space-evenly'>
          <Text>Distance:</Text>
          <Text>Duration:</Text>
        </HStack>
      </chakra.form>
    </Flex>
  )
}

export default App
