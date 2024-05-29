import React from "react";
import Item from "./Item";
import { Droppable } from "react-beautiful-dnd";
import { Box, Typography } from "@mui/material";

const StyledColumn = {
  display: "flex",
  flexDirection: "column",
};

const StyledList = {
  backgroundColor: "#bed3f2",
  borderRadius: 3,
  padding: 2,
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  maxHeight: "60vh", // Ajusta la altura máxima según tus necesidades
  overflowY: "auto",
};

const Column = ({ col: { list, id } }) => {
  return (
    
    <Droppable droppableId={id}>
      {(provided) => (
        <Box sx={StyledColumn}>
          <Box
            {...provided.droppableProps}
            ref={provided.innerRef}
            sx={StyledList}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {id}
            </Typography>
            {list.map((text, index) => (
              <Item key={text} text={text} index={index} />
            ))}
            {provided.placeholder}
          </Box>
        </Box>
      )}
    </Droppable>
    
  );
};

export default Column;
