import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { Link } from "react-router-dom";

function RootLayout() {
	const [addFood, setAddFood] = useState([])
	const [centerFood, setCenterFood] = useState([]);
	const [country, setCountry] = useState('')
	const [foodType, setFoodType] = useState('')
	const [foodDescription, setFoodDescription] = useState('')
	const [editId, setEditId] = useState(null)
	const [foodPositions, setFoodPositions] = useState({});
	const [searchTerm, setSearchTerm] = useState('');



	const handleAddFood = () => {
		if (editId) {
			// Tahrirlanayotgan holatda, ma'lumotlarni o'zgartirish
			const updatedFoods = addFood.map(food => {
				if (food.id === editId) {
					return {
						...food,
						country: country,
						foodType: foodType,
						foodDescription: foodDescription,
					}
				}
				return food
			})
			setAddFood(updatedFoods)
			setEditId(null) // Tahrirlangan holatni bekor qilish
		} else {
			// Yangi food qo'shish
			const newFood = {
				id: uuidv4(),
				country: country,
				foodType: foodType,
				foodDescription: foodDescription,
			}
			setAddFood([...addFood, newFood])
		}
		setCountry('')
		setFoodType('')
		setFoodDescription('')
	}

	// handle input change
	const handleInputChange = (event) => {
		const { name, value } = event.target
		if (name === 'country') setCountry(value)
		if (name === 'foodType') setFoodType(value)
		if (name === 'foodDescription') setFoodDescription(value)
	}

	// handle edit element
	const handleEdit = (id) => {
		const foodToEdit = addFood.find(food => food.id === id)
		setCountry(foodToEdit.country)
		setFoodType(foodToEdit.foodType)
		setFoodDescription(foodToEdit.foodDescription)
		setEditId(id) // Tahrirlangan elementning id sini saqlash
	}

	// handleDelete food element
	const handleDelete = (id) => {
		const updatedFoods = addFood.filter(food => food.id !== id)
		setAddFood(updatedFoods)
	}

	// Handle drag start
	const handleDragStart = (e, id) => {
		e.dataTransfer.setData("id", id);
	};

	// handleDragOver
	const handleDragOver = (e) => {
		e.preventDefault();
	};

	// handleDrop
	const handleDrop = (e) => {
		e.preventDefault();
		const draggedId = e.dataTransfer.getData("id");
		const targetIndex = addFood.findIndex(food => food.id === draggedId);
		const updatedFood = [...addFood];
		updatedFood.splice(targetIndex, 1); // Remove the dragged item from its current position
		setAddFood(updatedFood); // Update state to re-render without the dragged item
		setFoodPositions({ ...foodPositions, [draggedId]: addFood.length }); // Move the dragged item to the bottom
		// Add dragged item to center foods
		const draggedFood = addFood.find(food => food.id === draggedId);
		setCenterFood([...centerFood, draggedFood]);
	};

	const handleDeleteFromCenter = (id) => {
    const updatedCenterFood = centerFood.filter(food => food.id !== id);
    setCenterFood(updatedCenterFood);
    if (selectedFood && selectedFood.id === id) {
        setSelectedFood(null);
    }
};

	const [selectedFood, setSelectedFood] = useState(null);
	const handleReadMore = (food) => {
		setSelectedFood(food);
	};

	return (
		<div>
			<header>
				<div className="container">
					{/* logo */}
					<Link to='/' className="logo">Add<span>Food</span></Link>
					{/* navbar */}
					<div className="navbar">
						<div className="search-item">
							<input type="text" placeholder="search for elements" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
						</div>
					</div>
					{/* user */}
					<div className="user">
						<i className="fa-solid fa-user"></i>
					</div>
				</div>
			</header>
			<main>
				<div className="right-sidebar">
					<div className="card">
						<div className="title">
							<h3>Country's Food</h3>
							<i className="fa-solid fa-chevron-down"></i>
							<select className="countries" name="country" value={country} onChange={handleInputChange}>
								<option>Turkish</option>
								<option>Uzbek</option>
								<option>Chinese</option>
							</select>
						</div>
						<div className="main">
							<p>Country's food: {country}</p>
							<div className="food-type">
								<input type="text" placeholder="Food type" name="foodType" value={foodType} onChange={handleInputChange} />
							</div>
							<div className="food-description">
								<textarea cols="30" rows="10" name="foodDescription" value={foodDescription} onChange={handleInputChange}></textarea>
							</div>
						</div>
						<div className="footer">
							<div className="add-card">
								<button onClick={handleAddFood}>Add card</button>
							</div>
						</div>
					</div>
					<div>
						<div className="added-foods">
							{addFood.map((food, index) => (
								<div className="added-food" key={food.id}
									draggable
									onDragStart={(e) => handleDragStart(e, food.id)}
									onDragOver={(e) => handleDragOver(e)}
									onDrop={(e) => handleDrop(e, food.id)}
									style={{ order: foodPositions[food.id] ?? index }}>
									<div className="name">{food.country}'s {food.foodType.slice(0, 10)}{(food.foodType.length > 10) ? '...' : ''}</div>
									<div className="icons">
										<i className="fa-solid fa-pen" onClick={() => handleEdit(food.id)}></i>
										<i className="fa-solid fa-trash-can" onClick={() => handleDelete(food.id)}></i>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
				<div className="center" onDragOver={(e) => handleDragOver(e)} onDrop={(e) => handleDrop(e)}>
					{/* This div is the drop zone */}
					<h1>Foods List</h1>
					<div className="added-foods">
						{centerFood
							.filter(food => food.country.toLowerCase().includes(searchTerm.toLowerCase()) || food.foodType.toLowerCase().includes(searchTerm.toLowerCase()))
							.map(food => {
								return (
									<div className="added-food" key={food.id}>
										<div className="name">{food.country}'s {food.foodType.slice(0, 10)}{(food.foodType.length > 10) ? '...' : ''}</div>
										<div className="buttons">
											<button onClick={() => handleReadMore(food)}>Read More</button>
											<button onClick={() => handleDeleteFromCenter(food.id)}>Delete</button>
										</div>
									</div>
								)
							})}
					</div>

				</div>
				<div className="left-sidebar">
					{selectedFood && (
						<div className="foodAbout-card">
							<h1><span>Food's Country:</span> {selectedFood.country}</h1>
							<p><span>Food's description:</span> {selectedFood.foodDescription}</p>
						</div>
					)}
				</div>
			</main >

			<footer>
				<p>© created by Karimov Muhammaddiyor</p>
			</footer>
		</div >
	)
}

export default RootLayout
