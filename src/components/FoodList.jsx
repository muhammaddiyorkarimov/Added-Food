import React from 'react';

function FoodList({ addFood, handleDelete, handleEdit }) {
    return (
        <div className="added-foods">
            {addFood.map(food => (
                <div className="added-food" key={food.id}>
                    <div className="name">{food.country}: {food.foodType.slice(0, 10)}{(food.foodType.length > 10) ? '...' : ''}</div>
                    <div className="icons">
                        <i className="fa-solid fa-pen" onClick={() => handleEdit(food.id)}></i>
                        <i className="fa-solid fa-trash-can" onClick={() => handleDelete(food.id)}></i>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default FoodList;
