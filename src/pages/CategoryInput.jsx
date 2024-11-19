import React from 'react';
import Form from 'react-bootstrap/Form';

const CategoryInput = ({ categories, setCategories }) => {
  const handleCategoryChange = (index, value) => {
    const updatedCategories = [...categories];
    updatedCategories[index] = value;
    setCategories(updatedCategories);
  };

  return (
    <>
      <h4>Kategorien eingeben:</h4>
      {categories.map((category, index) => (
        <Form.Group key={index} controlId={`category-${index}`}>
          <Form.Label>Kategorie {index + 1}</Form.Label>
          <Form.Control
            type="text"
            placeholder={`Kategorie ${index + 1} eingeben`}
            value={category}
            onChange={(e) => handleCategoryChange(index, e.target.value)}
          />
        </Form.Group>
      ))}
    </>
  );
};

export default CategoryInput;
