import React from 'react';
import { useState } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';
import { LinePlotProps } from '@diamondlightsource/davidia';
import { MetaDataStrings, BeamlineConfig } from '../App';


interface HoverWindowProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string }) => void;
}

import { Rnd } from "react-rnd";

const MovableWindow = () => {
  return (
    <Rnd
      default={{
        x: 100,
        y: 100,
        width: 300,
        height: 200,
      }}
      bounds="window"
    >
      <div style={{ background: "#fff", border: "1px solid #ccc", height: "100%" }}>
        <h3>Window Title</h3>
        <p>Window content goes here.</p>
      </div>
    </Rnd>
  );
};


const HoverWindow: React.FC<HoverWindowProps> = ({ open, onClose, onSubmit }) => {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');

  const handleSubmit = () => {
    onSubmit({ title, description });
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <Rnd
      default={{
        x: 100,
        y: 100,
        width: 0.8,
        height: 200,
      }}
      bounds="window"
    >
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 0.8, bgcolor: 'background.paper',
        boxShadow: 24, p: 4, borderRadius: 2
      }}>
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setTitle(e.target.value)}
        />
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={description}
          onChange={(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDescription(e.target.value)}
        />
        <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
          Submit
        </Button>
      </Box>
    </Rnd>
  );
};

export default HoverWindow;
