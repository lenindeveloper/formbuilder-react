import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const sampleData = {
  headings: [
    {
      heading: "Which monkeys would you like as pets?",
    },
  ],
  position: 1,
  family: "multiple_choice",
  subtype: "vertical",
  answers: {
    choices: [
      {
        text: "Capuchin",
      },
      {
        text: "Mandrill",
      },
    ],
  },
};

const FormBuilder = () => {
  const [formData, setFormData] = useState(sampleData);
  const [history, setHistory] = useState([formData]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setHistory((prevHistory) => [
      ...prevHistory.slice(0, currentIndex + 1),
      formData,
    ]);
  }, [formData, currentIndex]);

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    setFormData((prevFormData) => {
      const newChoices = Array.from(prevFormData.answers.choices);
      newChoices.splice(source.index, 1);
      newChoices.splice(destination.index, 0, result.draggableId);

      return {
        ...prevFormData,
        answers: {
          ...prevFormData.answers,
          choices: newChoices,
        },
      };
    });
  };

  const handleUndo = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? 0 : prevIndex - 1));
    setFormData(history[currentIndex]);
  };

  const handleRedo = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === history.length - 1 ? prevIndex : prevIndex + 1
    );
    setFormData(history[currentIndex]);
  };

  const handlePreview = () => {
    console.log(JSON.stringify(formData, null, 2));
  };

  return (
    <div className="form-builder">
      <div className="form-builder-header">
        <button onClick={handleUndo}>Undo</button>
        <button onClick={handleRedo}>Redo</button>
        <button onClick={handlePreview}>Preview</button>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {formData.answers.choices.map((choice, index) => (
                <Draggable
                  key={choice.text}
                  draggableId={choice.text}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        background: snapshot.isDragging
                          ? "lightgreen"
                          : "lightgrey",
                        padding: 16,
                        margin: "0 0 8px 0",
                        width: 250,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {choice.text}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default FormBuilder;
