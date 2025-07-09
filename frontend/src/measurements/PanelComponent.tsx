// Panel component in App.tsx
import React from 'react';
import { Card, CardContent, Typography, Button, Grid, Container } from '@mui/material';
import HoverWindow from './HoverWindow';
import { Instance } from '../App';

interface CardData {
  id: number;
  title: string;
  description: string;
}

interface PanelProps {
  measurementInstance: Instance;
  setMeasurementInstance: React.Dispatch<React.SetStateAction<Instance>>;
}


export default
function NewMeasurementPanel({measurementInstance, setMeasurementInstance}: PanelProps) {
  const [cards, setCards] = React.useState<CardData[]>([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [activeCardId, setActiveCardId] = React.useState<number | null>(null);

  const handleOpenModal = (id: number) => {
    setActiveCardId(id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setActiveCardId(null);
  };

  const handleFormSubmit = (data: { title: string; description: string }) => {
    setCards(prev =>
      prev.map(card =>
        card.id === activeCardId ? { ...card, ...data } : card
      )
    );
  };

  const handleAddCard = () => {
    const newId = cards.length ? cards[cards.length - 1].id + 1 : 1;
    setCards([...cards, { id: newId, title: `Card ${newId}`, description: '' }]);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Button variant="outlined" onClick={handleAddCard} sx={{ mb: 2 }}>
        Add Card
      </Button>
      <Grid container spacing={2}>
        {cards.map((card) => (
          <Grid size={{xs: 12, sm: 6, md: 4}} key={card.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{card.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.description || 'No description'}
                </Typography>
                <Button size="small" onClick={() => handleOpenModal(card.id)} sx={{ mt: 1 }}>
                  Edit
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <HoverWindow
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
      />
    </Container>
  );
};


