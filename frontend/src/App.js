import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Input,
  Button,
  VStack,
  HStack,
  Text,
  useToast,
  Container,
  IconButton,
  useColorMode,
  Stack,
  Divider,
  Flex,
  useBreakpointValue,
  useColorModeValue,
  Tooltip
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getReminders,
  addReminder,
  deleteReminder,
  updateReminder
} from './services/api';

const MotionFlex = motion(Flex);

function App() {
  const [form, setForm] = useState({
    medicineName: '',
    dosageTime: '',
    frequency: ''
  });
  const [reminders, setReminders] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const cardBg = useColorModeValue('white', 'gray.800');
  const formBg = useColorModeValue('gray.50', 'gray.700');
  const btnColor = useColorModeValue('teal.600', 'teal.200');
  const dividerColor = useColorModeValue('gray.300', 'gray.600');
  const cardBorderColor = useColorModeValue('gray.300', 'gray.600');

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const res = await getReminders();
      setReminders(res.data);
    } catch (error) {
      toast({ title: 'Failed to load reminders.', status: 'error', duration: 2000, isClosable: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { medicineName, dosageTime, frequency } = form;
    if (!medicineName || !dosageTime || !frequency) {
      toast({ title: 'All fields are required.', status: 'warning', duration: 2000, isClosable: true });
      return;
    }

    try {
      if (editingId) {
        await updateReminder(editingId, form);
        toast({ title: 'Reminder updated.', status: 'success', duration: 2000, isClosable: true });
      } else {
        await addReminder(form);
        toast({ title: 'Reminder added.', status: 'success', duration: 2000, isClosable: true });
      }
      setForm({ medicineName: '', dosageTime: '', frequency: '' });
      setEditingId(null);
      fetchReminders();
    } catch (error) {
      toast({ title: 'Network Error', description: 'Could not connect to backend.', status: 'error', duration: 2000, isClosable: true });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteReminder(id);
      toast({ title: 'Reminder deleted.', status: 'info', duration: 2000, isClosable: true });
      fetchReminders();
    } catch (error) {
      toast({ title: 'Failed to delete reminder.', status: 'error', duration: 2000, isClosable: true });
    }
  };

  const handleEdit = (reminder) => {
    setForm({
      medicineName: reminder.medicineName,
      dosageTime: reminder.dosageTime,
      frequency: reminder.frequency
    });
    setEditingId(reminder.id);
  };

  return (
    <Container maxW="4xl" py={12} px={6}>
      <Flex mb={10} justify="space-between" align="center">
        <Heading size="lg" color={btnColor} letterSpacing="tight">
          💊 Medicine Reminder
        </Heading>
        <Tooltip label="Toggle Theme">
          <IconButton
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />} 
            onClick={toggleColorMode}
            aria-label="Toggle dark mode"
            isRound
            size="md"
            variant="ghost"
          />
        </Tooltip>
      </Flex>

      <VStack
        as="form"
        spacing={6}
        onSubmit={handleSubmit}
        mb={14}
        p={[6, 10]}
        bg={formBg}
        rounded="2xl"
        border="1px solid"
        borderColor={dividerColor}
        shadow="lg"
        align="stretch"
      >
        <Input
          placeholder="Medicine Name"
          size="lg"
          value={form.medicineName}
          onChange={(e) => setForm({ ...form, medicineName: e.target.value })}
        />
        <Input
          placeholder="Dosage Time (e.g. 8:00 AM)"
          size="lg"
          value={form.dosageTime}
          onChange={(e) => setForm({ ...form, dosageTime: e.target.value })}
        />
        <Input
          placeholder="Frequency (e.g. Daily)"
          size="lg"
          value={form.frequency}
          onChange={(e) => setForm({ ...form, frequency: e.target.value })}
        />
        <Button colorScheme={editingId ? 'yellow' : 'teal'} type="submit" size="lg">
          {editingId ? '✏️ Update Reminder' : '➕ Add Reminder'}
        </Button>
      </VStack>

      <Box>
        <Heading as="h2" size="md" mb={6} color={btnColor}>
          Your Reminders
        </Heading>
        <Stack
          spacing={8}
          divider={<Divider borderColor={dividerColor} />}
        > 
          <AnimatePresence>
            {reminders.length === 0 ? (
              <Text textAlign="center" color="gray.500">
                No reminders yet.
              </Text>
            ) : (
              reminders.map((reminder) => (
                <MotionFlex
                  key={reminder.id}
                  align="center"
                  justify="space-between"
                  p={[5, 6]}
                  rounded="xl"
                  borderWidth="1px"
                  borderColor={cardBorderColor}
                  bg={cardBg}
                  _hover={{ shadow: 'md', transform: 'scale(1.01)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <Box>
                    <Text fontWeight="bold" fontSize="lg">{reminder.medicineName}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {reminder.dosageTime} • {reminder.frequency}
                    </Text>
                  </Box>
                  <HStack spacing={4}>
                    <Tooltip label="Edit">
                      <IconButton icon={<EditIcon />} onClick={() => handleEdit(reminder)} size="sm" colorScheme="yellow" aria-label="Edit" isRound />
                    </Tooltip>
                    <Tooltip label="Delete">
                      <IconButton icon={<DeleteIcon />} onClick={() => handleDelete(reminder.id)} size="sm" colorScheme="red" aria-label="Delete" isRound />
                    </Tooltip>
                  </HStack>
                </MotionFlex>
              ))
            )}
          </AnimatePresence>
        </Stack>
      </Box>
    </Container>
  );
}

export default App;
